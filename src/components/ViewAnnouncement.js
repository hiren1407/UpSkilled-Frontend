import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

const ViewAnnouncement = () => {
    const dispatch = useDispatch();
    const userRole = useSelector((state) => state.user.role)
    const [announcement, setAnnouncement] = useState([]);
    const [editedAnnouncement, setEditedAnnouncement] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { courseId } = useParams();

    const { announcementId } = useParams();

    useEffect(() => {
        if(userRole=="instructor")
        {
        try {
            const response = axios.get(`${BASE_URL}/instructor/getAnnouncementById/${announcementId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                }
            );
            response.then((res) => {
                setAnnouncement(res.data);
                setEditedAnnouncement(res.data);
                setLoading(false);
            })
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }
    else{
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

    const closeModal = () => {
        setShowModal(false);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-dots loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
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
                        <button className="btn" onClick={() => setShowModal(true)}>
                            Edit
                        </button>
                        <button className="btn btn-error" onClick={() => setShowDeleteModal(true)}>Delete</button>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative bg-slate-700 p-4 rounded-lg shadow-lg w-1/2 text-center left-20">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
                        <h3 className="font-bold text-lg">Edit Announcement</h3>
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
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                        <h3 className="font-bold text-lg">Are you sure you want to delete this announcement?</h3>
                        <button className="btn m-4" onClick={handleDelete}>Yes</button>
                        <button className="btn m-4" onClick={() => setShowDeleteModal(false)}>
                            No
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}


export default ViewAnnouncement;