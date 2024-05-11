import { Box, Flex, Link, Text, VStack } from "@chakra-ui/react";
import SugggestedHeader from "./SugggestedHeader";
import SuggestedUser from "./SuggestedUser";
import { BiCopyright } from "react-icons/bi";
import useGetSuggestedUsers from "../../hooks/useGetSuggestedUsers";
import useAuthStore from "../../store/authStore";
import { useLocation } from "react-router-dom";

export default function SuggestedUsers() {
  const { isLoading, suggestedUsers } = useGetSuggestedUsers();
  const authUser = useAuthStore((state: any) => state.user);
  const { pathname } = useLocation();

  // Could add sleketons
  if (isLoading) return null;

  return (
    <>
      <VStack
        py={8}
        px={6}
        gap={4}
        display={document.body.clientWidth < 500 ? "none" : "block"}
      >
        <SugggestedHeader />
        {suggestedUsers.length !== 0 && (
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            w={"full"}
          >
            <Text
              fontSize={14}
              fontWeight={"bold"}
              color={"gray.500"}
              my={pathname === `/${authUser.username}` ? 1 : 4}
            >
              Suggested for you
            </Text>
            <Text
              fontSize={14}
              fontWeight={"bold"}
              _hover={{ color: "grya.400" }}
              cursor={"pointer"}
            >
              See all
            </Text>
          </Flex>
        )}
        {suggestedUsers.map((user) => (
          <SuggestedUser key={user.uid} user={user} />
        ))}
        <Box fontSize={14} color={"gray.500"} mt={5} alignSelf={"start"}>
          <Flex alignItems={"center"} gap={1}>
            <BiCopyright size={14} />
            {new Date().getFullYear()} Built by
            <Link
              href="https://www.instagram.com/tushardahiyaa"
              target="_blank"
              color={"blue.500"}
              fontSize={14}
            >
              Tushar Dahiya
            </Link>
          </Flex>
        </Box>
      </VStack>
      {suggestedUsers.length !== 0 && pathname === `/${authUser.username}` && (
        <Box
          border={"1px solid"}
          borderColor={"gray.600"}
          p={2}
          borderRadius={5}
        >
          <Text fontSize={14} mb={2} fontWeight={"bold"} color={"gray.500"}>
            Suggested for you
          </Text>
          {suggestedUsers.map((user) => (
            <SuggestedUser key={user.uid} user={user} />
          ))}
        </Box>
      )}
    </>
  );
}
