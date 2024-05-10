import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import useSignupWithEmailAndPassword from "../../hooks/useSignupWithEmailAndPassword";

export default function Signup() {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, signup } = useSignupWithEmailAndPassword();

  return (
    <>
      <Input
        placeholder="Email"
        _placeholder={{ opacity: 1, color: "gray.300" }}
        type="email"
        fontSize={14}
        value={inputs.email}
        size={"sm"}
        onChange={(e) => {
          setInputs({ ...inputs, email: e.target.value });
        }}
      />
      <Input
        placeholder="Username"
        _placeholder={{ opacity: 1, color: "gray.300" }}
        type="text"
        fontSize={14}
        value={inputs.username}
        size={"sm"}
        onChange={(e) => {
          setInputs({ ...inputs, username: e.target.value });
        }}
      />
      <Input
        placeholder="Full Name"
        _placeholder={{ opacity: 1, color: "gray.300" }}
        type="text"
        fontSize={14}
        value={inputs.fullName}
        size={"sm"}
        onChange={(e) => {
          setInputs({ ...inputs, fullName: e.target.value });
        }}
      />
      <InputGroup>
        <Input
          placeholder="Password"
          _placeholder={{ opacity: 1, color: "gray.300" }}
          type={showPassword ? "text" : "password"}
          fontSize={14}
          value={inputs.password}
          size={"sm"}
          onChange={(e) => {
            setInputs({ ...inputs, password: e.target.value });
          }}
        />
        <InputRightElement h={"full"}>
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
          </Button>
        </InputRightElement>
      </InputGroup>

      {error && (
        <Alert status="error" fontSize={12} p={2} borderRadius={4}>
          <AlertIcon fontSize={12} />
          {error.message}
        </Alert>
      )}

      <Button
        w={"full"}
        colorScheme="blue"
        size={"sm"}
        fontSize={14}
        isLoading={loading}
        onClick={() => {
          signup(inputs);
        }}
      >
        Sign Up
      </Button>
    </>
  );
}
