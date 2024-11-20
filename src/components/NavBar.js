import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../utils/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import { BASE_URL } from '../utils/constants';
import { toggleMenu } from '../utils/appSlice';

const NavBar = () => {
  const user = useSelector((store) => store.user.user);
  const role = useSelector((store) => store.user.role);
  const { courseId } = useParams();
  const path = '/' + role;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle user logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(BASE_URL + "/auth/logout", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      localStorage.removeItem('token');
      dispatch(clearUser());
      return navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  // Toggle the menu for mobile view
  const toggleMenuHandler = () => {
    dispatch(toggleMenu());
  };

  // Handle window resize to update mobile view state
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="navbar bg-neutral text-neutral-content fixed z-10 min-h-0" style={{ minHeight: '3.5rem' }} role="navigation" aria-label="Main Navigation">
      <div className="flex-1">
        {isMobile && (role === "admin" || courseId) && (
          <button className="btn btn-ghost" onClick={toggleMenuHandler} aria-label="Toggle Menu">
            <FontAwesomeIcon icon={faBars} />
          </button>
        )}
        <Link to={path} aria-label="Dashboard">
          <h1 className="ml-2 text-xl font-bold">
            <span style={{ color: 'orange' }}>Up</span>
            <span style={{ color: 'white' }}>Skilled</span>
          </h1>
        </Link>
        {user && (
          <Link data-testid="dashboardLinkTest" to={`/${user.role.toLowerCase()}`} className='hover:bg-neutral-400 p-2 rounded-md text-sm md:text-md' aria-label="Home">
            <FontAwesomeIcon className='mr-1' icon={faHome} />
            Home
          </Link>
        )}
      </div>
      {user && (
        <div className="flex-none gap-2">
          <div className="form-control text-sm md:text-md">
            Welcome, {user?.firstName}
          </div>
          <div className="dropdown dropdown-end mr-3 flex">
            <button data-testid="userMenuButton" tabIndex={0} className="btn btn-ghost btn-circle avatar" style={{ minHeight: '2.5rem', height: '2.5rem' }} aria-label="User Menu">
              <div className="w-8 rounded-full">
                <img
                  alt="user avatar"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW16OcRfS6od-QYRbk1htduUIOMUAaFVp0PQ&s"
                />
              </div>
            </button>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 text-blue-400 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              role="menu"
              aria-label="User Menu"
            >
              <li role="menuitem">
                <Link to='/profile' aria-label="Profile">
                  <FontAwesomeIcon icon={faUser} />
                  Profile
                </Link>
              </li>
              <li role="menuitem">
                <button data-testid="logoutButton" onClick={handleLogout} className='cursor-pointer' aria-label="Logout">
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;