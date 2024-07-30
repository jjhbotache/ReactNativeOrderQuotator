import React, { useState } from 'react';
import {
  Button,
  Dialog,
  ListItem,
} from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

interface DropdownProps {
  options: string[];
  onChange: (selectedOption: string) => void;
}

const Dropdown: React.FunctionComponent<DropdownProps> = ({ options, onChange }) => {
  const [visible, setVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Select an option');

  const toggleDialog = () => {
    setVisible(!visible);
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onChange(option);
    toggleDialog();
  };

  return (
    <View style={styles.container}>
      <Button
        title={selectedOption}
        onPress={toggleDialog}
        buttonStyle={styles.button}
      />
      <Dialog
        isVisible={visible}
        onBackdropPress={toggleDialog}
        overlayStyle={styles.dialog}
      >
        <Dialog.Title title="Select an Option" titleStyle={{textAlign:"center",fontSize:40}}/>
        {options.map((option, index) => (
          <ListItem
            key={index}
            containerStyle={{
              marginHorizontal: -10,
              borderRadius: 8,
            }}
            onPress={() => handleSelect(option)}
          >
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: '700' }}> {option} </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 6,
    width: 220,
  },
  dialog:{
    flex: .5,
    gap: 5,
    justifyContent:"space-evenly",
    alignContent:"center",  
  }
});

export default Dropdown;
