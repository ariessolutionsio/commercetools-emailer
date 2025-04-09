import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { extractErrorFromGraphQlResponse } from '../../helpers';
import { TDataTableSortingState } from '@commercetools-uikit/hooks';
import {
  TChannelRole,
  TFetchChannelDetailsQuery,
} from '../../types/generated/ctp';

import {
  useChannelDetailsFetcher,
  useChannelDetailsUpdater,
  useChannelsFetcher,
} from './use-channels-connector';

jest.mock('@commercetools-frontend/application-shell', () => ({
  useMcQuery: jest.fn(),
  useMcMutation: jest.fn(),
}));

jest.mock('../../helpers', () => ({
  createGraphQlUpdateActions: jest
    .fn()
    .mockReturnValue(['MOCK_GRAPHQL_ACTION']),
  extractErrorFromGraphQlResponse: jest
    .fn()
    .mockReturnValue(new Error('GraphQL error')),
  convertToActionData: jest.fn().mockReturnValue('converted-draft'),
}));

jest.mock('@commercetools/sync-actions', () => {
  const mockSyncChannels = {
    buildActions: jest.fn().mockReturnValue(['MOCK_ACTION']),
  };
  return {
    createSyncChannels: () => mockSyncChannels,
    __mockSyncChannels: mockSyncChannels,
  };
});

describe('useChannelsFetcher', () => {
  it('returns data when query succeeds', () => {
    const useMcQuery = require('@commercetools-frontend/application-shell')
      .useMcQuery as jest.Mock;

    useMcQuery.mockReturnValue({
      data: { channels: ['channel-1'] },
      loading: false,
      error: undefined,
    });

    const mockSorting: TDataTableSortingState = {
      value: { key: 'name', order: 'asc' },
      onChange: jest.fn(),
    };

    const { result } = renderHook(() =>
      useChannelsFetcher({
        page: { value: 1 },
        perPage: { value: 10 },
        tableSorting: mockSorting,
      })
    );

    expect(result.current.channelsPaginatedResult).toEqual(['channel-1']);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(useMcQuery).toHaveBeenCalledWith(expect.anything(), {
      variables: {
        limit: 10,
        offset: 0,
        sort: ['name asc'],
      },
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    });
  });
});

describe('useChannelDetailsFetcher', () => {
  it('returns channel when query succeeds', () => {
    const useMcQuery = require('@commercetools-frontend/application-shell')
      .useMcQuery as jest.Mock;

    useMcQuery.mockReturnValue({
      data: { channel: { id: '123', name: 'Test Channel' } },
      loading: false,
      error: undefined,
    });

    const { result } = renderHook(() => useChannelDetailsFetcher('123'));

    expect(result.current.channel).toEqual({ id: '123', name: 'Test Channel' });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(useMcQuery).toHaveBeenCalledWith(expect.anything(), {
      variables: { channelId: '123' },
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    });
  });
});

describe('useChannelDetailsUpdater', () => {
  const mockUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    const useMcMutation = require('@commercetools-frontend/application-shell')
      .useMcMutation as jest.Mock;

    useMcMutation.mockReturnValue([mockUpdate, { loading: false }]);
  });

  it('calls update mutation with correct actions', async () => {
    const originalDraft: NonNullable<TFetchChannelDetailsQuery['channel']> = {
      id: '123',
      version: 2,
      key: 'store-channel',
      roles: [TChannelRole.InventorySupply],
      nameAllLocales: [{ locale: 'en', value: 'Channel One' }],
    };

    const nextDraft = { name: 'Updated Channel' };

    const { result } = renderHook(() => useChannelDetailsUpdater());

    await act(async () => {
      await result.current.execute({ originalDraft, nextDraft });
    });

    const { __mockSyncChannels } = require('@commercetools/sync-actions');

    expect(__mockSyncChannels.buildActions).toHaveBeenCalledWith(
      nextDraft,
      'converted-draft'
    );

    expect(mockUpdate).toHaveBeenCalledWith({
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
      variables: {
        channelId: '123',
        version: 2,
        actions: ['MOCK_GRAPHQL_ACTION'],
      },
    });
  });

  it('throws extracted error if GraphQL response fails', async () => {
    const originalDraft: NonNullable<TFetchChannelDetailsQuery['channel']> = {
      id: 'channel-1',
      version: 2,
      key: 'store-channel',
      roles: [TChannelRole.OrderImport],
      nameAllLocales: [{ locale: 'en', value: 'Channel One' }],
    };
    const nextDraft = { name: 'Updated Channel' };

    mockUpdate.mockRejectedValueOnce('GraphQL error response');

    const { result } = renderHook(() => useChannelDetailsUpdater());

    await expect(
      result.current.execute({ originalDraft, nextDraft })
    ).rejects.toThrow('GraphQL error');

    expect(extractErrorFromGraphQlResponse).toHaveBeenCalledWith(
      'GraphQL error response'
    );
  });
});
