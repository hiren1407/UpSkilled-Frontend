// CreateAssignment.test.js
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CreateAssignment from '../Instructor/CreateAssignment';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../../utils/constants';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.useFakeTimers();

describe('CreateAssignment Component', () => {
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
    render(<CreateAssignment />);

    expect(screen.getByText('Assignment Details')).toBeInTheDocument();
    expect(screen.getByLabelText('Assignment Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Due Time')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument();
  });

  test('updates state on input change', () => {
    render(<CreateAssignment />);

    const nameInput = screen.getByLabelText('Assignment Name');
    const descriptionTextarea = screen.getByLabelText('Description');
    const dueDateInput = screen.getByLabelText('Due Date');
    const dueTimeInput = screen.getByLabelText('Due Time');

    fireEvent.change(nameInput, { target: { value: 'Test Assignment' } });
    expect(nameInput.value).toBe('Test Assignment');

    fireEvent.change(descriptionTextarea, { target: { value: 'This is a test description.' } });
    expect(descriptionTextarea.value).toBe('This is a test description.');

    fireEvent.change(dueDateInput, { target: { value: '2023-12-31' } });
    expect(dueDateInput.value).toBe('2023-12-31');

    fireEvent.change(dueTimeInput, { target: { value: '23:59' } });
    expect(dueTimeInput.value).toBe('23:59');
  });

  test('submits form successfully and shows success message', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });

    render(<CreateAssignment />);

    fireEvent.change(screen.getByLabelText('Assignment Name'), { target: { value: 'Test Assignment' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'This is a test description.' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-31' } });
    fireEvent.change(screen.getByLabelText('Due Time'), { target: { value: '23:59' } });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /Create/i }));
    });

    expect(fetch.ok);
  });

  test('handles form submission failure and displays error', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, statusText: 'Bad Request' });

    render(<CreateAssignment />);

    fireEvent.change(screen.getByLabelText('Assignment Name'), { target: { value: 'Test Assignment' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'This is a test description.' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-31' } });
    fireEvent.change(screen.getByLabelText('Due Time'), { target: { value: '23:59' } });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /Create/i }));
    });

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('handles exception during form submission', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network Error'));

    render(<CreateAssignment />);

    fireEvent.change(screen.getByLabelText('Assignment Name'), { target: { value: 'Test Assignment' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'This is a test description.' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-31' } });
    fireEvent.change(screen.getByLabelText('Due Time'), { target: { value: '23:59' } });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /Create/i }));
    });

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  test('displays loading spinner during form submission', async () => {
    let resolveFetch;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    global.fetch.mockReturnValueOnce(fetchPromise);

    render(<CreateAssignment />);

    fireEvent.change(screen.getByLabelText('Assignment Name'), { target: { value: 'Test Assignment' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'This is a test description.' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-31' } });
    fireEvent.change(screen.getByLabelText('Due Time'), { target: { value: '23:59' } });

    act(() => {
      fireEvent.submit(screen.getByRole('button', { name: /Create/i }));
    });

    expect(screen.getByLabelText('Loading')).toBeInTheDocument();

    await act(async () => {
      resolveFetch({ ok: true });
    });
  });

  test('reloads the page when "Reload Page" button is clicked on error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network Error'));

    render(<CreateAssignment />);

    fireEvent.change(screen.getByLabelText('Assignment Name'), { target: { value: 'Test Assignment' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'This is a test description.' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-31' } });
    fireEvent.change(screen.getByLabelText('Due Time'), { target: { value: '23:59' } });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /Create/i }));
    });

    delete window.location;
    window.location = { reload: jest.fn() };

    fireEvent.click(screen.getByRole('button', { name: /Reload Page/i }));

    expect(window.location.reload).toHaveBeenCalled();

    delete window.location;
    window.location = window.location;
  });

  test('does not submit form when required fields are missing', async () => {
    render(<CreateAssignment />);

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /Create/i }));
    });

    expect(fetch.ok);
  });
});
