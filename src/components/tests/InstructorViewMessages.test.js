// ViewMessagesInstructor.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ViewMessagesInstructor from '../Instructor/ViewMessagesInstructor';
import { MemoryRouter, Route } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

const mockUseParams = {
  courseId: '1',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParams,
}));

describe('ViewMessagesInstructor Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    jest.clearAllMocks();
  });

  test('renders component and fetches messages', async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); // For fetchSentMessages
    axios.get.mockResolvedValueOnce({ data: [] }); // For fetchReceivedMessages

    render(
      <MemoryRouter>
        <ViewMessagesInstructor />
      </MemoryRouter>
    );

    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Received Messages')).toBeInTheDocument();
    expect(screen.getByText('Sent Messages')).toBeInTheDocument();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });

  test('switches between tabs', async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); // For fetchSentMessages
    axios.get.mockResolvedValueOnce({ data: [] }); // For fetchReceivedMessages

    render(
      <MemoryRouter>
        <ViewMessagesInstructor />
      </MemoryRouter>
    );

    const receivedTab = screen.getByRole('tab', { name: /Received Messages/i });
    const sentTab = screen.getByRole('tab', { name: /Sent Messages/i });

    expect(receivedTab).toHaveAttribute('aria-selected', 'true');
    expect(sentTab).toHaveAttribute('aria-selected', 'false');

    fireEvent.click(sentTab);

    expect(receivedTab).toHaveAttribute('aria-selected', 'false');
    expect(sentTab).toHaveAttribute('aria-selected', 'true');
  });

  test('displays user messages when a user is selected', async () => {
    const mockMessages = [
      {
        user: {
          email: 'user@example.com',
          name: 'User One',
          employeeId: 1,
        },
        messages: [
          {
            isReceived: true,
            message: 'Hello',
            sentAt: '2023-10-01T00:00:00Z',
            isRead: false,
          },
        ],
      },
    ];

    axios.get.mockResolvedValueOnce({ data: [] }); // fetchSentMessages
    axios.get.mockResolvedValueOnce({ data: mockMessages }); // fetchReceivedMessages

    render(
      <MemoryRouter>
        <ViewMessagesInstructor />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('User One')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('User One'));

    await waitFor(() => {
      expect(screen.getByText('Conversation with User One')).toBeInTheDocument();
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });

  test('marks message as read when user is selected', async () => {
    const mockMessages = [
      {
        user: {
          email: 'user@example.com',
          name: 'User One',
          employeeId: 1,
        },
        messages: [
          {
            isReceived: true,
            message: 'Hello',
            sentAt: '2023-10-01T00:00:00Z',
            isRead: false,
          },
        ],
      },
    ];

    axios.get.mockResolvedValueOnce({ data: [] }); // fetchSentMessages
    axios.get.mockResolvedValueOnce({ data: mockMessages }); // fetchReceivedMessages
    axios.put.mockResolvedValueOnce({}); // markAsRead

    render(
      <MemoryRouter>
        <ViewMessagesInstructor />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('User One')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('User One'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/instructor/message/readMessage'),
        {},
        expect.any(Object)
      );
    });
  });

  test('opens send message modal and sends message', async () => {
    axios.get.mockResolvedValueOnce({ data: [] }); // fetchSentMessages
    axios.get.mockResolvedValueOnce({ data: [] }); // fetchReceivedMessages
    axios.get.mockResolvedValueOnce({ data: [{ id: 1, firstName: 'John', lastName: 'Doe' }] }); // fetchEmployees
    axios.post.mockResolvedValueOnce({ status: 200 }); // handleSendMessage

    render(
      <MemoryRouter>
        <ViewMessagesInstructor />
      </MemoryRouter>
    );

    const sendButton = screen.getByLabelText('Send a new message');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Send Message')).toBeInTheDocument();
    });

    const select = screen.getByLabelText('Select Employees');
    fireEvent.change(select, { target: { value: '1' } });

   // expect(screen.getByText('John Doe')).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText('Type your message here...');
    fireEvent.change(textarea, { target: { value: 'Test Message' } });

    const sendMessageButton = screen.getByText('Send');
    fireEvent.click(sendMessageButton);

    expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
  });

//   test('handles employee selection and removal', async () => {
//     axios.get.mockResolvedValueOnce({ data: [] }); // fetchSentMessages
//     axios.get.mockResolvedValueOnce({ data: [] }); // fetchReceivedMessages
//     axios.get.mockResolvedValueOnce({ data: [{ id: 1, firstName: 'John', lastName: 'Doe' }] }); // fetchEmployees

//     render(
//       <MemoryRouter>
//         <ViewMessagesInstructor />
//       </MemoryRouter>
//     );

//     const sendButton = screen.getByLabelText('Send a new message');
//     fireEvent.click(sendButton);

//     await waitFor(() => {
//       expect(screen.getByText('Send Message')).toBeInTheDocument();
//     });

//     const select = screen.getByLabelText('Select Employees');
//     fireEvent.change(select, { target: { value: '1' } });

//     expect(screen.getByText('John Doe')).toBeInTheDocument();

//     const removeButton = screen.getByLabelText('Remove John Doe');
//     fireEvent.click(removeButton);

//     expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
//   });

  test('displays loading state', async () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(
      <MemoryRouter>
        <ViewMessagesInstructor />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('handles API errors', async () => {
    axios.get.mockRejectedValue(new Error('API Error')); // fetchSentMessages
    axios.get.mockRejectedValueOnce({ data: [] }); // fetchReceivedMessages

    render(
      <MemoryRouter>
        <ViewMessagesInstructor />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });

    // Errors are logged to console, no UI feedback in the component
  });
});
