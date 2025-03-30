import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import AddProductFAB from './AddProductFAB'

const MarketPlace = () => {
  return (
    <View style={styles.container}>
      <Text>MarketPlace</Text>
      <AddProductFAB />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})


export default MarketPlace