import React from 'react'
import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

const Body = () => {

  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar />
      <div className='flex-grow mt-14'>
        <Outlet />
      </div>
      <Footer />
    </div >
  )
}

export default Body