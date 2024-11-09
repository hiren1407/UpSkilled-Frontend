import React from 'react'
import { Link } from 'react-router-dom'
import instructor from '../../images/instructor.jpg'

const AdminDashboard = () => {
  return (
    <div>
      <h1 className='flex text-3xl font-bold justify-center my-10'>Admin Dashboard</h1>
      <div className='flex justify-center items-center space-x-10 my-10'>
        <div className="card glass w-1/3 h-96">
          <figure>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCsyMDy2-FEk2nyC4O3JxTOHuB3C6Vdnv3mA&s"
              alt="courses" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Manage Courses</h2>
            <p>View all details of courses here</p>
            <div className="card-actions justify-end">
              <Link to='/admin/manage-courses'><button className="btn btn-primary">Go</button></Link>
            </div>
          </div>
        </div>
        <div className="card glass w-1/3 h-96">
          <figure>
            <img
              src={instructor}
              alt="instructors" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Manage Instructors</h2>
            <p>View all details of instructors here</p>
            <div className="card-actions justify-end">
              <Link to='/admin/manage-instructors'> <button className="btn btn-primary">Go</button> </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard