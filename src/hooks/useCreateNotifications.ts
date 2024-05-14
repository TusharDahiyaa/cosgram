import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useNotificationStore from "../store/useNotificationStore";

export default function useCreateNotifications() {
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state: any) => state.user);
  const addNotification = useNotificationStore(
    (state: any) => state.addNotification
  );

  interface NotificationProps {
    post: any;
    postId: string;
    type: "follow" | "comment" | "like" | "unlike";
  }

  const handleCreateNotification = async ({
    post,
    postId,
    type,
  }: NotificationProps) => {
    if (isLoading) return;
    if (!type) {
      throw new Error("Invalid notification type.");
    }
    setIsLoading(true);

    const userRef = await getDoc(doc(firestore, "users", post.createdBy));
    const userProfile = userRef.data();

    const newNotification = {
      type: type,
      fullName: authUser.fullName,
      postId: postId,
      userId: userProfile?.uid,
      createdAt: Date.now(),
    };

    if (type === "follow") {
      newNotification.postId = "";
    }

    try {
      const notificationDocRef = await addDoc(
        collection(firestore, "notifications"),
        newNotification
      );
      const notificationRef = doc(firestore, "users", post.createdBy);

      await updateDoc(notificationRef, {
        notifications: arrayUnion(notificationDocRef.id),
      });

      // Schedule notification deletion after a week
      setTimeout(async () => {
        await deleteDoc(notificationDocRef);
      }, 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds

      addNotification(newNotification);
    } catch (error: any) {
      showToast(
        { title: "Error updating notifications", description: error.message },
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleCreateNotification };
}
