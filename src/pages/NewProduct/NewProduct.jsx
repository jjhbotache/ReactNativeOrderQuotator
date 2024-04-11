import React, { useState } from 'react';
import { Button, Text, TextInput, View } from "react-native";
import NewProductStyleSheet from "./NewProductStyleSheet";
import { useNavigation } from "@react-navigation/native";

export default function NewProduct({db}) {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const {navigate} = useNavigation();

  function onCreateProduct(e) {
    console.log("creating product");
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO products (name, unit, price) VALUES ('${name}', '${unit}', ${price});`,
        [],
        (_, result) => {
          console.log("product created", result);
          setName('');
          setUnit('');
          setPrice('');
          navigate("Products");
        },
        (_, error) => {
          console.log("error creating product", error);
        }
      )
    })
  }

  return (
    <View style={NewProductStyleSheet.container}>
      <Text style={NewProductStyleSheet.title}>New Product</Text>
      <TextInput
        style={NewProductStyleSheet.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={NewProductStyleSheet.input}
        placeholder="Unit"
        value={unit}
        onChangeText={setUnit}
      />
      <TextInput
        style={NewProductStyleSheet.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType='numeric'
      />

      <Button style={NewProductStyleSheet.button} title="Create" onPress={onCreateProduct} />
    </View>
  );
};