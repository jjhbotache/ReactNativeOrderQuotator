import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, View } from "react-native";
import { Text, useTheme, ListItem, Input, makeStyles } from "@rneui/themed";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings as SettingsInterface } from "../helpers/createPDF"; // Import the new interface
import { useFocusEffect } from '@react-navigation/native';
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export const getSettingsFromStorage = async ()=> {
  try {
    const jsonValue = JSON.parse( await AsyncStorage.getItem('settings'));
    //  if the jsonValue doesnt have exactly the same keys as the required array, create a new object with the required keys as empty strings
    const requiredKeys = Object.keys(getListOfSettings());
    const jsonKeys = Object.keys(jsonValue);
    const missingKeys = requiredKeys.filter(key => !jsonKeys.includes(key));
    if(missingKeys.length > 0){
      return getListOfSettings();
    }

    return jsonValue != null ? jsonValue : getListOfSettings();
  } catch (e) {
    console.error("Failed to fetch settings from AsyncStorage", e);
    return new SettingsInterface();
  }
};

const createEmptySettings = (): SettingsInterface => {
  return new SettingsInterface();
};

const excludedSettings: string[] = ["customerName", "customerNit", "fileName", "date"];
const getListOfSettings = ()=>{
  let toReturn = {};
  const settings = Object.keys(createEmptySettings());
  const filtered = settings.filter(setting => !excludedSettings.includes(setting));
  filtered.forEach(setting => toReturn[setting] = "");
  
  return toReturn; 
}



export default function Settings() {
  const [settings, setSettings] = useState(getListOfSettings());
  const styles = useStyles();

  useFocusEffect(
    useCallback(() => {
      const fetchSettings = async () => {
        const fetchedSettings = await getSettingsFromStorage();
        // filter the settings that are not in the excludedSettings array
        // const filteredSettings = Object.keys(fetchedSettings).filter(setting => !excludedSettings.includes(setting));
        console.log(fetchedSettings);
        
        setSettings(fetchedSettings);
      };

      fetchSettings();
    }, [])
  );

  useEffect(() => {
    const saveSettings = async () => {
      try {
        const jsonValue = JSON.stringify(settings);
        await AsyncStorage.setItem('settings', jsonValue);
      } catch (e) {
        console.error("Failed to save settings to AsyncStorage", e);
      }
    };

    saveSettings();
  }, [settings]);

  const handleUpdateSetting = (key: keyof SettingsInterface, value: string) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value
    }));
  };

  return (
    <View style={styles.container}>
      <Text h1>Settings</Text>

      <ScrollView style={styles.settingsContainerView}>
        <View style={styles.listContainer}>
          {Object.keys(settings).filter(setting => !excludedSettings.includes(setting)).map((key) => (
            <ListItem key={key} bottomDivider style= {{padding: 0}} containerStyle = {{padding: 1}}>
              <View style={styles.row}>
                <ListItem.Content >
                  <ListItem.Title>{key}</ListItem.Title>
                  <Input
                    placeholder="Value"
                    value={settings[key as keyof SettingsInterface]}
                    onChangeText={(text) => handleUpdateSetting(key as keyof SettingsInterface, text)}
                  />
                </ListItem.Content>
              </View>
            </ListItem>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: theme.colors.background,
  },
  settingsContainerView: {
    width: "100%",
    flex: 0.9
  },
  listContainer: {
    gap: 5, // Separate list items vertically by 5 units
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    padding: 0,
    margin: 0,
  },
  listItem: {
    backgroundColor: "#31063c", // Custom background color for list items
  },
}));