import { View } from "react-native";
import { DataTable } from "react-native-paper";
import DialogBox from "../UI/DialogBox";
import { useEffect, useState } from "react";
import api from "@/api/api";
import i from "@/Translations";

function Attendance({ records }) {
  const [members, setMembers] = useState([]);
  const fetchMembers = async () => {
    try {
      const response = await api.get("/fetchAllMembers");
      setMembers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMembers();
    Object.keys(records).forEach((key) => {
      console.log(records[key].attendance);
    });
  }, [records]);

  return (
    <>
      <View>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>{i.t('date')}</DataTable.Title>
            <DataTable.Title>{i.t('present')} (%)</DataTable.Title>
            <DataTable.Title>{i.t('absentees')}</DataTable.Title>
          </DataTable.Header>
          {Object.keys(records).length > 0 &&
            Object.entries(records).map(([date, record]) => {
              const presentMembers = record.attendance;
              const absentMembers = members.filter(
                (member) => !presentMembers.includes(member.member_id)
              );
              return (
                <DataTable.Row key={date}>
                  <DataTable.Cell>{date}</DataTable.Cell>
                  <DataTable.Cell>
                    {((presentMembers.length / members.length) * 100).toFixed(
                      2
                    )}
                    %
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <DialogBox
                      content={absentMembers
                        .map((member) => member.name)
                        .join(", ")}
                      trigger="View"
                      title="Absentees"
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              );
            })}
        </DataTable>
      </View>
    </>
  );
}

export default Attendance;
