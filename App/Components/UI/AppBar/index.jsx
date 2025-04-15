import React, { useState } from "react";
import { Appbar, Dialog, Portal, Text, Button } from "react-native-paper";
import { usePathname, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AppBar = () => {
  const pathname = usePathname();
  const { top } = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <>
      <Appbar.Header statusBarHeight={top}>
        {pathname !== "/" && pathname !== "/Users" && pathname !== "/Home" && (
          <Appbar.BackAction onPress={() => router.back()} />
        )}
        <Appbar.Content title="SHGConnect" titleStyle={{ fontWeight: "bold" }} />
        {pathname !== "/" && (
          <>
            <Appbar.Action icon="bell" onPress={showDialog} />
            {pathname === "/Users" || pathname === "/Profile" ? (
              <Appbar.Action icon="logout" onPress={handleLogout} />
            ) : (
              <Appbar.Action icon="account-circle" onPress={() => router.push("Profile")} />
            )}
          </>
        )}
      </Appbar.Header>
      
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Notification</Dialog.Title>
          <Dialog.Content>
            <Text>No new notifications</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default AppBar;
