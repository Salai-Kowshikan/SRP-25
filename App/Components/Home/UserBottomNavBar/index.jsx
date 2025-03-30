import { BottomNavigation, Text } from 'react-native-paper';
import { useState } from 'react';
import MarketPlace from '../Marketplace';
import Invest from '../Invest';
import Community from '../Community';

const MarketPlaceRoute = () => <MarketPlace />;

const InvestRoute = () => <Invest />;

const CommunityRoute = () => <Community />;

const UserBottomNavBar = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'invest', title: 'Invest', focusedIcon: 'cash-check', unfocusedIcon: 'cash' },
    { key: 'market', title: 'Market', focusedIcon: 'cart-check', unfocusedIcon: 'cart-outline'},
    { key: 'community', title: 'Community', focusedIcon: 'account-group', unfocusedIcon: 'account-group-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    market: MarketPlaceRoute,
    invest: InvestRoute,
    community: CommunityRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default UserBottomNavBar;