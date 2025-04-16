import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Linking,
} from "react-native";
import {
  Text,
  Card,
  useTheme,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import api from "../../api/api";
import { useLoadingStore } from "../../stores/loadingStore";

interface Activity {
  id?: string;
  created_at: string;
  shg_name: string;
  description: string;
  details: string;
  image_url?: string;
  phone?: string;
}

export default function Forum() {
  const theme = useTheme();
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { loading, setLoading, resetLoading } = useLoadingStore();

  const toggleDetails = (index: number): void => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const fetchRecentPosts = async (): Promise<void> => {
    setLoading(true); // Start loading
    try {
      const response = await api.get<Activity[]>("/api/forum/posts");
      setRecentActivities(response.data);
    } catch (error) {
      console.error("Error fetching recent posts:", error);
    } finally {
      resetLoading(); // Stop loading
    }
  };

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
  };

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {recentActivities.map((activity, index) => (
          <Card key={index} style={styles.card}>
            <Card.Title
              title={activity.shg_name}
              subtitle={activity.created_at}
              right={() =>
                activity.phone && (
                  <IconButton
                    icon="phone"
                    size={20}
                    onPress={() => Linking.openURL(`tel:${activity.phone}`)}
                    style={styles.phoneIcon}
                  />
                )
              }
            />
            <Card.Cover
              source={{
                uri: activity.image_url || "https://picsum.photos/600/800",
              }}
              style={{ borderRadius: 0 }}
            />
            <Card.Content>
              <Text>{activity.description}</Text>
              {expandedIndex === index && (
                <Text style={styles.details}>{activity.details}</Text>
              )}
              <Text
                onPress={() => toggleDetails(index)}
                style={[styles.readMore, { color: theme.colors.primary }]}
              >
                {expandedIndex === index ? "Read Less" : "Read More"}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  details: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },
  readMore: {
    marginTop: 8,
    fontWeight: "bold",
  },
  phoneIcon: {
    marginRight: 10,
  },
});
