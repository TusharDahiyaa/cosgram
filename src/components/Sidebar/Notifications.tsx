import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { NotificationsLogo } from "../../assets/constants";
import useNotificationStore from "../../store/useNotificationStore";

const Notifications = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { notifications, clearNotifications } = useNotificationStore();

  return (
    <>
      <Tooltip
        hasArrow
        label={"Notifications"}
        placement="right"
        ml={1}
        openDelay={500}
        display={{ base: "block", md: "none" }}
      >
        <Flex
          alignItems={"center"}
          gap={4}
          _hover={{ bg: "whiteAlpha.400" }}
          borderRadius={6}
          p={2}
          w={{ base: 10, md: "full" }}
          justifyContent={{ base: "center", md: "flex-start" }}
          onClick={onOpen}
        >
          <NotificationsLogo />
          <Box display={{ base: "none", md: "block" }}>Notifications</Box>
        </Flex>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
          <ModalHeader>Notifications</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id}>
                  {notification.type === "follow" && (
                    <Text>{notification.fullName} followed you!</Text>
                  )}
                  {notification.type === "like" && (
                    <Text>{notification.fullName} liked your post.</Text>
                  )}
                  {/* Add cases for other notification types (e.g., comments) */}
                </li>
              ))}
            </ul>
          </ModalBody>
        </ModalContent>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Notifications;
