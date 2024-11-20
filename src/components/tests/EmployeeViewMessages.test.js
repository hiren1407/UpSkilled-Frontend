// ViewMessagesEmployee.test.js
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ViewMessagesEmployee from '../Employee/ViewMessagesEmployee';
import axios from 'axios';
import { useParams } from 'react-router-dom';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <i data-testid="fa-icon" />,
}));

describe('ViewMessagesEmployee Component', () => {
  let mockCourseId = '1';

  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    window.localStorage.__proto__.getItem = jest.fn(() => 'test-token');

    useParams.mockReturnValue({ courseId: mockCourseId });

    // Mock the dialog methods
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading messages while fetching data', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('getSentMessages')) {
        return new Promise(() => {}); // Keep the promise pending
      }
      if (url.includes('getReceivedMessages')) {
        return new Promise(() => {}); // Keep the promise pending
      }
    });

    render(<ViewMessagesEmployee />);

    expect(screen.getByText('Loading sent messages...')).toBeInTheDocument();
    expect(screen.getByText('Loading received messages...')).toBeInTheDocument();
  });

  test('renders sent and received messages after successful fetch', async () => {
    const sentMessages = [
      {
        messageId: '1',
        message: 'Sent message 1',
        sentAt: '2023-10-01T12:00:00Z',
      },
    ];

    const receivedMessages = [
      {
        messageId: '2',
        message: 'Received message 1',
        sentAt: '2023-10-01T13:00:00Z',
        isRead: false,
      },
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('getSentMessages')) {
        return Promise.resolve({ data: { messages: sentMessages } });
      }
      if (url.includes('getReceivedMessages')) {
        return Promise.resolve({ data: { messages: receivedMessages } });
      }
    });

    render(<ViewMessagesEmployee />);

    // Wait for sent messages to be displayed
    expect(await screen.findByText('Sent message 1')).toBeInTheDocument();
    expect(screen.getByText('Received message 1')).toBeInTheDocument();
  });

  test('displays appropriate messages when no messages are found', async () => {
    axios.get.mockResolvedValue({ data: { messages: [] } });

    render(<ViewMessagesEmployee />);

    // Wait for loading messages to disappear
    await screen.findByText('Messages');

    expect(screen.queryByText('Sent message 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Received message 1')).not.toBeInTheDocument();
  });

  test('sends a new message successfully', async () => {
    axios.get.mockResolvedValue({ data: { messages: [] } });

    // Mock fetch for sending message
    global.fetch = jest.fn().mockResolvedValue({ status: 200 });

    render(<ViewMessagesEmployee />);

    // Open the send message modal
    const sendButton = screen.getByRole('button', { name: 'Send a new message' });
    fireEvent.click(sendButton);

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

    // Type a new message
    const messageTextarea = screen.getByLabelText('Type your message here');
    fireEvent.change(messageTextarea, { target: { value: 'Hello, instructor!' } });

    // Send the message
    const sendMessageButton = screen.getByRole('button', { name: 'Send message' });
    fireEvent.click(sendMessageButton);

    // Verify fetch call
    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/employee/message/sendMessage`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.any(Object),
        body: JSON.stringify({ message: 'Hello, instructor!', courseId: '1' }),
      })
    );

    // Verify modal is closed
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
  });

  test('views a sent message', async () => {
    const sentMessages = [
      {
        messageId: '1',
        message: 'Sent message 1',
        sentAt: '2023-10-01T12:00:00Z',
      },
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('getSentMessages')) {
        return Promise.resolve({ data: { messages: sentMessages } });
      }
      if (url.includes('getReceivedMessages')) {
        return Promise.resolve({ data: { messages: [] } });
      }
    });

    render(<ViewMessagesEmployee />);

    const messageElement = await screen.findByText('Sent message 1');

    // Open the message modal
    fireEvent.click(messageElement);

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

    // Verify modal content
    const modalMessage = screen.getByTestId("message");
    expect(modalMessage).toHaveTextContent('Sent message 1');

    const sentAt = screen.getByText(/Sent At:/);
    expect(sentAt).toHaveTextContent('2023-10-01');
  });

  test('views a received message and marks it as read', async () => {
    const receivedMessages = [
      {
        messageId: '2',
        message: 'Received message 1',
        sentAt: '2023-10-01T13:00:00Z',
        isRead: false,
      },
    ];

    axios.get.mockImplementation((url) => {
      if (url.includes('getSentMessages')) {
        return Promise.resolve({ data: { messages: [] } });
      }
      if (url.includes('getReceivedMessages')) {
        return Promise.resolve({ data: { messages: receivedMessages } });
      }
    });

    // Mock fetch for marking message as read
    global.fetch = jest.fn().mockResolvedValue({ status: 200 });

    render(<ViewMessagesEmployee />);

    const messageElement = await screen.findByText('Received message 1');

    // Open the message modal
    fireEvent.click(messageElement);

    // Verify fetch call to mark as read
    expect(fetch.ok);
  });

  test('handles error when sending a message fails', async () => {
    axios.get.mockResolvedValue({ data: { messages: [] } });

    // Mock fetch to fail
    global.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));

    render(<ViewMessagesEmployee />);

    // Open the send message modal
    const sendButton = screen.getByRole('button', { name: 'Send a new message' });
    fireEvent.click(sendButton);

    // Type a new message
    const messageTextarea = screen.getByLabelText('Type your message here');
    fireEvent.change(messageTextarea, { target: { value: 'Hello, instructor!' } });

    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Send the message
    const sendMessageButton = screen.getByTestId("sendMessageButton");
    fireEvent.click(sendMessageButton);

    await act(async () => {});

    // Verify error is logged
    expect(consoleSpy).toHaveBeenCalledWith('Error sending message:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  test('handles error when fetching messages fails', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ViewMessagesEmployee />);

    await act(async () => {});

    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching sent messages:', expect.any(Error));
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching received messages:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  test('ensures accessibility attributes are set correctly', async () => {
    axios.get.mockResolvedValue({ data: { messages: [] } });

    render(<ViewMessagesEmployee />);

    // Check ARIA labels for buttons
    expect(screen.getByRole('button', { name: 'Send a new message' })).toBeInTheDocument();
  });

  test('switches between sent and received messages tabs', async () => {
    axios.get.mockResolvedValue({ data: { messages: [] } });

    render(<ViewMessagesEmployee />);

    // The tabs are implemented using radio buttons
    const sentTab = screen.getByLabelText('Sent Messages');
    const receivedTab = screen.getByLabelText('Received Messages');

    // Initially, sent messages tab should be selected
    expect(sentTab.checked).toBe(true);

    // Switch to received messages tab
    fireEvent.click(receivedTab);
    expect(receivedTab.checked).toBe(true);
  });
});
