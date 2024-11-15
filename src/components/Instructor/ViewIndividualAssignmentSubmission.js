import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";
import { useSelector } from "react-redux";

const ViewIndividualAssignmentSubmission = () => {
    const userRole = useSelector((state) => state.user.role);
    const [submissionDetails, setSubmissionDetails] = useState([]);
    const [gradeDetails, setGradeDetails] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [submissionFileUrl, setSubmissionFileUrl] = useState([]);
    const [showSubmission, setShowSubmission] = useState(false);
    const { courseId, assignmentId, submissionId } = useParams();
    const [editGrade, setEditGrade] = useState(false);
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissionDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${BASE_URL}/instructor/${courseId}/assignments/${assignmentId}/submissions/${submissionId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    document.title = data.userDetails.firstName + ' ' + data.userDetails.lastName + ' - Submission Details';
                    setEmployee(data.userDetails);
                    setSubmissionDetails(data);
                    if (data.gradeBook) {
                        setGradeDetails(data.gradeBook);
                        setGrade(data.gradeBook.grade);
                        setFeedback(data.gradeBook.feedback);
                    }
                    setLoading(false);
                    const pdfResponse = await fetch(`${BASE_URL}/instructor/${courseId}/assignments/${assignmentId}/submissions/${submissionId}/viewSubmission`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        },
                    });
                    const pdfBlob = await pdfResponse.blob();
                    const pdfUrl = URL.createObjectURL(pdfBlob);
                    setSubmissionFileUrl(pdfUrl);
                }
                else {
                    console.error('Failed to fetch submission details');
                }
            }
            catch (error) {
                console.error('Error fetching submission details:', error);
            }
            setLoading(false);
        };
        fetchSubmissionDetails();
    }, []);

    const handleGradeSubmission = async () => {
        try {
            setLoading(true);
            let response;
            if (gradeDetails.length === 0) {
                response = await fetch(`${BASE_URL}/instructor/gradeBook/gradeAssignment?submissionId=${submissionDetails.submissionId}&courseId=${courseId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        grade: grade,
                        feedback: feedback
                    })
                })
            } else {
                response = await fetch(`${BASE_URL}/instructor/gradeBook/updateGradeAssignment?gradingId=${gradeDetails.gradeBookId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        grade,
                        feedback
                    })
                });
            }
            if (response.ok) {
                const updatedGradeDetails = await response.json();
                setGradeDetails(updatedGradeDetails);
                setEditGrade(false);
                setShowPopup(true);
                setPopupMessage("Grade and feedback updated successfully");
                setLoading(false);
                setTimeout(() => {
                    setShowPopup(false);
                }
                    , 2000);
            } else {
                console.error('Failed to update grade and feedback');
                setPopupMessage("Failed to update grade and feedback");
                setShowPopup(true);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error updating grade and feedback:', error);
            alert('Error updating grade and feedback');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-dots loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap justify-center px-16 py-8 flex-col">
            <h2 className="text-2xl md:text-3xl font-bold text-center">Submission Details</h2>

            <div className="flex justify-between mt-4">
                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold mb-4">Submitted by: </h3>
                    <p>Name: {employee?.firstName} {employee?.lastName}</p>
                    <p>Email: {employee?.email}</p>
                    {gradeDetails.length !== 0 ? (
                        <>
                            <p>Grade: {gradeDetails?.grade}</p>
                            <p>Feedback: {gradeDetails?.feedback || '-'}</p>
                            <p>Graded on: {(gradeDetails && !isNaN(new Date(gradeDetails?.gradedDate)) ? new Date(gradeDetails?.gradedDate).toLocaleString() : '-')}</p>
                        </>) : (
                        <p>Grade: Not graded yet</p>
                    )}
                </div>
                {userRole === 'instructor' && (
                    !editGrade ? (gradeDetails.length === 0 ? (
                        <div>
                            <button className="btn btn-gray btn-sm md:btn-md" onClick={() => setEditGrade(!editGrade)}>Provide Grade and Feedback</button>
                        </div>
                    ) : (
                        <div>
                            <button className="btn btn-gray btn-sm md:btn-md" onClick={() => setEditGrade(!editGrade)}>Edit Grade and Feedback</button>
                        </div>
                    )) : (
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <div className="flex">
                                    <h3 className="text-2xl font-bold mr-1 mb-1">Grade:</h3>
                                    <input className="input input-bordered w-14 h-8 px-3 mr-1" type="text" value={grade} onChange={(e) => setGrade(e.target.value)} /> <span className="mt-1">/100</span>
                                </div>
                                <button className="btn btn-sm btn-circle btn-ghost right-2 top-2" onClick={() => setEditGrade(!setEditGrade)}>✕</button>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-1">Feedback:</h3>
                                <textarea className="w-96 h-24 input input-bordered" value={feedback} onChange={(e) => setFeedback(e.target.value)}></textarea>
                            </div>
                            <button className="btn mt-2 btn-sm md:btn-md" onClick={handleGradeSubmission}>Submit</button>
                        </div >
                    )
                )}
            </div>

            <div>
                <button className="btn mt-4 btn-sm md:btn-md" onClick={() => setShowSubmission(!showSubmission)}>{showSubmission ? 'Hide Submission' : 'Show Submission'}</button>
                {submissionFileUrl ? (
                    showSubmission && (
                        <div className="w-full content-center">
                            <div className="mt-4">
                                <iframe src={submissionFileUrl} style={{ width: '100%', height: '75vh' }} title="PDF Preview" />
                            </div>
                        </div>
                    )
                ) : (
                    <p>No PDF file available.</p>
                )}
            </div>

            {
                userRole === 'instructor' && showPopup &&
                (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="p-4 rounded shadow-lg">
                            <div className="alert alert-info">
                                <span>{popupMessage}</span>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default ViewIndividualAssignmentSubmission;