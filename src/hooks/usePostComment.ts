import { useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import usePostStore from "../store/postStore";

export default function usePostComment() {
  const [isCommenting, setIsCommenting] = useState(false);
  const showToast = useShowToast();
  const authUser = useAuthStore((state: any) => state.user);
  const addComment = usePostStore((state: any) => state.addComment);

  const handlePostComment = async (postId: string, comment: string) => {
    if (isCommenting) return;
    if (!authUser)
      return showToast(
        { title: "Error", description: "Must be logged in to comment" },
        "error"
      );

    if (!comment) {
      return showToast(
        { title: "Error", description: "Comment cannot be empty" },
        "error"
      );
    }
    setIsCommenting(true);

    const newComment = {
      comment,
      createdAt: Date.now(),
      createdBy: authUser.uid,
      postId,
    };

    try {
      await updateDoc(doc(firestore, "posts", postId), {
        comments: arrayUnion(newComment),
      });

      addComment(postId, newComment);

      showToast(
        {
          title: "Comment posted successfully",
          description: "",
        },
        "success"
      );
    } catch (error: any) {
      setIsCommenting(false);
      showToast(
        {
          title: "Error",
          description: error.message,
        },
        "error"
      );
    } finally {
      setIsCommenting(false);
    }
  };

  return { isCommenting, handlePostComment };
}
