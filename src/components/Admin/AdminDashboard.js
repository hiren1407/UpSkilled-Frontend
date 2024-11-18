import React from 'react'
import { Link } from 'react-router-dom' // Importing Link component for navigation
import instructor from '../../images/instructor.jpg' // Importing instructor image

// AdminDashboard component definition
const AdminDashboard = () => {
  return (
    <div className='my-2'>
      {/* Main title of the dashboard */}
      <h1 className='flex text-2xl md:text-4xl font-bold justify-center my-2'>Admin Dashboard</h1>
      
      {/* Container for the cards */}
      <div className='flex justify-center items-center space-x-10 my-10'>
        
        {/* Card for managing courses */}
        <div className="card glass w-1/3 h-96">
          <figure>
            {/* Image for the courses section */}
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCsyMDy2-FEk2nyC4O3JxTOHuB3C6Vdnv3mA&s"
              alt="courses" />
          </figure>
          <div className="card-body">
            {/* Title for the card */}
            <h2 className="card-title">Manage Courses</h2>
            {/* Description for the card */}
            <p>View all details of courses here</p>
            <div className="card-actions justify-end">
              {/* Link to navigate to manage courses page */}
              <Link to='/admin/manage-courses'>
                <button className="btn btn-primary">Go</button>
              </Link>
            </div>
          </div>
        </div>

        {/* Card for managing instructors */}
        <div className="card glass w-1/3 h-96">
          <figure>
            {/* Image for the instructors section */}
            <img
              src={instructor}
              alt="instructors" />
          </figure>
          <div className="card-body">
            {/* Title for the card */}
            <h2 className="card-title">Manage Instructors</h2>
            {/* Description for the card */}
            <p>View all details of instructors here</p>
            <div className="card-actions justify-end">
              {/* Link to navigate to manage instructors page */}
              <Link to='/admin/manage-instructors'> 
                <button className="btn btn-primary">Go</button> 
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Exporting the AdminDashboard component for use in other parts of the application
export default AdminDashboard