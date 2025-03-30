import { View, SafeAreaView, StyleSheet } from "react-native";
import { SegmentedButtons, Text } from "react-native-paper";
import { useState } from "react";

const Bookkeeping = () => {
  const [tab, setTab] = useState("accounts");
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.tabContainer}>
        <SegmentedButtons
          value={tab}
          onValueChange={setTab}
          buttons={[
            {
              value: "accounts",
              label: "Accounts Book",
              icon: "book",
            },
            {
              value: "meetings",
              label: "Meetings Book",
            icon: "calendar",
            },
          ]}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    margin: 20,
  },
  tabContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default Bookkeeping;
