import {
  Flex,
  GridItem,
  Image,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Avatar,
  Divider,
  VStack,
  Button,
  Box,
} from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Comment from "../Comment/Comment";
import PostFooter from "../FeedPosts/PostFooter";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import useShowToast from "../../hooks/useShowToast";
import { useState } from "react";
import { deleteObject, ref } from "firebase/storage";
import { firestore, storage } from "../../firebase/firebase";
import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import usePostStore from "../../store/postStore";
import Caption from "../Comment/Caption";

interface Post {
  id: string;
  caption: string;
  imageURL: string;
  likes: String[];
  comments: String[];
  createdAt: Date;
  createdBy: string;
}

export default function ProfilePost({ post }: { post: Post }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userProfile = useUserProfileStore((state: any) => state.userProfile);
  const authUser = useAuthStore((state: any) => state.user);
  const showToast = useShowToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePost = usePostStore((state: any) => state.deletePost);
  const decrementPostsCount = useUserProfileStore(
    (state: any) => state.deletePost
  );

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete")) return;
    if (isDeleting) return;

    try {
      const imageRef = ref(storage, `posts/${post.id}`);
      await deleteObject(imageRef);
      const userRef = doc(firestore, "users", authUser.uid);
      await deleteDoc(doc(firestore, "posts", post.id));
      await deleteNotificationsForDeletedPost(post.id);

      await updateDoc(userRef, {
        posts: arrayRemove(post.id),
      });

      deletePost(post.id);
      decrementPostsCount(post.id);
      showToast({ title: "Post deleted", description: "" }, "success");
      onClose();
    } catch (error) {
      showToast(
        { title: "Error", description: "Error while deleting post" },
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteNotificationsForDeletedPost = async (postId: string) => {
    try {
      const q = query(
        collection(firestore, "notifications"),
        where("postId", "==", postId)
      );
      const notificationsSnapshot = await getDocs(q);

      if (!notificationsSnapshot.empty) {
        notificationsSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      }
    } catch (error) {
      console.error("Error deleting notifications for post:", error);
    }
  };

  return (
    <>
      <GridItem
        cursor={"pointer"}
        borderRadius={4}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"whiteAlpha.300"}
        position={"relative"}
        aspectRatio={1 / 1}
        onClick={onOpen}
      >
        <Flex
          opacity={0}
          _hover={{ opacity: 1 }}
          position={"absolute"}
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={"blackAlpha.700"}
          transition={"all 0.3s ease"}
          zIndex={1}
          justifyContent={"center"}
        >
          <Flex alignItems={"center"} justifyContent={"center"} gap={50}>
            <Flex>
              <AiFillHeart size={20} />
              <Text fontWeight={"bold"} ml={2}>
                {post.likes.length}
              </Text>
            </Flex>
            <Flex>
              <FaComment size={20} />
              <Text fontWeight={"bold"} ml={2}>
                {post.comments.length}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Image
          src={post.imageURL}
          alt="profile Pic"
          w={"100%"}
          h={"100% "}
          objectFit={"cover"}
        />
      </GridItem>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered={true}
        size={{ base: "3xl", md: "5xl" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          {document.body.clientWidth > 500 ? (
            <ModalBody bg={"blackAlpha.800"} pb={5}>
              <Flex
                gap={2}
                w={{ base: "90%", sm: "70%", md: "full" }}
                mx={"auto"}
                maxH={"90vh"}
                minH={"50vh"}
              >
                <Flex
                  borderRadius={4}
                  overflow={"hidden"}
                  border={"1px solid"}
                  borderColor={"whiteAlpha.300"}
                  flex={1.5}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Image
                    src={post.imageURL}
                    alt="profile pic"
                    objectFit="cover"
                    boxSize="full"
                  />
                </Flex>
                <Flex
                  flex={1}
                  flexDir={"column"}
                  px={5}
                  display={{ base: "none", md: "flex" }}
                >
                  <Flex alignItems={"center"} justifyContent={"space-between"}>
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      gap={4}
                      my={"auto"}
                    >
                      <Avatar
                        src={userProfile.profilePicURL}
                        size={"sm"}
                        name={userProfile.fullName}
                      />
                      <Text fontWeight={"bold"} fontSize={14}>
                        {userProfile.username}
                      </Text>
                    </Flex>
                    {authUser?.uid === userProfile.uid && (
                      <Button
                        size={"sm"}
                        bg={"transparent"}
                        _hover={{ bg: "whiteAlpha.300", color: "red.600" }}
                        borderRadius={4}
                        p={1}
                        onClick={handleDeletePost}
                        isLoading={isDeleting}
                      >
                        <MdDelete size={20} cursor={"pointer"} />
                      </Button>
                    )}
                  </Flex>
                  <Divider my={4} bg={"gray.500"} />
                  <Text mb={4}>
                    {/* CAPTIONS */}
                    {post.caption && <Caption post={post} />}
                  </Text>
                  {post.comments.length > 0 && (
                    <VStack
                      w={"full"}
                      alignItems={"start"}
                      maxH={"350px"}
                      overflowY={"auto"}
                      className="commentsContainer"
                      borderTop={"1px solid"}
                      borderColor={"whiteAlpha.300"}
                      pt={2}
                    >
                      {/* COMMENTS */}
                      {post.comments.map((comment: any, index: number) => (
                        <Comment key={index} comment={comment} />
                      ))}
                    </VStack>
                  )}
                  <PostFooter
                    post={post}
                    username={authUser?.username}
                    isProfilePage={true}
                  />
                </Flex>
              </Flex>
            </ModalBody>
          ) : (
            <ModalBody bg={"blackAlpha.800"} pb={5} h={"full"}>
              {authUser?.uid === userProfile.uid && (
                <Button
                  size={"sm"}
                  bg={"transparent"}
                  _hover={{ bg: "whiteAlpha.300", color: "red.600" }}
                  borderRadius={4}
                  p={1}
                  onClick={handleDeletePost}
                  isLoading={isDeleting}
                >
                  <MdDelete size={20} cursor={"pointer"} />
                </Button>
              )}
              <Box my={10}>
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
                <PostFooter post={post} creatorProfile={userProfile} />
              </Box>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
