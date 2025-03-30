import { BottomNavigation, Text } from "react-native-paper";
import { useState } from "react";
import MarketPlace from "@/Components/Marketplace";

const Home = () => {
  const [index, setIndex] = useState(2);
  const [routes] = useState([
    {
      key: "analytics",
      title: "Analytics",
      focusedIcon: "chart-box",
      unfocusedIcon: "chart-box-outline",
    },
    {
      key: "marketplace",
      title: "Marketplace",
      focusedIcon: "cart",
      unfocusedIcon: "cart-outline",
    },
    {
      key: "bookkeeping",
      title: "Bookkeeping",
      focusedIcon: "book",
      unfocusedIcon: "book-outline",
    },
    {
      key: "forum",
      title: "Forum",
      focusedIcon: "account-group",
      unfocusedIcon: "account-group-outline",
    },
    {
      key: "management",
      title: "Management",
      focusedIcon: "account-circle",
      unfocusedIcon: "account-circle-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    analytics: () => <MarketPlace />,
    marketplace: () => <Text>Community</Text>,
    bookkeeping: () => <Text>Community</Text>,
    forum: () => <Text>Community</Text>,
    management: () => <Text>Community</Text>,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default Home;