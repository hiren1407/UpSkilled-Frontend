import React, { useEffect, useState } from 'react'; // Importing necessary hooks from React
import { BASE_URL } from "../../utils/constants"; // Importing the base URL for API requests
import axios from 'axios'; // Importing axios for making HTTP requests
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importing FontAwesomeIcon for icons
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'; // Importing specific icons

// Main component for managing instructors
const ManageInstructors = () => {
  // State variables to hold active and inactive instructors
  const [activeInstructors, setActiveInstructors] = useState([]); // State for active instructors
  const [inactiveInstructors, setInactiveInstructors] = useState([]); // State for inactive instructors
  const [flag, setFlag] = useState(false); // State to trigger re-fetching of instructors

  // Function to fetch instructors from the API
  const fetchInstructors = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    const response = await axios.get(`${BASE_URL}/admin/listInstructors`, {
      headers: {
        'Authorization': `Bearer ${token}` // Set authorization header with token
      }
    }, { withCredentials: true });
    
    const instructors = response.data; // Get the list of instructors from the response

    // Filter instructors based on their status
    const active = instructors.filter(instructor => instructor.status === "ACTIVE"); // Get active instructors
    const inactive = instructors.filter(instructor => instructor.status === "INACTIVE"); // Get inactive instructors

    // Update state with the filtered instructors
    setActiveInstructors(active);
    setInactiveInstructors(inactive);
  };

  // useEffect hook to fetch instructors when the component mounts or when the flag changes
  useEffect(() => {
    fetchInstructors(); // Call the function to fetch instructors
  }, [flag]); // Dependency array includes flag to re-fetch when it changes

  // Function to approve an instructor request
  const approveRequest = async (id) => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    // Make a POST request to approve the instructor
    const response = await fetch(`${BASE_URL}/admin/approve/${id}`, {
      method: 'POST', // HTTP method for approval
      headers: {
        'Authorization': `Bearer ${token}` // Set authorization header with token
      }
    }, { withCredentials: true });

    // If the response is successful, toggle the flag to re-fetch instructors
    if (response.status === 200) {
      setFlag(!flag);
    }
  };

  // Function to deny an instructor request
  const denyRequest = async (id) => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    // Make a POST request to deny the instructor
    const response = await fetch(`${BASE_URL}/admin/reject/${id}`, {
      method: 'POST', // HTTP method for rejection
      headers: {
        'Authorization': `Bearer ${token}` // Set authorization header with token
      }
    }, { withCredentials: true });

    // If the response is successful, toggle the flag to re-fetch instructors
    if (response.status === 200) {
      setFlag(!flag);
    }
  };

  return (
    <div className='my-2'>
      {/* Main title of the Manage Instructors section */}      
      <h1 className='flex text-2xl md:text-4xl font-bold justify-center my-2' tabIndex="0">Manage Instructors</h1>
      {/* Tabbed interface for active and inactive instructors */}
      <div role="tablist" className="tabs tabs-lifted mx-2">
        {/* Tab for Active Instructors */}
        <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Active Instructors" />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <div className="flex justify-center">
            <div className="overflow-x-auto w-full max-w-4xl">
              <table className="table-auto w-full text-center">
                {/* Table header for active instructors */}
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mapping through active instructors to display them in the table */}
                  { activeInstructors.map((data) => (
                    <tr key={data.id}>
                      <td className="border px-4 py-2">{data.firstName + " " + data.lastName}</td>
                      <td className="border px-4 py-2">{data.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tab for Inactive Instructors */}
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab"
          aria-label="Inactive Instructors"
          defaultChecked />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <div className="flex justify-center">
            <div className="overflow-x-auto w-full max-w-4xl">
              <table className="table-auto w-full text-center">
                {/* Table header for inactive instructors */}
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mapping through inactive instructors to display them in the table */}
                  {inactiveInstructors.map((data) => (
                    <tr key={data.id}>
                      <td className="border px-4 py-2">{data.firstName + " " + data.lastName}</td>
                      <td className="border px-4 py-2">{data.email}</td>
                      <td className="border px-4 py-2 space-x-3">
                        {/* Button to approve the instructor */}
                        <button className="btn bg-inherit btn-circle btn-sm" onClick={() => approveRequest(data.id)} aria-label={`Approve ${data.firstName} ${data.lastName}`}>
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </button>
                        {/* Button to deny the instructor */}
                        <button className="btn bg-inherit btn-circle btn-sm" onClick={() => denyRequest(data.id)} aria-label={`Deny ${data.firstName} ${data.lastName}`}>
                          <FontAwesomeIcon icon={faTimesCircle} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exporting the ManageInstructors component for use in other parts of the application
export default ManageInstructors;