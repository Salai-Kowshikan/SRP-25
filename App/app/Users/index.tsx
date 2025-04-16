import { BottomNavigation } from "react-native-paper";
import { useState } from "react";
import Marketplace from "@/Components/Users/Marketplace";
import Orders from "@/Components/Users/Orders";
import Forum from "@/Components/Users/Forum";

const Userpage = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "marketplace",
      title: "Marketplace",
      focusedIcon: "cart",
      unfocusedIcon: "cart-outline",
    },
    {
      key: "orders",
      title: "Orders",
      focusedIcon: "clipboard-list",
      unfocusedIcon: "clipboard-list-outline",
    },
    {
      key: "forum",
      title: "Forum",
      focusedIcon: "forum",
      unfocusedIcon: "forum-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    marketplace: () => <Marketplace />,
    orders: () => <Orders />,
    forum: () => <Forum />,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default Userpage;