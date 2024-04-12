import { StyleSheet } from "react-native";
import { bgPrimaryColor, bgSecondaryColor } from "../../constants/styleConstants";

const NewOrderStyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: bgPrimaryColor,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "white",
  },
  dropdown: {
    inputAndroid: {
      backgroundColor: "white",
      marginBottom: 20,
      borderRadius: 9999999999,
      selfAlign: "center",
    },
    padding: 4,
  },
  productsQuotationsContainer:{
    backgroundColor: bgSecondaryColor,
    padding: 20,
    borderColor: "white",
    borderWidth: 1,
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
  },
  productQuotation: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
    borderRadius: 20,
  },
  btn:{
    backgroundColor: bgSecondaryColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 9999999999,
    marginBottom: 20,
    alignItems: "center",
    maxWidth: "50%",
  },
  btnText:{
    color: "white",
  },
  input:{
    backgroundColor: "white",
    padding: 10,
    borderRadius: 9999999999,
    marginBottom: 20,
    width: "100%",
  },

});

export const ProductQuotationModalStyles = StyleSheet.create({
  title:{
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "white",
  },
  container:{
    backgroundColor: bgSecondaryColor,
    width: "95%",
    height: "95%",
    position: "absolute",
    top: "2.5%",
    left: "2.5%",
    justifyContent: "space-evenly",
    paddingVertical: "50%",
    alignItems: "center",
    flex: 1,
    
    padding: 20,
    borderRadius: 20,
  },
  btn:{
    backgroundColor: bgPrimaryColor,
    padding: 10,
    borderRadius: 9999999999,
  },
  btnText:{
    color: "white",
  },
  description:{
    color: "white",
    fontWeight: "900",
    fontSize: 20,
  },
  value:{
    color: "white",
    fontSize: 15,
  },
  total:{
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
})

export default NewOrderStyleSheet;