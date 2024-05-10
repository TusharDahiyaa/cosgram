import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";

export default function useLogout() {
  const [signOut, isLoggingOut] = useSignOut(auth);
  const showToast = useShowToast();
  const logoutUser = useAuthStore((state: any) => state.logout);

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem("user_info");
      logoutUser();
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

  return { handleLogout, isLoggingOut };
}
