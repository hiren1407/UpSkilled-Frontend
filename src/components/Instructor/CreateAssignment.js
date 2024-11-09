import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";

const CreateAssignment = () => {
    document.title = "Create Assignment";
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();
    const { courseId } = useParams();

    const handleCreate = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const assignmentDetails = {
                "title": name,
                "description": description,
                "deadline": new Date(dueDate).getTime().toString()
            }
            const response = await fetch(`${BASE_URL}/instructor/${courseId}/assignment/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(assignmentDetails)
            });

            console.log(response);
            if (response.ok) {
                setStatus('success');
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.error("Error creating syllabus:", error);
            setError('Failed to create assignment');
        }
        setLoading(false);
    }

    return (
        <div>
            <div className="flex p-12 m-2 text-center flex-col">
                <form className="flex flex-col " onSubmit={handleCreate}>
                    <label className="text-2xl">Assignment Details</label>
                    <label className="label">Assignment Name</label>
                    <input
                        type="text"
                        placeholder="Assignment Name"
                        className="input input-bordered"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label className="label">Description</label>
                    <textarea className="textarea textarea-bordered textarea-lg" style={{ minHeight: '40vh' }} placeholder="Description"
                        value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    <label className="label">Due Date</label>
                    <input
                        type="datetime-local"
                        placeholder="Due Date"
                        className="input input-bordered w-64"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary mt-5"
                        disabled={loading}
                    >
                        Create
                    </button>
                    {loading && <span className="loading loading-lg"></span>}
                    {error && <div className="text-red-500">{error}</div>}
                </form>
            </div>
            {status === 'success' &&
                (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                            <h3 className="font-bold text-lg">Assignment created successfully!</h3>
                            <button className="btn btn-primary mt-4" onClick={() => { navigate(`/instructor/course/${courseId}/assignments`) }}>Close</button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default CreateAssignment;