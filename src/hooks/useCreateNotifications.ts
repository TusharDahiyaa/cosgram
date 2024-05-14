import { useState } from "react";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/userProfileStore";
import useShowToast from "./useShowToast";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "../firebase/firebase";
import { ref } from "firebase/storage";

export default function useCreateNotifications(postId: string) {
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state: any) => state.user);
  const userProfile = useUserProfileStore((state: any) => state.userProfile);

  const handleCreateNotification = async (
    postId: string,
    type: "follow" | "comment" | "like"
  ) => {
    if (isLoading) return;
    if (!postId || !type) throw new Error("Invalid options types");
    setIsLoading(true);

    const newNotification = {
      type: "follow" || "comment" || "like",
      fullName: authUser.fullName,
      postId: "",
      createdAt: Date.now(),
    };

    try {
      const notificationDocRef = await addDoc(
        collection(firestore, "notifications"),
        newNotification
      );
      const userDocRef = doc(firestore, "users", authUser.uid);
      const imageRef = ref(storage, `/posts/${notificationDocRef.id}`);

      await updateDoc(userDocRef, { posts: arrayUnion(notificationDocRef.id) });

      //   if (userProfile.uid === authUser.uid)
      //     createPost({ ...newPost, id: postDocRef.id });
      //   if (pathname !== "/" && userProfile.uid === authUser.uid)
      //     addPost({ ...newPost, id: postDocRef.id });

      showToast(
        { title: "Post created successfully", description: "" },
        "success"
      );
    } catch (error: any) {
      showToast({ title: "Error", description: error.message }, "error");
    } finally {
      setIsLoading(false);
    }
  };
}
