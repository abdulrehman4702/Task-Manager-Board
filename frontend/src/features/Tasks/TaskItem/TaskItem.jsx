const TaskItem = ({ task, onUpdate, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'border-gray-500';
      case 'in-progress':
        return 'border-yellow-500';
      case 'done':
        return 'border-green-500';
      default:
        return 'border-gray-500';
    }
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${getStatusColor(task.status)}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <span className={`px-2 py-1 text-xs rounded ${
          task.status === 'done' ? 'bg-green-200 text-green-800' :
          task.status === 'in-progress' ? 'bg-yellow-200 text-yellow-800' :
          'bg-gray-200 text-gray-800'
        }`}>
          {task.status}
        </span>
      </div>
      {task.description && (
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      )}
      <div className="flex gap-2">
        <select
          value={task.status}
          onChange={(e) => onUpdate(task._id, { status: e.target.value })}
          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button
          onClick={() => onDelete(task._id)}
          className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
