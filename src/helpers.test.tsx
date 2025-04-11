import {
  getErrorMessage,
  extractErrorFromGraphQlResponse,
  createGraphQlUpdateActions,
  convertToActionData,
  filterEmailTypesWithCustomObjects,
} from './helpers'; // adjust this import path to your file

import { ApolloError } from '@apollo/client';
import { EmailType } from './components/emailer/types';
import { GraphQLError } from 'graphql';
import { TCustomObjectQueryResult } from './types/generated/ctp';

// ✅ Mock l10n utils
jest.mock('@commercetools-frontend/l10n', () => ({
  transformLocalizedStringToLocalizedField: jest.fn((val) => ({ ...val })),
  transformLocalizedFieldToLocalizedString: jest.fn(() => 'LocalizedName'),
}));

describe('getErrorMessage', () => {
  it('should return joined GraphQL error messages', () => {
    const error = new ApolloError({
      graphQLErrors: [new GraphQLError('Error 1'), new GraphQLError('Error 2')],
    });

    expect(getErrorMessage(error)).toBe('Error 1\nError 2');
  });

  it('should return fallback message if no graphql errors', () => {
    const error = new ApolloError({ errorMessage: 'Something went wrong' });
    expect(getErrorMessage(error)).toBe('Something went wrong');
  });
});

describe('extractErrorFromGraphQlResponse', () => {
  it('should return network error results if available', () => {
    const error = new ApolloError({
      graphQLErrors: [new GraphQLError('Internal error')],
    });

    expect(extractErrorFromGraphQlResponse(error)).toEqual([
      { message: 'Internal error' },
    ]);
  });

  it('should return graphQLErrors if networkError is missing', () => {
    const error = new ApolloError({
      graphQLErrors: [new GraphQLError('GraphQL failed')],
    });

    expect(extractErrorFromGraphQlResponse(error)).toEqual([
      { message: 'GraphQL failed' },
    ]);
  });

  it('should return raw response if not ApolloError', () => {
    const error = { message: 'Not Apollo' };
    expect(extractErrorFromGraphQlResponse(error)).toBe(error);
  });
});

describe('createGraphQlUpdateActions', () => {
  it('should return transformed actions', () => {
    const actions = [
      { action: 'changeName', name: { en: 'New Name' } },
      { action: 'setKey', key: 'abc-123' },
    ];

    const result = createGraphQlUpdateActions(actions);

    expect(result).toEqual([
      { changeName: { name: { en: 'New Name' } } },
      { setKey: { key: 'abc-123' } },
    ]);
  });
});

describe('convertToActionData', () => {
  it('should convert nameAllLocales to localized string', () => {
    const draft = {
      nameAllLocales: [{ locale: 'en', value: 'Test Name' }],
    };

    expect(convertToActionData(draft)).toEqual({
      ...draft,
      name: 'LocalizedName',
    });
  });

  it('should handle undefined nameAllLocales', () => {
    const draft = {};

    expect(convertToActionData(draft)).toEqual({
      ...draft,
      name: 'LocalizedName',
    });
  });
});

describe('filterEmailTypesWithCustomObjects', () => {
  const emailTypes: Omit<EmailType, 'isUsed'>[] = [
    { value: 'order-confirmation', label: 'Order Confirmation' },
    { value: 'shipping-confirmation', label: 'Shipping Confirmation' },
    { value: 'forgot-password', label: 'Forgot Password' },
  ];

  const customObjects: TCustomObjectQueryResult = {
    count: 2,
    offset: 0,
    total: 2,
    results: [
      {
        container: 'email-templates',
        id: '6bba4a21-ffec-4708-b868-b57ac000efaf',
        key: 'order-confirmation',
        lastModifiedAt: '2025-04-09T11:57:23.097Z',
        createdAt: '',
        version: 0,
        value: {
          body: '',
          subject: 'Test',
          type: 'order-confirmation',
          exists: true,
        },
      },
      {
        container: 'email-templates',
        id: '6bba4a21-ffec-4708-b868-b57ac000efaf',
        key: 'shipping-confirmation',
        lastModifiedAt: '2025-04-09T11:57:23.097Z',
        createdAt: '',
        version: 0,
        value: {
          body: '',
          subject: 'Test',
          type: 'shipping-confirmation',
          exists: true,
        },
      },
    ],
    exists: false,
  };

  it('should mark used email types correctly', () => {
    const result = filterEmailTypesWithCustomObjects(customObjects, emailTypes);

    expect(result).toEqual([
      {
        value: 'order-confirmation',
        label: 'Order Confirmation',
        isUsed: true,
      },
      {
        value: 'shipping-confirmation',
        label: 'Shipping Confirmation',
        isUsed: true,
      },
      { value: 'forgot-password', label: 'Forgot Password', isUsed: false },
    ]);
  });

  it('should return all isUsed false if customObjects is undefined', () => {
    const result = filterEmailTypesWithCustomObjects(undefined, emailTypes);

    expect(result).toEqual([
      {
        value: 'order-confirmation',
        label: 'Order Confirmation',
        isUsed: false,
      },
      {
        value: 'shipping-confirmation',
        label: 'Shipping Confirmation',
        isUsed: false,
      },
      { value: 'forgot-password', label: 'Forgot Password', isUsed: false },
    ]);
  });
});
