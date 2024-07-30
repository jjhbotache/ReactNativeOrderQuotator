import { Button, Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

export default function Products() {
  return <View style={styles.container} >
    <Text>Hola</Text>
    <Button
    onPress={e=>console.log("go back")} 
    title={"Product"}
    ></Button>
  </View>
};

const styles = StyleSheet.create({
container:{
  flex: 1,
  padding: 5,
}
})
