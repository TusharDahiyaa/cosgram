import { Box, Image, Skeleton } from "@chakra-ui/react";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
import useAuthStore from "../../store/authStore";

export default function FeedPost({ post }: any) {
  const { userProfile } = useGetUserProfileById(post.createdBy);
  const authUser = useAuthStore((state: any) => state.user);

  return (
    <Box my={10}>
      <PostHeader post={post} creatorProfile={userProfile} />
      <Box my={2} borderRadius={4} overflow={"hidden"}>
        <Image
          src={post.imageURL}
          alt={post.caption}
          h={"lg"}
          w="full"
          height={"full"} 
          objectFit={"cover"}
        />
      </Box>
      <PostFooter
        post={post}
        // isProfilePage={authUser.uid === userProfile?.uid}
        creatorProfile={userProfile}
      />
    </Box>
  );
}
