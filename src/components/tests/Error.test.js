// Error.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import Error from '../Error';
import { useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

// Mock the useSelector hook from react-redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('Error Component', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    useSelector.mockClear();
  });

  test('renders without crashing', () => {
    useSelector.mockReturnValue('admin');
    render(
      <BrowserRouter>
        <Error />
      </BrowserRouter>
    );
  });

  test('displays correct error messages', () => {
    useSelector.mockReturnValue('admin');
    render(
      <BrowserRouter>
        <Error />
      </BrowserRouter>
    );

    // Check for the main error heading
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByLabelText('Error 404')).toBeInTheDocument();

    // Check for the subheading
    expect(screen.getByText('Oops! Page Not Found')).toBeInTheDocument();

    // Check for the error description
    expect(
      screen.getByTestId("errorMessage")).toBeInTheDocument();
  });

  test('Link navigates to correct path based on user role', () => {
    const userRole = 'admin';
    useSelector.mockReturnValue(userRole);
    render(
      <BrowserRouter>
        <Error />
      </BrowserRouter>
    );

    const linkElement = screen.getByTestId("goBackHome");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', `/${userRole}`);
});

  test('main div has correct role and class', () => {
    useSelector.mockReturnValue('admin');
    render(
      <BrowserRouter>
        <Error />
      </BrowserRouter>
    );

    const mainDiv = screen.getByRole('main');
    expect(mainDiv).toBeInTheDocument();
    expect(mainDiv).toHaveClass('flex items-center justify-center h-screen');
  });

  test('h1 has correct text and aria-label', () => {
    useSelector.mockReturnValue('admin');
    render(
      <BrowserRouter>
        <Error />
      </BrowserRouter>
    );

    const h1Element = screen.getByLabelText('Error 404');
    expect(h1Element).toBeInTheDocument();
    expect(h1Element).toHaveTextContent('404');
    expect(h1Element).toHaveClass(
      'text-9xl font-extrabold text-indigo-500 mb-8'
    );
  });

  test('Link has correct aria-label and class', () => {
    useSelector.mockReturnValue('admin');
    render(
      <BrowserRouter>
        <Error />
      </BrowserRouter>
    );

    const linkElement = screen.getByLabelText('Go back to home page');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveClass(
      'px-6 py-3 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition duration-200'
    );
  });

  test('renders correctly with different user roles', () => {
    const userRoles = ['admin', 'user', 'guest'];
    userRoles.forEach((role) => {
      useSelector.mockReturnValue(role);
      render(
        <BrowserRouter>
          <Error />
        </BrowserRouter>
      );

      const linkElement = screen.getByTestId("goBackHome");
      expect(linkElement).toHaveAttribute('href', `/${role}`);

      // Cleanup after each render
      //screen.unmount();
    });
  });

  test('handles undefined user role gracefully', () => {
    useSelector.mockReturnValue(undefined);
    render(
      <BrowserRouter>
        <Error />
      </BrowserRouter>
    );

    const linkElement = screen.getByTestId("goBackHome");
    expect(linkElement).toHaveAttribute('href', '/undefined');
  });

});