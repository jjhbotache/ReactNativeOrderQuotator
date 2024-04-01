import { View } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import BottomNavBarStyleSheet from "./BottomNavBarStyleSheet";
import { useNavigation } from "@react-navigation/native";

export default function BottomNavBar({state, descriptors, navigation}) {
  // console.log("BottomNavBar",);
  // console.log("state", state);
  // console.log("descriptors", descriptors);
  // console.log("navigation", navigation);

  const {navigate} = useNavigation()


  return(
    <View style={BottomNavBarStyleSheet.navbar}>
      <Ionicons name="home" size={24} color="white" onPress={e=>navigate(state.routeNames[0])} />
      <Ionicons name="cube-outline" size={24} color="white" onPress={e=>navigate(state.routeNames[1])} />
    </View>
  )
};
