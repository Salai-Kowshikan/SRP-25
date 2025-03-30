import { BottomNavigation, Text } from "react-native-paper";
import { useState } from "react";
import Forum from "@/Components/Forum";
import MarketPlace from "@/Components/Marketplace";
import Bookkeeping from "@/Components/Bookkeeping";


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
  ]);

  const renderScene = BottomNavigation.SceneMap({
    analytics: () => <Text>Market analytics</Text>,
    forum: () => <Forum />,
    management: () => <Text>Community</Text>,
    marketplace: () => <MarketPlace />,
    bookkeeping: () => <Bookkeeping />,
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