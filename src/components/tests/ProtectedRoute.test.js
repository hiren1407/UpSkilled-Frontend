// ProtectedRoute.test.js

import React from 'react';
import { render } from '@testing-library/react';
import ProtectedRoute from '../ProtectedRoute'; 
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { setUser, clearUser } from '../../utils/userSlice'; 
import jwtDecode from 'jwt-decode';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Navigate: jest.fn(({ to }) => `Redirected to ${to}`),
  useNavigate: jest.fn(),
}));

jest.mock('../../utils/userSlice', () => ({
  setUser: jest.fn(),
  clearUser: jest.fn(),
}));

jest.mock('jwt-decode', () => ({
    __esModule: true,
    default: jest.fn(),
  }));

describe('ProtectedRoute Component', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  const TestComponent = () => <div>Test Component</div>;

  test('renders children when userRole is in Redux store and allowed', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: {
          user: { role: 'admin' },
        },
      })
    );

    const { getByText } = render(
      <ProtectedRoute allowedRoles={['admin']}>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(getByText('Test Component')).toBeInTheDocument();
  });

  test('redirects to "/" when userRole is in Redux store but not allowed', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: {
          user: { role: 'user' },
        },
      })
    );

    const { getByText } = render(
      <ProtectedRoute allowedRoles={['admin']}>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockDispatch).toHaveBeenCalledWith(clearUser());
    expect(Navigate).toHaveBeenCalledWith({ to: '/' }, {});
    expect(getByText('Redirected to /')).toBeInTheDocument();
  });

  test('decodes token and sets user when userRole is not in Redux but token is valid', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: {
          user: null,
        },
      })
    );

    const token = 'valid.token.here';
    const decodedToken = { role: 'admin' };
    localStorage.setItem('token', token);
    jwtDecode.mockReturnValue(decodedToken);

    const { getByText } = render(
      <ProtectedRoute allowedRoles={['admin']}>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(jwtDecode).toHaveBeenCalledWith(token);
    expect(mockDispatch).toHaveBeenCalledWith(
      setUser({ user: decodedToken, token })
    );
    expect(getByText('Test Component')).toBeInTheDocument();

    // Clean up
    localStorage.removeItem('token');
  });

  test('navigates to "/" when userRole is not in Redux and token is invalid', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: {
          user: null,
        },
      })
    );

    localStorage.removeItem('token');
    jwtDecode.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    render(
      <ProtectedRoute allowedRoles={['admin']}>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('navigates to "/" when no userRole and no token', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: {
          user: null,
        },
      })
    );

    localStorage.removeItem('token');
    jwtDecode.mockReturnValue(null);

    render(
      <ProtectedRoute allowedRoles={['admin']}>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('redirects to "/" when decoded userRole is not allowed', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: {
          user: null,
        },
      })
    );

    const token = 'valid.token.here';
    const decodedToken = { role: 'user' };
    localStorage.setItem('token', token);
    jwtDecode.mockReturnValue(decodedToken);

    const { getByText } = render(
      <ProtectedRoute allowedRoles={['admin']}>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(jwtDecode).toHaveBeenCalledWith(token);
    expect(mockDispatch).toHaveBeenCalledWith(
      setUser({ user: decodedToken, token })
    );
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockDispatch).toHaveBeenCalledWith(clearUser());
    expect(Navigate).toHaveBeenCalledWith({ to: '/' }, {});
    expect(getByText('Redirected to /')).toBeInTheDocument();

    // Clean up
    localStorage.removeItem('token');
  });

  test('handles error during jwtDecode and navigates to "/"', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: {
          user: null,
        },
      })
    );

    const token = 'invalid.token.here';
    localStorage.setItem('token', token);
    jwtDecode.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    render(
      <ProtectedRoute allowedRoles={['admin']}>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(jwtDecode).toHaveBeenCalledWith(token);
    expect(mockNavigate).toHaveBeenCalledWith('/');

    // Clean up
    localStorage.removeItem('token');
  });
});
