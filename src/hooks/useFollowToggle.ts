import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/userProfileStore";
import useShowToast from "./useShowToast";
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
import { firestore } from "../firebase/firebase";
import useCreateNotifications from "./useCreateNotifications";

export default function useFollowToggle(userId: string) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const authUser = useAuthStore((state: any) => state.user);
  const setAuthUser = useAuthStore((state: any) => state.setUser);
  const { userProfile, setUserProfile } = useUserProfileStore();
  const showToast = useShowToast();
  const { handleCreateNotification } = useCreateNotifications();

  const handleFollowUser = async () => {
    setIsUpdating(true);
    try {
      const currentUserRef = doc(firestore, "users", authUser.uid);
      const userToFollowOrUnfollowRef = doc(firestore, "users", userId);

      await updateDoc(currentUserRef, {
        following: isFollowing ? arrayRemove(userId) : arrayUnion(userId),
      });

      await updateDoc(userToFollowOrUnfollowRef, {
        followers: isFollowing
          ? arrayRemove(authUser.uid)
          : arrayUnion(authUser.uid),
      });

      if (isFollowing) {
        //Unfollow user
        setAuthUser({
          ...authUser,
          following: authUser.following.filter((uid: string) => uid !== userId),
        });
        if (userProfile)
          setUserProfile({
            ...userProfile,
            followers: userProfile.followers.filter(
              (uid: string) => uid !== authUser.uid
            ),
          });
        localStorage.setItem(
          "user_info",
          JSON.stringify({
            ...authUser,
            followers: authUser.followers.filter(
              (uid: string) => uid !== userId
            ),
          })
        );
        deleteFollowNotifications(userId);
        setIsFollowing(false);
      } else {
        //Follow user
        setAuthUser({
          ...authUser,
          following: [...authUser.following, userId],
        });
        if (userProfile)
          setUserProfile({
            ...userProfile,
            followers: [...userProfile.followers, authUser.uid],
          });
        localStorage.setItem(
          "user_info",
          JSON.stringify({
            ...authUser,
            following: [...authUser.following, userId],
          })
        );
        await handleCreateNotification({
          post: "",
          userToFollow: userId,
          postId: "",
          type: "follow",
        });
        setIsFollowing(true);
      }
    } catch (error: any) {
      showToast(
        {
          title: "Error",
          description: error.message,
        },
        "error"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      const isFollowing = authUser.following.includes(userId);
      setIsFollowing(isFollowing);
    }
  }, [authUser, userId]);

  return { isUpdating, isFollowing, handleFollowUser };
}

const deleteFollowNotifications = async (userId: string) => {
  try {
    const q = query(
      collection(firestore, "notifications"),
      where("userId", "==", userId),
      where("type", "==", "follow")
    );
    const notificationsSnapshot = await getDocs(q);

    if (!notificationsSnapshot.empty) {
      notificationsSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    }
  } catch (error) {
    console.error("Error deleting follow notifications:", error);
  }
};
