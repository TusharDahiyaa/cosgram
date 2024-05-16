import {
  Badge,
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
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";

interface Notification {
  fullName: string;
  type: string;
  postId: string;
  createdAt: number;
  userId: string;
}

const Notifications = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const authUser = useAuthStore((state: any) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [imageURLs, setImageURLs] = useState<{ [key: string]: string }>({});

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      if (!authUser) return;

      const fetchedNotifications = await fetchUserNotificationsForWeek(
        authUser.uid
      );
      setNotifications(fetchedNotifications);

      // Fetch image URLs for each notification
      const urls: { [key: string]: string } = {};
      await Promise.all(
        fetchedNotifications.map(async (notification: Notification) => {
          if (notification.type === "like" || notification.type === "comment") {
            const imageRef = await getDoc(
              doc(firestore, "posts", notification.postId)
            );
            const imageURL = imageRef.data()?.imageURL;
            if (imageURL) {
              urls[notification.postId] = imageURL;
            }
          }
        })
      );
      setImageURLs(urls);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [onOpen, isOpen]);

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
          <Box display={{ base: "none", md: "block" }}>
            Notifications
            <Badge
              mx={2}
              px={2}
              py={1}
              fontSize={16}
              colorScheme="blue"
              borderRadius={"full"}
            >
              {notifications.length}
            </Badge>
          </Box>
        </Flex>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent bg={"black"} border={"1px solid gray"} maxW={"500px"}>
          <ModalHeader>Notifications</ModalHeader>
          <ModalCloseButton />
          <ModalBody px={2} overflowY={"scroll"} maxH={"70lvh"}>
            <UnorderedList px={2}>
              {notifications.length > 0 &&
                notifications.map((notification: any) => (
                  <ListItem py={1} key={notification.createdAt}>
                    {notification.type === "follow" && (
                      <Box my={2}>
                        <Text
                          as={"span"}
                          fontWeight={"bold"}
                          mr={2}
                          cursor={"pointer"}
                        >
                          <span
                            onClick={() => {
                              window.location.href = `/${notification.userWhoTookAction}`;
                            }}
                          >
                            {notification.fullName}
                          </span>{" "}
                          started following you.
                        </Text>
                        <Text as={"span"} fontWeight={"normal"} fontSize={"sm"}>
                          {formatTimeAsTimeAgo(notification.createdAt)}
                        </Text>
                      </Box>
                    )}
                    {(notification.type === "like" ||
                      notification.type === "comment") && (
                      <Flex
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        my={2}
                      >
                        <Box mr={1}>
                          <Text
                            as={"span"}
                            fontWeight={"bold"}
                            mr={1}
                            cursor={"pointer"}
                          >
                            <span
                              onClick={() => {
                                window.location.href = `/${notification.userWhoTookAction}`;
                              }}
                            >
                              {notification.fullName}
                            </span>{" "}
                            {notification.type === "like"
                              ? "liked"
                              : "commented on"}{" "}
                            your photo.{" "}
                          </Text>
                          <Text
                            as={"span"}
                            fontWeight={"normal"}
                            fontSize={"sm"}
                          >
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
                            src={imageURLs[notification.postId]}
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
                  <Text color={"gray"} textAlign={"center"} my={10}>
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
