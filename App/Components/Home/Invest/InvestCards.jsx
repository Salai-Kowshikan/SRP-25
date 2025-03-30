import { Card, Text, Button } from "react-native-paper";
import { StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

const InvestCard = ({ title, subtitle, description, imageUri, id }) => {
    const router = useRouter()
  return (
    <Card style={styles.shgCard}>
      <Card.Title
        title={title}
        titleVariant="headlineSmall"
        subtitle={subtitle}
        subtitleVariant="titleSmall"
      />
      <Card.Content>
        <Text variant="bodySmall">{description}</Text>
      </Card.Content>
      <Card.Cover source={{ uri: imageUri }} style={styles.shgMedia} />
      <Card.Actions>
        <Button onPress={() => router.navigate(`Performance/${id}`)}>View Performance</Button>
        <Button onPress={() => router.navigate(`Invest/${id}`)}>Invest</Button>
      </Card.Actions>
    </Card>
  );
};

export default InvestCard;

const styles = StyleSheet.create({
  shgCard: {
    padding: 10,
  },
  shgMedia: {
    margin: 10,
    height: 150,
    resizeMode: "contain",
  },
});
