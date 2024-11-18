import React from 'react'
import { Link } from 'react-router-dom' // Importing Link component for navigation
import instructor from '../../images/instructor.jpg' // Importing instructor image

// AdminDashboard component definition
const AdminDashboard = () => {
  return (
    <main className='my-2' role="main">
      {/* Main heading for the dashboard */}
      <h1 className='flex text-2xl md:text-4xl font-bold justify-center my-2' tabIndex="0">Admin Dashboard</h1>
      
      {/* Container for the cards */}
      <div className='flex justify-center items-center space-x-10 my-10'>
        {/* Card for managing courses */}
        <article className="card glass w-1/3 h-96" role="region" aria-labelledby="manage-courses-title">
          <figure>
            {/* Image for the courses section */}
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCsyMDy2-FEk2nyC4O3JxTOHuB3C6Vdnv3mA&s"
              alt="Courses management" />
          </figure>
          <div className="card-body">
            {/* Title for the card */}
            <h2 id="manage-courses-title" className="card-title">Manage Courses</h2>
            {/* Description for the card */}
            <p>View all details of courses here</p>
            <div className="card-actions justify-end">
              {/* Link to navigate to manage courses page */}
              <Link to='/admin/manage-courses' data-testid="manageCoursesLink">
                
                <button data-testid="manageCoursesButton" className="btn btn-primary" aria-label="Go to manage courses">Go</button>
              
              </Link>
            </div>
          </div>
        </article>
        {/* Card for managing instructors */}
        <article className="card glass w-1/3 h-96" role="region" aria-labelledby="manage-instructors-title">
          <figure>
            {/* Image for the instructors section */}
            <img
              src={instructor}
              alt="Instructors management" />
          </figure>
          <div className="card-body">
            {/* Title for the card */}
            <h2 id="manage-instructors-title" className="card-title">Manage Instructors</h2>
            {/* Description for the card */}
            <p>View all details of instructors here</p>
            <div className="card-actions justify-end">
              {/* Link to navigate to manage instructors page */}
              <Link to='/admin/manage-instructors' data-testid="manageInstructorsLink">
                
                <button data-testid="manageInstructorsButton" className="btn btn-primary" aria-label="Go to manage instructors">Go</button>
              
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}

// Exporting the AdminDashboard component for use in other parts of the application
export default AdminDashboard