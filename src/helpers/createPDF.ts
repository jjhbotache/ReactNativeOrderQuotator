import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Order, Product, ProductOrder } from '../interfaces/databaseInterfaces';
import { toCurrency } from './stringHelpers';

export default async function createPDF(order: Order, products: Product[]) {
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
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <h1>Order Summary</h1>
        <table>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
          ${productOrdersHTML}
        </table>
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