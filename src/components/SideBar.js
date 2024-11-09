import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { fetchCourseDetails } from '../utils/courseSlice';

const SideBar = () => {

    const role = useSelector((store) => store.user.role);
    const {courseId} = useParams();
    const dispatch = useDispatch();
    const courseDetails = useSelector((store) => store.courseDetails);

    useEffect(() => {
        dispatch(fetchCourseDetails({ courseId }));
    }, [dispatch, courseId]);

    const adminItems = [
        { path: "/admin", label: "Admin Dashboard", icon: "fas fa-home" },
        { path: "/admin/manage-instructors", label: "Manage Instructors", icon: "fas fa-users-cog" },
        { path: "/admin/manage-courses", label: "Manage Courses", icon: "fas fa-users-cog" },
    ];

    const employeeItems = [
        { path: "/", label: "Employee Dashboard", icon: "fas fa-home" },
        { path: "/tasks", label: "My Tasks", icon: "fas fa-tasks" },
    ];

    const instructorItems = [
        { path: "/instructor", label: "Dashboard", icon: "fas fa-home" },
        { path: `/instructor/course/${courseId}/announcements`, label: "Announcements", icon: "fas fa-bullhorn" },
        { path: `/instructor/course/${courseId}/assignments`, label: "Assignments", icon: "fas fa-tasks" },

        { path: `/instructor/course/${courseId}/syllabus`, label: "Syllabus", icon: "fas fa-book" },
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
        // <div className='flex flex-col min-h-screen'>

        //   <div className='flex flex-grow'>
        //     <div className="fixed flex flex-col top-12 left-0 w-14 hover:w-64 md:w-64 bg-base-300 h-full transition-all duration-300 border-none z-10 sidebar">
        //       <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
        //         <ul className="flex flex-col py-4 space-y-1">
        //           <li>
        //             <Link to="/" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-cyan-500 border-l-4 border-transparent">
        //               <span className="inline-flex justify-center items-center ml-4">
        //                 <i className="fas fa-home"></i>
        //               </span>
        //               <span className="ml-2 text-sm tracking-wide truncate">Home</span>
        //             </Link>
        //           </li>
        //           <li>
        //             <Link to="/" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-cyan-500 border-l-4 border-transparent">
        //               <span className="inline-flex justify-center items-center ml-4">
        //                 <i className="fas fa-check-circle"></i>
        //               </span>
        //               <span className="ml-2 text-sm tracking-wide truncate">Announcements</span>
        //             </Link>
        //           </li>
        //           <li>
        //             <Link to="/" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-cyan-500 border-l-4 border-transparent">
        //               <span className="inline-flex justify-center items-center ml-4">
        //                 <i className="fas fa-users"></i>
        //               </span>
        //               <span className="ml-2 text-sm tracking-wide truncate">Syllabus</span>
        //             </Link>
        //           </li>
        //           <li>
        //             <Link to="/" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-cyan-500 border-l-4 border-transparent">
        //               <span className="inline-flex justify-center items-center ml-4">
        //                 <i className="fas fa-store"></i>
        //               </span>
        //               <span className="ml-2 text-sm tracking-wide truncate">Modules</span>
        //             </Link>
        //           </li>
        //           <li>
        //             <Link to="/" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-cyan-500 border-l-4 border-transparent">
        //               <span className="inline-flex justify-center items-center ml-4">
        //                 <i className="fas fa-sign-out-alt"></i>
        //               </span>
        //               <span className="ml-2 text-sm tracking-wide truncate">Assignments</span>
        //             </Link>
        //           </li>
        //         </ul>
        //         <p className="mb-14 px-5 py-3 hidden md:block text-center text-xs">Copyright @2021</p>
        //       </div>
        //     </div>
        //     <div className='flex-grow ml-14 md:ml-64 mt-16'>
        //       {/* <div className='breadcrumbs px-4'>
        //         <ol className="list-reset flex">
        //           <li>
        //             <Link to="/" className="text-blue-600 hover:text-blue-700">Dashboard</Link>
        //           </li>
        //           {pathnames.map((value, index) => {
        //             // Skip numeric segments
        //             if (value.match(/^\d+$/)) return null;
        //             const to = /${pathnames.slice(0, index + 1).join('/')};
        //             const breadcrumbName = getBreadcrumbName(value, index);
        //             return (
        //               <li key={to} className="flex items-center">
        //                 <span className="mx-2">/</span>
        //                 <Link to={to} className="text-blue-600 hover:text-blue-700">
        //                   {breadcrumbName}
        //                 </Link>
        //               </li>
        //             );
        //           })}
        //         </ol>
        //       </div> */}

        //     </div>
        //   </div>

        // </div >
        <div className='flex flex-col'>
            <div className='flex flex-grow'>
                <div className="fixed flex flex-col top-12 left-0 w-14 hover:w-64 md:w-64 bg-base-300 h-full transition-all duration-300 border-none z-10 sidebar">
                    <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
                        <ul className="flex flex-col py-4 space-y-1">
                            {itemsToDisplay.map((item, index) => (
                                <li key={index}>
                                    <Link to={item.path} className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-cyan-500 border-l-4 border-transparent">
                                        <span className="inline-flex justify-center items-center ml-4">
                                            <i className={item.icon}></i>
                                        </span>
                                        <span className="ml-2 text-sm tracking-wide truncate">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <p className="mb-14 px-5 py-3 hidden md:block text-center text-xs">Copyright @2021</p>
                    </div>
                </div>
                <div className='flex-grow ml-14 md:ml-64 mt-16'>
                    {/* Additional content can go here */}
                </div>
            </div>
        </div>
    )
}

export default SideBar