import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEnvelopeOpen, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';

const ViewMessagesEmployee = () => {
  const { courseId } = useParams();
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [loadingSent, setLoadingSent] = useState(true);
  const [loadingReceived, setLoadingReceived] = useState(true);
  const [newMessage, setNewMessage] = useState('');

  // Fetch sent messages from the server
  const fetchSentMessages = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${BASE_URL}/employee/course/${courseId}/message/getSentMessages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSentMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching sent messages:', error);
    } finally {
      setLoadingSent(false);
    }
  };

  // Fetch received messages from the server
  const fetchReceivedMessages = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${BASE_URL}/employee/course/${courseId}/message/getReceivedMessages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setReceivedMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching received messages:', error);
    } finally {
      setLoadingReceived(false);
    }
  };

  // Fetch messages on component mount
  useEffect(() => {
    fetchSentMessages();
    fetchReceivedMessages();
  }, []);

  // Handle sending a new message
  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (newMessage.trim() === '') return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}/employee/message/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: newMessage, courseId })
      });
      if (response.status === 200) {
        setNewMessage('');
        document.getElementById('send-message').close();
        fetchSentMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // View message details and mark as read if necessary
  const viewMessage = async (message, isReceivedMessage) => {
    const token = localStorage.getItem('token');

    if (isReceivedMessage && !message.isRead) {
      try {
        const response = await fetch(`${BASE_URL}/employee/message/readMessage?messageId=${message.messageId}&courseId=${courseId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 200) fetchReceivedMessages();
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }

    // Display message details in the modal
    const modal = document.getElementById('view-message');
    modal.querySelector('.modal-body').innerHTML = `
      <p><strong>Message:</strong> ${message.message}</p>
      <br/>
      <p><strong>${isReceivedMessage ? 'Received At' : 'Sent At'}:</strong> ${new Date(message.sentAt).toLocaleString()}</p>
    `;
    modal.showModal();
  };

  // Render a received message
  const renderReceivedMessage = (message) => (
    <div
      key={message.messageId}
      className={`border rounded-md p-4 my-2 shadow-md ${message.isRead ? 'bg-gray-200' : 'bg-white'}`}
      onClick={() => viewMessage(message, true)}
      role="button"
      tabIndex="0"
      aria-label={`Received message: ${message.message}`}
    >
      <p className="text-lg text-gray-700 truncate">{message.message}</p>
      <div className="text-gray-500 text-sm mt-2 flex items-center justify-between">
        <span>{new Date(message.sentAt).toLocaleString()}</span>
        <FontAwesomeIcon
          icon={message.isRead ? faEnvelopeOpen : faEnvelope}
          className={`text-${message.isRead ? 'green' : 'red'}-500`}
          aria-hidden="true"
        />
      </div>
    </div>
  );

  // Render a sent message
  const renderSentMessage = (message) => (
    <div
      key={message.messageId}
      className="border rounded-md p-4 my-2 bg-white shadow-md"
      onClick={() => viewMessage(message, false)}
      role="button"
      tabIndex="0"
      aria-label={`Sent message: ${message.message}`}
    >
      <p className="text-lg text-gray-700 truncate">{message.message}</p>
      <div className="text-gray-500 text-sm mt-2 flex items-center justify-between">
        <span>{new Date(message.sentAt).toLocaleString()}</span>
      </div>
    </div>
  );

  return (
    <div className="relative my-1">
      <h1 className="text-2xl md:text-3xl font-bold text-center my-4">Messages</h1>

      {/* Modal for sending a new message */}
      <dialog id="send-message" className="modal modal-bottom sm:modal-middle" aria-labelledby="send-message-title">
        <div className="modal-box">
          <h3 id="send-message-title" className="font-bold text-lg">Send message to instructor</h3>
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Close">✕</button>
          </form>
          <form className="py-4">
            <textarea
              className="w-full border rounded-md p-2 mb-4"
              rows="4"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              aria-label="Type your message here"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
              aria-label="Send message"
            >
              Send
            </button>
          </form>
        </div>
      </dialog>

      {/* Modal for viewing a message */}
      <dialog id="view-message" className="modal modal-bottom sm:modal-middle" aria-labelledby="view-message-title">
        <div className="modal-box">
          <h3 id="view-message-title" className="font-bold text-lg">Message</h3>
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Close">✕</button>
          </form>
          <div className="modal-body py-4"></div>
        </div>
      </dialog>

      {/* Button to open the send message modal */}
      <button
        className="absolute top-4 right-6 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 w-14"
        onClick={() => document.getElementById('send-message').showModal()}
        aria-label="Send a new message"
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>

      {/* Tabs for sent and received messages */}
      <div role="tablist" className="tabs tabs-lifted mx-2">
        <input type="radio" id="sent-tab" name="tabs" role="tab" className="tab" aria-controls="sent-messages" aria-label="Sent Messages" defaultChecked />
        <div id="sent-messages" role="tabpanel" className="tab-content border-base-300 rounded-box p-6 h-[36rem] overflow-y-auto">
          {loadingSent ? <p>Loading sent messages...</p> : sentMessages.map(renderSentMessage)}
        </div>

        <input type="radio" id="received-tab" name="tabs" role="tab" className="tab" aria-controls="received-messages" aria-label="Received Messages" />
        <div id="received-messages" role="tabpanel" className="tab-content border-gray-300 rounded-box p-6 h-[36rem] overflow-y-scroll">
          {loadingReceived ? <p>Loading received messages...</p> : receivedMessages.map(renderReceivedMessage)}
        </div>
      </div>
    </div>
  );
};

export default ViewMessagesEmployee;
