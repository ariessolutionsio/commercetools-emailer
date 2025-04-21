import { mockData } from '../mockData';

/**
 * Process subject text to replace merge tags with mock data
 * @param subject The subject text with merge tags
 * @returns Processed subject with merge tags replaced by mock data
 */
export const processSubjectMergeTags = (subject: string): string => {
  let processedSubject = subject;
  
  // Process order merge tags
  Object.entries(mockData.order).forEach(([key, value]) => {
    const regex = new RegExp(`{{order.${key}}}`, 'g');
    processedSubject = processedSubject.replace(regex, String(value));
  });
  
  // Process customer merge tags
  Object.entries(mockData.customer).forEach(([key, value]) => {
    const regex = new RegExp(`{{customer.${key}}}`, 'g');
    processedSubject = processedSubject.replace(regex, String(value));
  });
  
  return processedSubject;
}; 