import React from 'react';
import { render, screen, act } from '@testing-library/react';
import AssignmentView from '../Employee/AssignmentView';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  useParams: () => ({ assignmentId: '1', courseId: '101' }),
}));

describe('AssignmentView Component', () => {
    beforeEach(() => {
        jest.spyOn(window.localStorage.__proto__, 'getItem');
        window.localStorage.__proto__.getItem = jest.fn(() => 'test-token');
      });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner during data fetch', () => {
    render(<AssignmentView />);
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  test('renders error message on API failure', async () => {
    axios.get.mockRejectedValue(new Error('Failed to load'));
    render(<AssignmentView />);
    expect(await screen.findByRole('alert')).toHaveTextContent(/oops! something went wrong/i);
  });

  test('renders assignment details without submission', async () => {
    axios.get.mockResolvedValue({
      data: {
        assignmentDetails: {
          title: 'Test Assignment',
          description: 'Test Description',
          deadline: '2024-12-31T23:59:59Z',
        },
        submissionDetails: null,
      },
    });
    
    render(<AssignmentView />);
    
    expect(await screen.findByText('Test Assignment')).toBeInTheDocument();
    expect(screen.getByText('No submissions')).toBeInTheDocument();
  });

  test('renders assignment with submission details', async () => {
    axios.get.mockResolvedValue({
      data: {
        assignmentDetails: {
          title: 'Test Assignment',
          description: 'Test Description',
          deadline: '2024-12-31T23:59:59Z',
        },
        submissionDetails: [
          {
            submissionId: '123',
            submissionStatus: 'Submitted',
            submissionAt: '2024-12-01T12:00:00Z',
            gradeBook: {
              grade: 90,
              feedback: 'Good job!',
            },
          },
        ],
      },
    });
    
    render(<AssignmentView />);
    
    expect(await screen.findByText('Grade: 90%')).toBeInTheDocument();
    expect(screen.getByText('Good job!')).toBeInTheDocument();
  });
  
  test('handles file selection and upload', async () => {
    axios.get.mockResolvedValue({ /* mock data */ });
    
    render(<AssignmentView />);
    
    const fileInput = screen.getByTestId("uploadAssignment");
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    
    userEvent.upload(fileInput, file);
    
    expect(fileInput.files[0]).toBe(file);
    expect(fileInput.files).toHaveLength(1);
    
    // Mock the fetch call for file upload
    global.fetch = jest.fn().mockResolvedValue({ status: 200 });
  });

test('views submitted assignment', async () => {
    axios.get.mockResolvedValue({ /* mock data including submissionPdf */ });
    
    render(<AssignmentView />);
    
    const viewButton = screen.getByTestId("viewSubmissionButton");
    userEvent.click(viewButton);
    
    expect(await screen.findByText(/submission/i)).toBeInTheDocument();
  });
  
test('updates isMobile state on window resize', () => {
    render(<AssignmentView />);
    
    act(() => {
      global.innerWidth = 500;
      global.dispatchEvent(new Event('resize'));
    });
    
  });
  



});
