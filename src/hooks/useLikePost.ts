import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { firestore } from "../firebase/firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import useNotificationStore from "../store/useNotificationStore";

export default function useLikePost(post: any) {
  const [isUpdating, setIsUdpating] = useState(false);
  const authUser = useAuthStore((state: any) => state.user);
  const [likes, setLikes] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(authUser?.uid));
  const showToast = useShowToast();
  const { addNotification } = useNotificationStore();

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
        addNotification({
          id: `${post.id}-${authUser.uid}`, // Unique ID based on user actions
          type: "like",
          fullName: authUser.fullName,
          postId: post.id,
          createdAt: Date.now(),
        });
      }
    } catch (error: any) {
      showToast({ title: "Error", description: error.message }, "error");
    } finally {
      setIsUdpating(false);
    }
  };

  return { isLiked, likes, handleLikePost, isUpdating };
}
