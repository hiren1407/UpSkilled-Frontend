import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Profile from '../Profile';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../utils/userSlice';
import bg from '../../images/bg.jpeg';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../utils/userSlice', () => ({
  updateUser: jest.fn(),
}));

jest.mock('../../images/bg.jpeg', () => 'bg.jpeg');

describe('Profile Component', () => {
  const mockDispatch = jest.fn();
  const mockUnwrap = jest.fn();
  const mockUpdateUser = jest.fn(() => ({ unwrap: mockUnwrap }));

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation((selector) =>
      selector({
        user: {
          user: {
            sub: 'test@example.com',
            firstName: 'Saanya',
            lastName: 'Dhir',
            designation: 'Developer',
            role: 'instructor',
          },
        },
      })
    );
    updateUser.mockReturnValue(mockUpdateUser);
    jest.clearAllMocks();
  });

  test('renders Profile component with user data', () => {
    render(<Profile />);

    expect(screen.getByTestId("firstName")).toHaveValue('Saanya');
    expect(screen.getByTestId("lastName")).toHaveValue('Dhir');
    expect(screen.getByTestId("designation")).toHaveValue('Developer');
    //expect(screen.getByTestId("role")).toHaveValue('admin');
    expect(screen.getByTestId("email")).toHaveValue('test@example.com');
    expect(screen.getByTestId("password")).toHaveValue('');
  });

  test('toggles password visibility', () => {
    render(<Profile />);

    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByLabelText('Toggle password visibility');

    // Initially, password should be of type 'password'
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('displays error when password is less than 6 characters', async () => {
    render(<Profile />);

    const passwordInput = screen.getByLabelText('Password');
    const saveButton = screen.getByTestId("saveButtonTest");

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(saveButton);

    expect(screen.getByText('Password must be at least 6 characters long.')).toBeInTheDocument();
  });

  test('calls updateUser when password is valid', async () => {
    mockUnwrap.mockResolvedValue(201);

    render(<Profile />);

    const passwordInput = screen.getByLabelText('Password');
    const saveButton = screen.getByTestId("saveButtonTest");

    fireEvent.change(passwordInput, { target: { value: '123456' } });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(updateUser).toHaveBeenCalledWith({ password: '123456' });
    //expect(mockUnwrap).toHaveBeenCalled();

    // Check if success toast is displayed
    // const success = screen.getByTestId("profileUpdated");
    // expect(success).toBeInTheDocument();
  });

  test('displays error when updateUser fails', async () => {
    mockUnwrap.mockRejectedValue(new Error('Update failed'));

    render(<Profile />);

    const passwordInput = screen.getByLabelText('Password');
    const saveButton = screen.getByTestId("saveButtonTest");

    fireEvent.change(passwordInput, { target: { value: '123456' } });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(updateUser).toHaveBeenCalledWith({ password: '123456' });
    //expect(mockUnwrap).toHaveBeenCalled();

    //expect(screen.getByText('Update failed')).toBeInTheDocument();
  });

  test('password error message disappears when password is valid', () => {
    render(<Profile />);

    const passwordInput = screen.getByLabelText('Password');
    const saveButton = screen.getByTestId("saveButtonTest");

    // Enter invalid password
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(saveButton);

    expect(screen.getByText('Password must be at least 6 characters long.')).toBeInTheDocument();

    // Enter valid password
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(saveButton);

    expect(screen.queryByText('Password must be at least 6 characters long.')).toBeNull();
  });

  test('toast message disappears after 3 seconds', async () => {
    jest.useFakeTimers();
    mockUnwrap.mockResolvedValue(201);

    render(<Profile />);

    const passwordInput = screen.getByLabelText('Password');
    const saveButton = screen.getByTestId("saveButtonTest");

    fireEvent.change(passwordInput, { target: { value: '123456' } });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    //expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('Profile updated successfully!')).toBeNull();

    jest.useRealTimers();
  });

  test('all disabled inputs are indeed disabled', () => {
    render(<Profile />);

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const designationInput = screen.getByLabelText('Designation');
    const roleSelect = screen.getByLabelText('Role');
    const emailInput = screen.getByLabelText('Email ID');

    expect(firstNameInput).toBeDisabled();
    expect(lastNameInput).toBeDisabled();
    expect(designationInput).toBeDisabled();
    expect(roleSelect).toBeDisabled();
    expect(emailInput).toBeDisabled();
  });

  test('renders without crashing when user is null', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: {
          user: null,
        },
      })
    );

    render(<Profile />);

    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  test('displays default values when user data is missing', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: {
          user: {},
        },
      })
    );

    render(<Profile />);

    expect(screen.getByLabelText('First Name')).toHaveValue('');
    expect(screen.getByLabelText('Last Name')).toHaveValue('');
    expect(screen.getByLabelText('Designation')).toHaveValue('');
    expect(screen.getByLabelText('Role')).toHaveValue('');
    expect(screen.getByLabelText('Email ID')).toHaveValue('');
  });
});

