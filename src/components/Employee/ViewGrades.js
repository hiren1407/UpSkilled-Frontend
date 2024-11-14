import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../utils/constants';
import { useNavigate, useParams } from 'react-router-dom';

const ViewGrades = () => {
    const { courseId } = useParams();
  const [gradesData, setGradesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
   
  // Fetch data from API
  useEffect(() => {
    document.title="Grades"
    const fetchGradesData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/employee/getGrades/${courseId}`,{
        method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            }); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setGradesData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchGradesData();
  }, []); // Empty array ensures this runs only once when the component mounts

  // Calculate percentage
  const gradedAssignments = gradesData.filter(assignment => assignment.status === "GRADED");
  const totalAssignments = gradesData.length;
  const totalGrade = gradedAssignments.reduce((sum, assignment) => sum + assignment.grade, 0);
  const percentage = totalAssignments > 0 ? (totalGrade / (totalAssignments * 100)) * 100 : 0;

  // Loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center my-2 ">
      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-center my-2">Grades</h1>

      {/* Table */}
      {gradesData.length==0? <p className="text-center text-xl">No grades found</p>:
      <div className="w-4/5 my-5">
        <table className="min-w-full bg-white border-collapse shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left border-b">Assignment Name</th>
              <th className="px-6 py-4 text-left border-b">Grade</th>
            </tr>
          </thead>
          <tbody>
            {gradesData.map((assignment) => (
              <tr key={assignment.assignmentId}>
                <td className="px-6 py-4 border-b cursor-pointer hover:text-blue-500" onClick={()=>navigate(`/employee/course/${courseId}/assignments/${assignment.assignmentId}`)}>{assignment.assignmentName}</td>
                <td className="px-6 py-4 border-b">
                  {assignment.status === "GRADED" ? (
                    assignment.grade
                  ) : assignment.status === "PENDING" ? (
                    <span className="text-gray-500">Not Yet Submitted</span>
                  ) : (
                    <span className="text-gray-500">Not Graded</span>
                  )}
                </td>
              </tr>
            ))}
            <tr className="font-bold">
              <td className="px-6 py-4 text-right border-t">Percentage</td>
              <td className="px-6 py-4 border-t">{percentage.toFixed(2)}%</td>
            </tr>
          </tbody>
        </table>
      </div>}
    </div>
  );
};

export default ViewGrades;
