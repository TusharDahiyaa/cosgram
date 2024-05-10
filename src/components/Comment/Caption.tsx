import { Avatar, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useUserProfileStore from "../../store/userProfileStore";

export default function Caption({ post }: any) {
  const userProfile = useUserProfileStore((state: any) => state.userProfile);

  return (
    <Flex gap={4}>
      <Link to={`/${userProfile.username}`}>
        <Avatar src={userProfile.profilePicURL} size={"sm"} />
      </Link>
      <Flex direction={"column"}>
        <Flex gap={1} alignItems={"center"} my={"auto"}>
          <Link to={`/${userProfile.username}`}>
            <Text fontWeight={"bold"} fontSize={14}>
              {userProfile.username}
            </Text>
          </Link>
          <Text fontSize={14} fontWeight={"medium"}>
            {post.caption}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
