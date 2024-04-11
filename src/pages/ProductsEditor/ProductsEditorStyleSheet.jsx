import { StyleSheet } from "react-native";
import Constants from 'expo-constants';
import { bgPrimaryColor, bgThirdColor } from "../../constants/styleConstants";

const ProductsEditorStyleSheet = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: bgPrimaryColor,
    color: 'white',
    gap: 10,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  button:(red=false)=>(
    {
      backgroundColor: red ? 'red' : bgThirdColor,
      padding: 10,
      borderRadius: 10,
      width: 100,
    }
  ),
  btnText:{
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
  input: {
    height: 40,
    width: "60%",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    fontSize: 20,
  },
  btnsContainer: {
    flexDirection: 'row',
    width: '70%',
    justifyContent: 'space-evenly',
  }
});

export default ProductsEditorStyleSheet;