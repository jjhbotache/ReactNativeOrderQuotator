import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import { Order, Product, ProductOrder } from '../interfaces/databaseInterfaces';
import { toCurrency } from './stringHelpers';

export class Settings {
  customerName: string="";
  customerNit: string="";
  billedBy: string="";
  billerPhone: string="";
  fileName: string="";
  city: string="";
  billerId: string="";
  date: string="";
}

export default async function createPDF(order: Order, products: Product[], settings: Settings) {
  const currentDate = settings.date || new Date().toLocaleDateString();
  const totalAmount = order.productOrders.reduce((total, po: ProductOrder) => {
    const product = products.find(p => p.id === po.id_product);
    return total + (product ? parseFloat(po.amount.toString()) * product.price : 0);
  }, 0);

  const productOrdersHTML = order.productOrders.map((po: ProductOrder) => {
    const product = products.find(p => p.id === po.id_product);
    if (!product) return '';
    return `
      <tr>
        <td>${product.name}</td>
        <td>${parseFloat(po.amount.toString())} ${product.unit}</td>
        <td>${toCurrency(parseFloat(po.amount.toString()) * product.price)}</td>
      </tr>
    `;
  }).join('');

  const htmlContent = `<html>
  <head>
    <style>
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 40px;
      }

      .flex {
        display: flex;
        justify-content: space-between;
      }

      .text-center {
        text-align: center;
      }

      .mt-16 {
        margin-top: 64px;
      }

      .p-8 {
        padding: 32px;
      }

      .text-xl {
        font-size: 24px;
      }

      .font-bold {
        font-weight: bold;
      }

      .text-blue {
        color: #240077;
      }

      .mt-4 {
        margin-top: 16px;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
        page-break-inside: auto;
      }

      .table th,
      .table td {
        padding: 8px;
        border: 1px solid #000;
      }

      .table th {
        background-color: #f2f2f2;
        font-weight: bold;
      }

      .page-break {
        page-break-before: always;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="flex">
        <span>${settings.city} ${settings.date}</span>
      </div>
      <div class="text-center mt-16">
        <h1 class="text-xl font-bold">CUENTA DE COBRO</h1>
        <h2 class="text-blue mt-4">${settings.customerName}</h2>
        <p class="text-blue">NIT: ${settings.customerNit}</p>
      </div>
      <div class="text-center mt-16">
        <p>DEBE A:</p>
        <p class="mt-4">${settings.billedBy}</p>
        <p class="text-blue mt-4">C.C. ${settings.billerId}</p>
      </div>
      <div class="text-center mt-16">
        <p class="mt-4">LA SUMA DE M/CTE <span class="text-blue">(${toCurrency(totalAmount)})</span></p>
      </div>
      <div class="text-center mt-16">
        <h4 class="mt-4">POR CONCEPTO DE:</h4>
        <table class="table mt-4">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            ${productOrdersHTML}
          </tbody>
        </table>
      </div>
      <div class="mt-16">
        <p>Cordialmente:</p>
        <p>${settings.billedBy}</p>
        <p>C.C: ${settings.billerId}</p>
        <p class="text-blue">Tel: ${settings.billerPhone}</p>
      </div>
    </div>
  </body>
</html>
`;

  try {
    const { uri } = await Print.printToFileAsync({ 
      html: htmlContent,
      width: 612,
      height: 1080,
    });

    const newUri = `${FileSystem.documentDirectory}${settings.fileName}.pdf`;
    await FileSystem.moveAsync({
      from: uri,
      to: newUri,
    });

    await shareAsync(newUri, { UTI: '.pdf', mimeType: 'application/pdf' });
    return newUri;
  } catch (e) {
    console.error('Error creating PDF:', e);
    throw e;
  }
}