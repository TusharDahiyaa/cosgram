import { useState } from "react";
import useShowToast from "./useShowToast";

export default function usePreviewImg() {
  const [selectedFile, setSelectedFile] = useState<string | null>();
  const showToast = useShowToast();
  const maxFileSizeinBytes = 2 * 1024 * 1024; //2MB

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > maxFileSizeinBytes) {
        showToast(
          {
            title: "Error",
            description: "File size should be less than 2MB",
          },
          "error"
        );
        setSelectedFile(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setSelectedFile(result);
        }
      };

      reader.readAsDataURL(file);
    } else {
      showToast(
        {
          title: "Error",
          description: "Selected file is not a valid image",
        },
        "error"
      );
      setSelectedFile(file);
    }
  };

  return { selectedFile, handleImageChange, setSelectedFile };
}
