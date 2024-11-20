import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Login from '../Login';

const mockStore = configureStore([]);
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('Login Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { user: null, token: null },
    });

    mockDispatch.mockClear();
  });

  test('renders Login form correctly', () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );

    const heading = screen.getByRole('heading', { name: /Login/i });
    expect(heading).toBeInTheDocument();
    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

test('renders Signup form when toggled', () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );
  
    // Simulate clicking the "New User? Signup Here" link to toggle the form
    fireEvent.click(screen.getByText(/New User\? Signup Here/i));
  
    // Verify that the "Sign Up" heading is rendered
    const heading = screen.getByRole('heading', { name: /Sign Up/i });
    expect(heading).toBeInTheDocument();
  
    // Check for the presence of form fields
    expect(screen.getByTestId("first-name")).toBeInTheDocument();
    expect(screen.getByTestId("last-name")).toBeInTheDocument();
    expect(screen.getByTestId("designation")).toBeInTheDocument();
    
     // Verify the dropdown for Role
  const roleDropdown = screen.getByRole('combobox', { name: /Role/i });
  expect(roleDropdown).toBeInTheDocument();

  // Verify the options inside the dropdown
  fireEvent.click(roleDropdown); // Open the dropdown if needed
  expect(screen.getByRole('option', { name: /Select Role/i })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: /Employee/i })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: /Instructor/i })).toBeInTheDocument();
  
    // Check for email and password fields
    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
  
    // Verify the presence of the Sign Up button
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
  
    // Verify the link to return to the login form
    expect(screen.getByText(/Existing User\? Login Here/i)).toBeInTheDocument();
  });
  
  test('validates email and password on login', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );

    // Trigger Login without entering email or password
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    // Wait for the error message to appear
  await waitFor(() => {
    const errorMessage = screen.getByText(/Login failed/i); // Look for the specific error message
    expect(errorMessage).toBeInTheDocument(); // Ensure it's present
    expect(errorMessage).toHaveClass('text-red-500'); // Validate the class name for error styling
  });
  });
  

  test('shows signup validation errors', () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );

    fireEvent.click(screen.getByText(/New User\? Signup Here/i));

    // Trigger Signup without entering required fields
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    expect(screen.getByText(/First Name is required./i)).toBeInTheDocument();
    expect(screen.getByText(/Last Name is required./i)).toBeInTheDocument();
    expect(screen.getByText(/Designation is required./i)).toBeInTheDocument();
    expect(screen.getByText(/Role is required./i)).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );

    const passwordInput = screen.getByTestId("password");
    const toggleButton = document.querySelector(
        '.absolute.inset-y-0.right-0.flex.items-center.pr-3.cursor-pointer'
      );

    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');
  });

test('displays specific error messages on failed login', async () => {
    // Mock the dispatch function to simulate an error
    //mockDispatch.mockRejectedValueOnce(new Error('Rejected'));
  
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );
  
    const emailInput = screen.getByTestId("email");
    const passwordInput = screen.getByTestId("password");
    const loginButton = screen.getByRole('button', { name: /Login/i });
  
    // Simulate user input
    fireEvent.change(emailInput, { target: { value: 'wronguser@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
  
    // Simulate login button click
    fireEvent.click(loginButton);
  
    // Wait for the "Login failed" message inside the card body
    await waitFor(() => {
        const elementWithErrorClass = document.querySelector('.text-red-500'); // Query for the class
        expect(elementWithErrorClass).toBeInTheDocument(); // Ensure the class is applied
      });
  });
  
test('displays signup success modal on valid inputs', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );
  // Switch to the Sign-Up form
fireEvent.click(screen.getByText(/New User\? Signup Here/i));

// Generate a random email ID
const randomEmail = `user${Math.random().toString(36).substring(2, 11)}@gmail.com`;

// Fill in the signup form
fireEvent.change(screen.getByTestId('first-name'), { target: { value: 'Saanya' } });
fireEvent.change(screen.getByTestId('last-name'), { target: { value: 'Dhir' } });
fireEvent.change(screen.getByTestId('designation'), { target: { value: 'Developer' } });
fireEvent.change(screen.getByTestId('role'), { target: { value: 'Employee' } });
fireEvent.change(screen.getByTestId('email'), { target: { value: randomEmail } });
fireEvent.change(screen.getByTestId('password'), { target: { value: 'test@123' } });

// Mock the dispatch function to resolve successfully
mockDispatch.mockResolvedValueOnce(Promise.resolve(true));

// Click the "Sign Up" button
fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

// Ensure modal text includes instructor warning
expect(
  screen.getByText(/If you signed up as an instructor, you need to contact the admin before login/i)
).toBeInTheDocument();
  });
  
});
