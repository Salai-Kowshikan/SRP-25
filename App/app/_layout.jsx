import { Slot, Stack } from "expo-router";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import AppBar from "@/Components/UI/AppBar";
import { AuthProvider } from "@/contexts/AuthContext";

const theme = {
  ...MD3LightTheme,
  colors: {
    primary: "rgb(151, 72, 16)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(255, 219, 201)",
    onPrimaryContainer: "rgb(51, 18, 0)",
    secondary: "rgb(149, 74, 4)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(255, 220, 199)",
    onSecondaryContainer: "rgb(49, 19, 0)",
    tertiary: "rgb(150, 73, 10)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(255, 219, 200)",
    onTertiaryContainer: "rgb(50, 19, 0)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 251, 255)",
    onBackground: "rgb(32, 26, 23)",
    surface: "rgb(255, 251, 255)",
    onSurface: "rgb(32, 26, 23)",
    surfaceVariant: "rgb(244, 222, 212)",
    onSurfaceVariant: "rgb(82, 68, 60)",
    outline: "rgb(133, 116, 107)",
    outlineVariant: "rgb(215, 194, 184)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(54, 47, 44)",
    inverseOnSurface: "rgb(251, 238, 233)",
    inversePrimary: "rgb(255, 182, 141)",
    elevation: {
      level0: "transparent",
      level1: "rgb(250, 242, 243)",
      level2: "rgb(247, 237, 236)",
      level3: "rgb(244, 231, 229)",
      level4: "rgb(243, 230, 226)",
      level5: "rgb(240, 226, 222)",
    },
    surfaceDisabled: "rgba(32, 26, 23, 0.12)",
    onSurfaceDisabled: "rgba(32, 26, 23, 0.38)",
    backdrop: "rgba(59, 46, 39, 0.4)",
  },
};

function RootLayout() {
  return (
    <>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <AppBar />
          <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
      </PaperProvider>
    </>
  );
}

export default RootLayout;
