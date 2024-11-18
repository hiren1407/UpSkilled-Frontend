import axios from 'axios'; // Importing axios for making HTTP requests
import React, { useEffect, useState } from 'react'; // Importing necessary hooks from React
import { useNavigate, useParams } from 'react-router-dom'; // Importing hooks for routing
import { BASE_URL } from '../../utils/constants'; // Importing base URL for API requests

// Main component for displaying course details
const CourseDetails = () => {
    const { courseId } = useParams(); // Extracting course ID from URL parameters
    const [courseDetails, setCourseDetails] = useState(null); // State to hold course details
    const [syllabus, setSyllabus] = useState(null); // State to hold syllabus file URL
    const [loading, setLoading] = useState(true); // State for loading status
    const [enrollButtonContent, setEnrollButtonContent] = useState("Enroll"); // State for enroll button text
    const [isEnrolled, setIsEnrolled] = useState(false); // State to track enrollment status
    const [error, setError] = useState(null); // State to hold error messages
    const navigate = useNavigate(); // Hook for programmatic navigation
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // State to detect mobile view

    // useEffect hook to fetch course details and enrollment status
    useEffect(() => {
        setLoading(true); // Set loading to true while fetching data
        const fetchCourseDetails = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve token from local storage
                // Fetching enrollment status for the course
                const enrollmentStatus = await axios.get(`${BASE_URL}/employee/enrollment/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Set authorization header
                    }
                });
                // Fetching course details
                const response = await axios.get(`${BASE_URL}/employee/course/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Set authorization header
                    }
                });
                // Check if the user is enrolled in the course
                if (enrollmentStatus.data === "Enrolled") {
                    setIsEnrolled(true); // Update enrollment status
                    setEnrollButtonContent("Enrolled ✔️"); // Update button text
                }
                setLoading(false); // Set loading to false after fetching
                setCourseDetails(response.data); // Set course details in state
                document.title = "Course details - " + response.data.title; // Set document title
            } catch (error) {
                console.error('Error fetching course details:', error); // Log error to console
            }
        };

        fetchCourseDetails(); // Call the fetch function

        // Function to handle window resize for mobile detection
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize); // Add event listener for resize
        return () => window.removeEventListener("resize", handleResize); // Cleanup event listener on unmount
    }, [courseId, enrollButtonContent]); // Dependency array includes courseId and enrollButtonContent

    // Function to view the syllabus of the course
    const handleViewSyllabus = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve token from local storage
            // Fetching syllabus file from the API
            const response = await fetch(`${BASE_URL}/employee/${courseId}/syllabus`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Set authorization header
                }
            });
            if (response.status === 200) {
                const file = await response.blob(); // Get the file blob from response
                const fileUrl = URL.createObjectURL(file); // Create a URL for the blob
                document.getElementById('course-syllabus').showModal(); // Show modal for syllabus
                setSyllabus(fileUrl); // Set syllabus URL in state
            } else {
                setError("Failed to fetch syllabus"); // Set error message on failure
            }
        } catch (error) {
            console.error('Error fetching syllabus:', error); // Log error to console
        }
    };

    // Function to handle course enrollment
    const handleEnrollCourse = async (e) => {
        try {
            e.preventDefault(); // Prevent default form submission behavior
            const token = localStorage.getItem('token'); // Retrieve token from local storage
            // Sending POST request to enroll in the course
            const response = await fetch(`${BASE_URL}/employee/enroll?courseId=${courseId}`, {
                method: 'POST', // HTTP method for enrollment
                headers: {
                    'Authorization': `Bearer ${token}` // Set authorization header
                }
            });
            if (response.status === 200) {
                setEnrollButtonContent("Enrolled ✔️"); // Update button text on successful enrollment
            } else {
                setError('Failed to enroll in the course.'); // Set error message on failure
            }
        } catch (error) {
            console.error('Error enrolling in course:', error); // Log error to console
        }
    };

    // Render loading spinner while data is being fetched
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen" role="status" aria-live="polite">
                <span className="loading loading-dots loading-lg" aria-label="Loading"></span> {/* Loading spinner */}
            </div>
        );
    }

    // Render the course details
    return (
        <div className='mr-5'>
            <button className="btn btn-neutral ml-5 mt-5 btn-sm md:btn-md" onClick={() => navigate('/employee/all-courses')} aria-label="Back to all courses">⬅️ All courses</button>
            <div className="mx-5 my-5 p-6 max-w-full bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-2" tabIndex="0">{courseDetails.title}</h1> {/* Course title */}
                <h2 className="text-xl text-gray-700 mb-4" tabIndex="0">{courseDetails.name}</h2> {/* Course name */}
                <p className="text-gray-600 mb-4" tabIndex="0">{courseDetails.description}</p> {/* Course description */}
                <p className="text-gray-500 mb-6" tabIndex="0">Instructor: <span className="font-semibold">{courseDetails.instructorName}</span></p>

                <button
                    onClick={handleViewSyllabus} // Trigger view syllabus function
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mb-2 mr-2"
                    aria-label="View Syllabus"
                >
                    View Syllabus {/* Button to view syllabus */}
                </button>

                <button
                    type='button'
                    onClick={handleEnrollCourse} // Trigger enroll course function
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 mt-4"
                    disabled={isEnrolled} // Disable button if already enrolled
                    aria-label={enrollButtonContent}
                >
                    {enrollButtonContent} {/* Button text based on enrollment status */}
                </button>

                <dialog id="course-syllabus" className="modal" aria-labelledby="syllabus-title"> {/* Modal for syllabus display */}
                    <div className="modal-box w-11/12 max-w-5xl">
                        <h3 id="syllabus-title" className="font-bold text-lg text-center">Syllabus</h3> {/* Syllabus title */}
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Close">✕</button> {/* Close modal button */}
                        </form>
                        <div className="w-full content-center">
                            <div className="mt-4">
                                {isMobile ? (
                                    <a href={syllabus} download className="text-blue-500 underline">Download Syllabus</a> // Download link for mobile
                                ) : (
                                    <object
                                        data={syllabus} // Display syllabus PDF
                                        type="application/pdf"
                                        className="w-full h-[75vh] sm:h-[60vh] md:h-[70vh] overflow-y-scroll"
                                        style={{
                                            minHeight: '70vh',
                                            height: '100%',
                                            maxHeight: '100vh',
                                            width: '100%'
                                        }}
                                        aria-label="Syllabus PDF"
                                    >
                                    </object>
                                )}
                            </div>
                        </div>
                    </div>
                </dialog>
                {error && (
                    <div role="alert" className="alert alert-error my-4"> {/* Error alert */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current"
                            fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Error! No Syllabus found.</span> {/* Error message */}
                    </div>
                )}
            </div>
        </div>
    );
};

// Exporting the CourseDetails component for use in other parts of the application
export default CourseDetails;