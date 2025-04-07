import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useLoadingStore } from '@/stores/loadingStore';

const Loader = () => {
  const loading = useLoadingStore((state) => state.loading);

  if (!loading) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default Loader;
