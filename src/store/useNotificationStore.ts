import { create } from "zustand";

interface Notification {
  id: string; // Unique ID for the notification
  type: "follow" | "like" | "comment"; // Notification type
  fullName: string; // User ID associated with the action
  postId?: string; // Optional post ID for likes/comments
  createdAt: number; // Timestamp of when the notification was created
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
}

import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: async (notification) => {
    const notificationsRef = collection(firestore, "notifications");
    try {
      await addDoc(notificationsRef, notification);
      set((state) => ({
        notifications: [notification, ...state.notifications],
      }));
    } catch (error) {
      console.error("Error adding notification to Firestore:", error);
    }
  },
  clearNotifications: () => set({ notifications: [] }),
}));

export default useNotificationStore;
