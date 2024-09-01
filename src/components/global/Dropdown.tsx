import React, { useState, useEffect, useContext } from 'react';
import { FlatList, Text } from 'react-native';
import { Dialog, CheckBox, Button } from '@rneui/themed';
import { texts } from '../../constants';
import { languageContext } from '../../contexts/languageContext';

interface row {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  rows: row[];
  onChange: (value: string) => void;
  defaultValue?: string;
}

export default function Dropdown ({ rows, onChange, defaultValue }: SelectDropdownProps) {
  const [visible, setVisible] = useState(false);
  const {language}= useContext(languageContext);
  const [selectedValue, setSelectedValue] = useState(defaultValue || texts.selectAnOption[language]);
  

  useEffect(() => {
    if (defaultValue) {
      const defaultLabel = rows.find(row => row.value === defaultValue)?.label;
      if (defaultLabel) {
        setSelectedValue(defaultLabel);
      }
    }
  }, [defaultValue, rows]);

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
      <Button onPress={toggleOverlay} title={selectedValue}></Button>

      <Dialog isVisible={visible} onBackdropPress={toggleOverlay}>
        <Dialog.Title title={texts.selectAnOption[language]} />
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