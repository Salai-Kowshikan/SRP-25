import { BottomNavigation, Text } from "react-native-paper";
import { useState, useEffect } from "react";
import { useProductStore } from "@/stores/productStore";
import { useProfileStore } from "@/stores/profileStore";
import Forum from "@/Components/Forum";
import MarketPlace from "@/Components/Marketplace";
import Bookkeeping from "@/Components/Bookkeeping";
import Analytics from "@/Components/Analytics";

const Home = () => {
  const [index, setIndex] = useState(0);
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

  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  useEffect(() => {
    fetchProducts();
    fetchProfile("shg_001");
  }, [fetchProducts, fetchProfile]);

  const renderScene = BottomNavigation.SceneMap({
    analytics: () => <Analytics />,
    forum: () => <Forum />,
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