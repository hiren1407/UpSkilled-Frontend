import React, { useState, useEffect } from 'react'; // Importing necessary hooks from React
import { BASE_URL } from '../../utils/constants'; // Importing base URL for API requests
import { useNavigate, useParams } from 'react-router-dom'; // Importing hooks for routing

// Main component for viewing grades of a specific course
const ViewGrades = () => {
    const { courseId } = useParams(); // Extracting course ID from URL parameters
    const [gradesData, setGradesData] = useState([]); // State to hold grades data
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [error, setError] = useState(null); // State to hold error messages

    const navigate = useNavigate(); // Hook for programmatic navigation

    // useEffect hook to fetch grades data when the component mounts
    useEffect(() => {
        document.title = "Grades"; // Set the document title for the grades page
        const fetchGradesData = async () => {
            try {
                // Fetching grades data from API using the course ID
                const response = await fetch(`${BASE_URL}/employee/getGrades/${courseId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json", // Setting content type
                        "Authorization": `Bearer ${localStorage.getItem("token")}` // Setting authorization header with token
                    },
                });

                // Check if the response is okay
                if (!response.ok) {
                    throw new Error('Failed to fetch data'); // Throw an error if fetching fails
                }

                const data = await response.json(); // Parse the JSON data from the response
                setGradesData(data); // Set the grades data in state
                setLoading(false); // Set loading to false after fetching
            } catch (error) {
                setError(error.message); // Set error message if an error occurs
                setLoading(false); // Set loading to false in case of error
            }
        };

        fetchGradesData(); // Call the fetch function
    }, []); // Empty array ensures this effect runs only once when the component mounts

    // Calculate percentage based on graded assignments
    const gradedAssignments = gradesData.filter(assignment => assignment.status === "GRADED"); // Filter graded assignments
    const totalAssignments = gradesData.length; // Get total number of assignments
    const totalGrade = gradedAssignments.reduce((sum, assignment) => sum + assignment.grade, 0); // Calculate total grade
    const percentage = totalAssignments > 0 ? (totalGrade / (totalAssignments * 100)) * 100 : 0; // Calculate percentage

    // Loading and error states
    if (loading) {
        return <div role="status" aria-live="polite">Loading...</div>; // Render loading message while data is being fetched
    }

    if (error) {
        return <div role="alert">Error: {error}</div>; // Render error message if an error occurs
    }

  return (
    <div className="flex flex-col items-center my-2">
      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-center my-2" tabIndex="0">Grades</h1> {/* Title for the grades section */}

      {/* Table */}
      {gradesData.length === 0 ? (
        <p className="text-center text-xl" tabIndex="0">No grades found</p> // Message when no grades are available
      ) : (
        <div className="w-4/5 my-5">
          <table className="min-w-full bg-white border-collapse shadow-md rounded-lg" role="table">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left border-b" scope="col">Assignment Name</th> {/* Column header for assignment name */}
                <th className="px-6 py-4 text-left border-b" scope="col">Grade</th> {/* Column header for grade */}
              </tr>
            </thead>
            <tbody>
            {/* Mapping through grades data to display each assignment */}
              {gradesData.map((assignment) => (
                <tr key={assignment.assignmentId}>
                  <td
                    className="px-6 py-4 border-b cursor-pointer hover:text-blue-500"
                    onClick={() => navigate(`/employee/course/${courseId}/assignments/${assignment.assignmentId}`)}
                    tabIndex="0"
                    role="button"
                    aria-label={`View details for ${assignment.assignmentName}`}
                  >
                    {assignment.assignmentName} {/* Assignment name with navigation on click */}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {assignment.status === "GRADED" ? ( // Conditional rendering based on assignment status
                      assignment.grade // Display grade if graded
                    ) : assignment.status === "PENDING" ? (
                      <span className="text-gray-500">Not Yet Submitted</span>// Message for pending assignments
                    ) : (
                      <span className="text-gray-500">Not Graded</span> // Message for ungraded assignments
                    )}
                  </td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="px-6 py-4 text-right border-t">Percentage</td> {/* Row for displaying percentage */}
                <td className="px-6 py-4 border-t">{percentage.toFixed(2)}%</td>{/* Display calculated percentage */}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Exporting the ViewGrades component for use in other parts of the application
export default ViewGrades;