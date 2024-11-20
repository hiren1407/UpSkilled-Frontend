// CreateAnnouncement.test.js
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CreateAnnouncement from '../Instructor/CreateAnnouncement';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../../utils/constants';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.useFakeTimers();

describe('CreateAnnouncement Component', () => {
  let mockNavigate;
  let mockCourseId = '1';

  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    window.localStorage.__proto__.getItem = jest.fn(() => 'test-token');

    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    useParams.mockReturnValue({ courseId: mockCourseId });

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields and submit button', () => {
    render(<CreateAnnouncement />);

    // Check if title input is rendered
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();

    // Check if content textarea is rendered
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();

    // Check if submit button is rendered
    expect(screen.getByRole('button', { name: /Create Announcement/i })).toBeInTheDocument();
  });

  test('updates title and content state on input change', () => {
    render(<CreateAnnouncement />);

    const titleInput = screen.getByPlaceholderText('Title');
    const contentTextarea = screen.getByPlaceholderText('Description');

    // Type into title input
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    expect(titleInput.value).toBe('New Title');

    // Type into content textarea
    fireEvent.change(contentTextarea, { target: { value: 'New Content' } });
    expect(contentTextarea.value).toBe('New Content');
  });

  test('submits form successfully and shows popup', async () => {
    // Mock fetch to return a successful response
    global.fetch.mockResolvedValueOnce({ ok: true });

    render(<CreateAnnouncement />);

    // Fill in the form fields
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Test Announcement' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'This is a test announcement.' } });

    // Submit the form
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /Create Announcement/i }));
    });

    // Check if fetch was called with correct parameters
    expect(fetch.ok);

    // Check if success popup is displayed
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Announcement Created Successfully.')).toBeInTheDocument();

    // Fast-forward time to simulate the timeout
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Check if navigate was called to redirect to announcements page
    expect(mockNavigate).toHaveBeenCalledWith('/instructor/course/1/announcements');
  });

  test('hides success popup after timeout', async () => {
    // Mock fetch to return a successful response
    global.fetch.mockResolvedValueOnce({ ok: true });

    render(<CreateAnnouncement />);

    // Fill in the form fields
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Test Announcement' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'This is a test announcement.' } });

    // Submit the form
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /Create Announcement/i }));
    });

    // Check if success popup is displayed
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Fast-forward time to simulate the timeout
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Popup should be removed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('handles form submission failure and displays error', async () => {
    // Mock fetch to return a failure response
    global.fetch.mockResolvedValueOnce({ ok: false });

    render(<CreateAnnouncement />);

    // Fill in the form fields
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Test Announcement' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'This is a test announcement.' } });

    // Submit the form
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /Create Announcement/i }));
    });

    // Check if error message is displayed
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to create announcement');

    // Ensure that navigate was not called
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('handles exception during form submission', async () => {
    // Mock fetch to throw an error
    global.fetch.mockRejectedValueOnce(new Error('Network Error'));

    render(<CreateAnnouncement />);

    // Fill in the form fields
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Test Announcement' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'This is a test announcement.' } });

    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Submit the form
    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /Create Announcement/i }));
    });

    // Check if error message is displayed
    expect(screen.getByRole('alert'));

    // Ensure that navigate was not called
    expect(mockNavigate).not.toHaveBeenCalled();

    // Restore console.error
    consoleSpy.mockRestore();
  });
});
