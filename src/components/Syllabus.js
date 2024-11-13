import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { useParams } from "react-router-dom";

const Syllabus = () => {
    const course = useSelector((state) => state.courseDetails.course);
    const role = useSelector((state) => state.user.role);
    const [syllabus, setSyllabus] = useState(null);
    const [newSyllabus, setNewSyllabus] = useState(null); // State for the new syllabus file
    const { courseId } = useParams();
    const [status, setStatus] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null); // Reference to the file input

    const fetchSyllabus = async () => {
        try {
            const url = role === 'instructor' 
                ? `${BASE_URL}/instructor/${courseId}/syllabus`
                : `${BASE_URL}/employee/${courseId}/syllabus`; // Example URL for employee

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                responseType: 'blob' // Important for handling PDF files
            });

            if (response.status === 200) {
                const file = await response.blob();
                const fileUrl = URL.createObjectURL(file);
                setSyllabus(fileUrl);
            } else {
                setError("Failed to fetch syllabus");
            }
        } catch (error) {
            console.error("Error fetching syllabus:", error);
            alert("Failed to fetch syllabus");
        }
    };


    useEffect(() => {
        document.title = "Syllabus";
        fetchSyllabus();
    }, [courseId, role]);

    const handleUpload = async () => {
        if (!newSyllabus) {
            setFileError('Please select a file to upload');
            return;
        };
        const formData = new FormData();
        formData.append("file", newSyllabus);

        try {
            const response = await fetch(`${BASE_URL}/instructor/uploadSyllabus/${course.id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: formData
            });

            if (response.ok) {
                setStatus('success');
                setNewSyllabus(null);
                setFileError(null);
                setError(null);
                fetchSyllabus();
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error("Error uploading syllabus:", error);
            setStatus('error');
        }
    };

    return (
        <div className="flex flex-wrap justify-center px-16 py-8">
            <h1 className="text-3xl font-bold text-center">Course Syllabus</h1>
            <div className="hero place-items-start">
                <div className="w-full">
                    <div className="flex justify-between">
                        <div className="w-4/5">
                            <h1 className="text-xl font-bold">{course.title} - {course.name}</h1>
                            <h2 className="text-lg font-bold">Instructor: {course.instructorName} </h2>
                            <p className="py-4">
                                {course.description}
                            </p>
                        </div>
                        {role === 'instructor' && (
                            <div className="form-control w-64 align-right">
                                <label className="label">
                                    <span className="text-xl">Upload Syllabus</span>
                                </label>
                                <input type="file" className="file-input file-input-bordered w-full max-w-xs mb-2" onChange={(e) => setNewSyllabus(e.target.files[0])} ref={fileInputRef} />
                                {fileError && <p className="text-red-500 mb-2">{fileError}</p>}
                                <button className="btn btn-primary" onClick={handleUpload}>Upload Syllabus</button>
                            </div>
                        )}
                    </div>
                    {!error && <button className="btn py-0" onClick={() => document.getElementById('my_modal_4').showModal()}>Show Syllabus</button>}
                    {(
                        <dialog id="my_modal_4" className="modal">
                            <div className="modal-box w-11/12 max-w-5xl">
                                <h3 className="font-bold text-lg text-center">Syllabus</h3>
                                <form method="dialog" onSubmit={(e) => e.preventDefault()}>
                                <button type="button" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => document.getElementById('my_modal_4').close()}>✕</button>
                                </form>
                                <div className="w-full content-center">
                                    <div className="mt-4">
                                        <iframe src={syllabus} style={{ width: '100%', height: '75vh' }} title="PDF Preview" />
                                    </div>
                                </div>
                            </div>
                        </dialog>
                    )}

                </div>
            </div>

            {status === 'success' &&
                (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                            <h3 className="font-bold text-lg">Syllabus uploaded successfully!</h3>
                            <button className="btn btn-primary mt-4" onClick={() => { setStatus(null); fetchSyllabus() }}>Close</button>
                        </div>
                    </div>
                )
            }

            {error &&
                (
                    <div role="alert" className="alert alert-error my-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current"
                            fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Error! No Syllabus found.</span>
                    </div>
                )
            }

        </div>
    );
}

export default Syllabus;