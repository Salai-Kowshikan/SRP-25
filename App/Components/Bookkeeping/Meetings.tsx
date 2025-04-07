import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Surface, Text, DataTable } from "react-native-paper";
import DialogBox from "@/Components/UI/DialogBox";

interface Member {
  member_id: number;
  name: string;
}

interface MappedMeeting {
  key: string;
  date: string;
  presentPeople: number;
  totalPeople: number;
  mom: string;
  absentees: number[];
}

interface MeetingsProps {
  meetings: MappedMeeting[];
}

const Meetings = ({ meetings }: MeetingsProps) => {
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