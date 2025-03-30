import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Linking,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";
import {
    Text,
    Card,
    useTheme,
    SegmentedButtons,
    AnimatedFAB,
    IconButton,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

interface Activity {
    date: string;
    shgName: string;
    description: string;
    details: string;
    img?: string;
    phone?: string;
}

const yourPosts: Activity[] = [
    {
        date: "2024-07-30",
        shgName: "Empowerment SHG",
        description: "Shared a new article on community development.",
        details: "Detailed description of the article on community development shared by Empowerment SHG.",
        img: "https://picsum.photos/600/800",
        phone: "1234567890",
    },
    {
        date: "2024-07-28",
        shgName: "Unity SHG",
        description: "Posted about the upcoming health camp.",
        details: "Detailed description of the upcoming health camp posted by Unity SHG.",
        img: "https://picsum.photos/601/800",
        phone: "0987654321",
    },
];

const recentActivities: Activity[] = [
    {
        date: "2024-07-25",
        shgName: "Sunrise SHG",
        description: "Conducted a workshop on sustainable farming practices.",
        details: "Detailed description of the workshop on sustainable farming practices by Sunrise SHG.",
        img: "https://picsum.photos/600/800",
        phone: "1234567890",
    },
    {
        date: "2024-07-20",
        shgName: "Empowerment SHG",
        description: "Launched a new handicraft product line.",
        details: "Detailed description of the new handicraft product line launched by Empowerment SHG.",
        img: "https://picsum.photos/601/800",
        phone: "1234567890",
    },
    {
        date: "2024-07-15",
        shgName: "Unity SHG",
        description: "Organized a health camp for the local community.",
        details: "Detailed description of the health camp organized by Unity SHG for the local community.",
        img: "https://picsum.photos/602/800",
        phone: "1234567890",
    },
];

export default function Forum() {
    const theme = useTheme();
    const navigation = useNavigation();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [selectedTab, setSelectedTab] = useState<string>("recent");
    const [isExtended, setIsExtended] = useState(true);
    const [createPostModalVisible, setCreatePostModalVisible] = useState(false);

    const toggleDetails = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const activities = selectedTab === "recent" ? recentActivities : yourPosts;

    const onScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
        setIsExtended(currentScrollPosition <= 0);
    };

    return (
        <>
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
                style={styles.container}
                showsVerticalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16} // Ensures smooth scroll event handling
            >
                {activities.map((activity, index) => (
                    <Card key={index} style={styles.card}>
                        <Card.Title
                            title={activity.shgName}
                            subtitle={activity.date}
                            titleStyle={styles.title}
                            right={activity.phone ? () => (
                                <IconButton
                                    icon="phone"
                                    onPress={() => Linking.openURL(`tel:${activity.phone}`)}
                                />
                            ) : undefined}
                        />
                        <Card.Cover
                            source={{ uri: activity.img || "https://via.placeholder.com/600x800" }}
                            style={styles.image}
                        />
                        <Card.Content>
                            <Text style={styles.description}>{activity.description}</Text>
                            {expandedIndex === index && <Text style={styles.details}>{activity.details}</Text>}
                            <Text
                                onPress={() => toggleDetails(index)}
                                style={[styles.readMore, { color: theme.colors.primary }]}
                                accessible
                                accessibilityLabel={expandedIndex === index ? "Read less" : "Read more"}
                            >
                                {expandedIndex === index ? "Read Less" : "Read More"}
                            </Text>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>
            <AnimatedFAB
                icon={'plus'}
                label={'Add post'}
                extended={isExtended}
                onPress={() => setCreatePostModalVisible(true)} // Navigate to CreatePost screen
                visible={true}
                animateFrom={'right'}
                iconMode="dynamic"
                style={styles.fabStyle}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    card: {
        marginBottom: 20,
        borderRadius: 12,
        overflow: "hidden",
        elevation: 5,
    },
    title: {
        fontWeight: "bold",
        fontSize: 18,
    },
    image: {
        height: 250,
        resizeMode: "cover",
        borderRadius: 0,
    },
    description: {
        fontSize: 16,
        marginTop: 10,
    },
    details: {
        fontSize: 14,
        marginTop: 5,
        color: "#555",
    },
    readMore: {
        fontWeight: "bold",
        marginTop: 10,
    },
    fabStyle: {
        position: "absolute",
        bottom: 16,
        right: 16,
    },
});
