import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { firestore } from "../firebase/firebase";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import useCreateNotifications from "./useCreateNotifications";

export default function useLikePost(post: any) {
  const [isUpdating, setIsUdpating] = useState(false);
  const authUser = useAuthStore((state: any) => state.user);
  const [likes, setLikes] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(authUser?.uid));
  const showToast = useShowToast();
  const { handleCreateNotification } = useCreateNotifications();

  const handleLikePost = async () => {
    if (isUpdating) return;

    if (!authUser) {
      return showToast(
        { title: "Error", description: "Must be logged in to like" },
        "error"
      );
    }

    setIsUdpating(true);

    try {
      const postRef = doc(firestore, "posts", post.id);
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(authUser.uid) : arrayUnion(authUser.uid),
      });

      setIsLiked(!isLiked);
      isLiked ? setLikes(likes - 1) : setLikes(likes + 1);

      if (!isLiked) {
        await handleCreateNotification({
          post: post,
          userToFollow: "",
          postId: post.id,
          type: "like",
        });
      } else {
        // Find and delete corresponding notification for unlike action
        deleteLikeNotification(post.id, authUser.uid);
      }
    } catch (error: any) {
      showToast({ title: "Error", description: error.message }, "error");
    } finally {
      setIsUdpating(false);
    }
  };

  return { isLiked, likes, handleLikePost, isUpdating };
}

const deleteLikeNotification = async (postId: string, userId: string) => {
  try {
    const notificationId = `${postId}-${userId}`;
    const q = query(
      collection(firestore, "notifications"),
      where("id", "==", notificationId)
    );
    const notificationsSnapshot = await getDocs(q);

    if (!notificationsSnapshot.empty) {
      notificationsSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    }
  } catch (error) {
    console.error("Error deleting like notification:", error);
  }
};
