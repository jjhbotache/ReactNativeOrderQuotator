import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Modal } from "react-native";
import { Text, useTheme, Button, ListItem, Input, Icon, FAB, makeStyles } from "@rneui/themed";
import useDatabase from "../hooks/useDatabase";
import { Setting } from "../interfaces/databaseInterfaces";

export default function Settings() {
  const { theme } = useTheme();
  const { getSettings, manageSetting } = useDatabase();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [currentSetting, setCurrentSetting] = useState<Setting>({ setting: "", value: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const styles = useStyles();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const fetchedSettings = await getSettings();
    setSettings(fetchedSettings);
  };

  const handleAddSetting = async () => {
    await manageSetting(currentSetting, "create");
    fetchSettings();
    setCurrentSetting({ setting: "", value: "" });
    setModalVisible(false);
  };

  const handleEditSetting = (setting: Setting) => {
    setCurrentSetting(setting);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleUpdateSetting = async () => {
    await manageSetting(currentSetting, "update");
    fetchSettings();
    setCurrentSetting({ setting: "", value: "" });
    setIsEditing(false);
    setModalVisible(false);
  };

  const handleDeleteSetting = async (setting: string) => {
    await manageSetting({ setting } as Setting, "delete");
    fetchSettings();
  };

  const openModalForNewSetting = () => {
    setCurrentSetting({ setting: "", value: "" });
    setIsEditing(false);
    setModalVisible(true);
  };

  const openHelpModal = () => {
    setHelpModalVisible(true);
  };

  const closeHelpModal = () => {
    setHelpModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text h1>Settings</Text>

      <ScrollView style={styles.settingsContainerView}>
        <View style={styles.listContainer}>
          {settings.map((setting) => (
            <ListItem key={setting.setting} bottomDivider>
              <View style={styles.row}>
                <ListItem.Content>
                  <ListItem.Title>{setting.setting}</ListItem.Title>
                  <ListItem.Subtitle>{setting.value}</ListItem.Subtitle>
                </ListItem.Content>
                <Icon name="edit" color="blue" onPress={() => handleEditSetting(setting)} />
                <Icon name="delete" color="red" onPress={() => handleDeleteSetting(setting.setting)} />
              </View>
            </ListItem>
          ))}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text h4>{isEditing ? "Edit Setting" : "Add Setting"}</Text>
          <Input
            placeholder="Setting"
            value={currentSetting.setting}
            onChangeText={(text) => setCurrentSetting({ ...currentSetting, setting: text })}
            disabled={isEditing}
          />
          <Input
            placeholder="Value"
            value={currentSetting.value}
            onChangeText={(text) => setCurrentSetting({ ...currentSetting, value: text })}
          />
          <View style={styles.row}>
            <Button type="outline" title="Cancel" onPress={() => setModalVisible(false)} />
            <Button
              title={isEditing ? "Update Setting" : "Add Setting"}
              onPress={isEditing ? handleUpdateSetting : handleAddSetting}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={helpModalVisible}
        onRequestClose={closeHelpModal}
      >
        <View style={styles.modalView}>
          <Text h4>How do settings work</Text>
          <Text>Here you can add the settings you want to configure, to customise your pdf creation.</Text>
          <Text>Here is a list of settings you can add:</Text>
          <View style={styles.helpList}>
            <Text h4>1. company</Text>
            <Text>company setting is used to set the biller name you want your billing pdf says.</Text>
          </View>
          <Button title="Close" onPress={closeHelpModal} />
        </View>
      </Modal>

      <FAB 
        icon={{ name: "add", color: "white" }}
        color={theme.colors.primary}
        onPress={openModalForNewSetting} 
      />

      <Button 
        title="Help" 
        onPress={openHelpModal} 
        buttonStyle={styles.helpButton}
      />
    </View>
  );
}

const useStyles = makeStyles(theme=>({
  container: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  settingsContainerView: {
    width: "100%",
    flex: 0.9
  },
  listContainer: {
    gap: 5, // Separate list items vertically by 5 units
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Darker background with some transparency
    padding: 20,
    margin: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    width: "95%",
  },
  listItem: {
    backgroundColor: "#31063c", // Custom background color for list items
  },
  helpButton: {
    marginTop: 20,
    backgroundColor: theme.colors.secondary,
  },
  helpList: {
    marginTop: 10,
    alignItems: "flex-start",
  },
}));