import { View } from 'react-native';
import { useState } from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

const DialogBox = ({content,trigger,title}) => {
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  return (
      <View>
        <Button onPress={showDialog}>{trigger}</Button>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">{content}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
  );
};

export default DialogBox;