// 1. import `extendTheme` function
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

//Custom styles for dark theme in chakra UI
const styles = {
  global: (props: any) => ({
    body: {
      bg: mode("#393E46", "#222831")(props),
      color: mode("gray.800", "whiteAlpha.900")(props),
    },
  }),
};

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// 3. extend the theme
const theme = extendTheme({ config, styles });

export default theme;
