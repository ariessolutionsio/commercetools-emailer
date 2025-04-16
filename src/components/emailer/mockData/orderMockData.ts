// Mock data for order-related merge tags
export const orderMockData = {
  orderNumber: '12345',
  createdAt: '2023-01-01',
  orderTotalPrice: '$99.99',
  orderTaxedPrice: '$89.99',
  orderState: 'Confirmed',
  orderShipmentState: 'Shipped',
  orderLineItems: [
    {
      productName: 'Product 1',
      productQuantity: 2,
      productSubTotal: '$49.99'
    },
    {
      productName: 'Product 2',
      productQuantity: 1,
      productSubTotal: '$29.99'
    }
  ]
}; 