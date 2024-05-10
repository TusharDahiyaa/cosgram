import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";
import usePostStore from "../store/postStore";
import useUserProfileStore from "../store/userProfileStore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";

export default function useGetFeedPosts() {
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useShowToast();
  const authUser = useAuthStore((state: any) => state.user);
  const { posts, setPosts } = usePostStore();
  const { setUserProfile } = useUserProfileStore();

  useEffect(() => {
    const getFeedPosts = async () => {
      setIsLoading(true);
      if (authUser.following.length === 0) {
        setIsLoading(false);
        setPosts([]);
        return;
      }

      const q = query(
        collection(firestore, "posts"),
        where("createdBy", "in", authUser.following)
      );
      const querySnapshot = await getDocs(q);
      const feedPosts: { [key: string]: any }[] = [];

      querySnapshot.forEach((doc) => {
        feedPosts.push({ id: doc.id, ...doc.data() });
      });

      feedPosts.sort((a, b) => b.createdAt - a.createdAt);
      setPosts(feedPosts);

      try {
      } catch (error: any) {
        showToast({ title: "Error", description: error.message }, "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (authUser) {
      getFeedPosts();
    }
  }, [authUser, showToast, setPosts, setUserProfile]);

  return { isLoading, posts };
}
