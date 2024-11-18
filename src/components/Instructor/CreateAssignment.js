import { useState } from "react"; // Importing useState hook from React
import { useNavigate, useParams } from "react-router-dom"; // Importing hooks for navigation and URL parameters
import { BASE_URL } from "../../utils/constants"; // Importing base URL for API requests

// Main component for creating an assignment
const CreateAssignment = () => {
    document.title = "Create Assignment"; // Setting the document title for the page
    // State variables for managing assignment details and UI state
    const [name, setName] = useState(""); // State for assignment name
    const [description, setDescription] = useState(""); // State for assignment description
    const [dueDate, setDueDate] = useState(""); // State for assignment due date
    const [dueTime, setDueTime] = useState(""); // State for assignment due time
    const [loading, setLoading] = useState(false); // State to manage loading status during submission
    const [error, setError] = useState(null); // State to hold error messages
    const [status, setStatus] = useState(null); // State to manage submission status
    const navigate = useNavigate(); // Hook for programmatic navigation
    const { courseId } = useParams(); // Extracting course ID from URL parameters

    // Function to handle form submission for creating an assignment
    const handleCreate = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        setLoading(true); // Set loading state to true
        setError(null); // Reset error state

        try {
            // Constructing the deadline as a timestamp from due date and time
            const deadline = new Date(`${dueDate}T${dueTime}`).getTime().toString();
            // Creating assignment details object
            const assignmentDetails = {
                title: name,
                description: description,
                deadline
            };
            // Making a POST request to create the assignment
            const response = await fetch(`${BASE_URL}/instructor/${courseId}/assignment/create`, {
                method: "POST", // Setting method to POST
                headers: {
                    "Content-Type": "application/json", // Setting content type to JSON
                    "Authorization": `Bearer ${localStorage.getItem("token")}` // Setting authorization header with token
                },
                body: JSON.stringify(assignmentDetails) // Sending assignment details as JSON
            });

            // Handle the response
            if (response.ok) {
                setStatus('success'); // Set status to success on successful creation
            } else {
                throw new Error(response.statusText); // Throw error if response is not okay
            }
        } catch (error) {
            console.error("Error creating assignment:", error); // Log error to console
            setError('Failed to create assignment'); // Set error message
        }
        setLoading(false); // Set loading state to false after completion
    }

    // Conditional rendering based on loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen" role="alert" aria-busy="true">
                <span className="loading loading-dots loading-lg" aria-label="Loading"></span> {/* Loading spinner */}
            </div>
        );
    }

    // Conditional rendering based on error state
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-center" role="alert">
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

    // Render the component
    return (
        <div className="flex p-8 mx-2 text-center flex-col">
            <form className="flex flex-col" onSubmit={handleCreate} aria-labelledby="form-title"> {/* Form for creating assignment */}
                <h1 id="form-title" className="text-2xl">Assignment Details</h1> {/* Form title */}
                <label htmlFor="assignment-name" className="label">Assignment Name</label>{/* Label for assignment name input */}
                <input
                    id="assignment-name"
                    type="text"
                    placeholder="Assignment Name"
                    className="input input-bordered"
                    value={name} // Binding value to name state
                    onChange={(e) => setName(e.target.value)} // Update name state on change
                    required
                />
                <label htmlFor="description" className="label">Description</label> {/* Label for assignment description input */}
                <textarea
                    id="description"
                    className="textarea textarea-bordered textarea-lg"
                    style={{ minHeight: '40vh' }}
                    placeholder="Description"
                    value={description} // Binding value to description state
                    onChange={(e) => setDescription(e.target.value)} // Update description state on change
                    required
                ></textarea>
                <label htmlFor="due-date" className="label">Due Date</label> {/* Label for due date input */}
                <input
                    id="due-date"
                    type="date"
                    className="input input-bordered w-full"
                    value={dueDate} // Binding value to dueDate state
                    onChange={(e) => setDueDate(e.target.value)} // Update dueDate state on change
                    required
                />
                <label htmlFor="due-time" className="label">Due Time</label> {/* Label for due time input */}
                <input
                    id="due-time"
                    type="time"
                    className="input input-bordered w-full"
                    value={dueTime} // Binding value to dueTime state
                    onChange={(e) => setDueTime(e.target.value)} // Update dueTime state on change
                    required
                />
                <button
                    type="submit" // Submit button for the form
                    className="btn btn-neutral mt-5"
                    disabled={loading} // Disable button while loading
                >
                    Create
                </button>
            </form>
            {status === 'success' && ( // Conditional rendering for success message
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" role="dialog" aria-labelledby="success-title">
                    <div className="bg-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                        <h3 id="success-title" className="font-bold text-lg">Assignment created successfully!</h3> {/* Success message */}
                        <button 
                            className="btn btn-neutral mt-4" 
                            onClick={() => { navigate(`/instructor/course/${courseId}/assignments`) }} // Navigate to assignments page
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Exporting the CreateAssignment component for use in other parts of the application
export default CreateAssignment;