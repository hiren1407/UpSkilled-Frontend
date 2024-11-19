import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";
import { useSelector } from "react-redux";

const ViewIndividualAssignmentSubmission = () => {
    const userRole = useSelector((state) => state.user.role); // Get user role from Redux store
    const [submissionDetails, setSubmissionDetails] = useState([]); // State variable for submission details
    const [gradeDetails, setGradeDetails] = useState([]); // State variable for grade details
    const [employee, setEmployee] = useState([]); // State variable for employee details
    const [submissionFileUrl, setSubmissionFileUrl] = useState([]); // State variable for submission file URL
    const [showSubmission, setShowSubmission] = useState(false); // State variable to toggle submission visibility
    const { courseId, assignmentId, submissionId } = useParams(); // Get courseId, assignmentId, and submissionId from URL parameters
    const [editGrade, setEditGrade] = useState(false); // State variable to toggle grade editing
    const [grade, setGrade] = useState(''); // State variable for grade
    const [feedback, setFeedback] = useState(''); // State variable for feedback
    const [showPopup, setShowPopup] = useState(false); // State variable to show popup
    const [popupMessage, setPopupMessage] = useState(''); // State variable for popup message
    const [loading, setLoading] = useState(true); // State variable for loading state
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Fetch submission details on component mount
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
    }, [assignmentId, courseId, submissionId]);

    // Function to handle grade submission
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
                setTimeout(() => {
                    setShowPopup(false);
                }
                    , 2000);
            }
        } catch (error) {
            console.error('Error updating grade and feedback:', error);
            alert('Error updating grade and feedback');
        }
    };

    // Show loading spinner while loading
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen" role="status" aria-live="polite">
                <span className="loading loading-dots loading-lg" aria-label="Loading"></span>
            </div>
        );
    }

    return (
        <div className="flex flex-col px-4 py-6 md:px-16 md:py-8 space-y-6" role="main">
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
                            aria-label={gradeDetails.length === 0 ? 'Provide Grade and Feedback' : 'Edit Grade and Feedback'}
                        >
                            {gradeDetails.length === 0 ? 'Provide Grade and Feedback' : 'Edit Grade and Feedback'}
                        </button>
                    ) : (
                        <div className="flex flex-col gap-2 w-full max-w-sm">
                            <div className="flex items-center gap-2">
                                <label htmlFor="grade-input" className="text-sm sm:text-lg font-bold">Grade:</label>
                                <input
                                    id="grade-input"
                                    className="input input-bordered w-12 h-8 px-2"
                                    type="text"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    aria-label="Grade"
                                />
                                <span className="text-sm">/100</span>
                            </div>
                            <label htmlFor="feedback-textarea" className="sr-only">Feedback</label>
                            <textarea
                                id="feedback-textarea"
                                className="input input-bordered w-full h-24"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Provide feedback"
                                aria-label="Feedback"
                            />
                            <button className="btn btn-primary w-full sm:w-auto" onClick={handleGradeSubmission} aria-label="Submit Grade and Feedback">
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
                    aria-expanded={showSubmission}
                    aria-controls="submission-file"
                >
                    {showSubmission ? 'Hide Submission' : 'Show Submission'}
                </button>
                {showSubmission && submissionFileUrl && (
                    <div className="mt-4" id="submission-file">
                        {!isMobile ? (
                            <object
                                data={submissionFileUrl} // Display PDF in object tag
                                type="application/pdf"
                                className="w-full h-[75vh] sm:h-[60vh] md:h-[70vh]"
                                style={{ minHeight: 'calc(100vh - 150px)', width: '100%' }}
                                aria-label="PDF submission"
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" role="alert">
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