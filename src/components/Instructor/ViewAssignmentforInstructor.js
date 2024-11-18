import { useEffect, useState } from "react"; // Importing React hooks for state and side effects
import { useNavigate, useParams } from "react-router-dom"; // Importing hooks for navigation and URL parameters
import { BASE_URL } from "../../utils/constants"; // Importing base URL for API requests
import { useSelector } from "react-redux"; // Importing useSelector for accessing Redux state

// Main component for viewing an assignment
const ViewAssignment = () => {
    // Extracting assignmentId and courseId from URL parameters
    const { assignmentId, courseId } = useParams();
    
    // State variables for managing assignment details and UI state
    const [assignment, setAssignment] = useState({
        title: "",
        description: "",
        deadline: "",
    });
    const [loading, setLoading] = useState(true); // Loading state to manage fetching status
    const [editedAssignment, setEditedAssignment] = useState({}); // State for edited assignment details
    const [error, setError] = useState(null); // State for error messages
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
    const [popupMessage, setPopupMessage] = useState(''); // State for popup message content
    const [submissions, setSubmissions] = useState([]); // State to hold assignment submissions
    const [date, setDate] = useState(""); // State for due date
    const [time, setTime] = useState(""); // State for due time
    const role = useSelector((state) => state.user.role); // Accessing user role from Redux state
    const navigate = useNavigate(); // Hook for programmatic navigation

    // Function to fetch assignment submissions from the server
    const fetchAssignmentSubmissions = async () => {
        try {
            // Sending GET request to fetch submissions
            const response = await fetch(`${BASE_URL}/instructor/${courseId}/${assignmentId}/submissions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token') // Setting authorization header
                },
            });
            const data = await response.json(); // Parsing JSON response
            
            // If assignment details are present, set the state
            if (data.assignmentDetails) {
                const deadline = new Date(data.assignmentDetails.deadline); // Parsing deadline date
                setDate(deadline.toLocaleDateString("en-CA")); // Formatting date for input
                setTime(deadline.toTimeString().slice(0, 5)); // Formatting time for input
            }
            data.submissionDetails && setSubmissions(data.submissionDetails); // Setting submissions if available
            setEditedAssignment(data.assignmentDetails); // Setting edited assignment details
            setAssignment(data.assignmentDetails); // Setting assignment details
            document.title = data.assignmentDetails.title; // Setting document title to assignment title
            setLoading(false); // Setting loading to false after fetching
        } catch (error) {
            console.error(error); // Logging error to console
            setLoading(false); // Setting loading to false on error
        }
    };

    // useEffect hook to fetch assignment submissions on component mount
    useEffect(() => {
        fetchAssignmentSubmissions();
    }, []);

    // Function to handle updating the assignment
    const handleUpdate = async (event) => {
        setLoading(true); // Setting loading to true during update
        event.preventDefault(); // Preventing default form submission behavior
        try {
            // Preparing parameters for updating assignment
            const params = {
                ...editedAssignment,
                deadline: new Date(`${date}T${time}`).getTime().toString() // Converting date and time to timestamp
            };
            // Sending PUT request to update assignment
            const response = await fetch(`${BASE_URL}/instructor/${courseId}/assignment/${assignmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Setting authorization header
                },
                body: JSON.stringify(params), // Sending updated assignment details
            });
            if (response.ok) {
                setPopupMessage('Assignment updated successfully'); // Setting success message
                setShowPopup(true); // Showing popup
                setLoading(false); // Setting loading to false
            } else {
                setError('Failed to update assignment'); // Setting error message on failure
            }
        } catch (err) {
            setError('Failed to update assignment'); // Setting error message on exception
        }
    };

    // Function to handle deleting the assignment
    const handleDelete = async () => {
        setLoading (true); // Setting loading to true during deletion
        try {
            // Sending DELETE request to remove the assignment
            const response = await fetch(`${BASE_URL}/instructor/${courseId}/assignment/${assignmentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Setting authorization header
                }
            });

            if (response.ok) {
                setPopupMessage('Assignment deleted successfully'); // Setting success message
                setShowPopup(true); // Showing popup
            } else {
                setError('Failed to delete assignment'); // Setting error message on failure
            }
        } catch (err) {
            setError('Failed to delete assignment'); // Setting error message on exception
        }
        setLoading(false); // Setting loading to false after operation
    }

    // Conditional rendering for loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-dots loading-lg"></span> {/* Loading spinner */}
            </div>
        );
    }

    // Conditional rendering for error state
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-center">
                <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2> {/* Error heading */}
                <p className="text-lg text-gray-600 mb-6">
                    We encountered an error. Please try again later. {/* Error message */}
                </p>
                <button
                    onClick={() => window.location.reload()} // Reload page on button click
                    className="px-6 py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
                >
                    Reload Page
                </button>
            </div>
        );
    }

    // Render the component with assignment details and submissions
    return (
        <div className="container mx-auto p-8 pt-6 mt-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">{assignment?.title}</h1> {/* Assignment title */}
                <div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => document.getElementById('editAssignment').showModal()}>Edit</button> {/* Edit button */}
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => document.getElementById('deleteAssignment').showModal()}>Delete</button> {/* Delete button */}
                </div>
            </div>
            <div className="p-4 rounded-md shadow-md">
                <p className="text-md" style={{ whiteSpace: 'pre-line' }}>{assignment?.description}</p> {/* Assignment description */}
                <p className="text-md mt-4">Due: {new Date(assignment?.deadline).toLocaleString()}</p> {/* Due date and time */}
            </div>

            {/* Modal for editing assignment */}
            <dialog id="editAssignment" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <h3 className="font-bold text-lg text-center">Edit Assignment</h3> {/* Modal title */}
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button> {/* Close button */}
                    </form>
                    <form className="flex flex-col p-8" onSubmit={handleUpdate}>
                        <label className="label">Title:</label>
                        <input type="text" name="title" value={editedAssignment?.title} onChange={(e) => setEditedAssignment({ ...editedAssignment, title: e.target.value })} className="input input-bordered" /> {/* Title input */}
                        <label className="label">Description:</label>
                        <textarea name="description" value={editedAssignment?.description} onChange={(e) => setEditedAssignment({ ...editedAssignment, description: e.target.value })} className="textarea textarea-bordered textarea-lg" style={{ minHeight: '40vh' }}></textarea> {/* Description input */}

                        <label className="label">Due Date:</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input input-bordered w-full" /> {/* Due date input */}

                        <label className="label">Due Time:</label>
                        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input input-bordered w-full" /> {/* Due time input */}

                        <button type="submit" className="btn btn-neutral mt-5" disabled={loading}>Update</button> {/* Update button */}
                    </form>
                </div>
            </dialog>

            {/* Modal for confirming assignment deletion */}
            <dialog id="deleteAssignment" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button> {/* Close button */}
                    </form>
                    <div className="content-center">
                        <div className="mt-4">
                            <h3 className="font-bold text-lg">Are you sure you want to delete this assignment?</h3> {/* Confirmation message */}
                            <button className="btn m-4" onClick={handleDelete}>Yes</button> {/* Yes button for deletion */}
                            <button className="btn m-4" onClick={() => document.getElementById('deleteAssignment').close()}>
                                No
                            </button> {/* No button to cancel deletion */}
                        </div>
                    </div>
                </div>
            </dialog>

            {/* Popup for success messages */}
            {role === 'instructor' && showPopup &&
                (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                        <div className="bg-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                            <h3 className="font-bold text-lg text-white">{popupMessage}</h3> {/* Popup message */}
                            <button className="btn btn-neutral mt-4" onClick={() => { setShowPopup(false); navigate(`/instructor/course/${courseId}/assignments`) }}>Close</button> {/* Close button for popup */}
                        </div>
                    </div>
                )
            }

            {/* Conditional rendering for submissions */}
            {submissions.length === 0 ? <p className="text-center text-xl mt-8">No submissions found</p> :
                <div className="overflow-x-auto">
                    <h2 className="text-2xl font-bold mt-8">Submissions</h2> {/* Submissions title */}
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
                                    <th>{index + 1}</th> {/* Submission index */}
                                    <td>{`${submission.userDetails.firstName} ${submission.userDetails.lastName}`}</td> {/* Student's name */}
                                    <td><button className="btn btn-sm md:btn-md" onClick={() => navigate(`submission/${submission.submissionId}`)}>View Submission</button></td> {/* Button to view submission */}
                                    <td>{submission.gradeBook ? submission.gradeBook.grade : '-'}</td> {/* Displaying grade or placeholder */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
}

// Exporting the ViewAssignment component for use in other parts of the application
export default ViewAssignment;