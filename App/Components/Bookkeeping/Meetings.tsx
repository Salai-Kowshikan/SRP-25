import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Surface, Text, DataTable, FAB } from "react-native-paper";
import DialogBox from "@/Components/UI/DialogBox";
import AddEntryDialogBox from "./AddEntryDialogBox";

interface Member {
  member_id: number;
  name: string;
}

interface MappedMeeting {
  id: string;
  date: string;
  presentPeople: number;
  totalPeople: number;
  minutes: string;
  absentees: string[];
}

interface MeetingsProps {
  meetings: MappedMeeting[];
}

const Meetings = ({ meetings }: MeetingsProps) => {
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([5, 10, 15]);
  const [itemsPerPage, setItemsPerPage] = useState(numberOfItemsPerPageList[0]);
  const [sortedMeetings, setSortedMeetings] = useState<MappedMeeting[]>([]);
  const [isAddEntryDialogVisible, setIsAddEntryDialogVisible] = useState(false);

  const handleAddEntry = () => {
    setIsAddEntryDialogVisible(true);
  };

  const closeAddEntryDialog = () => {
    setIsAddEntryDialogVisible(false);
  };

  useEffect(() => {
    const sorted = [...meetings].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setSortedMeetings(sorted);
  }, [meetings]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, sortedMeetings.length);

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Surface style={styles.filters} elevation={4} mode="flat">
            <Text style={styles.title}>Meetings</Text>
            <ScrollView horizontal>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Date</DataTable.Title>
                  <DataTable.Title numeric>Attendance (%)</DataTable.Title>
                  <DataTable.Title>Minutes of the Meet</DataTable.Title>
                  <DataTable.Title>Absentees</DataTable.Title>
                </DataTable.Header>

                {sortedMeetings.slice(from, to).map((meeting) => {
                  const attendancePercentage = (
                    (meeting.presentPeople / meeting.totalPeople) *
                    100
                  ).toFixed(2);

                  const absenteeNames = meeting.absentees.join(", ");

                  return (
                    <DataTable.Row key={meeting.id}>
                      <DataTable.Cell>{new Date(meeting.date).toLocaleDateString()}</DataTable.Cell>
                      <DataTable.Cell numeric>{attendancePercentage}%</DataTable.Cell>
                      <DataTable.Cell>
                        <DialogBox
                          trigger="View MoM"
                          title="Minutes of the Meeting"
                          content={meeting.minutes}
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
                  numberOfPages={Math.ceil(sortedMeetings.length / itemsPerPage)}
                  onPageChange={(page) => setPage(page)}
                  label={`${from + 1}-${to} of ${sortedMeetings.length}`}
                  numberOfItemsPerPageList={numberOfItemsPerPageList}
                  numberOfItemsPerPage={itemsPerPage}
                  onItemsPerPageChange={setItemsPerPage}
                  showFastPaginationControls
                  selectPageDropdownLabel={"Rows per page"}
                />
              </DataTable>
            </ScrollView>
          </Surface>
        </View>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddEntry}
        label="Add Meeting"
      />

      <AddEntryDialogBox
        visible={isAddEntryDialogVisible}
        onClose={closeAddEntryDialog}
      />
    </>
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
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});

export default Meetings;