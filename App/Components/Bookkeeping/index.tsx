import { View, SafeAreaView, StyleSheet } from "react-native";
import { SegmentedButtons, Text } from "react-native-paper";
import { useState, useEffect } from "react";
import Accounts from "@/Components/Bookkeeping/Accounts";
import Meetings from "@/Components/Bookkeeping/Meetings";

const Bookkeeping = () => {
  const [tab, setTab] = useState("accounts");
  const shg_id = "shg_001";

  return (
    <View style={styles.container}>
      <SafeAreaView>
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
      {tab === "accounts" && <Accounts shg_id={shg_id} />}
      {tab === "meetings" && <Meetings />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
});

export default Bookkeeping;
