import { Box, Image } from "@chakra-ui/react";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";

export default function FeedPost({ post }: any) {
  const { userProfile } = useGetUserProfileById(post.createdBy);

  return (
    <Box my={10}>
      <PostHeader post={post} creatorProfile={userProfile} />
      <Box
        mb={2}
        overflow={"hidden"}
        bgGradient="linear-gradient(to right, #800f2f, #871031, #8d1134, #941136, #9b1239, #a1133b, #a7133d, #ad143f, #b41542, #bb1644, #c21747, #c9184a)"
        p={1}
      >
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
