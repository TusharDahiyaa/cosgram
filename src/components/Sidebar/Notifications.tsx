import {
  Box,
  Button,
  Flex,
  Image,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { NotificationsLogo } from "../../assets/constants";
import { useEffect, useState } from "react";
import fetchUserNotificationsForWeek from "../../hooks/useGetNotifications";
import useAuthStore from "../../store/authStore";
import formatTimeAsTimeAgo from "../../utils/formatTimeAsTimeAgo";

const Notifications = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notifications, setNotifications] = useState([]);
  const authUser = useAuthStore((state: any) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      if (!authUser) return;
      const notifications = await fetchUserNotificationsForWeek(authUser.uid);
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

  if (isLoading) return;

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
          <ModalBody px={4}>
            <UnorderedList>
              {notifications.length > 0 &&
                notifications.map((notification: any) => (
                  <ListItem py={1} key={notification.createdAt}>
                    {notification.type === "follow" && (
                      <Text>{notification.fullName} followed you!</Text>
                    )}
                    {notification.type === "like" && (
                      <Flex
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        my={2}
                      >
                        <Box>
                          <Text as={"span"} fontWeight={"bold"} mr={2}>
                            <span
                              onClick={() => {
                                window.location.href = ``;
                              }}
                            >
                              {notification.fullName}
                            </span>{" "}
                            liked your photo.
                          </Text>
                          <Text as={"span"} fontSize={"sm"}>
                            {formatTimeAsTimeAgo(notification.createdAt)}
                          </Text>
                        </Box>
                        <Box
                          w={10}
                          h={10}
                          overflow={"hidden"}
                          position={"relative"}
                          justifyContent={"center"}
                          rounded={5}
                        >
                          <Image
                            src="img3.png"
                            alt="post Image"
                            position={"absolute"}
                            top={-2.5}
                          />
                        </Box>
                      </Flex>
                    )}
                    {notification.type === "comment" && (
                      <Flex
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        my={2}
                      >
                        <Box>
                          <Text as={"span"} fontWeight={"bold"} mr={2}>
                            <span
                              onClick={() => {
                                window.location.href = ``;
                              }}
                            >
                              {notification.fullName}
                            </span>{" "}
                            commented on your photo.
                          </Text>
                          <Text as={"span"} fontSize={"sm"}>
                            {formatTimeAsTimeAgo(notification.createdAt)}
                          </Text>
                        </Box>
                        <Box
                          w={10}
                          h={10}
                          overflow={"hidden"}
                          position={"relative"}
                          justifyContent={"center"}
                          rounded={5}
                        >
                          <Image
                            src="img3.png"
                            alt="post Image"
                            position={"absolute"}
                            top={-2.5}
                          />
                        </Box>
                      </Flex>
                    )}
                  </ListItem>
                ))}
              {notifications.length === 0 && (
                <>
                  <Text color={"gray"}>
                    You don&apos;t have any notifications.
                  </Text>
                </>
              )}
            </UnorderedList>
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
