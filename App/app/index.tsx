import { View, StyleSheet, Text } from "react-native";
import { Button} from "react-native-paper";
import { useRouter } from "expo-router";

export default function Main() {

  const router = useRouter();

  return(
    <>
    <View>
      <Text>Login page</Text>
      <Button mode="contained" onPress={() => router.replace('/Home')}>Login</Button>
    </View>
    </>
  )
}

