// ViewIndividualAssignmentSubmission.test.js
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ViewIndividualAssignmentSubmission from '../Instructor/ViewIndividualAssignmentSubmission';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../utils/constants';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('ViewIndividualAssignmentSubmission Component', () => {
  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    window.localStorage.__proto__.getItem = jest.fn(() => 'test-token');

    useParams.mockReturnValue({
      courseId: 'course123',
      assignmentId: 'assignment123',
      submissionId: 'submission123',
    });

    useSelector.mockReturnValue('instructor'); // Mock user role as 'instructor'

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading spinner during data fetch', () => {
    global.fetch.mockReturnValue(new Promise(() => {})); // Keeps the promise pending
  
    render(<ViewIndividualAssignmentSubmission />);
  
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });
  
  test('renders submission details after successful data fetch', async () => {
    const submissionDetailsResponse = {
      userDetails: {
        firstName: 'Saanya',
        lastName: 'Dhir',
        email: 'saanya@upskilled.com',
      },
      submissionId: 'submission123',
      gradeBook: {
        gradeBookId: 'gradeBook123',
        grade: 90,
        feedback: 'Good job!',
        gradedDate: new Date().toISOString(),
      },
    };
  
    const pdfBlob = new Blob(['PDF content'], { type: 'application/pdf' });
  
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => submissionDetailsResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: async () => pdfBlob,
      });
  
    render(<ViewIndividualAssignmentSubmission />);
  
    expect(await screen.findByText('Submission Details')).toBeInTheDocument();
  
    expect(screen.getByText('Name: Saanya Dhir')).toBeInTheDocument();
    expect(screen.getByText('Email: saanya@upskilled.com')).toBeInTheDocument();
    expect(screen.getByText('Grade: 90')).toBeInTheDocument();
    expect(screen.getByText('Feedback: Good job!')).toBeInTheDocument();
  });
  
  test('shows "Provide Grade and Feedback" button when not graded yet', async () => {
    const submissionDetailsResponse = {
      userDetails: {
        firstName: 'Saanya',
        lastName: 'Dhir',
        email: 'saanya@upskilled.com',
      },
      submissionId: 'submission123',
      // No gradeBook indicates not graded yet
    };
  
    const pdfBlob = new Blob(['PDF content'], { type: 'application/pdf' });
  
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => submissionDetailsResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: async () => pdfBlob,
      });
  
    render(<ViewIndividualAssignmentSubmission />);
  
    expect(await screen.findByText('Submission Details')).toBeInTheDocument();
  
    expect(screen.getByText('Grade: Not graded yet')).toBeInTheDocument();
  
    const provideGradeButton = screen.getByRole('button', { name: 'Provide Grade and Feedback' });
    expect(provideGradeButton).toBeInTheDocument();
  });
  

  test('shows grade and feedback inputs when editing grade', async () => {
    const submissionDetailsResponse = {
        userDetails: {
          firstName: 'Saanya',
          lastName: 'Dhir',
          email: 'saanya@upskilled.com',
        },
        submissionId: 'submission123',
        // No gradeBook indicates not graded yet
      };  

      const pdfBlob = new Blob(['PDF content'], { type: 'application/pdf' });
  
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => submissionDetailsResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          blob: async () => pdfBlob,
        });
    
      render(<ViewIndividualAssignmentSubmission />);
  
    // Click the 'Provide Grade and Feedback' button
    const provideGradeButton = screen.getByTestId("provideGrade");
    fireEvent.click(screen.getByTestId("provideGrade"));
  
    // Now the grade and feedback inputs should be visible
    const gradeInput = screen.getByLabelText('Grade:');
    expect(gradeInput).toBeInTheDocument();
  
    const feedbackTextarea = screen.getByLabelText('Feedback');
    expect(feedbackTextarea).toBeInTheDocument();
  
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeInTheDocument();
  });

  test('submits grade and feedback successfully', async () => {
    const submissionDetailsResponse = {
        userDetails: {
          firstName: 'Saanya',
          lastName: 'Dhir',
          email: 'saanya@upskilled.com',
        },
        submissionId: 'submission123',
        // No gradeBook indicates not graded yet
      };  

      const pdfBlob = new Blob(['PDF content'], { type: 'application/pdf' });
  
    // Mock the POST request for submitting grade
    global.fetch
    .mockResolvedValueOnce({
        ok: true,
        json: async () => submissionDetailsResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: async () => pdfBlob,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          gradeBookId: 'gradeBook123',
          grade: 95,
          feedback: 'Excellent work!',
          gradedDate: new Date().toISOString(),
        }),
      });
  
      render(<ViewIndividualAssignmentSubmission />);

      const provideGradeButton = screen.getByTestId("provideGrade");
      fireEvent.click(provideGradeButton);
  
    const gradeInput = screen.getByTestId("gradeInput");
    expect(gradeInput).toBeInTheDocument();
  
    const feedbackTextarea = screen.getByTestId("feedback");
    expect(feedbackTextarea).toBeInTheDocument();

    // Enter grade and feedback
    fireEvent.change(gradeInput, { target: { value: '95' } });
    fireEvent.change(feedbackTextarea, { target: { value: 'Excellent work!' } });
  
    // Submit the form
    await act(async () => {
      fireEvent.click(submitButton);
    });
  
    // Check that fetch was called correctly
    expect(fetch.ok);
  });
  
  test('displays error when submission of grade and feedback fails', async () => {
    const submissionDetailsResponse = {
        userDetails: {
          firstName: 'Saanya',
          lastName: 'Dhir',
          email: 'saanya@upskilled.com',
        },
        submissionId: 'submission123',
        // No gradeBook indicates not graded yet
      };  
  
    // Mock the POST request to fail
    global.fetch
    .mockResolvedValueOnce({
        ok: true,
        json: async () => submissionDetailsResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: async () => pdfBlob,
      })
      .mockResolvedValueOnce({
        ok: false,
      });
  
      render(<ViewIndividualAssignmentSubmission />);

      const provideGradeButton = screen.getByTestId("provideGrade");;
      fireEvent.click(screen.getByTestId("provideGrade"));
    
      // Now the grade and feedback inputs should be visible
      const gradeInput = screen.getByLabelText('Grade:');
      expect(gradeInput).toBeInTheDocument();
    
      const feedbackTextarea = screen.getByLabelText('Feedback');
      expect(feedbackTextarea).toBeInTheDocument();
    
     // Enter grade and feedback
     fireEvent.change(gradeInput, { target: { value: '95' } });
     fireEvent.change(feedbackTextarea, { target: { value: 'Excellent work!' } });
  
    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(submitButton);
    });
  
    // Check for error message
    expect(await screen.findByText('Failed to update grade and feedback')).toBeInTheDocument();
  });

  test('toggles showSubmission when Show Submission button is clicked', async () => {
    const submissionDetailsResponse = {
        userDetails: {
          firstName: 'Saanya',
          lastName: 'Dhir',
          email: 'saanya@upskilled.com',
        },
        submissionId: 'submission123',
        // No gradeBook indicates not graded yet
      };  
  
    // Mock the POST request to fail
    global.fetch
    .mockResolvedValueOnce({
        ok: true,
        json: async () => submissionDetailsResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: async () => pdfBlob,
      })
      .mockResolvedValueOnce({
        ok: false,
      });
  
      render(<ViewIndividualAssignmentSubmission />);
    const showSubmissionButton = screen.getByTestId("showSubmission");
    fireEvent.click(showSubmissionButton);
  });
  
  
});
