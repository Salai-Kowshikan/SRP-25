import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
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
import api from "@/api/api";

interface AccountDetails {
  account_holder_name: string;
  account_number: string;
  account_type: string;
  balance: number;
  bank_name: string;
  branch_name: string;
  ifsc_code: string;
}

interface Member {
  id: string;
  member_name: string;
  non_smartphone_user: boolean;
}

interface Profile {
  shg_id: string;
  shg_name: string;
  rating: number;
  balance: number;
  account_details: AccountDetails;
}

export default function ProfileScreen() {
  const shgId = "shg_001";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editedName, setEditedName] = useState("");
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMemberNonSmartphone, setNewMemberNonSmartphone] = useState(false);
  const [editedNonSmartphoneUser, setEditedNonSmartphoneUser] = useState(false);

  useEffect(() => {
    fetchProfileAndMembers();
  }, []);

  const fetchProfileAndMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/profile/${shgId}`);
      const { data, members } = res.data;
      setProfile(data);
      setMembers(members);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateMember = async () => {
    if (!editingMember || !editedName.trim()) return;
    setLoading(true);
    try {
      const res = await api.put(
        `/api/profile/${shgId}/members/${editingMember.id}`,
        {
          member_name: editedName,
          non_smartphone_user: editedNonSmartphoneUser,
        }
      );
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                member_name: editedName,
                non_smartphone_user: editedNonSmartphoneUser,
              }
            : m
        )
      );
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
      const res = await api.post(`/api/profile/${shgId}/members`, {
        member_name: newMemberName,
        non_smartphone_user: newMemberNonSmartphone,
      });
      setMembers([...members, res.data]);
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
      console.log(editingMember.id);
      await api.delete(`/api/profile/${shgId}/members/${editingMember.id}`);
      setMembers((prev) => prev.filter((m) => m.id !== editingMember.id));
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
    <ScrollView style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#6200ee" />}

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
          <DataTable.Title>SMS</DataTable.Title>
          <DataTable.Title>Actions</DataTable.Title>
        </DataTable.Header>

        {members.map((m) => (
          <DataTable.Row key={m.id}>
            <DataTable.Cell>{m.member_name}</DataTable.Cell>
            <DataTable.Cell>
              {m.non_smartphone_user ? "No" : "Yes"}
            </DataTable.Cell>
            <DataTable.Cell>
              <IconButton
                icon="pencil"
                onPress={() => {
                  if (m.id) {
                    setEditingMember(m);
                    setEditedName(m.member_name);
                    setEditedNonSmartphoneUser(m.non_smartphone_user);
                    setIsEditDialogVisible(true);
                  } else {
                    console.error("Member ID is null or undefined");
                  }
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
