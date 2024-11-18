import axios from 'axios'; // Importing axios for making HTTP requests
import React, { useEffect, useState } from 'react'; // Importing React and necessary hooks
import { useNavigate, useParams } from 'react-router-dom'; // Importing hooks for navigation and URL parameters
import { BASE_URL } from '../utils/constants'; // Importing base URL for API requests
import { useSelector } from 'react-redux'; // Importing useSelector to access Redux state

// Main component for the Course Dashboard
const CourseDashboard = () => {
    const { courseId } = useParams(); // Extracting course ID from URL parameters
    const [courseDetails, setCourseDetails] = useState(null); // State to hold course details
    const role = useSelector((state) => state.user.role); // Fetching user role from Redux store
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [showUnenrollModal, setShowUnenrollModal] = useState(false); // State to control the visibility of the unenroll modal
    const [error, setError] = useState(null); // State to hold error messages
    const navigate = useNavigate(); // Hook for programmatic navigation

    // useEffect hook to fetch course details when the component mounts
    useEffect(() => {
        setLoading(true); // Setting loading state to true
        const fetchCourseDetails = async () => { // Function to fetch course details
            const token = localStorage.getItem('token'); // Retrieving token from local storage
            if (role === "employee") { // Checking if the user is an employee
                try {
                    // Making GET request to fetch course details for employee
                    const response = await axios.get(`${BASE_URL}/employee/course/${courseId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}` // Setting authorization header
                        }
                    });

                    setLoading(false); // Setting loading state to false
                    setCourseDetails(response.data); // Setting state with fetched course details
                } catch (error) {
                    setLoading(false); // Setting loading state to false on error
                    setError(error.message); // Setting error message
                    console.error('Error fetching course details:', error); // Logging error to console
                }
            } else { // If the user is an instructor
                try {
                    // Making GET request to fetch course details for instructor
                    const response = await axios.get(`${BASE_URL}/instructor/course/${courseId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}` // Setting authorization header
                        }
                    });

                    setLoading(false); // Setting loading state to false
                    setCourseDetails(response.data); // Setting state with fetched course details
                    document.title = `${response.data.title} - Dashboard`; // Setting document title
                } catch (error) {
                    console.error('Error fetching course details:', error); // Logging error to console
                }
            }
        };
        fetchCourseDetails(); // Calling the function to fetch course details
    }, [courseId, role]); // Dependencies array to run effect when courseId or role changes

    // Function to handle unenrollment from the course
    const handleUnenroll = async () => {
        const token = localStorage.getItem('token'); // Retrieving token from local storage
        try {
            // Making POST request to unenroll from the course
            const response = await fetch(`${BASE_URL}/employee/unenroll/${courseId}`, {
                method: "POST", // Setting request method to POST
                headers: {
                    'Authorization': `Bearer ${token}` // Setting authorization header
                }
            });
            
            if (response.status === 200) { // Checking if the response is successful
                navigate('/employee'); // Navigating to the employee dashboard
            }
        } catch (error) {
            console.error('Error unenrolling:', error); // Logging error to console
        }
    };

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
                <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2> {/* Error message title */}
                <p className="text-lg text-gray-600 mb-6">
                    We encountered an error. Please try again later. {/* Error message description */}
                </ p>
                <button
                    onClick={() => window.location.reload()} // Button to reload the page
                    className="px-6 py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
                >
                    Reload Page
                </button>
            </div>
        );
    }

    // Main return statement for the component
    return (
        <div className='mr-5'>
            <div className="mx-5 my-5 p-6 max-w-full bg-white rounded-lg shadow-md"> {/* Container for course details */}
                <h1 className="text-3xl font-bold mb-2">{courseDetails.title}</h1> {/* Course title */}
                <h2 className="text-xl text-gray-700 mb-4">{courseDetails.name}</h2> {/* Course name */}
                <p className="text-gray-600 mb-4">{courseDetails.description}</p> {/* Course description */}
                <p className="text-gray-500 mb-6">Instructor: <span className="font-semibold">{courseDetails.instructorName}</span></p> {/* Instructor name */}

                <button type="button" onClick={(e) => {
                        e.preventDefault(); // Preventing default button behavior
                        navigate('syllabus'); // Navigating to syllabus page
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mb-2 mr-2"
                >
                    View Syllabus
                </button>

                <button onClick={() => navigate('modules')} // Button to view course materials
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 mt-4 mr-2"
                >
                    View Course Material
                </button>

                {role === "employee" && ( // Conditional rendering for employee role
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 mt-4"
                        onClick={() => setShowUnenrollModal(true)} // Opening unenroll modal
                    >
                        Unenroll
                    </button>
                )}

                {showUnenrollModal && ( // Conditional rendering for unenroll confirmation modal
                    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                            <h3 className="font-bold text-lg">You will lose all submission and grade related data. Do you want to continue?</h3> {/* Warning message */}
                            <button className="btn m-4" onClick={handleUnenroll}>Yes</button> {/* Confirm unenroll button */}
                            <button className="btn m-4" onClick={() => setShowUnenrollModal(false)}>No</button> {/* Cancel button */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Exporting the CourseDashboard component for use in other parts of the application
export default CourseDashboard;