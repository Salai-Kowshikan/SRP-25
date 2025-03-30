import { View } from "react-native";
import { DataTable } from "react-native-paper";
import DialogBox from "../UI/DialogBox";
import i from "@/Translations";

function Minutes({ records }) {
    return (
      <>
        <View>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>{i.t('date')}</DataTable.Title>
              <DataTable.Title>{i.t('minutesofMeeting')}</DataTable.Title>
            </DataTable.Header>
            {Object.keys(records).map((date) => (
              <DataTable.Row key={date}>
                <DataTable.Cell>{date}</DataTable.Cell>
                <DataTable.Cell>
                  <DialogBox
                    content={records[date].minutes_book}
                    trigger={i.t("view")}
                    title="Minutes of meeting"
                  />
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </View>
      </>
    );
  }

export default Minutes;
