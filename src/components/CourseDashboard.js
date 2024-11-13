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
    
    
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchCourseDetails = async () => {
            const token = localStorage.getItem('token')
            if(role=="employee"){
            try {
                
                
                const response = await axios.get(`${BASE_URL}/employee/course/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }); // Replace with your API endpoint
               
                setLoading(false);
                setCourseDetails(response.data);
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        }
        else{
            try {
                
                
                const response = await axios.get(`${BASE_URL}/instructor/course/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }); // Replace with your API endpoint
               
                setLoading(false);
                setCourseDetails(response.data);
            } catch (error) {
                console.error('Error fetching course details:', error);
            }

        }
        };

        fetchCourseDetails();
    }, [courseId]);

   
    

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-dots loading-lg"></span>
            </div>
        );
    }

    if (!courseDetails) {
        return <div>No course details found.</div>;
    }

    return (
        <div className='mr-5'>
            
            <div className=" mx-5 my-5 p-6  max-w-full bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-2">{courseDetails.title}</h1>
                <h2 className="text-xl text-gray-700 mb-4">{courseDetails.name}</h2>
                <p className="text-gray-600 mb-4">{courseDetails.description}</p>
                <p className="text-gray-500 mb-6">Instructor: <span className="font-semibold">{courseDetails.instructorName}</span></p>

                <button
                    type="button"
                    onClick={(e)=>{e.preventDefault()
                        navigate('syllabus')}}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mb-2 mr-2"

                >
                    View Syllabus
                </button>



                <button
                    
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 mt-4"
                   
                >
                    View Course Material
                </button>

               
               
            </div>

        </div>
    );
};

export default CourseDashboard;