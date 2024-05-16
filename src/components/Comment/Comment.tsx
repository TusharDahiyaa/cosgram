import {
  Avatar,
  Box,
  Flex,
  Skeleton,
  SkeletonCircle,
  Text,
} from "@chakra-ui/react";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
import { Link } from "react-router-dom";
import formatTimeAsTimeAgo from "../../utils/formatTimeAsTimeAgo";

const Comment = ({ comment }: any) => {
  const { userProfile, isLoading } = useGetUserProfileById(comment.createdBy);

  if (isLoading) return <CommentSkeleton />;
  return (
    <Flex gap={4}>
      <Link to={`/${userProfile.username}`}>
        <Avatar src={userProfile.profilePicURL} size={"sm"} />
      </Link>
      <Flex direction={"column"}>
        <Box gap={1} my={"auto"}>
          <Text as={"span"} fontWeight={"bold"} fontSize={12} mr={1}>
            <Link to={`/${userProfile.username}`}>{userProfile.username}</Link>
          </Text>
          <Text as={"span"} fontSize={14}>
            {comment.comment}
          </Text>
        </Box>
        <Text fontSize={12} color={"gray"}>
          {formatTimeAsTimeAgo(comment.createdAt)}
        </Text>
      </Flex>
    </Flex>
  );
};

export default Comment;

const CommentSkeleton = () => {
  return (
    <Flex gap={4} w={"full"} alignItems={"center"}>
      <SkeletonCircle h={10} w="10" />
      <Flex gap={1} flexDir={"column"}>
        <Skeleton height={2} width={100} />
        <Skeleton height={2} width={50} />
      </Flex>
    </Flex>
  );
};
