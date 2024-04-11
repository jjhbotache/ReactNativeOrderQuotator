import { StyleSheet } from "react-native";
import { bgPrimaryColor, bgSecondaryColor, bgThirdColor } from "../../constants/styleConstants";

export const productsStyleSheet = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:bgPrimaryColor,
    color: 'white',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  separator: {
    height: 2,
    backgroundColor: 'black',
    marginBottom: 16,
  },
  infoContainer:{
    padding: 16,
    paddingBottom: 0,
    flex: 1,
  },
  productName: {
    color: 'white',
    fontSize: 18,
    marginBottom: 8,
  },
})

export const productStyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bgThirdColor,
    padding: 16,
  },
  name: {
    color: 'white',
    fontSize: 18,
    marginBottom: 8,
  },
  price: {
    color: 'white',
    fontSize: 18,
    marginBottom: 8,
  },
  separator: {
    backgroundColor: "None",
    marginBottom: 16,
  },
})