import React from 'react'
import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

const Body = () => {
  return (
    // Main container with flex layout and minimum height to cover the full screen
    <div className='flex flex-col min-h-screen'>
      {/* Navigation bar component */}
      <NavBar />
      {/* Main content area with role and aria-label for accessibility */}
      <main role="main" aria-label="Main content" className='flex-grow mt-14'>
        <Outlet />
      </main>
      {/* Footer component */}
      <Footer />
    </div>
  )
}

export default Body