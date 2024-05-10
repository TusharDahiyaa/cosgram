import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import useShowToast from "./useShowToast";
import { doc, getDoc } from "firebase/firestore";
import useAuthStore from "../store/authStore";

interface loginProps {
  email: string;
  password: string;
}

const useLogin = () => {
  const showToast = useShowToast();
  const [signInWithEmailAndPassword, , loading, error] =
    useSignInWithEmailAndPassword(auth);
  const loginUser = useAuthStore((state: any) => state.login);

  const login = async (inputs: loginProps) => {
    if (!inputs.email || !inputs.password) {
      return showToast(
        {
          title: "Invalid Inputs",
          description: "Please enter  your email and password",
        },
        "error"
      );
    }

    try {
      const userCreds = await signInWithEmailAndPassword(
        inputs.email,
        inputs.password
      );

      if (userCreds) {
        const userRef = doc(firestore, "users", userCreds.user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        localStorage.setItem("user_info", JSON.stringify(userData));
        loginUser(userData);
      }
    } catch (error: any) {
      showToast(
        {
          title: "Error",
          description: error.message,
        },
        "error"
      );
    }
  };

  return { loading, error, login };
};

export default useLogin;
