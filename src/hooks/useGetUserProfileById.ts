import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

export default function useGetUserProfileById(userId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const showToast = useShowToast();

  useEffect(() => {
    const getUserProfile = async () => {
      setIsLoading(true);
      setUserProfile(null);

      try {
        const userRef = await getDoc(doc(firestore, "users", userId));

        if (userRef.exists()) {
          setUserProfile(userRef.data());
        }
      } catch (error: any) {
        showToast({ title: "Error", description: error.message }, "error");
      } finally {
        setIsLoading(false);
      }
    };

    getUserProfile();
  }, [showToast, userId]);

  return { isLoading, userProfile, setUserProfile };
}
