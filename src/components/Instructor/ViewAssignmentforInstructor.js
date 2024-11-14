import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";
import { useSelector } from "react-redux";

const ViewAssignment = () => {
    const { assignmentId, courseId } = useParams();
    const [assignment, setAssignment] = useState({
        title: "",
        description: "",
        deadline: "",
    });
    const [loading, setLoading] = useState(true);
    const [editedAssignment, setEditedAssignment] = useState({});
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [submissions, setSubmissions] = useState([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const role = useSelector((state) => state.user.role);
    const navigate = useNavigate();

    const fetchAssignmentSubmissions = async () => {
        try {
            const response = await fetch(`${BASE_URL}/instructor/${courseId}/${assignmentId}/submissions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });
            const data = await response.json();
            if (data.assignmentDetails) {
                const deadline = new Date(data.assignmentDetails.deadline);
                setDate(deadline.toLocaleDateString("en-CA"));
                setTime(deadline.toTimeString().slice(0, 5));
            }
            data.submissionDetails && setSubmissions(data.submissionDetails);
            setEditedAssignment(data.assignmentDetails);
            setAssignment(data.assignmentDetails);
            document.title = data.assignmentDetails.title;
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignmentSubmissions();
    }, []);

    const handleUpdate = async (event) => {
        setLoading(true);
        event.preventDefault();
        try {
            const params = {
                ...editedAssignment,
                deadline: new Date(`${date}T${time}`).getTime().toString()
            };
            const response = await fetch(`${BASE_URL}/instructor/${courseId}/assignment/${assignmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(params),
            });
            if (response.ok) {
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
            } else {
                setError('Failed to delete assignment');
            }
        } catch (err) {
            setError('Failed to delete assignment');
        }
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-dots loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-center">
                <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2>
                <p className="text-lg text-gray-600 mb-6">
                    We encountered an error. Please try again later.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
                >
                    Reload Page
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 pt-6 mt-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">{assignment?.title}</h1>
                <div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => document.getElementById('editAssignment').showModal()}>Edit</button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => document.getElementById('deleteAssignment').showModal()}>Delete</button>
                </div>
            </div>
            <div className="p-4 rounded-md shadow-md">
                <p className="text-md" style={{ whiteSpace: 'pre-line' }}>{assignment?.description}</p>
                <p className="text-md mt-4">Due: {new Date(assignment?.deadline).toLocaleString()}</p>
            </div>

            <dialog id="editAssignment" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <h3 className="font-bold text-lg text-center">Edit Assignment</h3>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <form className="flex flex-col p-8" onSubmit={handleUpdate}>
                        <label className="label">Title:</label>
                        <input type="text" name="title" value={editedAssignment?.title} onChange={(e) => setEditedAssignment({ ...editedAssignment, title: e.target.value })} className="input input-bordered" />
                        <label className="label">Description:</label>
                        <textarea name="description" value={editedAssignment?.description} onChange={(e) => setEditedAssignment({ ...editedAssignment, description: e.target.value })} className="textarea textarea-bordered textarea-lg" style={{ minHeight: '40vh' }}></textarea>

                        <label className="label">Due Date:</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input input-bordered w-full" />

                        <label className="label">Due Time:</label>
                        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input input-bordered w-full" />

                        <button type="submit" className="btn btn-neutral mt-5" disabled={loading}>Update</button>
                    </form>
                </div>
            </dialog>

            <dialog id="deleteAssignment" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div className="content-center">
                        <div className="mt-4">
                            <h3 className="font-bold text-lg">Are you sure you want to delete this assignment?</h3>
                            <button className="btn m-4" onClick={handleDelete}>Yes</button>
                            <button className="btn m-4" onClick={() => document.getElementById('deleteAssignment').close()}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            </dialog>

            {role === 'instructor' && showPopup &&
                (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                        <div className="bg-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                            <h3 className="font-bold text-lg text-white">{popupMessage}</h3>
                            <button className="btn btn-neutral mt-4" onClick={() => { setShowPopup(false); navigate(`/instructor/course/${courseId}/assignments`) }}>Close</button>
                        </div>
                    </div>
                )
            }

            {submissions.length === 0 ? <p className="text-center text-xl mt-8">No submissions found</p> :
                <div className="overflow-x-auto">
                    <h2 className="text-2xl font-bold mt-8">Submissions</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Submission</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((submission, index) => (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>{`${submission.userDetails.firstName} ${submission.userDetails.lastName}`}</td>
                                    <td><button className="btn" onClick={() => navigate(`submission/${submission.submissionId}`)}>View Submission</button></td>
                                    <td>{submission.gradeBook ? submission.gradeBook.grade : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
}

export default ViewAssignment;