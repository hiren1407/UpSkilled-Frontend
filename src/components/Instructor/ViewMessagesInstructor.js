import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../utils/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEnvelopeOpen, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewMessagesInstructor = () => {
    const { courseId } = useParams();
    const [sentMessages, setSentMessages] = useState([]);
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [loadingSent, setLoadingSent] = useState(true);
    const [loadingReceived, setLoadingReceived] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [activeTab, setActiveTab] = useState('received'); // Tab state
    const [showToast, setShowToast] = useState(false);

    const fetchSentMessages = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${BASE_URL}/instructor/course/${courseId}/message/getSentMessages`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSentMessages(response.data);
        } catch (error) {
            console.error('Error fetching sent messages:', error);
        } finally {
            setLoadingSent(false);
        }
    };

    const fetchReceivedMessages = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${BASE_URL}/instructor/course/${courseId}/message/getReceivedMessages`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setReceivedMessages(response.data);
        } catch (error) {
            console.error('Error fetching received messages:', error);
        } finally {
            setLoadingReceived(false);
        }
    };

    useEffect(() => {
        fetchSentMessages();
        fetchReceivedMessages();
    }, []);

    const fetchEmployees = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${BASE_URL}/instructor/course/${courseId}/getAllEmployees`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEmployees(response.data);
            setSelectedEmployees([])
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleSendMessage = async (event) => {
        event.preventDefault();
        if (newMessage.trim() === '') return;

        const token = localStorage.getItem('token');

        try {
            const receiverEmployeeIds = selectedEmployees.map(employee => employee.id);
            const response = await axios.post(
                `${BASE_URL}/instructor/message/sendMessage`,
                { courseId: parseInt(courseId), receiverIds: receiverEmployeeIds, message: newMessage },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setNewMessage('');
                setSelectedEmployees([]);
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 1000);
                document.getElementById('send-message').close();
                fetchSentMessages();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const markAsRead = async (employeeId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(
                `${BASE_URL}/instructor/message/readMessage?employeeId=${employeeId}&courseId=${courseId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchReceivedMessages();
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    const selectUserMessages = async (user) => {
        setSelectedUser(user);
        activeTab === 'received' && user.messages.find(msg => msg.isRead === false) && markAsRead(user.user.employeeId);
    };

    const handleSelectEmployee = (e) => {
        const selectedId = parseInt(e.target.value);
        const selectedEmployee = employees.find((emp) => emp.id === selectedId);

        if (selectedEmployee) {
            setSelectedEmployees([...selectedEmployees, selectedEmployee]);
            setEmployees(employees.filter((emp) => emp.id !== selectedId));
        }
    };
    const handleRemoveEmployee = (id) => {
        const removedEmployee = selectedEmployees.find((emp) => emp.id === id);
        if (removedEmployee) {
            setEmployees([...employees, removedEmployee]);
            setSelectedEmployees(selectedEmployees.filter((emp) => emp.id !== id));
        }
    };

    return (
        <div className="relative my-4">
            <h1 className="text-2xl md:text-3xl font-bold text-center my-4">Messages</h1>

            {/* Tabs */}
            <div className="flex justify-center border-b mb-4">
                <button
                    className={`px-4 py-2 font-semibold ${activeTab === 'received' ? 'border-b-4 border-blue-500' : 'text-gray-500'}`}
                    onClick={() => {
                        setActiveTab('received');
                        setSelectedUser(null);
                    }}
                >
                    Received Messages
                </button>
                <button
                    className={`px-4 py-2 font-semibold ${activeTab === 'sent' ? 'border-b-4 border-blue-500' : 'text-gray-500'}`}
                    onClick={() => {
                        setActiveTab('sent');
                        setSelectedUser(null);
                    }}
                >
                    Sent Messages
                </button>
            </div>

            {/* Floating Button for Sending Message */}
            <button
                className="absolute top-4 right-6 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 w-14"
                onClick={() => { document.getElementById('send-message').showModal(); fetchEmployees() }}
            >
                <FontAwesomeIcon icon={faPaperPlane} />
            </button>

            {/* Main Layout */}
            <div className="flex flex-col sm:flex-row h-screen sm:h-auto mx-4 rounded-md">
                {/* Sidebar */}
                <div className="w-full sm:w-1/4 border-r p-4 bg-gray-100 overflow-y-auto sm:h-full">
                    <h2 className="text-xl font-bold mb-4">Users</h2>
                    {(activeTab === 'received' ? loadingReceived : loadingSent) ? (
                        <p>Loading...</p>
                    ) : (
                        (activeTab === 'received' ? receivedMessages : sentMessages).map((user) => (
                            <div
                                key={user.user.email}
                                className={`border rounded-md p-4 my-2 bg-white shadow-md cursor-pointer ${selectedUser?.user.email === user.user.email ? 'bg-blue-100' : ''
                                    }`}
                                onClick={() => selectUserMessages(user)}
                            >
                                <p className="text-lg font-semibold text-gray-700">{user.user.name}</p>
                                <div className="text-gray-500 text-sm mt-2 flex justify-between">
                                    <span>{new Date(user.messages[0].sentAt).toLocaleString()}</span>
                                    {activeTab === 'received' && (
                                        <FontAwesomeIcon
                                            icon={user.messages.some((msg) => !msg.isRead) ? faEnvelope : faEnvelopeOpen}
                                            className={`text-${user.messages.some((msg) => !msg.isRead) ? 'red' : 'green'}-500`}
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Chat Window */}
                <div className="w-full sm:w-3/4 p-4 bg-white overflow-y-auto">
                    {selectedUser ? (
                        <div className="h-[calc(100vh-200px)] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4">Messages with {selectedUser.user.name}</h2>
                            <div className="flex flex-col gap-4">
                                {selectedUser.messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-4 rounded-md shadow-md ${msg.isReceived ? 'bg-gray-200' : 'bg-blue-100'
                                            }`}
                                    >
                                        <p className="text-lg">{msg.message}</p>
                                        <div className="text-sm text-gray-500 mt-2">
                                            {msg.isReceived ? 'Received at' : 'Sent at'}:{' '}
                                            {new Date(msg.sentAt).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-lg text-gray-500">Select a user to view messages</p>
                    )}
                </div>
            </div>

            {/* Send Message Modal */}
            <dialog id="send-message" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Send Message</h3>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <form onSubmit={handleSendMessage} className="py-4">
                        <label className='block mb-2 text-sm font-bold text-gray-700'>Select Employees</label>
                        <select
                            onChange={handleSelectEmployee}
                            className="select select-bordered w-full min-h-[40px] mb-4"
                            defaultValue=""
                        >
                            <option value="">
                                Select an employee
                            </option>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.firstName + " " + employee.lastName}
                                </option>
                            ))}
                        </select>

                        <div className="flex flex-wrap gap-2">
                            {selectedEmployees.map((employee) => (
                                <div
                                    key={employee.id}
                                    className="flex items-center bg-blue-200 text-blue-800 px-3 py-1 rounded-md"
                                >
                                    <span>{employee.firstName + " " + employee.lastName}</span>
                                    <button
                                        className="ml-2 text-red-600 hover:text-red-800"
                                        onClick={() => handleRemoveEmployee(employee.id)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        <label className='block mb-2 text-sm font-bold text-gray-700'>Message</label>
                        <textarea className="w-full border rounded-md p-2 mb-4" rows="4" value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message here..." />
                        <button type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </dialog>

            {/* Toast */}
            {showToast && (
                <div className="flex justify-center absolute w-full top-1">
                    <div className="toast toast-top relative">
                        <div className="alert alert-success">
                            <span>Message sent successfully!</span>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default ViewMessagesInstructor;
