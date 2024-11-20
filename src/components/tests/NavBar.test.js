// NavBar.test.js

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import NavBar from '../NavBar';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../../utils/userSlice';
import { toggleMenu } from '../../utils/appSlice';;
import { useNavigate, useParams } from 'react-router-dom';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));


jest.mock('../../utils/userSlice', () => ({
  clearUser: jest.fn(),
}));

jest.mock('../../utils/appSlice', () => ({
  toggleMenu: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

global.fetch = jest.fn();

describe('NavBar Component', () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  const originalInnerWidth = global.innerWidth;

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ courseId: undefined });
    jest.clearAllMocks();
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  test('renders correctly when user is not logged in', () => {
    useSelector.mockImplementation((selector) => {
      return selector({
        user: {
          user: null,
          role: '',
        },
      });
    });

    render(
      <Router>
        <NavBar />
      </Router>
    );

    expect(screen.queryByText('Home')).toBeNull();
    expect(screen.queryByText(/Welcome,/)).toBeNull();
    expect(screen.queryByLabelText('User Menu')).toBeNull();
  });

  test('renders correctly when user is logged in', () => {
    useSelector.mockImplementation((selector) => {
      return selector({
        user: {
          user: { firstName: 'Admin', role: 'admin' },
          role: 'admin',
        },
      });
    });

    render(
      <Router>
        <NavBar />
      </Router>
    );

    expect(screen.getByTestId("dashboardLinkTest")).toBeInTheDocument();
    expect(screen.getByText('Welcome, Admin')).toBeInTheDocument();
    expect(screen.getByTestId("userMenuButton")).toBeInTheDocument();
  });

  test('shows toggleMenu button when isMobile is true and role is admin', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500 });
    useSelector.mockImplementation((selector) => {
      return selector({
        user: {
          user: { firstName: 'Admin', role: 'admin' },
          role: 'admin',
        },
      });
    });

    render(
      <Router>
        <NavBar />
      </Router>
    );

    expect(screen.getByLabelText('Toggle Menu')).toBeInTheDocument();
  });

  test('shows toggleMenu button when isMobile is true and courseId is present', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500 });
    useSelector.mockImplementation((selector) => {
      return selector({
        user: {
          user: { firstName: 'Jane', role: 'user' },
          role: 'user',
        },
      });
    });
    useParams.mockReturnValue({ courseId: '123' });

    render(
      <Router>
        <NavBar />
      </Router>
    );

    expect(screen.getByLabelText('Toggle Menu')).toBeInTheDocument();
  });

  test('does not show toggleMenu button when isMobile is true and role is user without courseId', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500 });
    useSelector.mockImplementation((selector) => {
      return selector({
        user: {
          user: { firstName: 'Jane', role: 'user' },
          role: 'user',
        },
      });
    });
    useParams.mockReturnValue({ courseId: undefined });

    render(
      <Router>
        <NavBar />
      </Router>
    );

    expect(screen.queryByLabelText('Toggle Menu')).toBeNull();
  });

  test('does not show toggleMenu button when isMobile is false', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024 });
    useSelector.mockImplementation((selector) => {
      return selector({
        user: {
          user: { firstName: 'Admin', role: 'admin' },
          role: 'admin',
        },
      });
    });

    render(
      <Router>
        <NavBar />
      </Router>
    );

    expect(screen.queryByLabelText('Toggle Menu')).toBeNull();
  });

  test('handleLogout works correctly', async () => {
    useSelector.mockImplementation((selector) => {
      return selector({
        user: {
          user: { firstName: 'Admin', role: 'admin' },
          role: 'admin',
        },
      });
    });

    const mockToken = 'mockToken';
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockToken);
    global.fetch.mockResolvedValueOnce({});

    render(
      <Router>
        <NavBar />
      </Router>
    );

    fireEvent.click(screen.getByTestId("userMenuButton"));
    fireEvent.click(screen.getByTestId("logoutButton"));

    await act(() => Promise.resolve());

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/logout'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mockToken}`,
      },
    });
    expect(removeItemSpy).toHaveBeenCalledWith('token');
    expect(mockDispatch).toHaveBeenCalledWith(clearUser());
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('handleLogout handles fetch error', async () => {
    useSelector.mockImplementation((selector) => {
      return selector({
        user: {
          user: { firstName: 'Admin', role: 'admin' },
          role: 'admin',
        },
      });
    });

    const mockToken = 'mockToken';
    jest.spyOn(Storage.prototype, 'removeItem');
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(mockToken);
    global.fetch.mockRejectedValueOnce(new Error('Network Error'));

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(
      <Router>
        <NavBar />
      </Router>
    );

    fireEvent.click(screen.getByTestId("userMenuButton"));
    fireEvent.click(screen.getByTestId("logoutButton"));

    await act(() => Promise.resolve());

    expect(global.fetch).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));

    consoleSpy.mockRestore();
  });

  test('toggleMenuHandler dispatches toggleMenu action', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500 });
    useSelector.mockImplementation((selector) => {
      return selector({
        user: {
          user: { firstName: 'Admin', role: 'admin' },
          role: 'admin',
        },
      });
    });

    render(
      <Router>
        <NavBar />
      </Router>
    );

    fireEvent.click(screen.getByLabelText('Toggle Menu'));
    expect(mockDispatch).toHaveBeenCalledWith(toggleMenu());
  });

  test('updates isMobile state on window resize', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024 });
    useSelector.mockImplementation((selector) => {
      return selector({
        user: {
          user: { firstName: 'Admin', role: 'admin' },
          role: 'admin',
        },
      });
    });

    render(
      <Router>
        <NavBar />
      </Router>
    );

    expect(screen.queryByLabelText('Toggle Menu')).toBeNull();

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 500 });
      window.dispatchEvent(new Event('resize'));
    });

    expect(screen.getByLabelText('Toggle Menu')).toBeInTheDocument();
  });

  test('Home link navigates to correct path based on user role', () => {
    useSelector.mockImplementation((selector) => {
      return selector({
        user: {
          user: { firstName: 'Admin', role: 'admin' },
          role: 'admin',
        },
      });
    });

    render(
      <Router>
        <NavBar />
      </Router>
    );

    const homeLink = screen.getByText('Home');
    expect(homeLink.closest('a')).toHaveAttribute('href', '/admin');

    const dashboardLink = screen.getByRole('link', { name: 'Dashboard' });
    expect(dashboardLink).toHaveAttribute('href', '/admin');
  });

//   test('renders correctly with different user roles', () => {
//     const roles = ['admin', 'instructor', 'student'];

//     roles.forEach((role) => {
//       useSelector.mockImplementation((selector) => {
//         return selector({
//           user: {
//             user: { firstName: 'Alex', role },
//             role,
//           },
//         });
//       });

//       render(
//         <Router>
//           <NavBar />
//         </Router>
//       );

//       const dashboardLink = screen.getByTestId("dashboardLinkTest");
//       expect(dashboardLink).toHaveAttribute('href', `/${role}`);
//     });
//   });

  test('dropdown menu contains Profile and Logout options', () => {
    useSelector.mockImplementation((selector) => {
      return selector({
        user: {
          user: { firstName: 'Admin', role: 'admin' },
          role: 'admin',
        },
      });
    });

    render(
      <Router>
        <NavBar />
      </Router>
    );

    fireEvent.click(screen.getByTestId("userMenuButton"));

    expect(screen.getByLabelText('Profile')).toBeInTheDocument();
    expect(screen.getByLabelText('Logout')).toBeInTheDocument();
  });
});
