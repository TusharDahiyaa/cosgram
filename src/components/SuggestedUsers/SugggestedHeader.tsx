import { Avatar, Button, Flex, Text } from "@chakra-ui/react";
import useLogout from "../../hooks/useLogout";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";

export default function SugggestedHeader() {
  const { handleLogout, isLoggingOut } = useLogout();
  const authUser = useAuthStore((state: any) => state.user);
  if (!authUser) return null;

  return (
    <Flex justifyContent={"space-between"} alignItems={"center"} w={"full"}>
      <Flex alignItems={"center"} gap={2}>
        <Link to={`${authUser.username}`}>
          <Avatar
            name={authUser.username}
            size={"sm"}
            src={authUser?.profilePicURL}
          />
        </Link>
        <Link to={`${authUser.username}`}>
          <Text fontSize={14} fontWeight={"bold"}>
            {authUser.username}
          </Text>
        </Link>
      </Flex>
      <Button
        fontSize={14}
        fontWeight={"medium"}
        color={"blue.400"}
        cursor={"pointer"}
        size={"sm"}
        bg={"transparent"}
        isLoading={isLoggingOut}
        _hover={{ bg: "transparent" }}
        onClick={handleLogout}
      >
        Log out
      </Button>
    </Flex>
  );
}
