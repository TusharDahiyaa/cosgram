import { Box, Flex, Image, Text } from "@chakra-ui/react";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";

export default function FollowingUser({ userId }: { userId: string }) {
  const { userProfile } = useGetUserProfileById(userId);

  return userProfile ? (
    <Flex
      my={4}
      alignItems={"center"}
      gap={4}
      cursor={"pointer"}
      _hover={{ bg: "blackAlpha.500" }}
      onClick={() => {
        window.location.href = `/${userProfile.username}`;
      }}
    >
      <Image
        src={userProfile?.profilePicURL}
        alt={userProfile?.username}
        borderRadius={"full"}
        boxSize={12}
      />
      <Box>
        <Text fontSize={"sm"} fontWeight={"semibold"}>
          {userProfile?.fullName}
        </Text>
        <Text fontSize={"sm"}>{userProfile?.username}</Text>
      </Box>
    </Flex>
  ) : null;
}
