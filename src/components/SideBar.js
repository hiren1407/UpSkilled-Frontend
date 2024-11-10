import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faUsersCog, faBook, faBullhorn, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { fetchCourseDetails } from '../utils/courseSlice';

const SideBar = () => {

    const role = useSelector((store) => store.user.role);
    const { courseId } = useParams();
    const location = useLocation(); // Get the current location
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCourseDetails({ courseId }));
    }, [dispatch, courseId]);

    const adminItems = [
        { path: "/admin/manage-instructors", label: "Manage Instructors", icon: faUsersCog },
        { path: "/admin/manage-courses", label: "Manage Courses", icon: faBook },
    ];

    const employeeItems = [
        { path: `/employee/${courseId}`, label: "Dashboard", icon: faChalkboardTeacher },
        { path: "/tasks", label: "My Tasks", icon: faTasks },
    ];

    const instructorItems = [
        { path: `/instructor/course/${courseId}`, label: "Dashboard", icon: faChalkboardTeacher },
        { path: `/instructor/course/${courseId}/announcements`, label: "Announcements", icon: faBullhorn },
        { path: `/instructor/course/${courseId}/assignments`, label: "Assignments", icon: faTasks },

        { path: `/instructor/course/${courseId}/syllabus`, label: "Syllabus", icon: faBook },
    ];

    // Determine which items to display based on role
    let itemsToDisplay = [];
    if (role === 'admin') {
        itemsToDisplay = adminItems;
    } else if (role === 'employee') {
        itemsToDisplay = employeeItems;
    } else if (role === 'instructor') {
        itemsToDisplay = instructorItems;
    }

    return (
        <div className='flex flex-col min-h-screen'>
            <div className='flex flex-grow'>
                <div className="fixed flex flex-col top-12 left-0 w-14 hover:w-64 md:w-64 bg-neutral text-neutral-content h-full transition-all duration-300 border-none z-10 sidebar">
                    <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
                        <ul className="flex flex-col py-4 space-y-1">
                            {itemsToDisplay.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        to={item.path}
                                        className={`relative flex flex-row items-center h-11 focus:outline-none hover:bg-cyan-500 border-l-4 border-transparent ${location.pathname === item.path ? 'bg-cyan-500 text-white' : ''}`}
                                    >
                                        <span className="inline-flex justify-center items-center ml-4">
                                            <FontAwesomeIcon icon={item.icon} />
                                        </span>
                                        <span className="ml-2 text-sm tracking-wide truncate">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                    </div>
                </div>
                <div className='flex-grow ml-14 md:ml-64 mt-16'>
                    {/* Additional content can go here */}
                </div>
            </div>
        </div>
    );
}

export default SideBar;