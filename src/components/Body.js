import React from 'react'
import NavBar from './NavBar'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Breadcrumbs from './Breadcrumbs'

const Body = () => {

  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar />
      <div className='flex-grow mt-12'>
        {/* <Breadcrumbs /> */}
        <Outlet />
      </div>
      <Footer />
    </div >
  )
}

export default Body