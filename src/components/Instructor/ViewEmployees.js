import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { useParams } from 'react-router-dom';

const ViewEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { courseId } = useParams();

    const fetchEmployees = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${BASE_URL}/instructor/course/${courseId}/getAllEmployees`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Sort employees alphabetically by full name
            const sortedEmployees = response.data.sort((a, b) => {
                const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
                const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
                return nameA.localeCompare(nameB);
            });

            setEmployees(sortedEmployees);

        } catch (err) {
            setError('Error fetching employees. Please try again later.');
            console.error('Error fetching employees:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Conditional rendering based on loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen" role="alert" aria-busy="true">
                <span className="loading loading-dots loading-lg" aria-label="Loading"></span> {/* Loading spinner */}
            </div>
        );
    }

    // Conditional rendering based on error state
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-center" role="alert">
                <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2> {/* Error heading */}
                <p className="text-lg text-gray-600 mb-6">
                    We encountered an error. Please try again later. {/* Error message */}
                </p>
                <button
                    onClick={() => window.location.reload()} // Reload page on button click
                    className="px-6 py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
                >
                    Reload Page
                </button>
            </div>
        );
    }

    return (
        <div className="p-4 shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Employees in the Course</h2>
            {employees.length > 0 ? (
                <ul className="space-y-2">
                    {employees.map((employee) => (
                        <li
                            key={employee.id}
                            className="border rounded-md p-3 shadow-sm flex justify-between items-center"
                        >
                            <div>
                                <p className="font-semibold text-gray-700">
                                    {employee.firstName} {employee.lastName}
                                </p>
                                <p className="text-sm text-gray-500">{employee.email}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500">No employees found in this course.</p>
            )}
        </div>
    );
};

export default ViewEmployees;
