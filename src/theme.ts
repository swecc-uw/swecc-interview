import { extendTheme, theme as baseTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "white",
        color: "gray.800",
      },
    },
  },
  colors: {
    brand: baseTheme.colors.teal,
  },
  components: {
    Button: {
      baseStyle: {
        rounded: "md",
        fontWeight: "bold",
      },
      sizes: {
        md: {
          h: 10,
          fontSize: "md",
          px: 6,
        },
      },
      variants: {
        solid: (_props: any) => ({
          bg: "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
          },
        }),
      },
    },
  },
});

export default theme;
