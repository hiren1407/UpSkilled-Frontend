import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../../utils/constants';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ManageCourses = () => {

    const [courses, setCourses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [flag, setFlag] = useState(false)
    const [courseTitle, setCourseTitle] = useState('');
    const [courseName, setCourseName] = useState('')
    const [instructorName, setInstructorName] = useState('');
    const [selectedInstructor, setSelectedInstructor] = useState('');
    const [description, setDescription] = useState('');
    const [currentCourseId, setCurrentCourseId] = useState(null); // To track the course being edited
    const [isEditing, setIsEditing] = useState(false); // To track if we are editing

    const fetchInstructors = async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/admin/listActiveInstructors`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setInstructors(response.data); // Assuming response.data is an array of instructors
    };


    const fetchCourses = async () => {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}/admin/courses`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }, { withCredentials: true });
        setCourses(response.data)
        // Assuming the response data is an array of instructors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        
        const token = localStorage.getItem('token');
        const newCourse = {
            "title": courseTitle,
            "instructorId": selectedInstructor,
            "description": description,
            "name": courseName
        };

        if (isEditing) {
            // Update existing course
            await fetch(`${BASE_URL}/admin/updateCourseDetails/${currentCourseId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCourse)
            });
        } else {
            // Create new course
            await fetch(`${BASE_URL}/admin/createCourse`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCourse)
            });
        }

        // Clear form fields
        setCourseTitle('');
        setCourseName('');
        setInstructorName('');
        setDescription('');
        setFlag(!flag); // Trigger re-fetching of courses
        document.getElementById('my_modal_5').close(); // Close modal after submission
    };

    const handleEdit = async (course) => {
        await fetchInstructors();
        setCourseTitle(course.title);
        setCourseName(course.name);
        setSelectedInstructor(course.instructorId);
        setDescription(course.description);
        setCurrentCourseId(course.id);
        setIsEditing(true);
        document.getElementById('my_modal_5').showModal();
    };

    const handleDelete = async (courseId) => {
        const token = localStorage.getItem('token');
        await fetch(`${BASE_URL}/admin/course/inactivate/${courseId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setFlag(!flag); // Trigger re-fetching of courses
    };

    useEffect(() => {
        fetchCourses()

    }, [flag])

    const openModal = async () => {
        setIsEditing(false)
        setSelectedInstructor('')
        await fetchInstructors(); // Fetch instructors when opening the modal
        document.getElementById('my_modal_5').showModal(); // Show the modal
    };

    return (
        <div className=''>
            <h1 className='flex text-3xl font-bold justify-center my-10'>Manage Courses</h1>

            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <button className="btn btn-primary my-5 ml-2" onClick={openModal}>Add Course</button>
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Add a New Course</h3>
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                    <form className="py-4">
                        <div>
                            <label className="label">Course Title:</label>
                            <input
                                type="text"
                                value={courseTitle}
                                onChange={(e) => setCourseTitle(e.target.value)}
                                required
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div>
                            <label className="label">Course Name:</label>
                            <input
                                type="text"
                                value={courseName}
                                onChange={(e) => setCourseName(e.target.value)}
                                required
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="mt-2">
                            <label className="label">Instructor Name:</label>
                            <select
                                value={selectedInstructor}
                                onChange={(e) => setSelectedInstructor(e.target.value)}
                                required
                                className="select select-bordered w-full"
                            >
                                <option value="" disabled>Select an instructor</option>
                                {instructors.map(instructor => (
                                    <option key={instructor.id} value={instructor.id}>{instructor.firstName + " " + instructor.lastName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-2">
                            <label className="label">Description:</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="textarea textarea-bordered w-full"
                            ></textarea>
                        </div>
                        <div className="modal-action">
                        <button type="submit" className="btn" onClick={(e)=>handleSubmit(e)}>{isEditing ? 'Update' : 'Create'}</button>
                        
                    </div>
                    </form>
                </div>
            </dialog>

            {courses.map((data) => (
                <div key={data.id} className="collapse collapse-plus bg-base-200 my-2 mx-2">
                    <input type="radio" name="my-accordion-3" defaultChecked />
                    <div className="collapse-title text-xl font-medium flex justify-between">
                        <span>{data.title} - {data.name}</span>
                        <span className="ml-4 textarea-sm">{data.instructorName}</span> {/* Display instructor name here */}
                    </div>
                    <div className="collapse-content">
                        <p>{data.description}</p>
                        <button className="btn btn-warning mt-2" onClick={() => handleEdit(data)}>
                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                </button>
                                <button className="btn btn-danger mt-2" onClick={() => handleDelete(data.id)}>
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </button>

                    </div>
                </div>




            ))}




        </div>
    );
}

export default ManageCourses