import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Text, ListItem, Dialog, CheckBox, Button } from '@rneui/themed';

interface row {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  rows: row[];
  onChange: (value: string) => void;
}
export default function Dropdown ({ rows, onChange }:SelectDropdownProps) {
  const [visible, setVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('Select an option');

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const labels = rows.map((row) => row.label);
  const values = rows.map((row) => row.value);

  const selectOption = (index: number) => {
    const selected = labels[index];
    setSelectedValue(selected);
    onChange(values[index]);
    toggleOverlay();
  };

  return (
    <>
      <Button onPress={toggleOverlay}>{selectedValue}</Button>

      <Dialog isVisible={visible} onBackdropPress={toggleOverlay}>
        <Dialog.Title title='Select an option' />
        <FlatList
          data={labels}
          renderItem={({ item, index }) => (
            <CheckBox
              title={item}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={item === selectedValue}
              onPress={() => selectOption(index)}
            />
          )}
          keyExtractor={(item) => item}
        />
      </Dialog>
    </>
  );
};
