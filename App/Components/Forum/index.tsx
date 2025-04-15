import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  SafeAreaView,
} from "react-native";
import {
  Text,
  Card,
  useTheme,
  SegmentedButtons,
  AnimatedFAB,
  Dialog,
  Portal,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
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

interface SelectedImage {
  uri: string;
  name: string;
  type: string;
}

export default function Forum() {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState<string>("recent");
  const [createPostModalVisible, setCreatePostModalVisible] =
    useState<boolean>(false);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [yourPosts, setYourPosts] = useState<Activity[]>([]);
  const [isExtended, setIsExtended] = useState<boolean>(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const [description, setDescription] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [image, setImage] = useState<SelectedImage | null>(null);

  const { loading, setLoading, resetLoading } = useLoadingStore();

  const toggleDetails = (index: number): void => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const fetchRecentPosts = async (): Promise<void> => {
    setLoading(true); 
    try {
      const response = await api.get<Activity[]>("/api/forum/posts");
      setRecentActivities(response.data);
    } catch (error) {
      console.error("Error fetching recent posts:", error);
    } finally {
      resetLoading(); 
    }
  };

  const fetchYourPosts = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await api.get<Activity[]>("/api/forum/posts/shg_001");
      setYourPosts(response.data);
    } catch (error) {
      console.error("Error fetching your posts:", error);
    } finally {
      resetLoading(); // Stop loading
    }
  };

  const addPost = async (): Promise<void> => {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("details", details);
    formData.append("phone", phone);
    formData.append("shg_id", "shg_001");

    if (image) {
      formData.append("image_file", {
        uri: image.uri,
        name: image.name,
        type: image.type,
      } as any); 
    }

    console.log("FormData:", formData);

    setLoading(true); // Start loading
    try {
      await api.post("api/forum/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCreatePostModalVisible(false);
      fetchRecentPosts(); // Refresh recent posts after adding
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      resetLoading(); // Stop loading
    }
  };

  const selectImage = async (): Promise<void> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const file = result.assets?.[0];
        if (file) {
          setImage({
            uri: file.uri,
            name: file.name,
            type: file.mimeType || "image/jpeg",
          });
          console.log("Selected Image:", file); // Debug log
        }
      } else {
        console.log("Image selection canceled");
      }
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  };

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  useEffect(() => {
    if (selectedTab === "recent") {
      fetchRecentPosts();
    } else if (selectedTab === "all") {
      fetchYourPosts();
    }
  }, [selectedTab]);

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={selectedTab}
        onValueChange={setSelectedTab}
        buttons={[
          { value: "recent", label: "Feed" },
          { value: "all", label: "Your posts" },
        ]}
        style={{ marginBottom: 10, margin: 10 }}
      />
      <ScrollView
        style={styles.scrollContainer}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {(selectedTab === "recent" ? recentActivities : yourPosts).map(
          (activity, index) => (
            <Card key={index} style={styles.card}>
              <Card.Title
                title={activity.shg_name}
                subtitle={activity.created_at}
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
          )
        )}
      </ScrollView>
      <AnimatedFAB
        icon={"plus"}
        label={"Add post"}
        extended={isExtended}
        onPress={() => setCreatePostModalVisible(true)}
        visible={true}
        animateFrom={"right"}
        iconMode={"dynamic"}
        style={styles.fabStyle}
      />
      <Portal>
        <Dialog
          visible={createPostModalVisible}
          onDismiss={() => setCreatePostModalVisible(false)}
        >
          <Dialog.Title>Create Post</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              label="Details"
              value={details}
              onChangeText={setDetails}
            />
            <TextInput label="Phone" value={phone} onChangeText={setPhone} />
            <Button onPress={selectImage}>Select Image</Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCreatePostModalVisible(false)}>
              Cancel
            </Button>
            <Button onPress={addPost}>Submit</Button>
          </Dialog.Actions>
        </Dialog>
        {/* Loader */}
        {loading && (
          <Dialog visible={loading} dismissable={false}>
            <Dialog.Content>
              <ActivityIndicator animating={true} size="large" />
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                Loading...
              </Text>
            </Dialog.Content>
          </Dialog>
        )}
      </Portal>
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
  fabStyle: {
    bottom: 16,
    right: 16,
    position: "absolute",
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
});