import React, { useEffect, useState } from 'react'; // Importing necessary hooks from React
import { useDispatch } from 'react-redux'; // Importing useDispatch for Redux state management
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation
import axios from 'axios'; // Importing axios for making HTTP requests
import { BASE_URL } from '../../utils/constants'; // Importing base URL for API requests

// Main component for viewing all available courses
const ViewAllCourses = () => {
  document.title = "All Courses"; // Set the document title to "All Courses"
  
  // State variables
  const [courses, setCourses] = useState([]); // State to hold the list of courses
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState(null); // State to hold error messages

  const navigate = useNavigate(); // Hook for programmatic navigation
  const dispatch = useDispatch(); // Hook for dispatching actions to Redux

  // Function to handle navigation to course details page
  const handleClick = (courseId) => {
    navigate(`/employee/course-details/${courseId}`); // Navigate to the course details page with the courseId
  };

  // useEffect hook to fetch all courses when the component mounts
  useEffect(() => {
    setLoading(true); // Set loading to true while fetching data
    // Making a GET request to fetch all courses
    const response = axios.get(`${BASE_URL}/employee/courses`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Set authorization header with token
      }
    });
    // Handling the response from the API
    response.then((res) => {
      setCourses(res.data); // Set the fetched courses in state
      setLoading(false); // Set loading to false after fetching
    }).catch((err) => {
      setError(err); // Set error if fetching fails
      setLoading(false);
    });
  }, [dispatch]); // Dependency array includes dispatch

  // Render loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" role="status" aria-live="polite">
        <span className="loading loading-dots loading-lg" aria-label="Loading"></span> {/* Loading spinner */}
      </div>
    );
  }

  // Render error message if there is an error
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center" role="alert">
        <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2> {/* Error title */}
        <p className="text-lg text-gray-600 mb-6">
          We encountered an error. Please try again later. {/* Error message */}
        </p>
        <button
          onClick={() => window.location.reload()} // Reload the page on button click
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
        >
          Reload Page {/* Reload button */}
        </button>
      </div>
    );
  }

  // Render message if no courses are available
  if (courses.length === 0) {
    return (
      <div>
        <button data-testid="myCoursesButton" className="btn btn-neutral ml-2 my-5" onClick={() => navigate('/employee')} aria-label="Go to My Courses">
          ⬅️ My Courses {/* Button to navigate back to My Courses */}
        </button>
        <h1 className='text-xl ml-2'>No courses are available at the moment.</h1> {/* Message for no courses */}
      </div>
    );
  }

  // Render the list of available courses
  return (
    <main className='my-2' role="main">
      <h1 className='text-2xl md:text-4xl font-bold text-center mb-2'>Available Courses</h1> {/* Page title */}
      <button data-testid="goToCourses" className="btn btn-neutral ml-2 btn-sm md:btn-md" onClick={() => navigate('/employee')} aria-label="Go to My Courses">
        ⬅️ My Courses {/* Button to navigate back to My Courses */}
      </button>
      <div className="flex flex-wrap justify-start my-8">
        {/* Mapping through the list of courses to display them */}
        {courses.map((course) => (
          <article key={course.id} className="card bg-base-100 w-96 shadow-xl m-2">
            <div className="card-body">
              <h2 className="card-title">{course.title}</h2> {/* Course title */}
              <p>{course.name}</p> {/* Course name */}
              <div className="card-actions justify-end">
                <button data-testid="viewCourseDetails" className="btn btn-primary" onClick={() => handleClick(course.id)} aria-label={`View details for ${course.title}`}>
                  View Course Details
                </button> {/* Button to navigate to course details */}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

// Exporting the ViewAllCourses component for use in other parts of the application
export default ViewAllCourses;