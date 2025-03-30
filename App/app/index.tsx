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


// export default function Main() {
  // const { setRole, setIsAuthenticated } = useContext(AuthContext);
  // const router = useRouter();
  // const theme = useTheme();

  // const userRouting = () => {
  //   setRole("User");
  //   setIsAuthenticated(true);
  //   router.push("/Home");
  // };
  // const SHGRouting = () => {
  //   setRole("SHG");
  //   setIsAuthenticated(true);
  //   router.push("/Home");
  // };
  // const SHGHeadRouting = () => {
  //   setRole("SHG-Head");
  //   setIsAuthenticated(true);
  //   router.push("/Home");
  // };
  // const VORouting = () => {
  //   setRole("VO");
  //   setIsAuthenticated(true);
  //   router.push("/VO");
  // };

//   return (
//     <View style={styles.pageLayout}>
//       <View style={styles.cardContainer}>
//         <Card style={styles.card} onPress={userRouting}>
//           <Card.Content style={styles.cardContent}>
//             <MaterialCommunityIcons
//               name="account"
//               size={40}
//               color={theme.colors.primary}
//             />
//             <Text style={styles.cardText}>Proceed as normal user</Text>
//           </Card.Content>
//         </Card>
//         <Card style={styles.card} onPress={SHGRouting}>
//           <Card.Content style={styles.cardContent}>
//             <MaterialCommunityIcons
//               name="account-group"
//               size={40}
//               color={theme.colors.primary}
//             />
//             <Text style={styles.cardText}>Login as SHG member</Text>
//           </Card.Content>
//         </Card>
//       </View>
//       <View style={styles.cardContainer}>
//         <Card style={styles.card} onPress={SHGHeadRouting}>
//           <Card.Content style={styles.cardContent}>
//             <MaterialCommunityIcons
//               name="account-cowboy-hat"
//               size={40}
//               color={theme.colors.primary}
//             />
//             <Text style={styles.cardText}>Login as SHG head</Text>
//           </Card.Content>
//         </Card>
//         <Card style={styles.card} onPress={VORouting}>
//           <Card.Content style={styles.cardContent}>
//             <MaterialCommunityIcons
//               name="account-tie"
//               size={40}
//               color={theme.colors.primary}
//             />
//             <Text style={styles.cardText}>Login as VO</Text>
//           </Card.Content>
//         </Card>
//       </View>
//     </View>
//   );
// }
