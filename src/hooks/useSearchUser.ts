import { useState } from "react";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

export default function useSearchUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const showToast = useShowToast();

  const getSearchedUserProfile = async (username: string) => {
    setIsLoading(true);
    setUser(null);
    try {
      const q = query(
        collection(firestore, "users"),
        where("username", "==", username)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return showToast(
          { title: "Error", description: "User not found" },
          "error"
        );
      }

      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error: any) {
      showToast({ title: "Error", description: error.message }, "error");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getSearchedUserProfile, user, setUser };
}
