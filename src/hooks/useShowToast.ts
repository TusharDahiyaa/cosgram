import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

type showToastProps = {
  title: string;
  description: string;
};

const useShowToast = () => {
  const toast = useToast();

  //useCallback is used to prevent infinite loop by caching the function
  const showToast = useCallback(
    ({ title, description }: showToastProps, status: string) => {
      toast({
        title: title,
        description: description,
        status: status as "success" | "error" | "warning" | "info",
        duration: 9000,
        isClosable: true,
      });
    },
    [toast]
  );

  return showToast;
};

export default useShowToast;
