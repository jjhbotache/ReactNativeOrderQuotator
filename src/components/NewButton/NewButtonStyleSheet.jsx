import { StyleSheet } from "react-native";
import { bgSecondaryColor } from "../../constants/styleConstants";

const NewButtonStyles = StyleSheet.create({
  addBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: bgSecondaryColor,
    padding: 16,
    borderRadius: 99999,
  },
});

export default NewButtonStyles;