import { BottomNavigation, Text } from "react-native-paper";
import { useState } from "react";
import SHGProfile from "@/Components/Home/SHGProfile";
import ShgCommunity from "../Community/shgCommunity";
import ShgMarket from "../Marketplace/shgmarket";
import SHGBookkeeping from "../../SHGBookkeeping";
import SHGManagement from "../SHGManagement";
import SHGDevelopment from "../SHGDevelopment";
import i from "@/Translations";

const CommunityRoute = () => <ShgCommunity />;

const MarketPlaceRoute = () => <ShgMarket />;

const BookKeepingRoute = () => <SHGBookkeeping />;

const ManagementRoute = () => <SHGManagement />;

const DevelopmentRoute = () => <SHGDevelopment />;

const ShgBottomNavBar = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "community",
      title: i.t("community"),
      focusedIcon: "account-group",
      unfocusedIcon: "account-group-outline",
    },
    {
      key: "marketplace",
      title: i.t("market"),
      focusedIcon: "cart",
      unfocusedIcon: "cart-outline",
    },
    {
      key: "bookkeeping",
      title: i.t("records"),
      focusedIcon: "book",
      unfocusedIcon: "book-outline",
    },

    {
      key: "development",
      title: i.t("develop"),
      focusedIcon: "chart-areaspline-variant",
      unfocusedIcon: "chart-line",
    },
    {
      key: "management",
      title: i.t("finance"),
      focusedIcon: "cash-check",
      unfocusedIcon: "cash",
    },
    // {
    //   key: "profile",
    //   title: "Profile",
    //   focusedIcon: "account",
    //   unfocusedIcon: "account-outline",
    // }
  ]);

  const renderScene = BottomNavigation.SceneMap({
    community: CommunityRoute,
    marketplace: MarketPlaceRoute,
    bookkeeping: BookKeepingRoute,
    development: DevelopmentRoute,
    management: ManagementRoute,
    // profile: ProfileRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default ShgBottomNavBar;
