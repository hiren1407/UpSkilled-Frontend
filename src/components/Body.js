import React, { useEffect } from 'react'
import NavBar from './NavBar'
import {  Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer'
// import { BASE_URL } from '../utils/constants'

// import axios from 'axios'

const Body = () => {
//   const dispatch=useDispatch()
  const navigate=useNavigate()
  
  
  return (
    <div className=''>
        <NavBar/>
        <Outlet/>
        <Footer/>
    </div>
  )
}

export default Body