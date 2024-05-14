import { create } from "zustand";

interface Notification {
  type: "follow" | "like" | "unlike" | "comment";
  fullName: string;
  post?: any;
  createdAt: number;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
  },
  clearNotifications: () => {
    set({ notifications: [] });
  },
}));

export default useNotificationStore;
