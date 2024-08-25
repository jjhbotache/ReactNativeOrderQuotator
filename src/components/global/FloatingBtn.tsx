import { Button, ButtonProps, Icon } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

export default function FloatingBtn(props:ButtonProps) {
  return (
    <View style={styles.container}>
      <Button {...props} buttonStyle={styles.button}>
        <Icon
        name="plus"
        type="font-awesome"
        size={28}
        />
      </Button>
    </View>
  )
};


const styles = StyleSheet.create({
  button:{
    borderRadius:9999999,
  },
  container:{
    position:"absolute",
    bottom:20,
    right:20,
    backgroundColor:"#222222",
    padding:5,
    borderRadius:15,
    shadowColor: "#ffffff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
})