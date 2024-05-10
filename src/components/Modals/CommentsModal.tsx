import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import Comment from "../Comment/Comment";
import usePostComment from "../../hooks/usePostComment";
import { RefObject, useEffect, useRef } from "react";

const CommentsModal = ({ isOpen, onClose, post }: any) => {
  const { handlePostComment, isCommenting } = usePostComment();
  const commentRef: RefObject<HTMLInputElement> = useRef(null);
  const commentsContainerRef = useRef(null);

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (commentRef.current?.value) {
      await handlePostComment(post.id, commentRef.current.value);
      commentRef.current.value = "";
    }
  };

  useEffect(() => {
    const scrollToBottom = () => {
      if (commentsContainerRef?.current) {
        commentsContainerRef.current.scrollTop =
          commentsContainerRef.current.scrollHeight;
      }
    };

    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
      }, 500);
    }
  }, [isOpen, post.comments.length]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInLeft">
      <ModalOverlay />
      <ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
        <ModalHeader>Comments</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Flex
            mb={4}
            gap={4}
            flexDir={"column"}
            maxH={"250px"}
            overflowY={"auto"}
            ref={commentsContainerRef}
            scrollBehavior={"smooth"}
          >
            {post.comments.map((comment: any, index: number) => (
              <Comment key={index} comment={comment} />
            ))}
          </Flex>
          <form style={{ marginTop: "2rem" }} onSubmit={handleCommentSubmit}>
            <Input placeholder="Comment" size={"sm"} ref={commentRef} />
            <Flex w={"full"} justifyContent={"flex-end"}>
              <Button
                type="submit"
                ml={"auto"}
                size={"sm"}
                my={4}
                isLoading={isCommenting}
              >
                Post
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CommentsModal;
