import { Flex, Image, Text } from "@chakra-ui/react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../firebase/firebase";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function GoogleAuth({ prefix }: { prefix: string }) {
  const [signInWithGoogle, , , error] = useSignInWithGoogle(auth);
  const showToast = useShowToast();
  const loginUser = useAuthStore((state: any) => state.login);

  const handleGoogleAuth = async () => {
    try {
      const newUser = await signInWithGoogle();
      if (!newUser && error) {
        showToast(
          {
            title: "Invalid Inputs",
            description: error.message,
          },
          "error"
        );
        return;
      }

      if (newUser) {
        const userRef = doc(firestore, "users", newUser.user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userDoc = userSnap.data();
          localStorage.setItem("user_info", JSON.stringify(userDoc));
          loginUser(userDoc);
          showToast(
            {
              title: "Logged In!",
              description: ``,
            },
            "success"
          );
        } else {
          const userDoc = {
            uid: newUser.user.uid,
            email: newUser.user.email,
            username: newUser.user.email?.split("@")[0],
            fullName: newUser.user.displayName,
            bio: "",
            profilePicURL: newUser.user.photoURL,
            followers: [],
            following: [],
            posts: [],
            createdAt: Date.now(),
          };
          await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
          localStorage.setItem("user-info", JSON.stringify(userDoc));
          loginUser(userDoc);
          showToast(
            {
              title: "User created!",
              description: `User has been created with email ${userDoc.email}`,
            },
            "success"
          );
        }
      }
    } catch (err: any) {
      showToast(
        {
          title: "Invalid Inputs",
          description: err.message,
        },
        "error"
      );
    }
  };

  return (
    <>
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        cursor={"pointer"}
        px={4}
        py={2}
        rounded={10}
        bg={"blackAlpha.900"}
        onClick={handleGoogleAuth}
      >
        <Image src="/google.png" w={5} alt="Google Logo" />
        <Text mx={2} color={"whiteAlpha.800"} fontWeight={300}>
          {prefix} with Google
        </Text>
      </Flex>
    </>
  );
}
