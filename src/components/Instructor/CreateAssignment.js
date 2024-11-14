import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../utils/constants";

const CreateAssignment = () => {
    document.title = "Create Assignment";
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [dueTime, setDueTime] = useState("");
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
            const deadline = new Date(`${dueDate}T${dueTime}`).getTime().toString();
            const assignmentDetails = {
                title: name,
                description: description,
                deadline
            };
            const response = await fetch(`${BASE_URL}/instructor/${courseId}/assignment/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(assignmentDetails)
            });

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
        <div className="flex p-8 mx-2 text-center flex-col">
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
                    type="date"
                    className="input input-bordered w-full"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <label className="label">Due Time</label>
                <input
                    type="time"
                    className="input input-bordered w-full"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                />
                <button
                    type="submit"
                    className="btn btn-neutral mt-5"
                    disabled={loading}
                >
                    Create
                </button>
            </form>
            {status === 'success' &&
                (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                            <h3 className="font-bold text-lg">Assignment created successfully!</h3>
                            <button className="btn btn-neutral mt-4" onClick={() => { navigate(`/instructor/course/${courseId}/assignments`) }}>Close</button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default CreateAssignment;