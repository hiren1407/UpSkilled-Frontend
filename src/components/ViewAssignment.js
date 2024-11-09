import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";

const ViewAssignment = () => {
    const { assignmentId } = useParams();
    const { courseId } = useParams();
    const [assignment, setAssignment] = useState({});
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editedAssignment, setEditedAssignment] = useState({});
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const role = useSelector((state) => state.user.role);
    const navigate = useNavigate();

    const fetchAssignment = async () => {
        try {
            const response = await fetch(`${BASE_URL}/instructor/getAssignmentById/${assignmentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });
            const data = await response.json();
            setAssignment(data);
            setEditedAssignment({
                ...data,
                deadline: new Date(data.deadline - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
            });
            document.title = data.title;
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAssignment();
    }, []);

    const handleUpdate = async (event) => {
        setLoading(true);
        event.preventDefault();
        try {
            const params = { ...editedAssignment, deadline: new Date(editedAssignment.deadline).getTime().toString() };
            const response = await fetch(`${BASE_URL}/instructor/${courseId}/assignment/${assignmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(params),
            });
            if (response.ok) {
                setShowEditModal(false);
                setPopupMessage('Assignment updated successfully');
                setShowPopup(true);
                setLoading(false);
            } else {
                setError('Failed to update assignment');
            }
        } catch (err) {
            setError('Failed to update assignment');
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/instructor/${courseId}/assignment/${assignmentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.ok) {
                setPopupMessage('Assignment deleted successfully');
                setShowPopup(true);
                setShowDeleteModal(false);
            } else {
                setError('Failed to delete assignment');
            }
        } catch (err) {
            setError('Failed to delete assignment');
        }
        setLoading(false);
    }

    const closeModal = () => {
        setShowEditModal(false);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-dots loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 pt-6 mt-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">{assignment.title}</h1>
                <div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => setShowEditModal(true)}>Edit</button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => setShowDeleteModal(true)}>Delete</button>
                </div>
            </div>
            <div className="p-4 rounded-md shadow-md">
                <p className="text-md">{assignment.description}</p>
                <p className="text-md">Due: {new Date(assignment.deadline).toLocaleString()}</p>
            </div>

            {role === 'instructor' && showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-slate-700 p-4 rounded-lg shadow-lg w-1/2 text-center left-20">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
                        <h3 className="font-bold text-lg">Edit Announcement</h3>
                        <form className="flex flex-col p-8" onSubmit={handleUpdate}>
                            <label className="label">Title:</label>
                            <input type="text" name="title" value={editedAssignment.title} onChange={(e) => setEditedAssignment({ ...editedAssignment, title: e.target.value })} className="input input-bordered" />
                            <label className="label">Description:</label>
                            <textarea name="description" value={editedAssignment.description} onChange={(e) => setEditedAssignment({ ...editedAssignment, description: e.target.value })} className="textarea textarea-bordered textarea-lg" style={{ minHeight: '40vh' }}></textarea>
                            <label className="label">Due Date:</label>
                            <input type="datetime-local" name="deadline" value={editedAssignment.deadline} onChange={(e) => setEditedAssignment({ ...editedAssignment, deadline: e.target.value })} className="input input-bordered" />
                            <button type="submit" className="btn btn-primary mt-5" disabled={loading}>Update</button>
                        </form>
                    </div>
                </div>
            )}

            {role === 'instructor' && showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                        <h3 className="font-bold text-lg">Are you sure you want to delete this assignment?</h3>
                        <button className="btn m-4" onClick={handleDelete}>Yes</button>
                        <button className="btn m-4" onClick={() => setShowDeleteModal(false)}>
                            No
                        </button>
                    </div>
                </div>
            )}

            {role === 'instructor' && showPopup &&
                (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                            <h3 className="font-bold text-lg">{popupMessage}</h3>
                            <button className="btn btn-primary mt-4" onClick={() => { setShowPopup(false); navigate(`/instructor/course/${courseId}/assignments`) }}>Close</button>
                        </div>
                    </div>
                )
            }


        </div>
    );
}

export default ViewAssignment;