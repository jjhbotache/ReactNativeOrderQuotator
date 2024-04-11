import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const AmountPicker = ({
  initialAmount = 0,
  step = 1,
  minAmount = 0,
  maxAmount = 100,
  onAmountChange,
}) => {
  const [amount, setAmount] = useState(initialAmount);

  const handleIncrement = () => {
    if (amount < maxAmount) {
      const newAmount = amount + step;
      setAmount(newAmount);
      onAmountChange?.(newAmount); // Llamar a onAmountChange si se proporciona
    }
  };

  const handleDecrement = () => {
    if (amount > minAmount) {
      const newAmount = amount - step;
      setAmount(newAmount);
      onAmountChange?.(newAmount); // Llamar a onAmountChange si se proporciona
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleDecrement}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.amountText}>{amount}</Text>
      <TouchableOpacity style={styles.button} onPress={handleIncrement}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  amountText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
});

export default AmountPicker;