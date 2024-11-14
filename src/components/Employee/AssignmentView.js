
import { BASE_URL } from '../../utils/constants';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';

const AssignmentView = () => {
    const { assignmentId, courseId } = useParams()
    const [assignment, setAssignment] = useState(null);
    const [submissionDetails,setSubmissionDetails]=useState(null)
    const [submissionId,setSubmissionId]=useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [submissionPdf, setSubmissionPdf] = useState(null);
    const fetchAssignment = async () => {
        try {
            setLoading(true);
            const token=localStorage.getItem('token')
            const response = await axios.get(`${BASE_URL}/employee/course/${courseId}/assignments/${assignmentId}`,{
                headers: {
                    "Authorization":`Bearer ${token}`
                }
                    
            });
            setAssignment(response.data.assignmentDetails);
            if(response.data.submissionDetails){
            setSubmissionDetails(response.data?.submissionDetails[0])
            setSubmissionId(response.data?.submissionDetails[0]?.submissionId)
            document.title=response.data.assignmentDetails.title
            }
        } catch (err) {
            
            setError('Failed to load assignment details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        
        
        fetchAssignment();
    }, [assignmentId]);

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-600">{error}</p>;

    const { title, description, deadline } = assignment;
    const deadlineDate = dayjs(deadline).format('MMMM D, YYYY h:mm A');
    const submission = submissionDetails || null;
    const gradeBook = submission?.gradeBook;
    const grade = gradeBook?.grade;

    let submissionStatus;
    if (!submission) {
        submissionStatus = 'No submissions';
    } else if (submission && !gradeBook) {
        submissionStatus = 'Not graded yet';
    } else {
        submissionStatus = `Grade: ${grade}%`;
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setUploadError(null);
        } else {
            setUploadError("Please upload a valid PDF file.");
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadError("Please select a PDF file before uploading.");
            return;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('courseId', courseId);
        

        try {
            const token=localStorage.getItem('token')
            formData.append('assignmentId', assignmentId);
            if (!submission) {
                
                // No submission present, so create a new submission
                const response = await fetch(`${BASE_URL}/employee/uploadAssignment`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                });
                if (response.status==200) {
                    alert('Assignment submitted successfully!');
                    setFile(null);
                    setUploadError(null);
                    fetchAssignment();
                } else {
                    setUploadError("Failed to upload assignment. Please try again.");
                }
            } else {
                formData.append('submissionId', submissionId)
                const response=await fetch(`${BASE_URL}/employee/updateUploadedAssignment/${submissionId}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                });
                if (response.status==200) {
                    alert('Assignment updated successfully!');
                    setFile(null);
                    setUploadError(null);
                    fetchAssignment();
                } else {
                    setUploadError("Failed to update assignment. Please try again.");
                }
            }
            
            // Reload the assignment data to reflect the latest submission
            fetchAssignment();
        } catch (error) {
            setUploadError("Failed to upload assignment. Please try again.");
        }
    };

    const handleViewSubmission = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch(`${BASE_URL}/employee/course/${courseId}/assignment/${assignmentId}/viewSubmission`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }); // Replace with your API endpoint
            if (response.status === 200) {
                const file = await response.blob();
                const fileUrl = URL.createObjectURL(file);
                document.getElementById('my_modal_4').showModal()
                setSubmissionPdf(fileUrl);
            } else {

                setError("Failed to fetch submission");
            }

        } catch (error) {
            console.error('Error fetching submission:', error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-base-100 shadow-lg rounded-lg mt-6">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="text-gray-600 mb-4">{description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-semibold">Deadline:</h3>
                    <p>{deadlineDate}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Submission Status:</h3>
                    <p>{submissionStatus}</p>
                </div>
            </div>

            {submission && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold mb-2">Submission Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold">Submission Status:</h4>
                            <p>{submission.submissionStatus}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold">Submitted At:</h4>
                            <p>{dayjs(submission.submissionAt).format('MMMM D, YYYY h:mm A')}</p>
                        </div>
                        {gradeBook && (
                            <>
                                <div>
                                    <h4 className="font-semibold">Grade:</h4>
                                    <p>{grade}%</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">Feedback:</h4>
                                    <p>{gradeBook.feedback}</p>
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        onClick={handleViewSubmission}
                        className="btn btn-primary mt-4"
                    >
                        View Submission
                    </button>
                </div>
            )}
            <dialog id="my_modal_4" className="modal">
                    <div className="modal-box w-11/12 max-w-5xl">
                        <h3 className="font-bold text-lg text-center">Submission</h3>
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <div className="w-full content-center">
                            <div className="mt-4">
                            <object
            data={submissionPdf}
            type="application/pdf"
            className="w-full h-[75vh] sm:h-[60vh] md:h-[70vh]"
            style={{ minHeight: 'calc(100vh - 150px)', width: '100%' }}
        >
            <p>Your browser does not support viewing PDF files.
               <a href={submissionPdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline"> Open PDF in new tab</a>
            </p>
        </object>
                            </div>
                        </div>


                    </div>
                </dialog>

            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Upload Assignment</h3>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full max-w-xs"
                    disabled={!!gradeBook} // Disable if assignment is graded
                />
                {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}

                <button
                    onClick={handleUpload}
                    disabled={!!gradeBook} // Disable if assignment is graded
                    className="btn btn-primary mt-4"
                >
                    {submission ? 'Update Assignment' : 'Submit Assignment'}
                </button>
            </div>
        </div>
    );
};

export default AssignmentView;
