import React, { useEffect, useState } from 'react'; // Importing necessary hooks from React
import { BASE_URL } from '../../utils/constants'; // Importing base URL for API requests
import axios from 'axios'; // Importing axios for making HTTP requests
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importing FontAwesomeIcon for icons
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'; // Importing specific icons

// Main component for managing courses
const ManageCourses = () => {
    // State variables for managing courses and related data
    const [courses, setCourses] = useState([]); // State to hold the list of courses
    const [instructors, setInstructors] = useState([]); // State to hold the list of instructors
    const [flag, setFlag] = useState(false); // State to trigger re-fetching of courses
    const [courseTitle, setCourseTitle] = useState(''); // State for course title input
    const [courseName, setCourseName] = useState(''); // State for course name input
    const [instructorName, setInstructorName] = useState(''); // State for instructor name
    const [selectedInstructor, setSelectedInstructor] = useState(''); // State for selected instructor
    const [description, setDescription] = useState(''); // State for course description input
    const [currentCourseId, setCurrentCourseId] = useState(null); // State to track the currently edited course ID
    const [isEditing, setIsEditing] = useState(false); // State to track if we are in editing mode
    const [error, setError] = useState(''); // State to hold error messages
    const [courseId, setCourseId] = useState(null); // State to hold the ID of the course to be deleted

    // Function to fetch active instructors from the API
    const fetchInstructors = async () => {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        try {
            const response = await axios.get(`${BASE_URL}/admin/listActiveInstructors`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Set authorization header with token
                }
            });
            setInstructors(response.data); // Update instructors state with fetched data
        } catch (err) {
            setError('Failed to fetch instructors.'); // Set error message on failure
        }
    };

    // Function to fetch courses from the API
    const fetchCourses = async () => {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        try {
            const response = await axios.get(`${BASE_URL}/admin/courses`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Set authorization header with token
                }
            });
            setCourses(response.data); // Update courses state with fetched data
        } catch (err) {
            setError('Failed to fetch courses.'); // Set error message on failure
        }
    };

    // Function to handle form submission for creating or updating a course
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        const newCourse = {
            "title": courseTitle, // Course title
            "instructorId": selectedInstructor, // Selected instructor ID
            "description": description, // Course description
            "name": courseName // Course name
        };

        try {
            if (isEditing) {
                // If in editing mode, update the existing course
                const response = await fetch(`${BASE_URL}/admin/updateCourseDetails/${currentCourseId}`, {
                    method: 'PUT', // HTTP method for updating
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' // Set content type to JSON
                    },
                    body: JSON.stringify(newCourse) // Convert new course data to JSON
                });
                if (response.status !== 200) {
                    setError('Failed to update course. Please try again.'); // Set error message on failure
                }
            } else {
                // If not editing, create a new course
                const response = await fetch(`${BASE_URL}/admin/createCourse`, {
                    method: 'POST', // HTTP method for creating
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' // Set content type to JSON
                    },
                    body: JSON.stringify(newCourse) // Convert new course data to JSON
                });
                if (response.status !== 200) {
                    setError('Failed to save course. Please try again.'); // Set error message on failure
                }
            }

            // Clear form fields after submission
            setCourseTitle('');
            setCourseName('');
            setSelectedInstructor('');
            setDescription('');
            setFlag(!flag); // Toggle flag to trigger re-fetching of courses
            document.getElementById('my_modal_5').close(); // Close the modal
            setError(''); // Clear any previous errors
        } catch (err) {
            setError('Failed to save course. Please try again.'); // Set error message on failure
        }
    };

    // Function to handle editing a course
    const handleEdit = async (course) => {
        await fetchInstructors(); // Fetch instructors before opening the modal
        setCourseTitle(course.title); // Set course title for editing
        setCourseName(course.name); // Set course name for editing
        setSelectedInstructor(course.instructorId); // Set selected instructor for editing
        setDescription(course.description); // Set course description for editing
        setCurrentCourseId(course.id); // Set current course ID for editing
        setIsEditing(true); // Set editing mode to true
        document.getElementById('my_modal_5').showModal(); // Show the modal for editing
    };

    // Function to handle course deletion
    const handleDelete = async () => {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        try {
            const response = await fetch(`${BASE_URL}/admin/course/inactivate/${courseId}`, {
                method: 'POST', // HTTP method for deleting
                headers: {
                    'Authorization': `Bearer ${token}` // Set authorization header with token
                }
            });
            if (response.status === 200) {
                setFlag(!flag); // Toggle flag to trigger re-fetching of courses
                setError(''); // Clear any previous errors
                document.getElementById('deleteCourse').close(); // Close the delete confirmation modal
            } // Clear any previous errors
        } catch (err) {
            setError('Failed to delete course. Please try again.'); // Set error message on failure
        }
    };

    // useEffect hook to fetch courses when the component mounts or when the flag changes
    useEffect(() => {
        fetchCourses(); // Fetch courses from the API
    }, [flag]);

    // Function to open the modal for adding a new course
    // Function to open the modal for adding a new course
    const openModal = async () => {
        setIsEditing(false); // Set editing mode to false
        setSelectedInstructor(''); // Clear selected instructor
        await fetchInstructors(); // Fetch instructors when opening the modal
        document.getElementById('my_modal_5').showModal(); // Show the modal
    };

    return (
        <div className='my-2'>
            <h1 className='flex text-2xl md:text-4xl font-bold justify-center my-2'>Manage Courses</h1>

            {/* Display error message if there is an error */}
            {error && <div className="error-message" role="alert">{error}</div>}
            <button className="btn btn-primary ml-2 btn-sm md:btn-md" onClick={openModal}>Add Course</button>
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle" aria-labelledby="modal-title" aria-describedby="modal-description">
                <div className="modal-box">
                    <h3 id="modal-title" data-testid="addCourseModalHeading" className="font-bold text-lg">Add a New Course</h3>
                    <form method="dialog">
                        {/* Close button for the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Close">✕</button>
                    </form>
                    <form className="py-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="label" htmlFor="courseTitle">Course Title:</label>
                            <input
                                id="courseTitle"
                            data-testid="courseTitleInput"
                                type="text"
                                value={courseTitle} // Bind input value to courseTitle state
                                onChange={(e) => setCourseTitle(e.target.value)} // Update state on input change
                                required
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div>
                            <label className="label" htmlFor="courseName">Course Name:</label>
                            <input
                                id="courseName"
                            data-testid="courseNameInput"
                                type="text"
                                value={courseName} // Bind input value to courseName state
                                onChange={(e) => setCourseName(e.target.value)} // Update state on input change
                                required
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="mt-2">
                            <label className="label" htmlFor="selectedInstructor">Instructor Name:</label>
                            <select
                                id="selectedInstructor"
                             data-testid="instructorSelect"
                                value={selectedInstructor} // Bind select value to selectedInstructor state
                                onChange={(e) => setSelectedInstructor(e.target.value)} // Update state on select change
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
                            <label className="label" htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                            data-testid="descriptionInput"
                                value={description} // Bind textarea value to description state
                                onChange={(e) => setDescription(e.target.value)} // Update state on textarea change
                                required
                                className="textarea textarea-bordered w-full"
                            ></textarea>
                        </div>
                        <div className="modal-action">
                            <button data-testid="updateButton" type="submit" className="btn">{isEditing ? 'Update' : 'Create'}</button>
                        </div>
                    </form>
                </div>
            </dialog>

            {/* Display list of courses */}
            {courses.map((data) => (
                <div key={data.id} className="collapse collapse-plus bg-base-200 my-2 mx-2">
                    <input type="radio" name="my-accordion-3" defaultChecked />
                    <div className="collapse-title text-xl font-medium flex justify-between">
                        <span>{data.title} - {data.name}</span>
                        <span className="ml-4 textarea-sm">{data.instructorName}</span> {/* Display instructor name here */}
                    </div>
                    <div className="collapse-content">
                        <p>{data.description}</p>
                        <div className="flex justify-end mt-2">
                            <button data-testid="editButton" className="btn btn-warning mt-2 mx-1 btn-sm md:btn-md" onClick={() => handleEdit(data)} aria-label={`Edit ${data.title}`}>
                                <FontAwesomeIcon icon={faEdit} /> Edit
                            </button>
                            <button data-testid="deleteCourseButton" className="btn btn-danger mt-2 btn-sm md:btn-md" onClick={() => { setCourseId(data.id); document.getElementById('deleteCourse').showModal() }} aria-label={`Delete ${data.title}`}>
                                <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Delete course modal */}
            <dialog id="deleteCourse" className="modal modal-bottom sm:modal-middle" aria-labelledby="delete-modal-title" aria-describedby="delete-modal-description">
                <div className="modal-box">
                    <h3 id="delete-modal-title" className="font-bold text-lg">Delete course</h3>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Close">✕</button>
                    </form>
                    <div id="delete-modal-description" className="modal-body">
                        <p>Are you sure you want to delete this course?</p>
                        <div className="flex justify-between mt-4">
                            <button data-testid="deleteButton" className="btn btn-danger" onClick={() => handleDelete()}>Delete</button>
                            <button className="btn btn-primary" onClick={() => document.getElementById('deleteCourse').close()}>Cancel</button>
                        </div>
                    </div>
                </div>
            </dialog>
        </div>
    );
}

// Exporting the ManageCourses component for use in other parts of the application
export default ManageCourses;