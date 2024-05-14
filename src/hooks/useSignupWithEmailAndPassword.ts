import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";

type signupProps = {
  fullName: string;
  username: string;
  email: string;
  password: string;
};

const useSignupWithEmailAndPassword = () => {
  const [createUserWithEmailAndPassword, , loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const showToast = useShowToast();
  const loginUser = useAuthStore((state: any) => state.login);

  const signup = async (inputs: signupProps) => {
    try {
      if (
        !inputs.fullName ||
        !inputs.username ||
        !inputs.email ||
        !inputs.password
      ) {
        showToast(
          {
            title: "Invalid Inputs",
            description: "Please fill all the details in the form",
          },
          "error"
        );
        return;
      }

      const usersRef = collection(firestore, "users");

      const q = query(usersRef, where("username", "==", inputs.username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        showToast(
          {
            title: "Error",
            description: "Username already exists",
          },
          "error"
        );
        return;
      }

      const newUser = await createUserWithEmailAndPassword(
        inputs.email,
        inputs.password
      );
      if (!newUser && error) {
        showToast(
          {
            title: "Error",
            description: error.message,
          },
          "error"
        );
        return;
      }

      if (newUser) {
        const userDoc = {
          uid: newUser.user.uid,
          fullName: inputs.fullName,
          username: inputs.username,
          email: inputs.email,
          bio: ``,
          profilePicURL: "",
          followers: [],
          following: [],
          posts: [],
          notifications: [],
          createdAt: new Date(),
        };

        await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
        localStorage.setItem("user_info", JSON.stringify(userDoc));
        loginUser(userDoc);
        showToast(
          {
            title: "User Created!",
            description: `User created with the user email ${newUser.user.email}`,
          },
          "success"
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return {
    loading,
    error,
    signup,
  };
};

export default useSignupWithEmailAndPassword;
