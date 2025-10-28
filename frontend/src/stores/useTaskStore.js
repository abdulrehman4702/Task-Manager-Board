import { create } from 'zustand';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),

  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === taskId ? { ...task, ...updates } : task
      ),
    })),

  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== taskId),
    })),

  getTaskById: (taskId) => {
    const state = get();
    return state.tasks.find((task) => task._id === taskId);
  },

  getTasksByStatus: (status) => {
    const state = get();
    return state.tasks.filter((task) => task.status === status);
  },

  clearTasks: () => set({ tasks: [] }),
}));

