import { useEffect } from 'react';
import api from '../../../utils/api';
import TaskForm from '../../../components/Tasks/TaskForm';
import Alert from '../../../components/Alert/Alert';
import ConfirmationModal from '../../../components/Modal/ConfirmationModal';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useTaskStore } from '../../../stores/useTaskStore';
import { useUIStore } from '../../../stores/useUIStore';
import { useSocket } from '../../../hooks/useSocket';

const TaskBoard = () => {
  const { user, logout } = useAuthStore();
  const { tasks, setTasks, setLoading, addTask, updateTask, deleteTask } = useTaskStore();
  const { alert, deleteModal, clearAlert, openDeleteModal, closeDeleteModal, showSuccessAlert, showErrorAlert } = useUIStore();
  const socket = useSocket(user?.id);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (socket.socket) {
      socket.onTaskUpdate((data) => {
        updateTask(data.task._id, data.task);
      });

      socket.onTaskCreate((data) => {
        addTask(data.task);
      });

      socket.onTaskDelete((data) => {
        deleteTask(data.taskId);
      });
    }
  }, [socket.socket, updateTask, addTask, deleteTask]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showErrorAlert('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (formData) => {
    try {
      const response = await api.post('/tasks', formData);
      addTask(response.data);
      socket.emitTaskCreate({ task: response.data, userId: user.id });
      showSuccessAlert('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      showErrorAlert('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updates);
      updateTask(taskId, response.data);
      socket.emitTaskUpdate({ task: response.data, userId: user.id });
      
      if (updates.status) {
        const statusText = updates.status === 'todo' ? 'Todo' : 
                          updates.status === 'in-progress' ? 'In Progress' : 'Done';
        showSuccessAlert(`Task status changed to "${statusText}"`);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      showErrorAlert('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      deleteTask(taskId);
      socket.emitTaskDelete({ taskId, userId: user.id });
      showSuccessAlert('Task deleted successfully!');
    } catch (error) {
      console.error('Error deleting task:', error);
      showErrorAlert('Failed to delete task');
    }
  };

  const confirmDelete = () => {
    if (deleteModal.taskId) {
      handleDeleteTask(deleteModal.taskId);
    }
    closeDeleteModal();
  };

  const loading = useTaskStore((state) => state.loading);
  
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
          onClose={clearAlert}
        />
      )}
      
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteModal.taskTitle || 'this task'}"? This action cannot be undone.`}
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
