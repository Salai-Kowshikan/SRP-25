import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { Card, DataTable, Button, Switch, IconButton } from "react-native-paper";

interface Member {
  id: number;
  name: string;
  attendance: number;
  smsConfig: boolean;
}

const initialMembers: Member[] = [
  { id: 1, name: "John Doe", attendance: 80, smsConfig: false },
  { id: 2, name: "Jane Smith", attendance: 60, smsConfig: true },
];

export default function Profile() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [newMember, setNewMember] = useState<Member>({ id: 0, name: "", attendance: 100, smsConfig: false });
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const addMember = () => {
    if (newMember.name.trim()) {
      setMembers([...members, { ...newMember, id: Date.now() }]);
      setNewMember({ id: 0, name: "", attendance: 100, smsConfig: false });
    }
  };

  const editMember = (id: number) => {
    const member = members.find((m) => m.id === id);
    if (member) setEditingMember(member);
  };

  const saveMember = () => {
    if (editingMember) {
      setMembers(members.map((m) => (m.id === editingMember.id ? editingMember : m)));
      setEditingMember(null);
    }
  };

  const removeMember = (id: number) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const toggleSmsConfig = (id: number) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, smsConfig: !m.smsConfig } : m)));
  };

  return (
    <View style={{ padding: 16 }}>
      <Card style={{ marginBottom: 16 }}>
        <Card.Content>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Sunrise SHG</Text>
          <Text>Members: {members.length}</Text>
          <Text>Location: Green Valley</Text>
        </Card.Content>
      </Card>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Name</DataTable.Title>
          <DataTable.Title>Attendance (%)</DataTable.Title>
          <DataTable.Title>SMS User Config</DataTable.Title>
          <DataTable.Title>Action</DataTable.Title>
        </DataTable.Header>

        {members.map((member) => (
          <DataTable.Row key={member.id}>
            <DataTable.Cell>{member.name}</DataTable.Cell>
            <DataTable.Cell>{member.attendance}%</DataTable.Cell>
            <DataTable.Cell>
              <Switch value={member.smsConfig} onValueChange={() => toggleSmsConfig(member.id)} />
            </DataTable.Cell>
            <DataTable.Cell>
              <IconButton icon="pencil" onPress={() => editMember(member.id)} />
              <IconButton icon="delete" onPress={() => removeMember(member.id)} />
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>

      <View style={{ marginTop: 20 }}>
        {editingMember ? (
          <>
            <TextInput
              placeholder="Edit Name"
              value={editingMember.name}
              onChangeText={(text) => setEditingMember({ ...editingMember, name: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <Button mode="contained" onPress={saveMember}>Save</Button>
          </>
        ) : (
          <>
            <TextInput
              placeholder="New Member Name"
              value={newMember.name}
              onChangeText={(text) => setNewMember({ ...newMember, name: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <Button mode="contained" onPress={addMember}>Add Member</Button>
          </>
        )}
      </View>
    </View>
  );
}