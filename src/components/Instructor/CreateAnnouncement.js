import { useState } from "react"; // Importing useState hook from React
import { BASE_URL } from "../../utils/constants"; // Importing base URL for API requests
import { useNavigate, useParams } from "react-router-dom"; // Importing hooks for navigation and URL parameters

// Main component for creating an announcement
const CreateAnnouncement = () => {
    // State variables for managing form inputs and UI state
    const [title, setTitle] = useState(""); // State for announcement title
    const [content, setContent] = useState(""); // State for announcement content
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility after successful submission
    const [error, setError] = useState(null); // State to hold error messages
    const { courseId } = useParams(); // Extracting course ID from URL parameters
    const navigate = useNavigate(); // Hook for programmatic navigation

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        
        // Making a POST request to create a new announcement
        const response = await fetch(`${BASE_URL}/instructor/course/${courseId}/announcement`, {
            method: "POST", // Set method to POST
            headers: {
                "Content-Type": "application/json", // Set content type to JSON
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Set authorization header with token
            },
            body: JSON.stringify({ title, content }), // Prepare the request body with title and content
        });
        
        // Check if the response is okay
        if (response.ok) {
            setShowPopup(true); // Show the success popup
            // Set a timeout to hide the popup and navigate to the announcements page
            setTimeout(() => {
                setShowPopup(false); // Hide the popup
                navigate(`/instructor/course/${courseId}/announcements`); // Navigate to the announcements page
            }, 2000);
        } else {
            setError("Failed to create announcement"); // Set error message if creation fails
        }
    }

    // Render the component
    return (
        <div className="flex justify-center">
            <div className="w-3/4 border-2 p-2 my-8 text-center self-center">
                <h2 className="my-2 text-2xl">Create Announcement</h2> {/* Title of the form */}
                <form onSubmit={handleSubmit} className="flex flex-col p-12" aria-labelledby="form-title"> {/* Title of the form */}{/* Input for announcement title */}
                    <label htmlFor="title" className="sr-only">Title</label>
                    <input
                        id="title"
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)} // Update title state on change
                        className="input input-bordered m-2 p-6"
                        required
                    />
                    {/* Textarea for announcement content */}
                    <label htmlFor="content" className="sr-only">Description</label>
                    <textarea
                        id="content"
                        placeholder="Description"
                        value={content}
                        onChange={(event) => setContent(event.target.value)} // Update content state on change
                        className="textarea textarea-bordered textarea-lg m-2 min-h-96"
                        required
                    ></textarea>
                    {/* Submit button for the form */}
                    <button type="submit" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg my-2">
                        Create Announcement
                    </button>
                    {/* Display error message if there is an error */}
                    {error && <div className="alert alert-error" role="alert">{error}</div>}
                </form>
                {/* Popup message for successful announcement creation */}
                {showPopup && (
                    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
                        <div className="p-4 rounded shadow-lg" role="dialog" aria-labelledby="popup-title">
                            <div className="alert alert-info">
                                <span id="popup-title">Announcement Created Successfully.</span> {/* Success message */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Exporting the CreateAnnouncement component for use in other parts of the application
export default CreateAnnouncement;