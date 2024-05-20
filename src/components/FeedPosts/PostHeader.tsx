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
    <Flex
      alignItems={"center"}
      justifyContent={"space-between"}
      w={"full"}
      bgGradient="linear-gradient(to right, #800f2f, #871031, #8d1134, #941136, #9b1239, #a1133b, #a7133d, #ad143f, #b41542, #bb1644, #c21747, #c9184a)"
      p={1}
      roundedTop={10}
    >
      <Flex alignItems={"center"} gap={{ base: 1, md: 4 }}>
        {creatorProfile ? (
          <Link to={`/${creatorProfile.username}`}>
            <Avatar
              src={creatorProfile.profilePicURL}
              size={"sm"}
              border={"2px solid"}
              borderColor={"whiteAlpha.400"}
            />
          </Link>
        ) : (
          <SkeletonCircle size={"10"} />
        )}

        <Flex
          fontSize={{ base: 12, md: 15 }}
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
            color={"whiteAlpha.900"}
            fontWeight={"lightweight"}
            fontSize={{ base: 12, md: 15 }}
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
          color={"whiteAlpha.800"}
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
