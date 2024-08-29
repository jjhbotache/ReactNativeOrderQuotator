import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Order, Product, ProductOrder } from '../interfaces/databaseInterfaces';
import { toCurrency } from './stringHelpers';

export default async function createPDF(order: Order, products: Product[], customerName: string, billedBy: string) {
  // Obtener la fecha actual
  const currentDate = new Date().toLocaleDateString();

  // Calcular el total de la cuenta
  const totalAmount = order.productOrders.reduce((total, po: ProductOrder) => {
    const product = products.find(p => p.id === po.id_product);
    return total + (product ? po.amount * product.price : 0);
  }, 0);

  // Generar el contenido HTML para el PDF
  const productOrdersHTML = order.productOrders.map((po: ProductOrder) => {
    const product = products.find(p => p.id === po.id_product);
    if (!product) return '';
    return `
      <tr>
        <td>${product.name}</td>
        <td>${po.amount} ${product.unit}</td>
        <td>${toCurrency(po.amount * product.price)}</td>
      </tr>
    `;
  }).join('');

  const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 18px;
            color: #333;
            margin: 40px;
          }
          h1, h2, h3 {
            color: #0056b3;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          .total-text {
            font-size: 24px;
            font-weight: bold;
            margin-top: 20px;
            text-align: right;
          }
        </style>
      </head>
      <body>
        <h1>Order Summary</h1>
        <h2>Date: ${currentDate}</h2>
        <h3>Customer: ${customerName}</h3>
        <h3>Billed By: ${billedBy}</h3>
        <table>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
          ${productOrdersHTML}
        </table>
        <div class="total-text">Total: ${toCurrency(totalAmount)}</div>
      </body>
    </html>
  `;

  try {
    // Crear el PDF a partir del contenido HTML
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    console.log('File has been saved to:', uri);

    // Compartir el PDF
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    return uri;
  } catch (e) {
    console.error('Error creating PDF:', e);
    throw e;
  }
}