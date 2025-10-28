import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import TaskForm from '../../../components/Tasks/TaskForm';
import Alert from '../../../components/Alert/Alert';
import ConfirmationModal from '../../../components/Modal/ConfirmationModal';
import { useAuth } from '../../../hooks/useAuth';
import { useSocket } from '../../../hooks/useSocket';

const TaskBoard = () => {
  const { user, logout } = useAuth();
  const socket = useSocket(user?.id);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null, taskTitle: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (socket.socket) {
      socket.onTaskUpdate((data) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === data.task._id ? data.task : task
          )
        );
      });

      socket.onTaskCreate((data) => {
        setTasks((prevTasks) => [data.task, ...prevTasks]);
      });

      socket.onTaskDelete((data) => {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== data.taskId)
        );
      });
    }
  }, [socket.socket]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (formData) => {
    try {
      const response = await api.post('/tasks', formData);
      setTasks([response.data, ...tasks]);
      socket.emitTaskCreate({ task: response.data });
      setAlert({
        message: 'Task created successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error creating task:', error);
      setAlert({
        message: 'Failed to create task',
        type: 'error'
      });
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updates);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? response.data : task
        )
      );
      socket.emitTaskUpdate({ task: response.data });
      
      if (updates.status) {
        const statusText = updates.status === 'todo' ? 'Todo' : 
                          updates.status === 'in-progress' ? 'In Progress' : 'Done';
        setAlert({
          message: `Task status changed to "${statusText}"`,
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setAlert({
        message: 'Failed to update task status',
        type: 'error'
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId)
      );
      socket.emitTaskDelete({ taskId });
      setAlert({
        message: 'Task deleted successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      setAlert({
        message: 'Failed to delete task',
        type: 'error'
      });
    }
  };

  const openDeleteModal = (taskId, taskTitle) => {
    setDeleteModal({ isOpen: true, taskId, taskTitle });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, taskId: null, taskTitle: '' });
  };

  const confirmDelete = () => {
    if (deleteModal.taskId) {
      handleDeleteTask(deleteModal.taskId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  return (
    <div className="min-h-screen bg-gray-100">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteModal.taskTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
      
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Task Board</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user?.username}</span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <TaskForm onSubmit={handleCreateTask} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-4">Todo</h2>
            <div className="space-y-4">
              {todoTasks.length > 0 ? (
                todoTasks.map((task) => (
                  <div key={task._id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-gray-500">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                      <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-800">
                        {task.status}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                    )}
                    <div className="flex gap-2">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTask(task._id, { status: e.target.value })}
                        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="todo">Todo</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <button
                        onClick={() => openDeleteModal(task._id, task.title)}
                        className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No tasks</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-4">In Progress</h2>
            <div className="space-y-4">
              {inProgressTasks.length > 0 ? (
                inProgressTasks.map((task) => (
                  <div key={task._id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                      <span className="px-2 py-1 text-xs rounded bg-yellow-200 text-yellow-800">
                        {task.status}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                    )}
                    <div className="flex gap-2">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTask(task._id, { status: e.target.value })}
                        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="todo">Todo</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <button
                        onClick={() => openDeleteModal(task._id, task.title)}
                        className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No tasks</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-4">Done</h2>
            <div className="space-y-4">
              {doneTasks.length > 0 ? (
                doneTasks.map((task) => (
                  <div key={task._id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                      <span className="px-2 py-1 text-xs rounded bg-green-200 text-green-800">
                        {task.status}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                    )}
                    <div className="flex gap-2">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTask(task._id, { status: e.target.value })}
                        className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="todo">Todo</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <button
                        onClick={() => openDeleteModal(task._id, task.title)}
                        className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No tasks</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
