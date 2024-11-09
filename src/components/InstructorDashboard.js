import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const InstructorDashboard = () => {
  document.title = "Instructor Dashboard";
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClick = (courseId) => {
    navigate(`/instructor/course/${courseId}`);
  }

  useEffect(() => {
    setLoading(true);
    const response = axios.get(`${BASE_URL}/instructor/courses`, {
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

  return (
    <div>
      <h1 className='text-5xl text-center'>Instructor Dashboard</h1>
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

export default InstructorDashboard