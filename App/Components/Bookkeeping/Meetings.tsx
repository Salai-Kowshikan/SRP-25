import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Surface, Text, DataTable } from "react-native-paper";
import DialogBox from "@/Components/UI/DialogBox";
import api from "@/api/api";

interface Member {
  member_id: number;
  name: string;
}

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

const Meetings = () => {
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([5, 10, 15]);
  const [itemsPerPage, setItemsPerPage] = useState(numberOfItemsPerPageList[0]);

  const [members] = useState<Member[]>([
    { member_id: 1, name: "John Doe" },
    { member_id: 2, name: "Jane Smith" },
    { member_id: 3, name: "Alice Johnson" },
    { member_id: 4, name: "Bob Brown" },
    { member_id: 5, name: "Charlie Davis" },
  ]);

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

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, meetings.length);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Surface style={styles.filters} elevation={4} mode="flat">
          <Text style={styles.title}>Meetings</Text>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title numeric>Attendance (%)</DataTable.Title>
              <DataTable.Title>Minutes of the Meet</DataTable.Title>
              <DataTable.Title>Absentees</DataTable.Title>
            </DataTable.Header>

            {meetings.slice(from, to).map((meeting) => {
              const attendancePercentage = (
                (meeting.presentPeople / meeting.totalPeople) *
                100
              ).toFixed(2);

              const absenteeNames = meeting.absentees
                .map((id) => members.find((member) => member.member_id === id)?.name)
                .filter(Boolean)
                .join(", ");

              return (
                <DataTable.Row key={meeting.key}>
                  <DataTable.Cell>{meeting.date}</DataTable.Cell>
                  <DataTable.Cell numeric>{attendancePercentage}%</DataTable.Cell>
                  <DataTable.Cell>
                    <DialogBox
                      trigger="View MoM"
                      title="Minutes of the Meeting"
                      content={meeting.mom}
                    />
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <DialogBox
                      trigger="View Absentees"
                      title="Absentees"
                      content={absenteeNames || "None"}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(meetings.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${meetings.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              showFastPaginationControls
              selectPageDropdownLabel={"Rows per page"}
            />
          </DataTable>
        </Surface>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
  },
  filters: {
    padding: 10,
    borderRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default Meetings;