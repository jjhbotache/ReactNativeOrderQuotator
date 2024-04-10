import { StyleSheet } from "react-native";
import Constants from 'expo-constants';

const NewProductStyleSheet = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    maxWidth: 200,
    borderRadius: 39,
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default NewProductStyleSheet;