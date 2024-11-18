import { useEffect, useState } from "react"; // Importing necessary React hooks
import axios from "axios"; // Importing axios for making HTTP requests
import { BASE_URL } from "../utils/constants"; // Importing base URL for API requests
import { useSelector } from "react-redux"; // Importing useSelector to access Redux state
import { useNavigate, useParams } from "react-router-dom"; // Importing hooks for navigation and URL parameters

// Main component for viewing announcements
const ViewAnnouncement = () => {
    document.title = "Announcements"; // Setting the document title for the page
    const [announcements, setAnnouncements] = useState([]); // State to hold announcements
    const user = useSelector((state) => state.user); // Getting user information from Redux state
    const navigate = useNavigate(); // Hook for programmatic navigation
    const { courseId } = useParams(); // Extracting courseId from URL parameters

    // useEffect hook to fetch announcements when the component mounts
    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieving token from local storage
        // Checking user role to determine the API endpoint
        if (user.role === "instructor") {
            // Making GET request for instructor announcements
            const response = axios.get(`${BASE_URL}/instructor/course/${courseId}/announcements`, {
                headers: {
                    "Authorization": `Bearer ${token}` // Setting authorization header
                }
            });

            response.then((res) => {
                setAnnouncements(res.data); // Setting state with fetched announcements
            }).catch((err) => {
                console.log(err); // Logging error if fetching fails
            });
        } else {
            // Making GET request for employee announcements
            const response = axios.get(`${BASE_URL}/employee/course/${courseId}/announcements`, {
                headers: {
                    "Authorization": `Bearer ${token}` // Setting authorization header
                }
            });
            response.then((res) => {
                setAnnouncements(res.data); // Setting state with fetched announcements
            }).catch((err) => {
                console.log(err); // Logging error if fetching fails
            });
        }
    }, [user, courseId]); // Dependencies array to run effect when user or courseId changes

    return (
        <div className="flex flex-wrap justify-center w-4/5 justify-self-center mx-5 my-1"> {/* Main container for announcements */}
            <div className="flex justify-between items-center my-4 w-full"> {/* Header section */}
                <h1 className="text-2xl md:text-3xl text-center font-bold flex-grow">Announcements</h1> {/* Title for announcements */}
            </div>
            <div className="flex justify-end w-full mb-2"> {/* Button section for creating new announcements */}
                {user.role === "instructor" && <button className="btn btn-success btn-sm md:btn-md" onClick={() => navigate(`/instructor/course/${courseId}/create-announcement`)}>Create New</button>} {/* Button for instructors to create new announcements */}
            </div>
            {announcements.length === 0 ? (
                <p className="text-center text-xl">No announcements found</p> // Message when no announcements are available
            ) : (
                <div className="p-8 border-2 w-4/5 md:w-full bg-slate-700"> {/* Container for announcements */}
                    {announcements.map((announcement, index) => (
                        <div key={index} className="shadow-md rounded-md p-4  my-4 bg-base-300 cursor-pointer" onClick={() => navigate(`${announcement.id}`)}> {/* Individual announcement item */}
                            <h2 className="text-xl font-bold">{announcement.title}</h2> {/* Title of the announcement */}
                            <p className="text-md  truncate max-w-md">{announcement.content}</p> {/* Content of the announcement */}
                            <p className="text-sm ">Posted on: {new Date(announcement.updatedAt).toLocaleString()}</p> {/* Date of the announcement */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Exporting the ViewAnnouncement component for use in other parts of the application
export default ViewAnnouncement;