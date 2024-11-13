import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Assignments = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        document.title = "Assignments";
        const response = fetch(`${BASE_URL}/instructor/course/${courseId}/assignments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        response.then(response => response.json())
            .then(data => setAssignments(data))
            .catch(error => console.error('Error fetching assignments:', error));
    }, [courseId]);

    return (
        <div className="flex flex-col w-4/5 items-center justify-self-center">
            <div className="flex justify-between items-center my-4 w-full">
                <h1 className="text-4xl text-center flex-grow">Assignments</h1>
                <button className="btn btn-primary" onClick={() => navigate(`/instructor/course/${courseId}/create-assignment`)}>Create New</button>
            </div>
            {assignments.length === 0 ? <p className="text-center text-xl">No assignments found</p> :
                <div className="p-8 border-2 w-full bg-slate-700">
                    {assignments.map((assignmentDetails, index) => {
                        let assignment = assignmentDetails.assignmentDetails;
                        return (
                            <div key={index} className="shadow-md rounded-md p-4  my-4 bg-base-300 cursor-pointer" onClick={() => navigate(`${assignment.id}`)}>
                                <h2 className="text-xl font-bold">{assignment.title}</h2>
                                <p className="text-md  truncate max-w-md">{assignment.description}</p>
                                <p className="text-sm ">Due: {new Date(assignment.deadline).toString()}</p>
                            </div>
                        );
                    })}
                </div>
            }
        </div>
    );
}

export default Assignments;