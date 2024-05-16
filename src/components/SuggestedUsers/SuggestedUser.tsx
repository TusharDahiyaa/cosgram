import { Avatar, Box, Button, Flex, VStack } from "@chakra-ui/react";
import useFollowToggle from "../../hooks/useFollowToggle";
import useAuthStore from "../../store/authStore";
import { Link } from "react-router-dom";

export default function SuggestedUser({ user }: any) {
  const { isFollowing, isUpdating, handleFollowUser } = useFollowToggle(
    user?.uid
  );
  const authUser = useAuthStore((state: any) => state.user);

  const onClickFollowToggle = async () => {
    await handleFollowUser();
    // setUser({
    //   ...user,
    //   followers: isFollowing
    //     ? user.followers.filter(
    //         (follower: any) => follower.uid !== authUser.uid
    //       )
    //     : [...user.followers, authUser],
    // });
  };

  return (
    <Flex
      alignItems={"center"}
      w={"full"}
      justifyContent={"space-between"}
      mb={2}
    >
      <Flex
        alignItems={"center"}
        gap={2}
        cursor={"pointer"}
        onClick={() => {
          window.location.href = `/${user.username}`;
        }}
      >
        <Link to={`/${user.username}`}>
          <Avatar src={user.profilePicURL} size={"md"} name={user.fullName} />
        </Link>
        <VStack spacing={2} alignItems={"flex-start"}>
          <Link to={`/${user.username}`}>
            <Box fontSize={12} fontWeight={"bold"}>
              {user.fullName}
            </Box>
          </Link>

          <Box fontSize={11} color={"gray.500"}>
            {user.followers.length}{" "}
            {user.followers.length > 1 ? "followers" : "follower"}
          </Box>
        </VStack>
      </Flex>
      {authUser.uid !== user.uid && (
        <Button
          fontSize={13}
          bg={"transparent"}
          p={0}
          h={"max-content"}
          fontWeight={"medium"}
          color={"blue.400"}
          cursor={"pointer"}
          _hover={{
            color: "white",
          }}
          isLoading={isUpdating}
          onClick={onClickFollowToggle}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      )}
    </Flex>
  );
}
