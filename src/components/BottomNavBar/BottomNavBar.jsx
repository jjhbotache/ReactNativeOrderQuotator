import { View } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import BottomNavBarStyleSheet from "./BottomNavBarStyleSheet";

export default function BottomNavBar() {
  return(
    <View style={BottomNavBarStyleSheet.navbar}>
      <Ionicons name="home" size={24} color="white" />
      <Ionicons name="cube-outline" size={24} color="white" />
    </View>
  )
};
