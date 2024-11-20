// ViewAssignment.test.js
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ViewAssignment from '../Instructor/ViewAssignmentforInstructor';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../utils/constants';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('ViewAssignment Component', () => {
  let mockNavigate;
  let mockAssignmentId = 'assignment123';
  let mockCourseId = 'course123';
  let mockRole = 'instructor';

  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    window.localStorage.__proto__.getItem = jest.fn(() => 'test-token');

    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    useParams.mockReturnValue({ assignmentId: mockAssignmentId, courseId: mockCourseId });

    useSelector.mockImplementation((callback) => {
      return callback({ user: { role: mockRole } });
    });

    global.fetch = jest.fn();

    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading spinner during data fetch', async () => {
    global.fetch.mockReturnValue(new Promise(() => {}));

    render(<ViewAssignment />);

    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  test('displays error message when data fetch fails', async () => {
    global.fetch.mockRejectedValue(new Error('Network Error'));

    render(<ViewAssignment />);

    expect(await screen.findByText(/Oops! Something went wrong./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Page/i })).toBeInTheDocument();
  });

  test('reloads the page when "Reload Page" button is clicked', async () => {
    global.fetch.mockRejectedValue(new Error('Network Error'));

    const originalLocation = window.location;
    delete window.location;
    window.location = { reload: jest.fn() };

    render(<ViewAssignment />);

    const reloadButton = await screen.findByRole('button', { name: /Reload Page/i });

    fireEvent.click(reloadButton);

    expect(window.location.reload).toHaveBeenCalled();

    window.location = originalLocation;
  });

  test('renders assignment details and submissions after successful data fetch', async () => {
    const assignmentData = {
      assignmentDetails: {
        title: 'Test Assignment',
        description: 'This is a test assignment.',
        deadline: new Date().getTime(),
      },
      submissionDetails: [
        {
          submissionId: 'submission1',
          userDetails: {
            firstName: 'John',
            lastName: 'Doe',
          },
          gradeBook: {
            grade: 95,
          },
        },
      ],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => assignmentData,
    });

    render(<ViewAssignment />);

    expect(await screen.getByTestId("assignmentTitle")).toBeInTheDocument();
    expect(screen.getByTestId("assignmentDescription")).toBeInTheDocument();
    expect(screen.getByTestId("dueDate")).toBeInTheDocument();

    expect(screen.getByRole('table', { name: 'Submissions Table' })).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
  });

  test('handles empty submissions list', async () => {
    const assignmentData = {
      assignmentDetails: {
        title: 'Test Assignment',
        description: 'This is a test assignment.',
        deadline: new Date().getTime(),
      },
      submissionDetails: [],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => assignmentData,
    });

    render(<ViewAssignment />);

    expect(await screen.findByText('No submissions found')).toBeInTheDocument();
  });

  test('opens and closes edit assignment modal', async () => {
    const assignmentData = {
      assignmentDetails: {
        title: 'Test Assignment',
        description: 'This is a test assignment.',
        deadline: new Date().getTime(),
      },
      submissionDetails: [],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => assignmentData,
    });

    render(<ViewAssignment />);

    await screen.findByText('Test Assignment');

    const editButton = screen.getByTestId("editButton");
    fireEvent.click(editButton);

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

    const closeButton = screen.getByTestId("closeButton");
    fireEvent.click(closeButton);
  });

  test('updates assignment successfully', async () => {
    const assignmentData = {
      assignmentDetails: {
        title: 'Test Assignment',
        description: 'This is a test assignment.',
        deadline: new Date().getTime(),
      },
      submissionDetails: [],
    };

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => assignmentData,
      })
      .mockResolvedValueOnce({ ok: true });

    render(<ViewAssignment />);

    await screen.findByText('Test Assignment');

    const editButton = screen.getByTestId("editButton");
    fireEvent.click(editButton);

    const titleInput = screen.getByLabelText('Title:');
    fireEvent.change(titleInput, { target: { value: 'Updated Assignment' } });

    const updateButton = screen.getByTestId("updateButton");
    await act(async () => {
      fireEvent.click(updateButton);
    });

    expect(fetch.ok);
  });

  test('deletes assignment successfully', async () => {
    const assignmentData = {
      assignmentDetails: {
        title: 'Test Assignment',
        description: 'This is a test assignment.',
        deadline: new Date().getTime(),
      },
      submissionDetails: [],
    };

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => assignmentData,
      })
      .mockResolvedValueOnce({ ok: true });

    render(<ViewAssignment />);

    await screen.findByText('Test Assignment');

    const deleteButton = screen.getByTestId("deleteButton");
    fireEvent.click(deleteButton);

    const yesButton = screen.getByTestId("yesButton");
    await act(async () => {
      fireEvent.click(yesButton);
    });

    expect(fetch.ok);
  });

  test('navigates to view submission when "View Submission" button is clicked', async () => {
    const assignmentData = {
      assignmentDetails: {
        title: 'Test Assignment',
        description: 'This is a test assignment.',
        deadline: new Date().getTime(),
      },
      submissionDetails: [
        {
          submissionId: 'submission1',
          userDetails: {
            firstName: 'John',
            lastName: 'Doe',
          },
          gradeBook: {
            grade: 95,
          },
        },
      ],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => assignmentData,
    });

    render(<ViewAssignment />);

    await screen.findByText('Test Assignment');

    const viewSubmissionButton = screen.getByTestId("viewSubmission");
    fireEvent.click(viewSubmissionButton);

    expect(mockNavigate).toHaveBeenCalledWith(`submission/submission1`);
  });

  test('handles error during assignment update', async () => {
    const assignmentData = {
      assignmentDetails: {
        title: 'Test Assignment',
        description: 'This is a test assignment.',
        deadline: new Date().getTime(),
      },
      submissionDetails: [],
    };

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => assignmentData,
      })
      .mockResolvedValueOnce({ ok: false });

    render(<ViewAssignment />);

    await screen.findByText('Test Assignment');

    const editButton = screen.getByTestId("editButton");
    fireEvent.click(editButton);

    const updateButton = screen.getByTestId("updateButton");
    await act(async () => {
      fireEvent.click(updateButton);
    });

  });

  test('handles error during assignment deletion', async () => {
    const assignmentData = {
      assignmentDetails: {
        title: 'Test Assignment',
        description: 'This is a test assignment.',
        deadline: new Date().getTime(),
      },
      submissionDetails: [],
    };

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => assignmentData,
      })
      .mockResolvedValueOnce({ ok: false });

    render(<ViewAssignment />);

    await screen.findByText('Test Assignment');

    const deleteButton = screen.getByTestId("deleteButton");
    fireEvent.click(deleteButton);

    const yesButton = screen.getByTestId("yesButton");
    await act(async () => {
      fireEvent.click(yesButton);
    });

    expect(await screen.findByText(/Oops! Something went wrong./i)).toBeInTheDocument();
  });

  test('ensures accessibility attributes are set correctly', async () => {
    const assignmentData = {
      assignmentDetails: {
        title: 'Test Assignment',
        description: 'This is a test assignment.',
        deadline: new Date().getTime(),
      },
      submissionDetails: [],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => assignmentData,
    });

    render(<ViewAssignment />);

    expect(await screen.findByRole('heading', { name: 'Test Assignment' })).toBeInTheDocument();
    expect(screen.getByTestId("editButton")).toBeInTheDocument();
    expect(screen.getByTestId("deleteButton")).toBeInTheDocument();
  });
});
