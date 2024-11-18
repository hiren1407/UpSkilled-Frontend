import { BASE_URL } from '../../utils/constants'; // Importing base URL for API requests
import React, { useEffect, useState } from 'react'; // Importing necessary hooks from React
import { useParams } from 'react-router-dom'; // Importing useParams for accessing URL parameters
import dayjs from 'dayjs'; // Importing dayjs for date formatting
import axios from 'axios'; // Importing axios for making HTTP requests

// Main component for viewing assignments
const AssignmentView = () => {
    // Extracting assignmentId and courseId from URL parameters
    const { assignmentId, courseId } = useParams(); 
    // State variables for managing assignment data and submission details
    const [assignment, setAssignment] = useState(null); // State to hold assignment details
    const [submissionDetails, setSubmissionDetails] = useState(null); // State for submission details
    const [submissionId, setSubmissionId] = useState(null); // State for submission ID
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for error messages
    const [file, setFile] = useState(null); // State for the file to be uploaded
    const [uploadError, setUploadError] = useState(null); // State for upload error messages
    const [submissionPdf, setSubmissionPdf] = useState(null); // State for the submitted PDF
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // State for mobile view detection
    const [showToast, setShowToast] = useState(false); // State for showing success toast

    // Function to fetch assignment details and submission details from the API
    const fetchAssignment = async () => {
        try {
            setLoading(true); // Set loading to true while fetching data
            const token = localStorage.getItem('token'); // Retrieve token from local storage
            // Making GET request to fetch assignment details
            const response = await axios.get(`${BASE_URL}/employee/course/${courseId}/assignments/${assignmentId}`, {
                headers: {
                    "Authorization": `Bearer ${token}` // Set authorization header
                }
            });
            // Setting assignment and submission details in state
            setAssignment(response.data.assignmentDetails);
            if (response.data.submissionDetails) {
                setSubmissionDetails(response.data?.submissionDetails[0]);
                setSubmissionId(response.data?.submissionDetails[0]?.submissionId);
                document.title = response.data.assignmentDetails.title; // Set document title to assignment title
            }
        } catch (err) {
            setError('Failed to load assignment details'); // Set error message on failure
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    // useEffect hook to fetch assignment details on component mount or when assignmentId changes
    useEffect(() => {
        fetchAssignment(); // Call the fetchAssignment function
        // Function to update mobile view state on window resize
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        // Add event listener for window resize
        window.addEventListener("resize", handleResize);
        // Cleanup function to remove event listener
        return () => window.removeEventListener("resize", handleResize);
    }, [assignmentId]); // Dependency array includes assignmentId

    // Render loading spinner while data is being fetched
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen" role="status" aria-live="polite">
                <span className="loading loading-dots loading-lg" aria-label="Loading"></span>
            </div>
        );
    }

    // Render error message if there is an error
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-center" role="alert" aria-live="assertive">
                <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2>
                <p className="text-lg text-gray-600 mb-6">
                    We encountered an error. Please try again later.
                </p>
                <button
                    onClick={() => window.location.reload()} // Reload the page on button click
                    className="px-6 py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
                >
                    Reload Page
                </button>
            </div>
        );
    }

    // Destructuring assignment details
    const { title, description, deadline } = assignment; 
    const deadlineDate = dayjs(deadline).format('MMMM D, YYYY h:mm A'); // Formatting deadline date
    const submission = submissionDetails || null; // Set submission to submissionDetails or null if not available
    const gradeBook = submission?.gradeBook; // Accessing grade book from submission details
    const grade = gradeBook?.grade; // Getting the grade from the grade book

    // Determining submission status based on submission details
    let submissionStatus;
    if (!submission) {
        submissionStatus = 'No submissions'; // No submission made
    } else if (submission && !gradeBook) {
        submissionStatus = 'Not graded yet'; // Submission exists but not graded
    } else {
        submissionStatus = `Grade: ${grade}%`; // Submission is graded
    }

    // Function to handle file selection for upload
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]; // Get the selected file
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile); // Set the selected file in state
            setUploadError(null); // Clear any previous upload errors
        } else {
            setUploadError("Please upload a valid PDF file."); // Set error for invalid file type
        }
    };

    // Function to handle file upload
    // Function to handle file upload
    const handleUpload = async () => {
        if (!file) {
            setUploadError("Please select a PDF file before uploading."); // Error if no file selected
            return;
        }

        const formData = new FormData(); // Create a FormData object for file upload
        formData.append('file', file); // Append the file to the form data
        formData.append('courseId', courseId); // Append course ID to the form data

        try {
            const token = localStorage.getItem('token'); // Retrieve token from local storage
            formData.append('assignmentId', assignmentId); // Append assignment ID to the form data
            if (!submission) {
                // If no submission exists, create a new submission
                const response = await fetch(`${BASE_URL}/employee/uploadAssignment`, {
                    method: "POST", // HTTP method for creating submission
                    headers: {
                        "Authorization": `Bearer ${token}` // Set authorization header
                    },
                    body: formData // Attach form data
                });
                if (response.status == 200) {
                    setShowToast(true); // Show success toast
                    setTimeout(() => {
                        setShowToast(false); // Hide toast after 3 seconds
                    }, 3000);
                    setFile(null); // Clear the file input
                    setUploadError(null); // Clear any upload errors
                    fetchAssignment(); // Refresh assignment data
                } else {
                    setUploadError("Failed to upload assignment. Please try again."); // Error on upload failure
                }
            } else {
                // If submission exists, update the existing submission
                formData.append('submissionId', submissionId); // Append submission ID to the form data
                const response = await fetch(`${BASE_URL}/employee/updateUploadedAssignment/${submissionId}`, {
                    method: "PUT", // HTTP method for updating submission
                    headers: {
                        "Authorization": `Bearer ${token}` // Set authorization header
                    },
                    body: formData // Attach form data
                });
                if (response.status == 200) {
                    setShowToast(true); // Show success toast
                    setTimeout(() => {
                        setShowToast(false); // Hide toast after 3 seconds
                    }, 3000);
                    setFile(null); // Clear the file input
                    setUploadError(null); // Clear any upload errors
                    fetchAssignment(); // Refresh assignment data
                } else {
                    setUploadError("Failed to update assignment. Please try again."); // Error on update failure
                }
            }

            // Reload the assignment data to reflect the latest submission
            fetchAssignment();
        } catch (error) {
            setUploadError("Failed to upload assignment. Please try again."); // Error on catch
        }
    };

    // Function to view the submitted assignment
    const handleViewSubmission = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve token from local storage
            const response = await fetch(`${BASE_URL}/employee/course/${courseId}/assignment/${assignmentId}/viewSubmission`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Set authorization header
                }
            }); // Fetch submission from API
            if (response.status === 200) {
                const file = await response.blob(); // Get the file blob from response
                const fileUrl = URL.createObjectURL(file); // Create a URL for the blob
                document.getElementById('my_modal_4').showModal(); // Show the modal for viewing submission
                setSubmissionPdf(fileUrl); // Set the submission PDF URL
            } else {
                setError("Failed to fetch submission"); // Error if fetching submission fails
            }
        } catch (error) {
            console.error('Error fetching submission:', error); // Log error to console
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-base-100 shadow-lg rounded-lg mt-6">
            {showToast && (
                    <div className="flex justify-center">
                        <div className="toast toast-top relative" role="status" aria-live="polite">
                                <div className="alert alert-success">
                                    <span>Assignment submitted successfully!</span> {/* Success message */}
                                </div>
                        </div>
                    </div>
            )}
            <h2 className="text-2xl font-bold mb-4" tabIndex="0">{title}</h2> {/* Display assignment title */}
            <p className="mb-4" tabIndex="0">{description}</p> {/* Display assignment description */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-semibold" tabIndex="0">Deadline:</h3>
                    <p tabIndex="0">{deadlineDate}</p>{/* Display formatted deadline date */}
                </div>
                <div>
                    <h3 className="text-lg font-semibold" tabIndex="0">Submission Status:</h3>
                    <p tabIndex="0">{submissionStatus}</p>{/* Display submission status */}
                </div>
            </div>

            {submission && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold mb-2" tabIndex="0">Submission Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold" tabIndex="0">Submission Status:</h4>
                            <p tabIndex="0">{submission.submissionStatus}</p> {/* Display submission status */}
                        </div>
                        <div>
                            <h4 className="font-semibold" tabIndex="0">Submitted At:</h4>
                            <p tabIndex="0">{dayjs(submission.submissionAt).format('MMMM D, YYYY h:mm A')}</p> {/* Display submission date */}
                        </div>
                        {gradeBook && (
                            <>
                                <div>
                                    <h4 className="font-semibold" tabIndex="0">Grade:</h4>
                                    <p tabIndex="0">{grade}%</p> {/* Display grade */}
                                </div>
                                <div>
                                    <h4 className="font-semibold" tabIndex="0">Feedback:</h4>
                                    <p tabIndex="0">{gradeBook.feedback}</p> {/* Display feedback */}
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        onClick={handleViewSubmission} // Trigger view submission function
                        className="btn btn-primary mt-4"
                    >
                        View Submission
                    </button>
                </div>
            )}
            <dialog id="submissionModal" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <h3 className="font-bold text-lg text-center">Submission</h3>
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Close">✕</button>
                    </form>
                    <div className="w-full content-center">
                        <div className="mt-4">
                            {!isMobile ? (
                                <object
                                    data={submissionPdf} // Display PDF in object tag
                                    type="application/pdf"
                                    className="w-full h-[75vh] sm:h-[60vh] md:h-[70vh]"
                                    style={{ minHeight: 'calc(100vh - 150px)', width: '100%' }}
                                    aria-label="Submission PDF"
                                />
                            ) : (
                                <p>Your browser does not support viewing PDF files.
                                    <a href={submissionPdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline"> Open PDF in new tab</a>
                                </p> // Link to open PDF in new tab for mobile users
                            )}
                        </div>
                    </div>
                </div>
            </dialog>

            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Upload Assignment</h3>
                <input
                    type="file"
                    accept="application/pdf" // Accept only PDF files
                    onChange={handleFileChange} // Trigger file change function
                    className="file-input file-input-bordered w-full max-w-xs"
                    disabled={!!gradeBook} // Disable input if assignment is graded
                    aria-label="Upload Assignment"
                />
                {uploadError && <p className="text-red-500 mt-2" role="alert">{uploadError}</p>} {/* Display upload error message */}

                <button
                    onClick={handleUpload} // Trigger upload function
                    disabled={!!gradeBook } // Disable button if assignment is graded
                    className="btn btn-primary mt-4"
                >
                    {submission ? 'Update Assignment' : 'Submit Assignment'} {/* Button text based on submission status */}
                </button>
            </div>
        </div>
    );
};

// Exporting the AssignmentView component for use in other parts of the application
export default AssignmentView;