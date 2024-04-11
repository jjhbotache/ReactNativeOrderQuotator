import { View } from "react-native";

export default function Row({children,widthPercentage=100,justifyContent="space-evenly"}) {
  return <View style={
    {
      flexDirection:"row",
      justifyContent:justifyContent,
      alignItems:"center",
      width:`${widthPercentage}%`
    }
  }>
    {children}
  </View>
};

