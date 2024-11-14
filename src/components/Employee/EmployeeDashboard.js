import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';

const EmployeeDashboard = () => {
  document.title = "Employee Dashboard";
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = (courseId) => {
    navigate(`/employee/course/${courseId}`);
  }

  useEffect(() => {
    setLoading(true);
    const response = axios.get(`${BASE_URL}/employee/enrolledCourses`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    response.then((res) => {
      setCourses(res.data);
      setLoading(false);
    }).catch((err) => {
      setError(err);
    });
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2>
        <p className="text-lg text-gray-600 mb-6">
          We encountered an error. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (<div><button className="btn btn-neutral ml-2 my-5" onClick={() => navigate('/employee/all-courses')}>Enroll in a new course</button><h1 className='text-xl ml-2'>You haven't enrolled in any courses yet.</h1></div>)
  }

  return (
    <div>
      <h1 className='text-5xl text-center'>My Courses</h1>
      <button className="btn btn-neutral ml-2" onClick={() => navigate('/employee/all-courses')}>Enroll in a new course</button>
      <div className="flex flex-wrap justify-start my-8">
        {courses.map((course) => (
          <div key={course.id} className="card bg-base-100 w-96 shadow-xl m-2">
            <div className="card-body">
              <h2 className="card-title">{course.title}</h2>
              <p>{course.name}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary" onClick={() => handleClick(course.id)}>Go to Course</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EmployeeDashboard