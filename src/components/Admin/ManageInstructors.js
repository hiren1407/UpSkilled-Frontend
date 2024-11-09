import React, { useEffect, useState } from 'react'
import { BASE_URL } from "../../utils/constants";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';


const ManageInstructors = () => {
  const [activeInstructors, setActiveInstructors] = useState([]);
  const [inactiveInstructors, setInactiveInstructors] = useState([]);
  const [flag, setFlag] = useState(false)

  const fetchInstructors = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${BASE_URL}/admin/listInstructors`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, { withCredentials: true });
    const instructors = response.data;

    // Filter instructors based on their status
    const active = instructors.filter(instructor => instructor.status === "ACTIVE");
    const inactive = instructors.filter(instructor => instructor.status === "INACTIVE");

    setActiveInstructors(active);
    setInactiveInstructors(inactive);
    // Assuming the response data is an array of instructors
  };

  useEffect(() => {
    fetchInstructors()

  }, [flag])

  const approveRequest = async (id) => {
    const token = localStorage.getItem('token')

    const response = await fetch(`${BASE_URL}/admin/approve/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, { withCredentials: true })
    if (response.status == 200) {
      setFlag(!flag)
    }

  }

  const denyRequest = async (id) => {
    const token = localStorage.getItem('token')
    
    const response = await fetch(`${BASE_URL}/admin/reject/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, { withCredentials: true })
    if (response.status == 200) {
      setFlag(!flag)
    }

  }

  return (
    <div className=''>

      <h1 className='flex text-3xl font-bold justify-center my-10'>Manage Instructors</h1>


      <div role="tablist" className="tabs tabs-lifted mx-2">
        <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Active Instrcutors" />
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <div className="flex justify-center">
            <div className="overflow-x-auto w-full max-w-4xl">
              <table className="table-auto w-full text-center">
                {/* head */}
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>


                  </tr>
                </thead>
                <tbody>
                  {activeInstructors.map((data) => (

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
                {/* head */}
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>

                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inactiveInstructors.map((data) => (
                    <tr key={data.id}>
                      <td className="border px-4 py-2">{data.firstName + " " + data.lastName}</td>
                      <td className="border px-4 py-2">{data.email}</td>

                      <td className="border px-4 py-2 space-x-3">
                        <button className="btn bg-inherit btn-circle btn-sm" onClick={() => approveRequest(data.id)}><FontAwesomeIcon icon={faCheckCircle} /></button>
                        <button className="btn bg-inherit btn-circle btn-sm" onClick={() => denyRequest(data.id)}><FontAwesomeIcon icon={faTimesCircle} /></button>
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

export default ManageInstructors