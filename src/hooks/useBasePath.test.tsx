import { useLocation } from 'react-router-dom';
import useBasePath from './useBasePath';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

describe('useBasePath', () => {
  it('should return the base path by removing the last segment', () => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/templates/123',
    });

    const { result } = renderHook(() => useBasePath());
    expect(result.current).toBe('/templates');
  });

  it('should return an empty string if pathname has only one segment', () => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/templates',
    });

    const { result } = renderHook(() => useBasePath());
    expect(result.current).toBe('');
  });

  it('should return empty string if pathname is root', () => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/',
    });

    const { result } = renderHook(() => useBasePath());
    expect(result.current).toBe('');
  });

  it('should handle nested routes', () => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/admin/settings/templates/456',
    });

    const { result } = renderHook(() => useBasePath());
    expect(result.current).toBe('/admin/settings/templates');
  });
});
