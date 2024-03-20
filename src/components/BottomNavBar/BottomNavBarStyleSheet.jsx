import { StyleSheet } from "react-native";

const BottomNavBarStyleSheet = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#333333',
    paddingBottom: 32,
    paddingTop: 10,

    marginTop: -5,

    borderTopLeftRadius: 16,  
    borderTopRightRadius: 16,
  },
});

export default BottomNavBarStyleSheet;