// Body.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import Body from '../Body';
import '@testing-library/jest-dom';

// Mock the NavBar component
jest.mock('../NavBar', () => () => <nav data-testid="nav-bar">NavBar</nav>);

// Mock the Footer component
jest.mock('../Footer', () => () => <footer data-testid="footer">Footer</footer>);

// Mock the Outlet component from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

describe('Body Component', () => {
  test('renders without crashing', () => {
    render(<Body />);
  });

  test('renders NavBar component', () => {
    render(<Body />);
    expect(screen.getByTestId('nav-bar')).toBeInTheDocument();
  });

  test('renders Outlet component', () => {
    render(<Body />);
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  test('renders Footer component', () => {
    render(<Body />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('main element has correct role and aria-label', () => {
    render(<Body />);
    const mainElement = screen.getByRole('main', { name: 'Main content' });
    expect(mainElement).toBeInTheDocument();
  });

  test('main element has correct className', () => {
    render(<Body />);
    const mainElement = screen.getByRole('main', { name: 'Main content' });
    expect(mainElement).toHaveClass('flex-grow mt-14');
  });

  test('root div has correct className', () => {
    const { container } = render(<Body />);
    const rootDiv = container.firstChild;
    expect(rootDiv).toHaveClass('flex flex-col min-h-screen');
  });
});
