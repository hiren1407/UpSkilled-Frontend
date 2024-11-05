import React, { useEffect } from 'react'
import NavBar from './NavBar'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer'
// import { BASE_URL } from '../utils/constants'

// import axios from 'axios'

const Body = () => {

  return (
    <div className='flex flex-column'>
      <NavBar />
      <div className='flex-grow mt-12'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Body