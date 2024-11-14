import { useState } from "react";
import { BASE_URL } from "../../utils/constants";
import { useNavigate, useParams } from "react-router-dom";

const CreateAnnouncement = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [error, setError] = useState(null);
    const { courseId } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch(`${BASE_URL}/instructor/course/${courseId}/announcement`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, content }),
        });
        if (response.ok) {
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                navigate(`/instructor/course/${courseId}/announcements`);
            }, 2000);
        }
        else {
            setError("Failed to create announcement");
        }
    }

    return (
        <div className="flex justify-center">
            <div className="w-3/4 border-2 p-2 my-8 text-center self-center ">
                <h2 className="my-2 text-2xl">Create Announcement</h2>
                <form onSubmit={handleSubmit} className="flex flex-col p-12">
                    <input type="text" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)}
                        className="input input-bordered m-2 p-6" />
                    <textarea placeholder="Description" value={content} onChange={(event) => setContent(event.target.value)}
                        className="textarea textarea-bordered textarea-lg m-2 min-h-96"></textarea>
                    <button type="submit" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg my-2">Create Announcement</button>
                    {error && <div className="alert alert-error">{error}</div>}
                </form>
                {showPopup && (
                    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
                        <div className="p-4 rounded shadow-lg">
                            <div className="alert alert-info">
                                <span>Announcement Created Successfully.</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateAnnouncement;