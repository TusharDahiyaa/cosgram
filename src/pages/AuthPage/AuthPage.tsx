import { Box, Container, Flex, Image, VStack } from "@chakra-ui/react";
import AuthForm from "../../components/AuthForm/AuthForm";

export default function AuthPage() {
  return (
    <Flex
      minH={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
      px={4}
      bgGradient={
        "radial-gradient(circle, #ffffff, #d1d1d3, #a5a5a9, #7a7b81, #52545b, #3f4147, #2e2e34, #1d1d22, #19171b, #141114, #0c090b, #000000)"
      }
    >
      <Container maxW={"container.md"} padding={0}>
        <Flex justifyContent={"center"} alignItems={"center"} gap={10}>
          {/* Left side */}
          <VStack
            spacing={4}
            align={"stretch"}
            bg={"blackAlpha.800"}
            p={5}
            rounded={10}
          >
            <AuthForm />
            <Box textAlign={"center"}>Get the App.</Box>
            <Flex gap={5} justifyContent={"center"}>
              <Image src="/playstore.png" h={"10"} alt="Playstore logo" />
              <Image src="/microsoft.png" h={"10"} alt="Playstore logo" />
            </Flex>
          </VStack>

          {/* Right side */}
          <Box display={{ base: "none", md: "block" }}>
            <Image
              src="/cosgram_auth.png"
              alt="Auth Img"
              h={"550"}
              rounded={10}
            />
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
}
