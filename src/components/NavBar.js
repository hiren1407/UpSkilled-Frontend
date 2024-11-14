import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../images/Logo.jpeg'
import { useDispatch, useSelector } from 'react-redux'
import { clearUser } from '../utils/userSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome,faUser , faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { BASE_URL } from '../utils/constants'

const NavBar = () => {
  const user = useSelector((store) => store.user.user)
  const role = useSelector((store) => store.user.role)
  const path='/'+role
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  const handleLogout = async () => {
    try {
      const token= localStorage.getItem('token')
      const res=await fetch(BASE_URL+"/auth/logout",
      {
      method:'POST',
        headers:{
        'Authorization':`Bearer ${token}`
      }})
      if(res.status==200){
      localStorage.removeItem('token')
      dispatch(clearUser())
      return navigate("/")
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="navbar bg-neutral text-neutral-content fixed z-10 min-h-0" style={{ minHeight: '3.5rem' }}>
      <div className="flex-1">
        <Link to={path}><img src={Logo} alt='Logo' className='h-8 w-28 ml-4'></img></Link>
        {user && (<Link to={`/${user.role.toLowerCase()}`}><span className='hover:bg-neutral-400 p-2 rounded-md'><FontAwesomeIcon className='mr-1' icon={faHome}></FontAwesomeIcon>Home</span></Link>)}
      </div>
      {user && (<div className="flex-none gap-2">
        <div className="form-control">
          Welcome, {user?.firstName}
        </div>
        <div className="dropdown dropdown-end mr-3 flex">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar" style={{ minHeight: '2.5rem', height: '2.5rem' }}>
            <div className="w-8 rounded-full">
              <img
                alt="user avatar"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW16OcRfS6od-QYRbk1htduUIOMUAaFVp0PQ&s" />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 text-blue-400 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li>
              <Link to='/profile'>
              <FontAwesomeIcon icon={faUser } />
                Profile
              </Link>
            </li>

            <li><button onClick={handleLogout} className=' cursor-pointer'><FontAwesomeIcon icon={faSignOutAlt} />Logout</button></li>
          </ul>
        </div>
      </div>)}

    </div>
  )
}

export default NavBar