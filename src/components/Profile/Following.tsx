import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  UnorderedList,
} from "@chakra-ui/react";
import FollowingUser from "./FollowingUser";

export default function Following({ isOpen, onClose, userProfile }: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        bg={"black"}
        boxShadow={"xl"}
        border={"1px solid gray"}
        mx={3}
      >
        <ModalHeader>Following</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <UnorderedList>
            {userProfile.following.map((follower: any) => (
              <FollowingUser key={follower} userId={follower} />
            ))}
          </UnorderedList>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
