import React, { useEffect, useState } from 'react'; // Importing necessary hooks from React
import { useDispatch } from 'react-redux'; // Importing useDispatch for Redux state management
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation
import axios from 'axios'; // Importing axios for making HTTP requests
import { BASE_URL } from '../../utils/constants'; // Importing base URL for API requests

// Main component for the Employee Dashboard
const EmployeeDashboard = () => {
  document.title = "Employee Dashboard"; // Set the document title for the dashboard
  const [courses, setCourses] = useState([]); // State to hold the list of courses
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState(null); // State to hold error messages

  const navigate = useNavigate(); // Hook for programmatic navigation
  const dispatch = useDispatch(); // Hook for dispatching actions to Redux

  // Function to handle navigation to the course details
  const handleClick = (courseId) => {
    navigate(`/employee/course/${courseId}`); // Navigate to the course details page
  };

  // useEffect hook to fetch enrolled courses when the component mounts
  useEffect(() => {
    setLoading(true); // Set loading to true while fetching data
    // Making a GET request to fetch enrolled courses
    const response = axios.get(`${BASE_URL}/employee/enrolledCourses`, {
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
    });
  }, [dispatch]); // Dependency array includes dispatch

  // Render loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-dots loading-lg"></span> {/* Loading spinner */}
      </div>
    );
  }

  // Render error message if there is an error
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
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

  // Render message if no courses are enrolled
  if (courses.length === 0) {
    return (
      <div>
        <button className="btn btn-neutral ml-2 my-5" onClick={() => navigate('/employee/all-courses')}>
          Enroll in a new course {/* Button to navigate to all courses */}
        </button>
        <h1 className='text-xl ml-2'>You haven't enrolled in any courses yet.</h1> {/* Message for no courses */}
      </div>
    );
  }

  // Render the list of enrolled courses
  return (
    <div className='my-2'>
      <h1 className='text-2xl md:text-4xl font-bold text-center mb-2'>My Courses</h1> {/* Dashboard title */}
      <button className="btn btn-neutral ml-2 btn-sm md:btn-md" onClick={() => navigate('/employee/all-courses')}>
        Enroll in a new course {/* Button to navigate to all courses */}
      </button>
      <div className="flex flex-wrap justify-start my-8">
        {/* Mapping through the list of courses to display them */}
        {courses.map((course) => (
          <div key={course.id} className="card bg-base-100 w-96 shadow-xl m-2">
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
};

// Exporting the EmployeeDashboard component for use in other parts of the application
export default EmployeeDashboard;