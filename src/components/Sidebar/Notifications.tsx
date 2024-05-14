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
import { useEffect, useState } from "react";
import fetchUserNotificationsForWeek from "../../hooks/useGetNotifications";
import useAuthStore from "../../store/authStore";

const Notifications = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notifications, setNotifications] = useState([]);
  const authUser = useAuthStore((state: any) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const { notifications } = await fetchUserNotificationsForWeek(
        authUser.uid
      );
      console.log(notifications);
      setNotifications(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

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
              {notifications.length > 0 &&
                notifications.map((notification) => (
                  <li key={notification.createdAt}>
                    {notification.type === "follow" && (
                      <Text>{notification.fullName} followed you!</Text>
                    )}
                    {notification.type === "like" && (
                      <Text>{notification.fullName} liked your post.</Text>
                    )}
                    {notification.type === "comment" && (
                      <Text>
                        {notification.fullName} commented on your post.
                      </Text>
                    )}
                  </li>
                ))}
              {notifications.length === 0 && (
                <>
                  <Text color={"gray"}>
                    You don&apos;t have any notifications.
                  </Text>
                </>
              )}
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
