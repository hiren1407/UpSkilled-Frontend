import React, { useState } from 'react'
import { updateUser } from '../utils/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import bg from '../images/bg.jpeg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {

  const user = useSelector((store) => store.user.user)

  const [email, setEmail] = useState(user?.sub);
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(user?.firstName);
  const [designation, setDesignation] = useState(user?.designation);
  const [role, setRole] = useState(user?.role);
  const [lastName, setLastName] = useState(user?.lastName);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false)

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const dispatch = useDispatch();


  const update = async () => {
    try {
      const response = await dispatch(updateUser({ designation, password })).unwrap();
      if (response == 201) {
        setShowToast(true)
        setTimeout(() => {
          setShowToast(false)
        }, 3000)

      }

    } catch (err) {

      setError(err.message || "Update failed"); // Set error if login fails
    }
  };



  return (

    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        paddingTop: '5rem', // Space for navbar
        paddingBottom: '5rem', // Space for footer
      }}
    >

      <div className="card bg-base-300 w-96 shadow-xl text-black" style={{ background: 'linear-gradient(0deg, #9495fd, #a3c3fe)' }}>
        {showToast && (
          <div className="flex justify-center">
            <div className="toast toast-top relative">
              <div className="alert alert-success">
                <span>Profile updated successfully!</span>
              </div>
            </div>
          </div>
        )}
        <div className="card-body">
          <h2 className="card-title justify-center">
            Profile
          </h2>
          <div>

            <>
              <div className="flex gap-x-2 my-2">
                <label className="form-control w-1/2">
                  <div className="label">
                    <span className="label-text text-white">First Name</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full"
                    disabled
                  />
                </label>
                <label className="form-control w-1/2">
                  <div className="label">
                    <span className="label-text text-white">Last Name</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full"
                    disabled
                  />
                </label>
              </div>
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text text-white">Designation</span>
                </div>
                <input
                  type="text"
                  value={designation}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </label>
              <label className="form-control w-full max-w-xs my-2">
                <div className="label">
                  <span className="label-text text-white">Role</span>
                </div>
                <select
                  className="select select-bordered w-full max-w-xs"
                  disabled
                >
                  <option disabled selected value="">
                    {role}
                  </option>

                </select>
              </label>
            </>

            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text text-black">Email ID:</span>
              </div>
              <input
                type="text"
                value={email}
                className="input input-bordered w-full max-w-xs"
                disabled
              />

            </label>
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text text-black">Password</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  className="input input-bordered w-full pr-10" // Add padding to the right for the icon
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </span>
              </div>
            </label>
          </div>
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center m-2">
            <button
              className="btn btn-primary"
              onClick={update}
            >
              Save
            </button>

          </div>


        </div>
      </div>

    </div>
  )
}

export default Profile