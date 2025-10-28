const TaskList = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-200 text-gray-800';
      case 'in-progress':
        return 'bg-yellow-200 text-yellow-800';
      case 'done':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No tasks yet. Create your first task!</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
              <span className={`px-2 py-1 text-xs rounded ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </div>
            {task.description && (
              <p className="text-gray-600 text-sm mb-3">{task.description}</p>
            )}
            <div className="flex gap-2">
              <select
                value={task.status}
                onChange={(e) => onUpdateTask(task._id, { status: e.target.value })}
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button
                onClick={() => onDeleteTask(task._id)}
                className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;
