// Define available merge tags for email templates
export const mergeTags = {
  order: {
    orderNumber: '{{order.orderNumber}}',
    createdAt: '{{order.createdAt}}',
    orderTotalPrice: '{{order.orderTotalPrice}}',
    taxedPrice: '{{order.orderTaxedPrice}}',
    state: '{{order.orderState}}',
    shipmentState: '{{order.orderShipmentState}}',
  },
  customer: {
    firstName: '{{customer.customerFirstName}}',
    middleName: '{{customer.customerMiddleName}}',
    lastName: '{{customer.customerLastName}}',
    email: '{{customer.customerEmail}}',
    number: '{{customer.customerNumber}}',
    rawEmail: '{{customer.email}}',
    rawFirstName: '{{customer.firstName}}',
  },
  lineItems: {
    list: '{{#each order.orderLineItems}}{{this.productName}} - {{this.productQuantity}} x {{this.productSubTotal}}{{/each}}',
  }
};