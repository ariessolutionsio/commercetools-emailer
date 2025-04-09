import { renderHook } from '@testing-library/react-hooks';
import {
  useCustomObjectUpdater,
  useCustomObjectDeleter,
} from './use-custom-object-connector';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';

jest.mock('@commercetools-frontend/application-shell', () => ({
  useMcMutation: jest.fn(),
}));

describe('useCustomObjectUpdater', () => {
  it('should call updateCustomObject mutation and handle callbacks', async () => {
    const onCompleted = jest.fn();
    const onError = jest.fn();

    const mutateFn = jest.fn(({ onCompleted: mutationOnCompleted }) => {
      if (mutationOnCompleted) mutationOnCompleted();
      return Promise.resolve();
    });

    const useMcMutationMock =
      require('@commercetools-frontend/application-shell').useMcMutation;
    useMcMutationMock.mockReturnValueOnce([mutateFn, { loading: false }]);

    const { result } = renderHook(() => useCustomObjectUpdater());

    await result.current.execute({
      draft: {
        container: 'foo',
        key: 'bar',
        value: '',
      },
      onCompleted,
      onError,
    });

    expect(mutateFn).toHaveBeenCalledWith({
      context: { target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM },
      variables: {
        draft: {
          container: 'foo',
          key: 'bar',
          value: '',
        },
      },
      onCompleted: expect.any(Function),
      onError: expect.any(Function),
    });

    expect(onCompleted).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});

describe('useCustomObjectDeleter', () => {
  it('should call deleteCustomObject mutation and handle callbacks', async () => {
    const onCompleted = jest.fn();
    const onError = jest.fn();

    const mutateFn = jest.fn(({ onCompleted: mutationOnCompleted }) => {
      if (mutationOnCompleted) mutationOnCompleted();
      return Promise.resolve();
    });

    const useMcMutationMock =
      require('@commercetools-frontend/application-shell').useMcMutation;
    useMcMutationMock.mockReturnValueOnce([mutateFn, { loading: false }]);

    const { result } = renderHook(() => useCustomObjectDeleter());

    await result.current.execute({
      id: '123',
      version: 1,
      onCompleted,
      onError,
    });

    expect(mutateFn).toHaveBeenCalledWith({
      context: { target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM },
      variables: {
        id: '123',
        version: 1,
      },
      onCompleted: expect.any(Function),
      onError: expect.any(Function),
    });

    expect(onCompleted).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
});
