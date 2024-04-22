import { StyleSheet } from "react-native";
import { bgPrimaryColor, bgSecondaryColor, bgThirdColor } from "../../constants/styleConstants";

const OrderEditorStyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: bgPrimaryColor,
    color: 'white',
    padding: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
    width: '100%',
    fontSize: 40,
  },
  text:({type})=>(
    type === 'title' ? (
      {
        fontSize: 40,
        color: 'white',
        fontWeight: 'bold',
      }
    ) : (
      {
        fontSize: 16,
        color: 'white',
      }
    )
  ),
  productsQuotationsContainer: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: bgSecondaryColor,
    color: 'white',
    padding: 20,
  },
  dropdown:{
    inputAndroid: {
      backgroundColor: "white",
      marginBottom: 20,
      selfAlign: "center",
      color: "black",
      width: "100%",
      minWidth: 150,
    }
  },
});

export default OrderEditorStyleSheet;