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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
        <div className="flex flex-col px-4 py-6 md:px-16 md:py-8 space-y-6">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-center">Submission Details</h2>

            <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-6">
                <div className="flex flex-col gap-2 w-full sm:w-2/3">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">Submitted by:</h3>
                    <p className="text-sm sm:text-base">Name: {employee?.firstName} {employee?.lastName}</p>
                    <p className="text-sm sm:text-base">Email: {employee?.email}</p>
                    {gradeDetails.length !== 0 ? (
                        <>
                            <p className="text-sm sm:text-base">Grade: {gradeDetails?.grade}</p>
                            <p className="text-sm sm:text-base">Feedback: {gradeDetails?.feedback || '-'}</p>
                            <p className="text-sm sm:text-base">Graded on: {gradeDetails?.gradedDate ? new Date(gradeDetails.gradedDate).toLocaleString() : '-'}</p>
                        </>
                    ) : (
                        <p className="text-sm sm:text-base">Grade: Not graded yet</p>
                    )}
                </div>

                {userRole === 'instructor' && (
                    !editGrade ? (
                        <button
                            className="btn btn-gray btn-sm md:btn-md w-full sm:w-auto"
                            onClick={() => setEditGrade(!editGrade)}
                        >
                            {gradeDetails.length === 0 ? 'Provide Grade and Feedback' : 'Edit Grade and Feedback'}
                        </button>
                    ) : (
                        <div className="flex flex-col gap-2 w-full max-w-sm">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm sm:text-lg font-bold">Grade:</h3>
                                <input
                                    className="input input-bordered w-12 h-8 px-2"
                                    type="text"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                />
                                <span className="text-sm">/100</span>
                            </div>
                            <textarea
                                className="input input-bordered w-full h-24"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Provide feedback"
                            />
                            <button className="btn btn-primary w-full sm:w-auto" onClick={handleGradeSubmission}>
                                Submit
                            </button>
                        </div>
                    )
                )}
            </div>

            <div className="w-full">
                <button
                    className="btn btn-gray w-full sm:w-auto"
                    onClick={() => setShowSubmission(!showSubmission)}
                >
                    {showSubmission ? 'Hide Submission' : 'Show Submission'}
                </button>
                {showSubmission && submissionFileUrl && (
                    <div className="mt-4">
                        {!isMobile ? (
                                <object
                                    data={submissionFileUrl} // Display PDF in object tag
                                    type="application/pdf"
                                    className="w-full h-[75vh] sm:h-[60vh] md:h-[70vh]"
                                    style={{ minHeight: 'calc(100vh - 150px)', width: '100%' }}
                                />
                            ) : (
                                <p>Your browser does not support viewing PDF files.
                                    <a href={submissionFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline"> Open PDF in new tab</a>
                                </p> // Link to open PDF in new tab for mobile users
                            )}
                    </div>
                )}
            </div>

            {userRole === 'instructor' && showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-4 bg-white rounded shadow-lg">
                        <div className="alert alert-info">
                            <span>{popupMessage}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewIndividualAssignmentSubmission;