import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import bg from '../images/bg.jpeg'
import axios  from "axios";
// import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
//   const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    // try {
    //   const res = await axios.post(
    //     BASE_URL + "/auth/login",
    //     {
    //       emailId,
    //       password,
    //     },
    //     { withCredentials: true }
    //   );
    // //   dispatch(addUser(res.data));
    //   return navigate("/");
    // } catch (err) {
    //   setError(err?.response?.data || "Something went wrong");
    // }
  };

  

  return (
    <div className="flex justify-center h-screen" style={{backgroundImage:`url(${bg})`,backgroundSize:'cover'}}>
      <div className="card bg-base-300 w-96 shadow-xl fixed mt-36">
        <div className="card-body">
          <h2 className="card-title justify-center">
        
          </h2>
          <div>
            
            
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text">Email ID:</span>
              </div>
              <input
                type="text"
                value={emailId}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text">Password</span>
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
              onClick={handleLogin }
            >
              {isLoginForm ? "Login" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;