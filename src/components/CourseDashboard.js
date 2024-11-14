import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Assuming you're using react-router for routing
import { BASE_URL } from '../utils/constants';
import { useSelector } from 'react-redux';


const CourseDashboard = () => {
    const { courseId } = useParams(); // Get course ID from URL parameters
    const [courseDetails, setCourseDetails] = useState(null);
    const role = useSelector((state) => state.user.role)
    const [loading, setLoading] = useState(true);
    const [showUnenrollModal, setShowUnenrollModal] = useState(false);
    
    
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchCourseDetails = async () => {
            const token = localStorage.getItem('token')
            if (role === "employee") {
                try {
                    const response = await axios.get(`${BASE_URL}/employee/course/${courseId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }); // Replace with your API endpoint

                    setLoading(false);
                    setCourseDetails(response.data);
                } catch (error) {
                    setLoading(false);
                    setError(error.message);
                    console.error('Error fetching course details:', error);
                }
            }
            else {
                try {
                    const response = await axios.get(`${BASE_URL}/instructor/course/${courseId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }); // Replace with your API endpoint

                    setLoading(false);
                    setCourseDetails(response.data);
                    document.title = `${response.data.title} - Dashboard`;
                } catch (error) {
                    console.error('Error fetching course details:', error);
                }
            }
        };
        fetchCourseDetails();
    }, [courseId]);

    const handleUnenroll = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`${BASE_URL}/employee/unenroll/${courseId}`, {
                method: "POST",
                headers: {
                    
                    'Authorization': `Bearer ${token}`
                }
            }); // Replace with your API endpoint
            
            if(response.status==200){
            navigate('/employee')
            }
        } catch (error) {
            console.error('Error unenrolling:', error)
    }
}
   
    

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

    return (
        <div className='mr-5'>
            <div className=" mx-5 my-5 p-6  max-w-full bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-2">{courseDetails.title}</h1>
                <h2 className="text-xl text-gray-700 mb-4">{courseDetails.name}</h2>
                <p className="text-gray-600 mb-4">{courseDetails.description}</p>
                <p className="text-gray-500 mb-6">Instructor: <span className="font-semibold">{courseDetails.instructorName}</span></p>

                <button type="button" onClick={(e) => {
                        e.preventDefault()
                        navigate('syllabus')
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mb-2 mr-2"
                >
                    View Syllabus
                </button>



                <button
                    
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 mt-4 mr-2"
                   
                >
                    View Course Material
                </button>
                {role=="employee"?<button
                    
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200 mt-4"
                    onClick={() => setShowUnenrollModal(true)}
                   
                >
                    Unenroll
                </button>:<></>}
                {showUnenrollModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                        <h3 className="font-bold text-lg">You will lose all submission and grade related data. Do you want to continue?</h3>
                        <button className="btn m-4" onClick={handleUnenroll}>Yes</button>
                        <button className="btn m-4" onClick={() => setShowUnenrollModal(false)}>
                            No
                        </button>
                    </div>
                </div>
            )}

               
               
            </div>
        </div>
    );
};

export default CourseDashboard;