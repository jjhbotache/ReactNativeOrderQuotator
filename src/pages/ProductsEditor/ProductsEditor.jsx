import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput, TouchableHighlight, View } from 'react-native';
import ProductsEditorStyleSheet from './ProductsEditorStyleSheet';
import { useNavigation } from '@react-navigation/native';
import { useDatabase } from '../../hooks/useDatabase';

export default function ProductsEditor({ route }) {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const { navigate } = useNavigation();
  const { id: idProductToEdit } = route.params;
  const { getProductById, updateProduct, deleteProduct } = useDatabase();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(idProductToEdit);
        if (product) {
          setName(product.name);
          setUnit(product.unit);
          setPrice(product.price.toString());
        }
      } catch (error) {
        console.log('error fetching product to edit', error);
      }
    };

    fetchProduct();
  }, [idProductToEdit]);

  const onSaveProduct = async () => {
    try {
      await updateProduct(idProductToEdit, name, unit, parseFloat(price));
      console.log('product updated');
      navigate('Products');
    } catch (error) {
      console.log('error updating product', error);
    }
  };

  const onDeleteProduct = async () => {
    try {
      await deleteProduct(idProductToEdit);
      console.log('product deleted');
      navigate('Products');
    } catch (error) {
      console.log('error deleting product', error);
    }
  };

  return (
    <View style={ProductsEditorStyleSheet.container}>
      <Text style={ProductsEditorStyleSheet.title}>Edit Product</Text>
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
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <View style={ProductsEditorStyleSheet.btnsContainer}>
        <TouchableHighlight style={ProductsEditorStyleSheet.button()} onPress={onSaveProduct}>
          <Text style={ProductsEditorStyleSheet.btnText}>Save</Text>
        </TouchableHighlight>
        <TouchableHighlight style={ProductsEditorStyleSheet.button()} onPress={() => navigate('Products')}>
          <Text style={ProductsEditorStyleSheet.btnText}>Cancel</Text>
        </TouchableHighlight>
      </View>
      <TouchableHighlight style={ProductsEditorStyleSheet.button(true)} onPress={onDeleteProduct}>
        <Text style={ProductsEditorStyleSheet.btnText}>Delete</Text>
      </TouchableHighlight>
    </View>
  );
}
