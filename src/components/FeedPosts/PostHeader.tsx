import {
  Avatar,
  Box,
  Button,
  Flex,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import formatTimeAsTimeAgo from "../../utils/formatTimeAsTimeAgo";
import { BsDot } from "react-icons/bs";
import { Link } from "react-router-dom";
import useFollowToggle from "../../hooks/useFollowToggle";

export default function PostHeader({ post, creatorProfile }: any) {
  const { isFollowing, isUpdating, handleFollowUser } = useFollowToggle(
    post.createdBy
  );

  return (
    <Flex alignItems={"center"} justifyContent={"space-between"} w={"full"}>
      <Flex alignItems={"center"} gap={4}>
        {creatorProfile ? (
          <Link to={`/${creatorProfile.username}`}>
            <Avatar
              src={creatorProfile.profilePicURL}
              size={"sm"}
              border={"1px solid"}
              borderColor={"whiteAlpha.400"}
            />
          </Link>
        ) : (
          <SkeletonCircle size={"10"} />
        )}

        <Flex
          fontSize={{ base: 14, md: 16 }}
          fontWeight={"bold"}
          alignItems={"center"}
        >
          {creatorProfile ? (
            <>
              <Link to={`/${creatorProfile.username}`}>
                {creatorProfile.username}
              </Link>
            </>
          ) : (
            <Skeleton w={"100px"} h={"10px"} />
          )}
          <Flex
            color={"whiteAlpha.600"}
            fontWeight={"lightweight"}
            fontSize={{ base: 14, md: 16 }}
            alignItems={"center"}
          >
            <BsDot size={24} />
            {formatTimeAsTimeAgo(post.createdAt)}
          </Flex>
        </Flex>
      </Flex>
      <Box cursor={"pointer"}>
        <Button
          size={"xs"}
          bg={"transparent"}
          fontSize={12}
          color={"blue.500"}
          fontWeight={"bold"}
          _hover={{
            color: "white",
          }}
          transition={"0.2 ease-in-out"}
          onClick={handleFollowUser}
          isLoading={isUpdating}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      </Box>
    </Flex>
  );
}
