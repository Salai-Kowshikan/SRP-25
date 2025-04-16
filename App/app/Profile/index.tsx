import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  Card,
  DataTable,
  Button,
  IconButton,
  Dialog,
  Portal,
  Switch,
} from "react-native-paper";
import { useProfileStore } from "@/stores/profileStore";
import { useLoadingStore } from "@/stores/loadingStore"; // Import loadingStore
import api from "@/api/api";
import Loader from "@/Components/UI/Loader"; // Import the Loader component

interface Member {
  member_id: string;
  member_name: string;
  non_smartphone_user: boolean;
}

export default function ProfileScreen() {
  const shgId = "shg_001";

  // Use profileStore for state management
  const {
    profile,
    members,
    fetchProfile,
    updateProfile,
  } = useProfileStore();

  // Use loadingStore for global loading state
  const setLoading = useLoadingStore((state) => state.setLoading);

  const [newMemberName, setNewMemberName] = useState("");
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editedName, setEditedName] = useState("");
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [newMemberNonSmartphone, setNewMemberNonSmartphone] = useState(false);
  const [editedNonSmartphoneUser, setEditedNonSmartphoneUser] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Show loader
      try {
        await fetchProfile(shgId); // Fetch profile and members from the store
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false); // Hide loader
      }
    };

    fetchData();
  }, [fetchProfile, shgId, setLoading]);

  const updateMember = async () => {
    if (!editingMember || !editedName.trim()) return;
    setLoading(true);
    try {
      await api.put(
        `/api/profile/${shgId}/members/${editingMember.member_id}`,
        {
          member_name: editedName,
          non_smartphone_user: editedNonSmartphoneUser,
        }
      );
      await fetchProfile(shgId); // Refetch the profile and members
      setIsEditDialogVisible(false);
      setEditingMember(null);
      setEditedName("");
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async () => {
    if (!newMemberName.trim()) return;
    setLoading(true);
    try {
      await api.post(`/api/profile/${shgId}/members`, {
        member_name: newMemberName,
        non_smartphone_user: newMemberNonSmartphone,
      });
      await fetchProfile(shgId); // Refetch the profile and members
      setNewMemberName("");
      setNewMemberNonSmartphone(false);
      setIsAddDialogVisible(false);
    } catch (err) {
      console.error("Add error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async () => {
    if (!editingMember) return;
    setLoading(true);
    try {
      await api.delete(`/api/profile/${shgId}/members/${editingMember.member_id}`);
      await fetchProfile(shgId); // Refetch the profile and members
      setIsEditDialogVisible(false);
      setEditingMember(null);
      setEditedName("");
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    

      <ScrollView style={styles.container}>
        {profile && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>{profile.shg_name}</Text>
              <Text>Balance: {profile.balance}</Text>
              <Text>Total Members: {members.length}</Text>
              <Text style={styles.subtitle}>Bank Details</Text>
              <Text>Bank Name: {profile.account_details.bank_name}</Text>
              <Text>Account Number: {profile.account_details.account_number}</Text>
              <Text>Account Type: {profile.account_details.account_type}</Text>
              <Text>IFSC Code: {profile.account_details.ifsc_code}</Text>
              <Text>Branch Name: {profile.account_details.branch_name}</Text>
              <Text>
                Account Holder Name: {profile.account_details.account_holder_name}
              </Text>
            </Card.Content>
          </Card>
        )}

        <Button
          mode="contained"
          onPress={() => setIsAddDialogVisible(true)}
          style={styles.addButton}
        >
          Add Member
        </Button>

        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title>Smartphone</DataTable.Title>
            <DataTable.Title>Actions</DataTable.Title>
          </DataTable.Header>

          {members.map((m) => (
            <DataTable.Row key={m.member_id}>
              <DataTable.Cell>{m.member_name}</DataTable.Cell>
              <DataTable.Cell>
                {m.non_smartphone_user ? "No" : "Yes"}
              </DataTable.Cell>
              <DataTable.Cell>
                <IconButton
                  icon="pencil"
                  onPress={() => {
                    setEditingMember(m);
                    setEditedName(m.member_name);
                    setEditedNonSmartphoneUser(m.non_smartphone_user);
                    setIsEditDialogVisible(true);
                  }}
                />
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>

        {/* Edit Dialog */}
        <Portal>
          <Dialog
            visible={isEditDialogVisible}
            onDismiss={() => setIsEditDialogVisible(false)}
          >
            <Loader/>
            <Dialog.Title>Edit Member</Dialog.Title>
            <Dialog.Content>
              
              <TextInput
                placeholder="Edit member name"
                value={editedName}
                onChangeText={setEditedName}
                style={{
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                  marginBottom: 10,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text>Has Smartphone?</Text>
                <Switch
                  value={!editedNonSmartphoneUser}
                  onValueChange={(val) => setEditedNonSmartphoneUser(!val)}
                  style={{ marginLeft: 10 }}
                />
              </View>
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: "space-between" }}>
              <Button onPress={deleteMember} textColor="red">
                Delete
              </Button>
              <Button onPress={updateMember}>Save</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Add Dialog */}
        <Portal>
          <Dialog
            visible={isAddDialogVisible}
            onDismiss={() => setIsAddDialogVisible(false)}
          >
            <Dialog.Title>Add New Member</Dialog.Title>
            <Dialog.Content>
              <TextInput
                placeholder="New member name"
                value={newMemberName}
                onChangeText={setNewMemberName}
                style={{
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                  marginBottom: 10,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Text>Has Smartphone?</Text>
                <Switch
                  value={!newMemberNonSmartphone}
                  onValueChange={(val) => setNewMemberNonSmartphone(!val)}
                  style={{ marginLeft: 10 }}
                />
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={addMember}>Add</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: 24,
    marginVertical: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 8,
  },
  addButton: {
    marginBottom: 16,
  },
});