// ViewGrades.test.js
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import ViewGrades from '../Employee/ViewGrades';
import { useNavigate, useParams } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

describe('ViewGrades Component', () => {
  let mockNavigate;

  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    window.localStorage.__proto__.getItem = jest.fn(() => 'test-token');

    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    useParams.mockReturnValue({ courseId: '1' });

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading message during data fetch', async () => {
    fetch.mockReturnValue(new Promise(() => {})); // Keeps the promise pending

    render(<ViewGrades />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });

  test('renders grades table after successful data fetch', async () => {
    const gradesData = [
      {
        assignmentId: 'a1',
        assignmentName: 'Assignment 1',
        grade: 85,
        status: 'GRADED',
      },
      {
        assignmentId: 'a2',
        assignmentName: 'Assignment 2',
        grade: null,
        status: 'PENDING',
      },
      {
        assignmentId: 'a3',
        assignmentName: 'Assignment 3',
        grade: null,
        status: 'SUBMITTED',
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => gradesData,
    });

    render(<ViewGrades />);

    expect(await screen.findByText('Grades')).toBeInTheDocument();

    // Check if assignments are displayed
    expect(screen.getByText('Assignment 1')).toBeInTheDocument();
    expect(screen.getByText('Assignment 2')).toBeInTheDocument();
    expect(screen.getByText('Assignment 3')).toBeInTheDocument();

    // Check grades
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('Not Yet Submitted')).toBeInTheDocument();
    expect(screen.getByText('Not Graded')).toBeInTheDocument();

    // Check percentage calculation
    const percentageRow = screen.getByText('Percentage').closest('tr');
    expect(percentageRow).toHaveTextContent('Percentage');
    expect(percentageRow).toHaveTextContent('28.33%');
  });

  test('displays message when no grades are found', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<ViewGrades />);

    expect(await screen.findByText('No grades found')).toBeInTheDocument();
  });

  test('displays error message when data fetch fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<ViewGrades />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Error: Failed to fetch data');
  });

  test('handles exception during data fetch', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    render(<ViewGrades />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Error: Network Error');
  });

  test('navigates to assignment details when assignment name is clicked', async () => {
    const gradesData = [
      {
        assignmentId: 'a1',
        assignmentName: 'Assignment 1',
        grade: 85,
        status: 'GRADED',
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => gradesData,
    });

    render(<ViewGrades />);

    const assignmentLink = await screen.findByText('Assignment 1');

    fireEvent.click(assignmentLink);

    expect(mockNavigate).toHaveBeenCalledWith('/employee/course/1/assignments/a1');
  });

  test('calculates percentage correctly', async () => {
    const gradesData = [
      {
        assignmentId: 'a1',
        assignmentName: 'Assignment 1',
        grade: 80,
        status: 'GRADED',
      },
      {
        assignmentId: 'a2',
        assignmentName: 'Assignment 2',
        grade: 90,
        status: 'GRADED',
      },
      {
        assignmentId: 'a3',
        assignmentName: 'Assignment 3',
        grade: null,
        status: 'PENDING',
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => gradesData,
    });

    render(<ViewGrades />);

    expect(await screen.findByText('Grades')).toBeInTheDocument();

    // Check percentage calculation
    const percentageRow = screen.getByText('Percentage').closest('tr');
    expect(percentageRow).toHaveTextContent('Percentage');
    expect(percentageRow).toHaveTextContent('56.67%'); // (80+90)/(3*100)*100 = 56.67%
  });

  test('sets document title to "Grades"', () => {
    render(<ViewGrades />);
    expect(document.title).toBe('Grades');
  });
});
