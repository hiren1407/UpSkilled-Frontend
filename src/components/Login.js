import { useState } from "react";
import { useDispatch } from "react-redux";
// import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import bg from '../images/bg.jpeg'
import { loginUser, signUpUser, setUser } from '../utils/userSlice';
import { jwtDecode } from 'jwt-decode';
import '../Styles/Login.css'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [designation, setDesignation] = useState("");
  const [role, setRole] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await dispatch(loginUser({ email, password })).unwrap();
      if (response) {
        localStorage.setItem('token', response);
        const user = jwtDecode(response);
        dispatch(setUser({ user, token: response }));
        if (user.role.toLowerCase() === "admin") navigate("/admin");
        else if (user.role.toLowerCase() === "instructor") navigate("/instructor");
        else if (user.role.toLowerCase() === "employee") navigate("/employee");
      }
    } catch (err) {
        console.log(err)
      setError(err.message || "Login failed"); // Set error if login fails
    }
  };

  const handleSignUp = async () => {
    try {
      await dispatch(signUpUser({ firstName, lastName, email, password, role, designation })).unwrap();
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Signup failed"); // Set error if signup fails
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen "
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        paddingTop: '5rem', // Space for navbar
        paddingBottom: '5rem', // Space for footer
      }}
    >
      <div className="card bg-base-300 w-96 shadow-xl text-black" style={{ background: 'linear-gradient(0deg, #9495fd, #a3c3fe)' }}>
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2>
          <div>
            {!isLoginForm && (
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
                      onChange={(e) => setFirstName(e.target.value)}
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
                      onChange={(e) => setLastName(e.target.value)}
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
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option disabled selected value="">
                      Select Role
                    </option>
                    <option>Employee</option>
                    <option>Instructor</option>
                  </select>
                </label>
              </>
            )}
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text text-black">Email ID:</span>
              </div>
              <input
                type="text"
                value={email}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text text-black">Password</span>
              </div>
              <input
                type="password"
                value={password}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center m-2">
            <button
              className="btn btn-primary"
              onClick={isLoginForm ? handleLogin : handleSignUp}
            >
              {isLoginForm ? "Login" : "Sign Up"}
            </button>
          </div>

          <p
            className="m-auto cursor-pointer py-2"
            onClick={() => setIsLoginForm((value) => !value)}
          >
            {isLoginForm ? "New User? Signup Here" : "Existing User? Login Here"}
          </p>
        </div>
      </div>
    </div>
  );



};
export default Login;