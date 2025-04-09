import { renderHook, act } from '@testing-library/react-hooks';
import useDeleteTemplate from './useDeleteTemplate';
import { DOMAINS } from '@commercetools-frontend/constants';

jest.mock('@commercetools-frontend/actions-global', () => ({
  useShowNotification: jest.fn(),
}));

jest.mock('./use-custom-objects-connector/use-custom-object-connector', () => ({
  useCustomObjectDeleter: jest.fn(),
}));

const mockShowNotification = jest.fn();
const mockExecute = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  require('@commercetools-frontend/actions-global').useShowNotification.mockReturnValue(
    mockShowNotification
  );
  require('./use-custom-objects-connector/use-custom-object-connector').useCustomObjectDeleter.mockReturnValue(
    {
      execute: mockExecute,
    }
  );
});

describe('useDeleteTemplate', () => {
  it('should show error notification when no template id', async () => {
    const handleCompleted = jest.fn();

    const { result } = renderHook(() => useDeleteTemplate(handleCompleted));

    await act(async () => {
      await result.current.handleDelete({
        version: 1,
        type: 'email',
        subject: 'Test',
        body: 'Test',
      } as unknown as Parameters<ReturnType<typeof useDeleteTemplate>['handleDelete']>[0]);
    });

    expect(mockShowNotification).toHaveBeenCalledWith({
      kind: 'error',
      domain: DOMAINS.SIDE,
      text: 'Please enter a template ID',
    });

    expect(mockExecute).not.toHaveBeenCalled();
    expect(handleCompleted).not.toHaveBeenCalled();
  });

  it('should show error when templateData is falsy', async () => {
    const handleCompleted = jest.fn();
    const { result } = renderHook(() => useDeleteTemplate(handleCompleted));

    await act(async () => {
      await result.current.handleDelete(undefined);
    });

    expect(mockShowNotification).toHaveBeenCalledWith({
      kind: 'error',
      domain: DOMAINS.SIDE,
      text: 'Template not found',
    });

    expect(mockExecute).not.toHaveBeenCalled();
    expect(handleCompleted).not.toHaveBeenCalled();
  });

  it('should call execute and show success on completion', async () => {
    const handleCompleted = jest.fn();

    mockExecute.mockImplementation(async ({ onCompleted }) => {
      onCompleted();
    });

    const { result } = renderHook(() => useDeleteTemplate(handleCompleted));

    await act(async () => {
      await result.current.handleDelete({
        id: 'template-123',
        version: 2,
        type: 'email',
        subject: 'Test',
        body: 'Test',
      });
    });

    expect(mockExecute).toHaveBeenCalledWith({
      id: 'template-123',
      version: 2,
      onCompleted: expect.any(Function),
      onError: expect.any(Function),
    });

    expect(mockShowNotification).toHaveBeenCalledWith({
      kind: 'success',
      domain: DOMAINS.SIDE,
      text: 'Template deleted successfully!',
    });

    expect(handleCompleted).toHaveBeenCalled();
  });

  it('should call execute and show error on onError callback', async () => {
    const handleCompleted = jest.fn();

    mockExecute.mockImplementation(async ({ onError }) => {
      onError();
    });

    const { result } = renderHook(() => useDeleteTemplate(handleCompleted));

    await act(async () => {
      await result.current.handleDelete({
        id: 'template-123',
        version: 1,
        type: 'email',
        subject: 'Test',
        body: 'Test',
      });
    });

    expect(mockShowNotification).toHaveBeenCalledWith({
      kind: 'error',
      domain: DOMAINS.SIDE,
      text: 'Error deleting template',
    });

    expect(handleCompleted).not.toHaveBeenCalled();
  });

  it('should show error if execute throws', async () => {
    const handleCompleted = jest.fn();
    mockExecute.mockRejectedValue(new Error('Boom'));

    const { result } = renderHook(() => useDeleteTemplate(handleCompleted));

    await act(async () => {
      await result.current.handleDelete({
        id: 'template-123',
        version: 1,
        type: 'email',
        subject: 'Test',
        body: 'Test',
      });
    });

    expect(mockShowNotification).toHaveBeenCalledWith({
      kind: 'error',
      domain: DOMAINS.SIDE,
      text: 'Error deleting template',
    });

    expect(handleCompleted).not.toHaveBeenCalled();
  });
});
