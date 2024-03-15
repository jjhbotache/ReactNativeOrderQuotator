import { StyleSheet } from "react-native";

const BottomNavBarStyleSheet = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#333333',
    paddingBottom: 32,
    paddingTop: 10,
    
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: 'white',

    borderTopLeftRadius: 16,  
    borderTopRightRadius: 16,
  },
});

export default BottomNavBarStyleSheet;