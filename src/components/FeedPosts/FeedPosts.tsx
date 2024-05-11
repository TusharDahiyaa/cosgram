import {
  Box,
  Container,
  Flex,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from "@chakra-ui/react";
import FeedPost from "./FeedPost";
import useGetFeedPosts from "../../hooks/useGetFeedPosts";

const FeedPosts = () => {
  const { isLoading, posts } = useGetFeedPosts();

  return (
    <Container maxW={"container.sm"} py={10} px={2}>
      {isLoading &&
        [1, 2, 3].map((_, index) => (
          <VStack key={index} gap={4} alignItems={"flex-start"} mb={10}>
            <Flex gap={2}>
              <SkeletonCircle size={"10"} />
              <VStack
                gap={2}
                alignItems={"flex-start"}
                justifyContent={"center"}
              >
                <Skeleton w={200} h={3} />
                <Skeleton w={200} h={3} />
              </VStack>
            </Flex>
            <Skeleton w="full">
              <Box h={"450px"}>Contents Wrapped</Box>
            </Skeleton>
            <Skeleton w={"50%"} h={2} />
            <Skeleton w={"30%"} h={2} />
          </VStack>
        ))}

      {!isLoading &&
        posts.length > 0 &&
        posts.map((post: any) => <FeedPost post={post} key={post.id} />)}
      {!isLoading && posts.length === 0 && (
        <>
          <Text fontSize={"lg"} color={"red.400"}>
            Oh no!!. Looks like you don&apos;t have any friends.
          </Text>
          <Text color={"red.400"}>Stop coding and go follow some!</Text>
        </>
      )}
    </Container>
  );
};

export default FeedPosts;
