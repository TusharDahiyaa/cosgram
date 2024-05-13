import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useUserProfileStore from "../store/userProfileStore";
import useShowToast from "./useShowToast";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import useNotificationStore from "../store/useNotificationStore";

export default function useFollowToggle(userId: string) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const authUser = useAuthStore((state: any) => state.user);
  const setAuthUser = useAuthStore((state: any) => state.setUser);
  const { userProfile, setUserProfile } = useUserProfileStore();
  const showToast = useShowToast();
  const { addNotification } = useNotificationStore();

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
            following: authUser.following.filter(
              (uid: string) => uid !== userId
            ),
          })
        );
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
        setIsFollowing(true);
        addNotification({
          id: `${userId}-${authUser.uid}`,
          type: "follow",
          fullName: authUser.fullName,
          createdAt: Date.now(),
        });
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
