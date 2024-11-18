import { useEffect, useRef, useState } from "react"; // Importing necessary hooks from React
import { useSelector } from "react-redux"; // Importing useSelector to access Redux state
import { BASE_URL } from "../utils/constants"; // Importing base URL for API requests
import { useParams } from "react-router-dom"; // Importing useParams to access URL parameters

// Main component for displaying the syllabus
const Syllabus = () => {
    const course = useSelector((state) => state.courseDetails.course); // Getting course details from Redux state
    const role = useSelector((state) => state.user.role); // Getting user role from Redux state
    const [syllabus, setSyllabus] = useState(null); // State to hold the syllabus file URL
    const [newSyllabus, setNewSyllabus] = useState(null); // State for the new syllabus file to be uploaded
    const { courseId } = useParams(); // Extracting courseId from URL parameters
    const [status, setStatus] = useState(null); // State to hold the upload status (success/error)
    const [fileError, setFileError] = useState(null); // State to hold file upload error messages
    const [error, setError] = useState(null); // State to hold general error messages
    const fileInputRef = useRef(null); // Reference to the file input element for clearing the input after upload
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // State to check if the view is mobile

    // Function to fetch the syllabus from the server
    const fetchSyllabus = async () => {
        try {
            // Constructing the API URL based on user role
            const url = role === 'instructor'
                ? `${BASE_URL}/instructor/${courseId}/syllabus` // URL for instructor
                : `${BASE_URL}/employee/${courseId}/syllabus`; // URL for employee

            // Fetching the syllabus file from the server
            const response = await fetch(url, {
                method: "GET", // Setting the request method to GET
                headers: {
                    "Content-Type": "application/json", // Setting content type to JSON
                    "Authorization": `Bearer ${localStorage.getItem("token")}` // Adding authorization token from local storage
                },
                responseType: 'blob' // Important for handling binary files like PDFs
            });

            if (response.status === 200) { // Checking if the response is successful
                const file = await response.blob(); // Getting the file as a blob
                const fileUrl = URL.createObjectURL(file); // Creating a URL for the blob
                setSyllabus(fileUrl); // Setting the syllabus state with the blob URL
            } else {
                setError("Failed to fetch syllabus"); // Setting error message if fetching fails
            }
        } catch (error) {
            console.error("Error fetching syllabus:", error); // Logging error to console
            setError("Failed to fetch syllabus"); // Setting error message
        }
    };

    // useEffect hook to fetch syllabus and handle window resizing
    useEffect(() => {
        document.title = "Syllabus"; // Setting the document title
        fetchSyllabus(); // Fetching the syllabus when component mounts
        const handleResize = () => setIsMobile(window.innerWidth < 768); // Function to check if the view is mobile
        window.addEventListener("resize", handleResize); // Adding event listener for window resize
        return () => window.removeEventListener("resize", handleResize); // Cleanup function to remove event listener
    }, [courseId, role]); // Dependencies array to run effect when courseId or role changes

    // Function to handle syllabus file upload
    const handleUpload = async () => {
        if (!newSyllabus) { // Checking if a new syllabus file is selected
            setFileError('Please select a file to upload'); // Setting error message if no file is selected
            return; // Exiting the function
        }
        const formData = new FormData(); // Creating a FormData object to hold the file
        formData.append("file", newSyllabus); // Appending the selected file to the FormData

        try {
            // Making POST request to upload the syllabus
            const response = await fetch(`${BASE_URL}/instructor/uploadSyllabus/${course.id}`, {
                method: "POST", // Setting request method to POST
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}` // Adding authorization token
                },
                body: formData // Setting the body to the FormData object
            });

 if (response.ok) { // Checking if the response is successful
                setStatus('success'); // Setting status to success
                setNewSyllabus(null); // Resetting the new syllabus state
                setFileError(null); // Clearing any file error messages
                setError(null); // Clearing any general error messages
                fetchSyllabus(); // Fetching the syllabus again to update the view
                if (fileInputRef.current) { // Checking if the file input reference exists
                    fileInputRef.current.value = ''; // Clearing the file input
                }
            } else {
                setStatus('error'); // Setting status to error if upload fails
            }
        } catch (error) {
            console.error("Error uploading syllabus:", error); // Logging error to console
            setStatus('error'); // Setting status to error
        }
    };

    // Main return statement for the component
    return (
        <div className="flex flex-wrap justify-center px-4 py-4 md:px-16">
            <h1 className="text-2xl md:text-3xl font-bold text-center">Course Syllabus</h1> {/* Main title for the syllabus page */}
            <div className="hero place-items-start w-full my-5">
                <div className="w-full">
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className="w-full md:w-4/5">
                            <h1 className="text-lg md:text-xl font-bold">{course.title} - {course.name}</h1> {/* Course title and name */}
                            <h2 className="text-md md:text-lg font-bold">Instructor: {course.instructorName}</h2> {/* Instructor name */}
                            <p className="py-4 text-sm md:text-base">
                                {course.description} {/* Course description */}
                            </p>
                        </div>
                        {role === 'instructor' && ( // Conditional rendering for instructor role
                            <div className="form-control w-full md:w-64 mt-4 md:mt-0">
                                <label className="label">
                                    <span className="text-md md:text-xl">Upload Syllabus</span> {/* Label for file upload */}
                                </label>
                                <input
                                    type="file" accept="application/pdf" // Accepting only PDF files
                                    className="file-input file-input-bordered w-full max-w-xs mb-2"
                                    onChange={(e) => setNewSyllabus(e.target.files[0])} // Setting the new syllabus file on change
                                    ref={fileInputRef} // Setting the reference for the file input
                                />
                                {fileError && <p className="text-red-500 mb-2 text-sm">{fileError}</p>} {/* Displaying file error message */}
                                <button className="btn btn-neutral w-full md:w-auto" onClick={handleUpload}>Upload Syllabus</button> {/* Button to upload syllabus */}
                            </div>
                        )}
                    </div>
                    {!error && ( // Conditional rendering for showing syllabus button if no error
                        <button
                            className="btn py-1 mt-4 md:mt-0 w-full md:w-auto"
                            onClick={() => document.getElementById('syllabus').showModal()} // Opening the syllabus modal
                        >
                            Show Syllabus
                        </button>
                    )}
                    {(
                        <dialog id="syllabus" className="modal"> {/* Modal for displaying the syllabus */}
                            <div className="modal-box w-11/12 max-w-5xl">
                                <h3 className="font-bold text-lg text-center">Syllabus</h3> {/* Modal title */}
                                <form method="dialog" onSubmit={(e) => e.preventDefault()}> {/* Preventing default form submission */}
                                    <button type="button" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => document.getElementById('syllabus').close()}>✕</button> {/* Close button for modal */}
                                </form>
                                <div className="w-full content-center">
                                    <div className="mt-4">
                                        {isMobile ? ( // Conditional rendering for mobile view
                                            <a href={syllabus} download className="text-blue-500 underline">Download Syllabus</a> // Link to download syllabus
                                        ) : (
                                            <object
                                                data={syllabus} // Displaying the syllabus PDF
                                                type="application/pdf"
                                                className="w-full h-[75vh] sm:h-[60vh] md:h-[70vh] overflow-y-scroll"
                                                style={{
                                                    minHeight: '70vh',
                                                    height: '100%',
                                                    maxHeight : '100vh',
                                                    width: '100%'
                                                }}
                                            >
                                                
                                            </object>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </dialog>
                    )}
                </div>
            </div>

            {status === 'success' && ( // Conditional rendering for successful upload status
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-slate-700 p-4 md:p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                        <h3 className="font-bold text-lg text-white">Syllabus uploaded successfully!</h3> {/* Success message */}
                        <button className="btn btn-neutral mt-4 w-full md:w-auto" onClick={() => { setStatus(null); fetchSyllabus(); }}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            {error && ( // Conditional rendering for error state
                <div role="alert" className="alert alert-error my-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current"
                        fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Error! No Syllabus found.</span> {/* Error message */}
                </div>
            )}
        </div>
    );

}

// Exporting the Syllabus component for use in other parts of the application
export default Syllabus;