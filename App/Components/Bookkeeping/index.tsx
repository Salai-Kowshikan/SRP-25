import { View, SafeAreaView, StyleSheet } from "react-native";
import { SegmentedButtons, Text } from "react-native-paper";
import { useState, useEffect } from "react";
import Accounts from "@/Components/Bookkeeping/Accounts";
import Meetings from "@/Components/Bookkeeping/Meetings";
import api from "@/api/api";

interface MeetingResponse {
  meeting_id: string;
  date: string;
  present: number;
  absentees: string[];
  minutes: string;
  shg_id: string;
}

interface MappedMeeting {
  id: string;
  date: string;
  presentPeople: number;
  totalPeople: number;
  minutes: string;
  absentees: string[];
}

const Bookkeeping = () => {
  const [tab, setTab] = useState("accounts");
  const [meetings, setMeetings] = useState<MappedMeeting[]>([]);
  const shg_id = "shg_001";

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await api.get<{ data: MeetingResponse[] }>(`/api/meetings/${shg_id}`);
        console.log("Fetched meetings data:", response.data);

        const mappedMeetings: MappedMeeting[] = response.data.data.map((meeting) => ({
          id: meeting.meeting_id,
          date: meeting.date,
          presentPeople: meeting.present,
          totalPeople: meeting.present + meeting.absentees.length,
          minutes: meeting.minutes,
          absentees: meeting.absentees,
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
      {tab === "accounts" && <Accounts shg_id={shg_id} />}
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
