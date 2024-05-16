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
    userToFollow: string;
    postId: string;
    type: "follow" | "comment" | "like" | "unlike";
  }

  const handleCreateNotification = async ({
    post,
    userToFollow,
    postId,
    type,
  }: NotificationProps) => {
    if (isLoading) return;
    if (!type) {
      throw new Error("Invalid notification type.");
    }
    setIsLoading(true);
    let userProfile = null;
    if (post !== "") {
      const userRef = await getDoc(doc(firestore, "users", post.createdBy));
      userProfile = userRef.data();
    } else {
      const userRef = await getDoc(doc(firestore, "users", userToFollow));
      userProfile = userRef.data();
    }

    const newNotification = {
      type: type,
      userWhoTookAction: authUser.username,
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
      if (post !== "") {
        const notificationRef = doc(firestore, "users", post.createdBy);
        await updateDoc(notificationRef, {
          notifications: arrayUnion(notificationDocRef.id),
        });
      } else {
        const notificationRef = doc(firestore, "users", userToFollow);
        await updateDoc(notificationRef, {
          notifications: arrayUnion(notificationDocRef.id),
        });
      }

      // Schedule notification deletion after a week
      setTimeout(async () => {
        await deleteDoc(notificationDocRef);
      }, 1 * 24 * 60 * 60 * 1000); // 7 days in milliseconds

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
