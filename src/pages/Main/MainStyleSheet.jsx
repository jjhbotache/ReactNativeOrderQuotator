import { StyleSheet } from "react-native";
import Constants from 'expo-constants';
import { bgPrimaryColor } from "../../constants/styleConstants";

const MainStyleSheet = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: bgPrimaryColor,
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  separator: {
    height: 2,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  infoContainer:{
    padding: 16,
    paddingBottom: 0,
    flex: 1,
  }
});

export default MainStyleSheet;
