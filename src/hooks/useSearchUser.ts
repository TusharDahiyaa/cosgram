import { useState } from "react";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

export default function useSearchUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any[]>([]);
  const showToast = useShowToast();

  const getSearchedUserProfile = async (fullName_lower: string) => {
    setIsLoading(true);
    setUser([]);
    try {
      const q = query(
        collection(firestore, "users"),
        where("fullName_lowercase", "==", fullName_lower.toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return showToast(
          { title: "Error", description: "User not found" },
          "error"
        );
      }

      const users = querySnapshot.docs.map((doc) => doc.data());
      setUser(users);
    } catch (error: any) {
      showToast({ title: "Error", description: error.message }, "error");
      setUser([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getSearchedUserProfile, user, setUser };
}
