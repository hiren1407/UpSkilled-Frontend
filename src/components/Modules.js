import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const CourseMaterial = () => {
    const [allModules, setAllModules] = useState([]);
    const [modulePdf, setModulePdf] = useState(null);
    const { courseId } = useParams();
    const courseDetails = useSelector((state) => state.courseDetails.course);
    const userRole = useSelector((state) => state.user.role);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [moduleError, setModuleError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPdf, setNewPdf] = useState(null);
    const [moduleId, setModuleId] = useState(null);

    const fetchModules = async () => {
        setLoading(true);
        document.title = `Modules - ${courseDetails.title}`;
        try {
            let url;
            if (userRole === "instructor") {
                url = `${BASE_URL}/instructor/getCourseMaterials/${courseId}`;
            }
            else if (userRole === "employee") {
                url = `${BASE_URL}/employee/getCourseMaterials/${courseId}`
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json();
            setAllModules(data);
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (courseDetails.length !== 0) fetchModules();
    }, [courseDetails]);

    const handleCreateModule = async () => {
        if (userRole !== "instructor") return;
        if (!newTitle || !newDescription || !newPdf) {
            setModuleError("Please fill in all fields");
            return;
        }

        try {
            const formData = new FormData();
            let response;
            if (isEditing) {
                formData.append("newMaterialTitle", newTitle);
                formData.append("newMaterialDescription", newDescription);
                formData.append("file", newPdf);
                response = await fetch(`${BASE_URL}/instructor/updateCourseMaterial/${courseId}/${moduleId}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: formData
                });
            }
            else {
                formData.append("materialTitle", newTitle);
                formData.append("materialDescription", newDescription);
                formData.append("file", newPdf);
                response = await fetch(`${BASE_URL}/instructor/uploadCourseMaterial/${courseId}`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: formData
                });
            }
            if (response.ok) {
                document.getElementById('moduleDetails').close();
                setNewTitle("");
                setNewDescription("");
                setNewPdf(null);
                setModuleError("");
                fetchModules();
            }
            else {
                setModuleError("Failed to create module");
            }
        }
        catch (error) {
            setModuleError(error.message);
        }
    }

    const handleViewModule = async (id) => {
        document.getElementById('modulePdf').showModal();
        let url;
        if (userRole === "instructor") {
            url = `${BASE_URL}/instructor/getCourseMaterial/${courseId}/${id}`;
        }
        else {
            url = `${BASE_URL}/employee/getCourseMaterial/${courseId}/${id}`;
        }
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        const file = await response.blob();
        const fileUrl = URL.createObjectURL(file);
        setModulePdf(fileUrl);
    }

    const handleEdit = async (data) => {
        if (userRole !== "instructor") return;
        setIsEditing(true);
        setNewTitle(data.materialTitle);
        setNewDescription(data.materialDescription);
        setModuleId(data.id);
        document.getElementById('moduleDetails').showModal();
    }

    const handleDelete = async () => {
        if (userRole !== "instructor") return;
        try {
            const response = await fetch(`${BASE_URL}/instructor/deleteCourseMaterial/${courseId}/${moduleId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const result = await response.json();
            if (result) {
                document.getElementById('deleteModule').close();
                fetchModules();
            }
            else {
                console.log(result.message);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const openModal = () => {
        setIsEditing(false);
        setNewTitle("");
        setNewDescription("");
        setNewPdf(null);
        document.getElementById('moduleDetails').showModal();
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-dots loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-center">
                <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2>
                <p className="text-lg text-gray-600 mb-6">
                    We encountered an error. Please try again later.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-200"
                >
                    Reload Page
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center m-4">
                <h1 className="text-4xl text-center flex-grow">Course Materials for {courseDetails.title}</h1>
                {userRole === "instructor" && <button className="btn btn-neutral" onClick={openModal}>Create New</button>}
            </div>
            <div className="row mx-2">
                <div className="col-md-6">
                    {allModules.length !== 0 ? (allModules.map((data) => (
                        <div key={data.id} className="collapse collapse-plus bg-base-200 my-2">
                            <input type="radio" name="my-accordion-3" defaultChecked={allModules[0] === data} />
                            <div className="collapse-title text-xl font-medium flex justify-between">
                                <span>{data.materialTitle}</span>
                            </div>
                            <div className="collapse-content">
                                <p>{data.materialDescription}</p>
                                <div className="flex justify-between mt-2">
                                    <button className="btn btn-neutral" onClick={() => handleViewModule(data.id)}>View Module</button>
                                    {userRole === 'instructor' &&
                                        <div>
                                            <button className="btn btn-warning mt-2" onClick={() => { handleEdit(data) }}>
                                                <FontAwesomeIcon icon={faEdit} /> Edit
                                            </button>
                                            <button className="btn btn-danger mt-2" onClick={() => { setModuleId(data.id); document.getElementById('deleteModule').showModal() }}>
                                                <FontAwesomeIcon icon={faTrash} /> Delete
                                            </button>
                                        </div>}
                                </div>
                            </div>
                        </div>
                    ))) : <p className="text-center text-xl">No modules available</p>}

                    <dialog id="moduleDetails" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">{isEditing ? 'Edit Module Details' : 'Create a new module'}</h3>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>

                            <div className="modal-body">
                                <div className="form-control w-full max-w-md">
                                    <label className="label">
                                        <span className="text-xl">Module Title</span>
                                    </label>

                                    <input type="text" className="input input-bordered w-full" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                                </div>
                                <div className="form-control w-full ">
                                    <label className="label">
                                        <span className="text-xl">Module Description</span>
                                    </label>
                                    <textarea className="textarea textarea-bordered w-full h-48" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />

                                </div>
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="text-xl">Upload PDF</span>
                                    </label>

                                    <input type="file" accept="application/pdf" className="file-input file-input-bordered w-full" onChange={(e) => setNewPdf(e.target.files[0])} />
                                    {moduleError && <p className="text-red-500">{moduleError}</p>}
                                </div>
                                <div className="form-control w-full mt-4">
                                    <button className="btn btn-primary" onClick={handleCreateModule}>{isEditing ? 'Edit Module' : 'Create Module'}</button>
                                </div>
                            </div>
                        </div>
                    </dialog>

                    <dialog id="modulePdf" className="modal">
                        <div className="modal-box w-11/12 max-w-5xl">
                            <h3 className="font-bold text-lg text-center">{ }</h3>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <div className="w-full content-center">
                                <div className="mt-4">
                                    <iframe src={modulePdf} style={{ width: '100%', height: '75vh' }} title="PDF Preview" />
                                </div>
                            </div>
                        </div>
                    </dialog>

                    <dialog id="deleteModule" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Delete module</h3>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this module?</p>
                                <div className="flex justify-between mt-4">
                                    <button className="btn btn-danger" onClick={() => handleDelete()}>Delete</button>
                                    <button className="btn btn-primary" onClick={() => document.getElementById('deleteModule').close()}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </dialog>
                </div>
            </div>
        </div>
    );
}

export default CourseMaterial;