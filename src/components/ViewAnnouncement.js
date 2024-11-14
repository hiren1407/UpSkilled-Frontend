import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

const ViewAnnouncement = () => {
    const userRole = useSelector((state) => state.user.role)
    const [announcement, setAnnouncement] = useState([]);
    const [editedAnnouncement, setEditedAnnouncement] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const { courseId, announcementId } = useParams();

    useEffect(() => {
        if (userRole === "instructor") {
            try {
                const response = axios.get(`${BASE_URL}/instructor/getAnnouncementById/${announcementId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    }
                );
                response.then((res) => {
                    document.title = res.data.title;
                    setAnnouncement(res.data);
                    setEditedAnnouncement(res.data);
                    setLoading(false);
                })
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        }
        else {
            try {
                const response = axios.get(`${BASE_URL}/employee/getAnnouncementById/${announcementId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    }
                );
                response.then((res) => {
                    setAnnouncement(res.data);

                    setLoading(false);
                })
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }

        }
    }, [user, announcementId]);

    const handleUpdate = async (event) => {
        setLoading(true);
        event.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/instructor/announcement/${announcementId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(editedAnnouncement),
            });
            if (response.ok) {
                setTimeout(() => {
                    navigate(`/instructor/course/${courseId}/announcements`);
                }
                    , 1000);
            } else {
                setError('Failed to update announcement');
            }
        } catch (err) {
            setError('Failed to update announcement');
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/instructor/deleteAnnouncementById/${announcementId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setTimeout(() => {
                    navigate(`/instructor/course/${courseId}/announcements`);
                }
                    , 500);
            } else {
                setError('Failed to delete announcement');
            }
        } catch (err) {
            setError('Failed to delete announcement');
        }
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
        <div className="flex flex-col w-4/5 items-center justify-self-center">
            <h1 className="text-4xl text-center my-4 w-full">Announcement Details</h1>
            <div className="bg-slate-700 p-6 rounded-lg shadow-lg w-full">
                <div className="card bg-base-300 rounded-box grid h-20 items-center px-5">
                    <h2 className="text-2xl font-bold">{announcement.title}</h2>
                </div>

                <div className="divider"></div>

                <div className="card bg-base-300 rounded-box grid min-h-fit place-items-left p-5">
                    <p className="">{announcement.content}</p>
                    <p className="mt-4 text-sm text-gray-500">Posted on: {new Date(announcement.updatedAt).toLocaleString()}</p>
                </div>
                {user.role === 'instructor' && (
                    <div className="flex justify-between mt-4">
                        <button className="btn" onClick={() => document.getElementById('editAnnouncement').showModal()}>
                            Edit
                        </button>
                        <button className="btn btn-error" onClick={() => document.getElementById('deleteAnnouncement').showModal()}>Delete</button>
                    </div>
                )}
            </div>

            <dialog id="editAnnouncement" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <h3 className="font-bold text-lg text-center">Edit Announcement</h3>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <form className="flex flex-col p-8" onSubmit={handleUpdate}>
                        <input type="text" placeholder="Title" value={editedAnnouncement.title}
                            onChange={(event) => setEditedAnnouncement({ ...editedAnnouncement, title: event.target.value })}
                            className="input input-bordered m-2 p-6 text-2xl" />
                        <textarea placeholder="Description" value={editedAnnouncement.content}
                            onChange={(event) => setEditedAnnouncement({ ...editedAnnouncement, content: event.target.value })}
                            className="textarea textarea-bordered textarea-lg m-2 " style={{ minHeight: '40vh' }}></textarea>
                        <button type="submit" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg mt-2">
                            Update
                        </button>
                    </form>
                </div>
            </dialog>

            <dialog id="deleteAnnouncement" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div className="content-center">
                        <div className="mt-4">
                            <h3 className="font-bold text-lg">Are you sure you want to delete this announcement?</h3>
                            <button className="btn m-4" onClick={handleDelete}>Yes</button>
                            <button className="btn m-4" onClick={() => document.getElementById('deleteAnnouncement').close()}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            </dialog>
        </div>
    );
}


export default ViewAnnouncement;