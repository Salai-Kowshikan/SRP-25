import { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Button,
  TextInput,
  Switch,
  Text,
  SegmentedButtons,
  HelperText,
  Snackbar,
} from "react-native-paper";
import { useRouter } from "expo-router";
import api from "@/api/api";
import { useLoadingStore } from "@/stores/loadingStore";

export default function Main() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShgUser, setIsShgUser] = useState(false);
  const [mode, setMode] = useState("login");
  const [error, setError] = useState({ username: "", password: "" });
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const setLoading = useLoadingStore((state) => state.setLoading);
  const resetLoading = useLoadingStore((state) => state.resetLoading);

  const isPasswordValid = password.length >= 8;

  const validateFields = () => {
    const errors = { username: "", password: "" };
    if (!username) errors.username = "Username cannot be empty.";
    if (!password) errors.password = "Password cannot be empty.";
    else if (!isPasswordValid)
      errors.password = "Password must be at least 8 characters long.";
    setError(errors);
    return !errors.username && !errors.password;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
        is_shg: isShgUser,
      });

      if (response.status === 200) {
        console.log("Login successful:", response.data);
        setSnackbarVisible(true);
        router.replace("/Home")
      } else {
        setError(response.data.error || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      setError({
        username: "",
        password: "An error occurred. Please try again.",
      });
    } finally {
      resetLoading();
    }
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      console.log("Registering user:", { username, password, isShgUser });
      const response = await api.post("/auth/register", {
        username,
        password,
        is_shg: isShgUser,
      });
      console.log("Register response:", response.data);

      if (response.data.success === true) {
        console.log("Registration successful:", response.data);
        setSnackbarVisible(true);
      } else if (response.data.success === false) {
        setError({ username: response.data.error, password: "" });
      }
    } catch (err) {
      console.error(err);
      setError({
        username: "",
        password: "An error occurred. Please try again.",
      });
    } finally {
      resetLoading();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login / Register</Text>
      <SegmentedButtons
        value={mode}
        onValueChange={setMode}
        buttons={[
          { value: "login", label: "Login" },
          { value: "register", label: "Register" },
        ]}
        style={styles.segmentedButtons}
      />
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <HelperText type="error" visible={error.username !== ""}>
        {error.username}
      </HelperText>
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <HelperText type="error" visible={error.password !== ""}>
        {error.password}
      </HelperText>
      <View style={styles.switchContainer}>
        <Text>SHG User</Text>
        <Switch value={isShgUser} onValueChange={setIsShgUser} />
      </View>
      <Button
        mode="contained"
        onPress={mode === "login" ? handleLogin : handleRegister}
        style={styles.button}
      >
        {mode === "login" ? "Login" : "Register"}
      </Button>
      <Button
        mode="outlined"
        onPress={() => router.replace("/Home")}
        style={styles.debugButton}
      >
        Debug: Go to Home
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {mode === "login" ? "Login successful!" : "Registration successful!"}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 5,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
  debugButton: {
    marginTop: 10,
    borderColor: "red",
    borderWidth: 1,
  },
});
