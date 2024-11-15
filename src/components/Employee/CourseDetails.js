import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Assuming you're using react-router for routing
import { BASE_URL } from '../../utils/constants';

const CourseDetails = () => {
    const { courseId } = useParams(); // Get course ID from URL parameters
    const [courseDetails, setCourseDetails] = useState(null);
    const [syllabus, setSyllabus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrollButtonContent, setEnrollButtonContent] = useState("Enroll")
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        setLoading(true);
        const fetchCourseDetails = async () => {
            try {
                const token = localStorage.getItem('token')
                const enrollmentStatus = await axios.get(`${BASE_URL}/employee/enrollment/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const response = await axios.get(`${BASE_URL}/employee/course/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }); // Replace with your API endpoint
                if (enrollmentStatus.data == "Enrolled") {
                    setIsEnrolled(true)
                    setEnrollButtonContent("Enrolled ✔️")
                }
                setLoading(false);
                setCourseDetails(response.data);
                document.title="Course details - "+response.data.title
            } catch (error) {
                console.error('Error fetching course details:', error);
            }
        };

        fetchCourseDetails();
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [courseId, enrollButtonContent]);

    const handleViewSyllabus = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${BASE_URL}/employee/${courseId}/syllabus`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }); // Replace with your API endpoint
            if (response.status === 200) {
                const file = await response.blob();
                const fileUrl = URL.createObjectURL(file);
                document.getElementById('course-syllabus').showModal()
                setSyllabus(fileUrl);
            } else {
                setError("Failed to fetch syllabus");
            }
        } catch (error) {
            console.error('Error fetching syllabus:', error);
        }
    };

    const handleEnrollCourse = async (e) => {
        try {
            e.preventDefault()
            const token = localStorage.getItem('token')
            const response = await fetch(`${BASE_URL}/employee/enroll?courseId=${courseId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }); // Replace with your API endpoint
            if (response.status === 200) {
                setEnrollButtonContent("Enrolled ✔️")
            } else {
                alert('Failed to enroll in the course.');
            }
        } catch (error) {
            console.error('Error enrolling in course:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-dots loading-lg"></span>
            </div>
        );
    }

    return (
        <div className='mr-5'>
            
            <button className="btn btn-neutral ml-5 mt-5 btn-sm md:btn-md" onClick={() => navigate('/employee/all-courses')}>⬅️ All courses</button>
            <div className=" mx-5 my-5 p-6  max-w-full bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-2">{courseDetails.title}</h1>
                <h2 className="text-xl text-gray-700 mb-4">{courseDetails.name}</h2>
                <p className="text-gray-600 mb-4">{courseDetails.description}</p>
                <p className="text-gray-500 mb-6">Instructor: <span className="font-semibold">{courseDetails.instructorName}</span></p>

                <button
                    onClick={handleViewSyllabus}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 mb-2 mr-2"

                >
                    View Syllabus
                </button>

                <button
                    type='button'
                    onClick={handleEnrollCourse}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 mt-4"
                    disabled={isEnrolled}
                >
                    {enrollButtonContent}
                </button>

                <dialog id="course-syllabus" className="modal">
                    <div className="modal-box w-11/12 max-w-5xl">
                        <h3 className="font-bold text-lg text-center">Syllabus</h3>
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <div className="w-full content-center">
                        <div className="mt-4">
                                    {isMobile ? (
                                        <a href={syllabus} download className="text-blue-500 underline">Download Syllabus</a>
                                    ) : (
                                        <object
                                            data={syllabus}
                                            type="application/pdf"
                                            className="w-full h-[75vh] sm:h-[60vh] md:h-[70vh] overflow-y-scroll"
                                            style={{
                                                minHeight: '70vh',
                                                height: '100%',
                                                maxHeight: '100vh',
                                                width: '100%'
                                            }}
                                        >
                                            
                                        </object>
                                    )}
                                    </div>
                        </div>
                    </div>
                </dialog>
                {error &&
                    (
                        <div role="alert" className="alert alert-error my-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current"
                                fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Error! No Syllabus found.</span>
                        </div>
                    )
                }
            </div>

        </div>
    );
};

export default CourseDetails;