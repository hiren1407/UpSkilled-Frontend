import React from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
// import { BASE_URL } from '../utils/constants'
import Logo from '../images/Logo.jpeg'
import { BASE_URL } from '../utils/constants'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { clearUser } from '../utils/userSlice'


const NavBar = () => {
  const user = useSelector((store) => store.user.user)
  const userCheck=useSelector((store)=>store.user.role)
  //   const dispatch=useDispatch()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  //   const handleLogout=async()=>{

  //     try{
  //       await axios.post(BASE_URL+"/auth/logout",{},{withCredentials:true})
  //       dispatch(removeUser())
  //       return navigate("/login")
  //     }
  //     catch(err){

  //     }
  //   }

  const handleLogout = async () => {

    try {
      //   await axios.post(BASE_URL+"/auth/logout",{},{withCredentials:true})
      localStorage.removeItem('token')
      dispatch(clearUser())
      return navigate("/")
    }
    catch (err) {

    }
  }


  return (
    <div className="navbar bg-neutral text-neutral-content fixed z-10 min-h-0">
      <div className="flex-1">
        {/* <Link to="/" className="btn btn-ghost text-xl">UpSkilled</Link> */}
        <Link to="/"><img src={Logo} alt='Logo' className='h-8 w-28 ml-4'></img></Link>
      </div>
      {userCheck && (<div className="flex-none gap-2">
        <div className="form-control">
          Welcome , {user?.firstName}
        </div>
        <div className="dropdown dropdown-end mx-5 flex">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="user photo"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW16OcRfS6od-QYRbk1htduUIOMUAaFVp0PQ&s" />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 text-blue-400 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li>
              <Link to='/profile' className="justify-between">
                Profile

              </Link>
            </li>

            <li><a onClick={handleLogout}>Logout</a></li>
          </ul>
        </div>
      </div>)}

    </div>
  )
}

export default NavBar