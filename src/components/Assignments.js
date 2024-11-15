import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";

const Assignments = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const role = useSelector((state) => state.user.role); // Fetch role from Redux store

    useEffect(() => {
        document.title = "Assignments";
        const fetchAssignments = async () => {
            try {
                const url = role === 'instructor' 
                    ? `${BASE_URL}/instructor/course/${courseId}/assignments`
                    : `${BASE_URL}/employee/course/${courseId}/assignments`; // Example URL for employee

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setAssignments(data);
                } else {
                    console.error('Failed to fetch assignments');
                }
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        };

        fetchAssignments();
    }, [courseId, role]);

    return (
        <div className="flex flex-col w-4/5 items-center justify-self-center">
            <div className="flex justify-between items-center my-4 w-full">
                <h1 className="text-2xl md:text-3xl text-center font-bold flex-grow">Assignments</h1>
                {role === 'instructor' && ( // Show button only for instructors
                    <button className="btn btn-neutral" onClick={() => navigate(`/instructor/course/${courseId}/create-assignment`)}>
                        Create New
                    </button>
                )}
            </div>
            {assignments.length === 0 ? (
                <p className="text-center text-xl">No assignments found</p>
            ) : (
                <div className="p-8 border-2 w-full bg-slate-700">
                    {assignments.map((assignment, index) => {
                        
                        let assignmentDetails=assignment?.assignmentDetails
                        if (assignment.submissionDetails){
                        
                        var gradingDetails=assignment?.submissionDetails[0]?.gradeBook
                        }
                        return(
                        <div key={index} className="shadow-md rounded-md p-4 my-4 bg-base-300 cursor-pointer" onClick={() => navigate(`${assignmentDetails.id}`)}>
                            <h2 className="text-xl font-bold">{assignmentDetails.title}</h2>
                            <p className="text-md truncate max-w-md">{assignmentDetails.description}</p>
                            <p className="text-sm">Due: {new Date(assignmentDetails.deadline).toString()}</p>
                           { gradingDetails && <p className="mt-2">Grade: {gradingDetails?.grade}/100</p>}
                        </div>)})}
                    
                </div>
            )}
        </div>
    );
};

export default Assignments;