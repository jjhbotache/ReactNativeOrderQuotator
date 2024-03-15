import { StyleSheet } from "react-native";
import Constants from 'expo-constants';

const MainStyleSheet = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#630000',
  },
  title: {
    fontSize: 24,
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
