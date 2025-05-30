import { EmailType } from './types';

export const emailTypes: Omit<EmailType, 'isUsed'>[] = [
  {
    value: 'create-account-confirmation',
    label: 'Create Account Confirmation',
  },
  {
    value: 'create-account-verification',
    label: 'Create Account Verification',
  },
  { value: 'forgot-password', label: 'Forgot Password' },
  { value: 'order-confirmation', label: 'Order Confirmation' },
  { value: 'shipping-confirmation', label: 'Shipping Confirmation' },
];
