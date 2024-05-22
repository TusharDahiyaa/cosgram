import { Box, Flex, Spinner } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import Navbar from "../../components/Navbar/Navbar";

export default function PageLayout({ children }: any) {
  const { pathname } = useLocation();
  const [user, loading] = useAuthState(auth);

  const canRenderSidebar = pathname !== "/auth" && user;
  const canRenderNavbar = !user && pathname !== "/auth";

  const checkingUserIsAuth = !user && loading;
  if (checkingUserIsAuth) return <PageLayoutSpinner />;

  return (
    <Flex direction={canRenderNavbar ? "column" : "row"}>
      {/* Sidebar on left */}
      {canRenderSidebar ? (
        <Box w={{ base: "50px", md: "240px" }}>
          <Sidebar />
        </Box>
      ) : null}

      {/* Navbar */}
      {canRenderNavbar ? <Navbar /> : null}

      {/* Page Content on the r ight */}
      <Box flex={1} width={{ base: "calc(100%-70px)", md: "calc(100%-240px)" }}>
        {children}
      </Box>
    </Flex>
  );
}

const PageLayoutSpinner = () => {
  return (
    <Flex
      flexDir={"column"}
      h={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Spinner size={"xl"} />
    </Flex>
  );
};
