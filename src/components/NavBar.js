import React from 'react'
// import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
// import { BASE_URL } from '../utils/constants'


const NavBar = () => {
//   const user=useSelector((store)=>store.user)
//   const dispatch=useDispatch()
  const navigate=useNavigate()

//   const handleLogout=async()=>{

//     try{
//       await axios.post(BASE_URL+"/auth/logout",{},{withCredentials:true})
//       dispatch(removeUser())
//       return navigate("/login")
//     }
//     catch(err){

//     }
//   }

  
  return (
    <div className="navbar bg-neutral text-neutral-content fixed">
    <div className="flex-1">
      <Link to="/" className="btn btn-ghost text-xl">UpSkilled</Link>
    </div>
    
  </div>
  )
}

export default NavBar