import { Modal, Portal, Button, Text, TextInput, Checkbox, useTheme } from "react-native-paper";
import { View, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useProfileStore } from "@/stores/profileStore";

interface AddEntryDialogBoxProps {
  visible: boolean;
  onClose: () => void;
}

const AddEntryDialogBox = ({ visible, onClose }: AddEntryDialogBoxProps) => {
  const theme = useTheme();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedAttendees, setSelectedAttendees] = useState<Record<string, boolean>>({});
  const [minutes, setMinutes] = useState<string>("");

  const members = useProfileStore((state) => state.members); 

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const toggleAttendee = (id: string) => {
    setSelectedAttendees((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async () => {
    try {
      const presentMembers = members.filter((member) => selectedAttendees[member.member_id]);
      const absentees = members
        .filter((member) => !selectedAttendees[member.member_id])
        .map((member) => member.member_name);

      const payload = {
        minutes,
        date: date?.toISOString().split("T")[0],
        absentees,
        present: presentMembers.length,
        attendance_percentage: ((presentMembers.length / members.length) * 100).toFixed(2),
      };

      console.log("API Payload:", payload);
      onClose();
    } catch (error) {
      console.error("Failed to prepare meeting entry payload:", error);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={{
          ...styles.modalContainer,
          backgroundColor: theme.colors.surface,
        }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={{ ...styles.title, color: theme.colors.onSurface }}>Add New Meeting</Text>
          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={{ ...styles.datePickerButton, borderColor: theme.colors.primary }}
          >
            {date ? date.toISOString().split("T")[0] : "Select Date"}
          </Button>
          {showDatePicker && (
            <DateTimePicker value={date || new Date()} mode="date" display="default" onChange={handleDateChange} />
          )}
          <Text style={{ ...styles.subtitle, color: theme.colors.onSurface }}>Select Attendees</Text>
          <ScrollView style={styles.attendeesContainer}>
            {members.map((member) => (
              <View key={member.member_id} style={styles.checkboxContainer}>
                <Checkbox
                  status={selectedAttendees[member.member_id] ? "checked" : "unchecked"}
                  onPress={() => toggleAttendee(member.member_id)}
                  color={theme.colors.primary}
                />
                <Text style={{ color: theme.colors.onSurface }}>{member.member_name}</Text>
              </View>
            ))}
          </ScrollView>
          <TextInput
            label="Minutes of the Meeting"
            style={{ ...styles.input, backgroundColor: theme.colors.surface }}
            multiline
            value={minutes}
            onChangeText={setMinutes}
            theme={{ colors: { text: theme.colors.onSurface, placeholder: theme.colors.outline } }}
          />
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={handleSubmit} style={{ ...styles.button, backgroundColor: theme.colors.primary }}>
              Submit
            </Button>
            <Button mode="outlined" onPress={onClose} style={{ ...styles.button, borderColor: theme.colors.primary }}>
              Cancel
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 8,
    maxHeight: "90%",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  datePickerButton: {
    marginBottom: 15,
  },
  attendeesContainer: {
    maxHeight: 150,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default AddEntryDialogBox;
