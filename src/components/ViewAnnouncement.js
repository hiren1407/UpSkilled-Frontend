import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

const ViewAnnouncement = () => {
    const userRole = useSelector((state) => state.user.role); // Get user role from Redux store
    const [announcement, setAnnouncement] = useState([]); // State variable for announcement details
    const [editedAnnouncement, setEditedAnnouncement] = useState({}); // State variable for edited announcement details
    const [loading, setLoading] = useState(false); // State variable for loading state
    const [error, setError] = useState(null); // State variable for error message
    const [showEditPopup, setShowEditPopup] = useState(false); // State variable for showing popup
    const [showDeletePopup, setShowDeletePopup] = useState(false); // State variable for showing popup
    const navigate = useNavigate(); // Hook to navigate programmatically
    const { courseId, announcementId } = useParams(); // Get courseId and announcementId from URL parameters

    const fetchAnnouncement = async () => {
        setLoading(true); // Set loading state to true
        try {
            const response = await axios.get(
                `${BASE_URL}/${userRole === "instructor" ? "instructor" : "employee"}/getAnnouncementById/${announcementId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Include authorization token
                    }
                }
            );
            document.title = response.data.title; // Set document title to announcement title
            setAnnouncement(response.data); // Set announcement details
            setEditedAnnouncement(response.data); // Set edited announcement details
            setLoading(false); // Set loading state to false
        } catch (error) {
            setError(error.message); // Set error message
            setLoading(false); // Set loading state to false
        }
    };
    useEffect(() => {
        // Fetch announcement details on component mount
        fetchAnnouncement();
    }, []);

    // Function to handle announcement update
    const handleUpdate = async (event) => {
        setLoading(true); // Set loading state to true
        event.preventDefault(); // Prevent default form submission behavior
        try {
            const response = await fetch(`${BASE_URL}/instructor/announcement/${announcementId}`, {
                method: 'PUT', // HTTP method for updating
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Include authorization token
                },
                body: JSON.stringify(editedAnnouncement), // Send edited announcement details
            });
            if (response.ok) {
                setShowEditPopup(true); // Showing popup
            } else {
                setError('Failed to update announcement'); // Set error message
            }
        } catch (err) {
            setError('Failed to update announcement'); // Set error message
        }
        setLoading(false); // Set loading state to false
    };

    // Function to handle announcement deletion
    const handleDelete = async () => {
        setLoading(true); // Set loading state to true
        try {
            const response = await fetch(`${BASE_URL}/instructor/deleteAnnouncementById/${announcementId}`, {
                method: 'DELETE', // HTTP method for deleting
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Include authorization token
                }
            });

            if (response.ok) {
                setShowDeletePopup(true); // Showing popup
            } else {
                setError('Failed to delete announcement'); // Set error message
            }
        } catch (err) {
            setError('Failed to delete announcement'); // Set error message
        }
        setLoading(false); // Set loading state to false
    };

    // Show loading spinner while loading
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen" role="status" aria-live="polite">
                <span className="loading loading-dots loading-lg" aria-label="Loading"></span>
            </div>
        );
    }

    // Show error message if there is an error
    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-center" role="alert">
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
        <main className="flex flex-col w-4/5 items-center justify-self-center" role="main">
            <h1 className="text-2xl md:text-3xl text-center font-bold my-4 w-full">Announcement Details</h1>
            <section className="bg-slate-700 p-6 rounded-lg shadow-lg w-full">
                <div className="card bg-base-300 rounded-box grid h-20 items-center px-5">
                    <h2 className="text-2xl font-bold">{announcement.title}</h2>
                </div>

                <div className="divider"></div>

                <div className="card bg-base-300 rounded-box grid min-h-fit place-items-left p-5">
                    <p>{announcement.content}</p>
                    <p className="mt-4 text-sm text-gray-500">Posted on: {new Date(announcement.updatedAt).toLocaleString()}</p>
                </div>
                {userRole === 'instructor' && (
                    <div className="flex justify-between mt-4">
                        <button className="btn" onClick={() => document.getElementById('editAnnouncement').showModal()}>
                            Edit
                        </button>
                        <button className="btn btn-error" onClick={() => document.getElementById('deleteAnnouncement').showModal()}>Delete</button>
                    </div>
                )}
            </section>

            <dialog id="editAnnouncement" className="modal" aria-labelledby="editAnnouncementTitle">
                <div className="modal-box w-11/12 max-w-5xl">
                    <h3 id="editAnnouncementTitle" className="font-bold text-lg text-center">Edit Announcement</h3>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Close">✕</button>
                    </form>
                    <form className="flex flex-col p-8" onSubmit={handleUpdate}>
                        <label htmlFor="announcementTitle" className="sr-only">Title</label>
                        <input id="announcementTitle" type="text" placeholder="Title" value={editedAnnouncement.title}
                            onChange={(event) => setEditedAnnouncement({ ...editedAnnouncement, title: event.target.value })}
                            className="input input-bordered m-2 p-6 text-2xl" />
                        <label htmlFor="announcementContent" className="sr-only">Description</label>
                        <textarea id="announcementContent" placeholder="Description" value={editedAnnouncement.content}
                            onChange={(event) => setEditedAnnouncement({ ...editedAnnouncement, content: event.target.value })}
                            className="textarea textarea-bordered textarea-lg m-2" style={{ minHeight: '40vh' }}></textarea>
                        <button type="submit" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg mt-2">
                            Update
                        </button>
                    </form>
                </div>
            </dialog>

            <dialog id="deleteAnnouncement" className="modal" aria-labelledby="deleteAnnouncementTitle">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Close">✕</button>
                    </form>
                    <div className="content-center">
                        <div className="mt-4"></div>
                        <h3 id="deleteAnnouncementTitle" className="font-bold text-lg">Are you sure you want to delete this announcement?</h3>
                        <button className="btn m-4" onClick={handleDelete}>Yes</button>
                        <button className="btn m-4" onClick={() => document.getElementById('deleteAnnouncement').close()}>
                            No
                        </button>
                    </div>
                </div>
            </dialog>


            {/*Update Popup Notification */}
            {userRole === 'instructor' && showEditPopup &&
                (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10" role="dialog" aria-labelledby="popupMessageTitle">
                        <div className="bg-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                            <h3 id="popupMessageTitle" className="font-bold text-lg text-white">Assignment update successfully</h3> {/* Popup message */}
                            <button className="btn btn-neutral mt-4" onClick={() => { setShowEditPopup(false); fetchAnnouncement() }}>Close</button> {/* Close button for popup */}
                        </div>
                    </div>
                )
            }

            {/*Delete Popup Notification */}
            {userRole === 'instructor' && showDeletePopup &&
                (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10" role="dialog" aria-labelledby="popupMessageTitle">
                        <div className="bg-slate-700 p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                            <h3 id="popupMessageTitle" className="font-bold text-lg text-white">Assignment Deleted successfully</h3> {/* Popup message */}
                            <button className="btn btn-neutral mt-4" onClick={() => { setShowDeletePopup(false); navigate(`/instructor/course/${courseId}/announcements`) }}>Close</button> {/* Close button for popup */}
                        </div>
                    </div>
                )
            }
        </main>
    );
};

export default ViewAnnouncement;