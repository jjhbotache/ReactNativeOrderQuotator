import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  orderContainer: {
    backgroundColor: '#333333',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  orderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  orderDetails: {
    color: '#aaaaaa',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default styles;