import { TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import NewButtonStyles from "./NewButtonStyleSheet";


export default function NewButton({onPress}) {
  return(
    <TouchableOpacity style={NewButtonStyles.addBtn} onPress={onPress}>
      <Ionicons name="add" size={24} color="white" />
    </TouchableOpacity>
  )
};
