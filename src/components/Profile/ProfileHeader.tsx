import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import EditProfile from "./EditProfile";
import useFollowToggle from "../../hooks/useFollowToggle";
import SuggestedUsers from "../SuggestedUsers/SuggestedUsers";

export default function ProfileHeader() {
  const { userProfile } = useUserProfileStore();
  const authUser = useAuthStore((state: any) => state.user);
  const visitOwnProfileAndAuthCheck =
    authUser && authUser.username === userProfile.username;
  const visitAnotherProfileAndAuthCheck =
    authUser && authUser.username !== userProfile.username;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isFollowing, isUpdating, handleFollowUser } = useFollowToggle(
    userProfile?.uid
  );

  return (
    <Flex
      gap={{ base: 4, sm: 10 }}
      py={document.body.clientWidth < 500 ? 0 : 5}
      direction={{ base: "column", sm: "row" }}
    >
      <Flex>
        <AvatarGroup
          size={{ base: "xl", md: "2xl" }}
          justifySelf={"center"}
          alignSelf={"flex-start"}
          mx={"auto"}
        >
          <Avatar name={userProfile.username} src={userProfile.profilePicURL} />
        </AvatarGroup>
        <Flex
          display={{ base: "flex", sm: "none" }}
          gap={4}
          direction={{ base: "column", sm: "row" }}
          justifyContent={{ base: "center", sm: "flex-start" }}
          alignItems={"center"}
          w={"full"}
        >
          <Text fontSize={{ base: "lg", md: "xl" }}>
            {userProfile.username}
          </Text>

          {visitOwnProfileAndAuthCheck && (
            <Flex gap={4} alignItems={"center"} justifyContent={"center"}>
              <Button
                bg={"white"}
                color={"black"}
                _hover={{ bg: "whiteAlpha.800", color: "black" }}
                size={{ base: "xs", md: "sm" }}
                onClick={onOpen}
              >
                Edit Profile
              </Button>
            </Flex>
          )}
          {visitAnotherProfileAndAuthCheck && (
            <Flex gap={4} alignItems={"center"} justifyContent={"center"}>
              <Button
                bg={"blue.500"}
                color={"white"}
                _hover={{ bg: "blue.600", color: "white" }}
                size={{ base: "xs", md: "sm" }}
                onClick={handleFollowUser}
                isLoading={isUpdating}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
      <VStack alignItems={"start"} gap={1} mx={"auto"} flex={1}>
        <Flex
          display={{ base: "none", sm: "flex" }}
          gap={4}
          direction={{ base: "column", sm: "row" }}
          justifyContent={{ base: "center", sm: "flex-start" }}
          alignItems={"center"}
          w={"full"}
        >
          <Text fontSize={{ base: "sm", md: "lg" }} fontWeight={"semibold"}>
            {userProfile.username}
          </Text>
          {visitOwnProfileAndAuthCheck && (
            <Flex gap={4} alignItems={"center"} justifyContent={"center"}>
              <Button
                bg={"white"}
                color={"black"}
                _hover={{ bg: "whiteAlpha.800", color: "black" }}
                size={{ base: "xs", md: "sm" }}
                onClick={onOpen}
              >
                Edit Profile
              </Button>
            </Flex>
          )}
          {visitAnotherProfileAndAuthCheck && (
            <Flex gap={4} alignItems={"center"} justifyContent={"center"}>
              <Button
                bg={"blue.500"}
                color={"white"}
                _hover={{ bg: "blue.600", color: "white" }}
                size={{ base: "xs", md: "sm" }}
                onClick={handleFollowUser}
                isLoading={isUpdating}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </Flex>
          )}
        </Flex>
        <Flex
          alignItems={"center"}
          justifyContent={"space-evenly"}
          gap={{ base: 4, sm: 6 }}
          my={4}
        >
          <Text fontSize={{ base: "sm", md: "md" }} textAlign={"center"}>
            <Text as={"span"} fontWeight={"bold"} mr={1}>
              {userProfile.posts.length}
            </Text>
            Posts
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }} textAlign={"center"}>
            <Text as={"span"} fontWeight={"bold"} mr={1}>
              {userProfile.followers.length}
            </Text>
            Followers
          </Text>
          <Text fontSize={{ base: "sm", md: "md" }} textAlign={"center"}>
            <Text as={"span"} fontWeight={"bold"} mr={1}>
              {userProfile.following.length}
            </Text>
            Following
          </Text>
        </Flex>
        <Flex alignItems={"center"} gap={4}>
          <Text fontSize={"md"} fontWeight={"bold"}>
            {userProfile.fullName}
          </Text>
        </Flex>
        <Text fontSize={{ base: "sm", md: "md" }} fontStyle={"oblique"}>
          {userProfile.bio}
        </Text>
      </VStack>
      <Box flex={3} mr={0} display={{ base: "block", lg: "none" }} w={"full"}>
        <SuggestedUsers />
      </Box>
      {isOpen && <EditProfile isOpen={isOpen} onClose={onClose} />}
    </Flex>
  );
}
