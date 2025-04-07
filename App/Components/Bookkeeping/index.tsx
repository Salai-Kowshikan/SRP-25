import { View, SafeAreaView, StyleSheet } from "react-native";
import { SegmentedButtons, Text } from "react-native-paper";
import { useState, useEffect } from "react";
import Accounts from "@/Components/Bookkeeping/Accounts";
import Meetings from "@/Components/Bookkeeping/Meetings";
import api from "@/api/api";

interface MeetingResponse {
  id: string;
  date?: string;
  attendees: number;
  absentees: {
    Absentees: number[];
  };
}

interface MappedMeeting {
  key: string;
  date: string;
  presentPeople: number;
  totalPeople: number;
  mom: string;
  absentees: number[];
}

const Bookkeeping = () => {
  const [tab, setTab] = useState("accounts");
  const [meetings, setMeetings] = useState<MappedMeeting[]>([]);
  const user_id = "shg2005";

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await api.get<{ data: MeetingResponse[] }>(`${user_id}/meeting`);
        console.log("Fetched meetings data:", response.data);

        const mappedMeetings: MappedMeeting[] = response.data.data.map((meeting) => ({
          key: meeting.id,
          date: meeting.date || "N/A",
          presentPeople: meeting.attendees,
          totalPeople: meeting.attendees + meeting.absentees.Absentees.length,
          mom: "Minutes of the meeting not provided",
          absentees: meeting.absentees.Absentees,
        }));

        setMeetings(mappedMeetings);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <SegmentedButtons
          value={tab}
          onValueChange={setTab}
          buttons={[
            {
              value: "accounts",
              label: "Accounts Book",
              icon: "book",
            },
            {
              value: "meetings",
              label: "Meetings Book",
              icon: "calendar",
            },
          ]}
        />
      </SafeAreaView>
      {tab === "accounts" && <Accounts />}
      {tab === "meetings" && <Meetings meetings={meetings} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
});

export default Bookkeeping;
