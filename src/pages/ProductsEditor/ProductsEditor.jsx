import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput, TouchableHighlight, TouchableNativeFeedback, View } from "react-native";
import ProductsEditorStyleSheet from "./ProductsEditorStyleSheet";
import { useNavigation } from "@react-navigation/native";

export default function ProductsEditor({db,route}) {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const {navigate} = useNavigation();

  const {id: idProductToEdit} = route.params;	
  console.log("id", idProductToEdit);
  
  useEffect(() => {
    // get and set product data
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM products WHERE id = ${idProductToEdit};`,
        [],
        (_, { rows: { _array } }) => {
          console.log("product to edit", _array);
          const [product] = _array;
          setName(product.name);
          setUnit(product.unit);
          setPrice(product.price);
        },
        (_, error) => {
          console.log("error fetching product to edit", error);
        }
      )
    });
    
  }, []);

  function onSaveProduct() {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE products SET name = '${name}', unit = '${unit}', price = ${price} WHERE id = ${idProductToEdit};`,
        [],
        () => {
          console.log("product updated");
          navigate("Products");
        },
        (_, error) => {
          console.log("error updating product", error);
        }
      )
    });
  }
  function onDeleteProduct() {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM products WHERE id = ${idProductToEdit};`,
        [],
        () => {
          console.log("product deleted");
          navigate("Products");
        },
        (_, error) => {
          console.log("error deleting product", error);
        }
      )
    });
  } 

  return (
    <View style={ProductsEditorStyleSheet.container}>
      <Text style={ProductsEditorStyleSheet.title}>New Product</Text>
      <TextInput
        style={ProductsEditorStyleSheet.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={ProductsEditorStyleSheet.input}
        placeholder="Unit"
        value={unit}
        onChangeText={setUnit}
      />
      <TextInput
        style={ProductsEditorStyleSheet.input}
        placeholder="Price"
        value={price.toString()}
        onChangeText={setPrice}
        keyboardType='numeric'
      />
      <View style={ProductsEditorStyleSheet.btnsContainer}>
        <TouchableHighlight style={ProductsEditorStyleSheet.button()} title="Save" onPress={onSaveProduct} >
          <Text style={ProductsEditorStyleSheet.btnText} >Save</Text>
        </TouchableHighlight>
        <TouchableHighlight style={ProductsEditorStyleSheet.button()} title="Cancel" onPress={() => navigate("Products")} >
          <Text style={ProductsEditorStyleSheet.btnText} >Cancel</Text>
        </TouchableHighlight>
      </View>
      <TouchableHighlight style={ProductsEditorStyleSheet.button(true)} title="Delete" onPress={onDeleteProduct} >
        <Text style={ProductsEditorStyleSheet.btnText} >Delete</Text>
      </TouchableHighlight>

      
    </View>
  );
};