import { useState } from "react";
import { BASE_URL } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateAnnouncement = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const courseId = useSelector((store) => store.courseDetails.course.id);
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
        }
    }

    const closePopup = () => {
        setShowPopup(false);
        navigate(`/instructor/course/${courseId}/announcements`);
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
                </form>
                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                            <h3 className="font-bold text-lg">Announcement Created Successfully!</h3>
                            <button className="btn mt-4" onClick={closePopup}>
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateAnnouncement;