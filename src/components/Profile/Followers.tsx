import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  UnorderedList,
} from "@chakra-ui/react";
import Follower from "./Follower";

export default function Followers({ isOpen, onClose, userProfile }: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        bg={"black"}
        boxShadow={"xl"}
        border={"1px solid gray"}
        mx={3}
        maxW={400}
      >
        <ModalHeader>Followers</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY={"scroll"} maxH={500}>
          <UnorderedList>
            {userProfile.followers.map((follower: any) => (
              <Follower key={follower} userId={follower} />
            ))}
          </UnorderedList>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
