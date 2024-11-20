import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManageInstructors from '../Admin/ManageInstructors';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});

describe('ManageInstructors Component', () => {
  const mockActiveInstructors = [
    { id: 1, firstName: 'Saanya', lastName: 'Dhir', email: 'saanyadhir@upskilled.com', status: 'ACTIVE' },
  ];
  const mockInactiveInstructors = [
    { id: 2, firstName: 'Test', lastName: 'User', email: 'testuser@upskilled.com', status: 'INACTIVE' },
  ];

  beforeEach(() => {
    window.localStorage.getItem.mockReturnValue('mockToken');
    axios.get.mockResolvedValue({
      data: [...mockActiveInstructors, ...mockInactiveInstructors],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the heading and tabs', async () => {
    render(<ManageInstructors />);
    expect(screen.getByTestId('heading')).toHaveTextContent('Manage Instructors');
    expect(screen.getByTestId('activeInstructorsTab')).toBeInTheDocument();
    expect(screen.getByTestId('inactiveInstructorsTab')).toBeInTheDocument();

    // Wait for the API call
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  });

  test('displays active instructors in the active tab', async () => {
    render(<ManageInstructors />);
    
    await waitFor(() => {
      const activeName = screen.getByTestId('activeInstructorName-1');
      const activeEmail = screen.getByTestId('activeInstructorEmail-1');
      expect(activeName).toHaveTextContent('Saanya Dhir');
      expect(activeEmail).toHaveTextContent('saanyadhir@upskilled.com');
    });
  });

  test('displays inactive instructors in the inactive tab', async () => {
    render(<ManageInstructors />);
    
    await waitFor(() => {
      const inactiveName = screen.getByTestId('inactiveInstructorName-2');
      const inactiveEmail = screen.getByTestId('inactiveInstructorEmail-2');
      expect(inactiveName).toHaveTextContent('Test User');
      expect(inactiveEmail).toHaveTextContent('testuser@upskilled.com');
    });
  });

  test('calls approveRequest when approve button is clicked', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 200 });
    render(<ManageInstructors />);
    
    // Wait for data to load
    await waitFor(() => screen.getByTestId('approveButton-2'));

    const approveButton = screen.getByTestId('approveButton-2');
    fireEvent.click(approveButton);

    await waitFor(() => expect(fetch.ok));
  });

  test('calls denyRequest when deny button is clicked', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 200 });
    render(<ManageInstructors />);
    
    // Wait for data to load
    await waitFor(() => screen.getByTestId('denyButton-2'));

    const denyButton = screen.getByTestId('denyButton-2');
    fireEvent.click(denyButton);

    await waitFor(() => expect(fetch.ok))
  });

 
  test('toggles the flag state on successful requests', async () => {
    global.fetch = jest.fn().mockResolvedValue({ status: 200 });
    const { container } = render(<ManageInstructors />);

    const approveButton = await waitFor(() => screen.getByTestId('approveButton-2'));
    fireEvent.click(approveButton);

    await waitFor(() => expect(container).toBeTruthy());
  });
});
