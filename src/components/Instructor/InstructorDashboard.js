import React, { useEffect, useState } from 'react'; // Importing necessary hooks from React
import { useDispatch } from 'react-redux'; // Importing useDispatch for Redux state management
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation
import axios from 'axios'; // Importing axios for making HTTP requests
import { BASE_URL } from '../../utils/constants'; // Importing base URL for API requests
import { fetchCourseDetails } from '../../utils/courseSlice'; // Importing action to fetch course details

// Main component for the Instructor Dashboard
const InstructorDashboard = () => {
  document.title = "Instructor Dashboard"; // Setting the document title for the dashboard
  const [courses, setCourses] = useState([]); // State to hold the list of courses
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState(null); // State to hold error messages

  const navigate = useNavigate(); // Hook for programmatic navigation
  const dispatch = useDispatch(); // Hook to access the Redux dispatch function

  // Function to handle click on a course card
  const handleClick = (courseId) => {
    dispatch(fetchCourseDetails({ courseId })); // Dispatching action to fetch course details
    navigate(`/instructor/course/${courseId}`); // Navigating to the course details page
  };

  // useEffect hook to fetch courses when the component mounts
  useEffect(() => {
    setLoading(true); // Setting loading to true before fetching
    const response = axios.get(`${BASE_URL}/instructor/courses`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Setting authorization header with token
      }
    });

    // Handling the response after fetching courses
    response.then((res) => {
      setCourses(res.data); // Setting the courses in state
    }).catch((err) => {
      setError(err); // Setting error if fetching fails
    }).finally(() => {
      setLoading(false); // Setting loading to false after fetching completes
    });
  }, [dispatch]); // Dependency array to run effect only once on mount

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

  // Render the component with the list of courses
  return (
    <div className='my-2'>
      <h1 className='text-2xl md:text-4xl font-bold text-center'>Dashboard</h1> {/* Dashboard title */}
      <div className="flex flex-wrap justify-start my-8">
        {courses.map((course) => ( // Mapping through courses to render each course card
          <div key={course.id} className="card bg-base-100 w-96 shadow-xl m-2"> {/* Course card */}
            <div className="card-body">
              <h2 className="card-title">{course.title}</h2> {/* Course title */}
              <p>{course.name}</p> {/* Course name */}
              <div className="card-actions justify-end">
                <button className="btn btn-primary" onClick={() => handleClick(course.id)}>Go to Course</button> {/* Button to navigate to course details */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Exporting the InstructorDashboard component for use in other parts of the application
export default InstructorDashboard;