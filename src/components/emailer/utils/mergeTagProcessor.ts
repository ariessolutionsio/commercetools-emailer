import { mockData } from '../mockData';

/**
 * Process HTML content to replace merge tags with mock data
 * @param html The HTML content with merge tags
 * @returns Processed HTML with merge tags replaced by mock data
 */
export const processMergeTags = (html: string): string => {
  let processedHtml = html;
  
  // Process order merge tags
  Object.entries(mockData.order).forEach(([key, value]) => {
    const regex = new RegExp(`{{order.${key}}}`, 'g');
    processedHtml = processedHtml.replace(regex, String(value));
  });
  
  // Process customer merge tags
  Object.entries(mockData.customer).forEach(([key, value]) => {
    const regex = new RegExp(`{{customer.${key}}}`, 'g');
    processedHtml = processedHtml.replace(regex, String(value));
  });
  
  // Process line items list
  const lineItemsRegex = /{{#each order.orderLineItems}}(.*?){{\/each}}/g;
  processedHtml = processedHtml.replace(lineItemsRegex, (match, template) => {
    return mockData.order.orderLineItems.map(item => {
      let result = template;
      result = result.replace(/{{this.productName}}/g, item.productName);
      result = result.replace(/{{this.productQuantity}}/g, String(item.productQuantity));
      result = result.replace(/{{this.productSubTotal}}/g, item.productSubTotal);
      return result;
    }).join('<br>');
  });
  
  // Process custom order line items block
  const orderLineItemsBlockRegex = /<div[^>]*data-type="order-line-items"[^>]*>(.*?)<\/div>/gs;
  processedHtml = processedHtml.replace(orderLineItemsBlockRegex, (match) => {
    // Generate a table for order line items
    let tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="background-color: #f5f5f5; padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Product</th>
            <th style="background-color: #f5f5f5; padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Quantity</th>
            <th style="background-color: #f5f5f5; padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Price</th>
            <th style="background-color: #f5f5f5; padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    // Add rows for each line item
    mockData.order.orderLineItems.forEach(item => {
      const subtotal = parseFloat(item.productSubTotal.replace(/[^0-9.-]+/g, '')) * item.productQuantity;
      tableHtml += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.productName}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.productQuantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.productSubTotal}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${subtotal.toFixed(2)}</td>
        </tr>
      `;
    });
    
    // Calculate and add total
    const total = mockData.order.orderLineItems.reduce((sum, item) => {
      const price = parseFloat(item.productSubTotal.replace(/[^0-9.-]+/g, ''));
      return sum + (price * item.productQuantity);
    }, 0);
    
    tableHtml += `
          <tr>
            <td colspan="3" style="padding: 10px; border-top: 2px solid #ddd; font-weight: bold;">Total</td>
            <td style="padding: 10px; border-top: 2px solid #ddd; font-weight: bold;">$${total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    `;
    
    return tableHtml;
  });
  
  return processedHtml;
}; 