import { create } from 'zustand';

export const useUIStore = create((set) => ({
  alert: null,
  deleteModal: { isOpen: false, taskId: null, taskTitle: '' },

  setAlert: (alert) => set({ alert }),

  clearAlert: () => set({ alert: null }),

  openDeleteModal: (taskId, taskTitle) =>
    set({ deleteModal: { isOpen: true, taskId, taskTitle } }),

  closeDeleteModal: () =>
    set({ deleteModal: { isOpen: false, taskId: null, taskTitle: '' } }),

  showSuccessAlert: (message) =>
    set({ alert: { message, type: 'success' } }),

  showErrorAlert: (message) => set({ alert: { message, type: 'error' } }),

  showInfoAlert: (message) => set({ alert: { message, type: 'info' } }),

  showWarningAlert: (message) => set({ alert: { message, type: 'warning' } }),
}));

