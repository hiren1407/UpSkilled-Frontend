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
        <main className="flex flex-col w-4/5 justify-self-center" role="main">
            <header className="flex justify-between items-center my-4 w-full">
                <h1 className="text-2xl md:text-3xl text-center font-bold flex-grow">Assignments</h1>
            </header>
            <div className="flex justify-end w-full mb-2">
                {role === 'instructor' && ( // Show button only for instructors
                    <button 
                        className="btn btn-success btn-sm md:btn-md" 
                        onClick={() => navigate(`/instructor/course/${courseId}/create-assignment`)}
                        aria-label="Create New Assignment"
                    >
                        Create New
                    </button>
                )}
            </div>
            {assignments.length === 0 ? (
                <p className="text-center text-xl">No assignments found</p>
            ) : (
                <section className="p-8 border-2 w-full bg-slate-700" aria-labelledby="assignments-list">
                    <h2 id="assignments-list" className="sr-only">Assignments List</h2>
                    {assignments.map((assignment, index) => {
                        let assignmentDetails = assignment?.assignmentDetails;
                        let gradingDetails = assignment?.submissionDetails?.[0]?.gradeBook;

                        return (
                            <article 
                                key={index} 
                                className="shadow-md rounded-md p-4 my-4 bg-base-300 cursor-pointer" 
                                onClick={() => navigate(`${assignmentDetails.id}`)}
                                tabIndex="0"
                                role="button"
                                aria-pressed="false"
                            >
                                <h3 className="text-xl font-bold">{assignmentDetails.title}</h3>
                                <p className="text-md truncate max-w-md">{assignmentDetails.description}</p>
                                <p className="text-sm">Due: {new Date(assignmentDetails.deadline).toString()}</p>
                                {gradingDetails && <p className="mt-2">Grade: {gradingDetails?.grade}/100</p>}
                            </article>
                        );
                    })}
                </section>
            )}
        </main>
    );
};

export default Assignments;