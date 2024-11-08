import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const ViewAnnouncement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    const { courseId } = useParams();

    useEffect(() => {
        if (user.role === "instructor") {
            const response = axios.get(`${BASE_URL}/instructor/course/${courseId}/announcements`,
                {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                }
            );

            response.then((res) => {
                setAnnouncements(res.data);
            }
            ).catch((err) => {
                console.log(err);
            });
        }
        else {
            const response = axios.get(`${BASE_URL}/employee/course/${courseId}/announcements`);
            response.then((res) => {
                setAnnouncements(res.data);
            }
            ).catch((err) => {
                console.log(err);
            });
        }
    }, [user, courseId]);

    return (
        <div className="flex flex-col w-4/5 items-center justify-self-center">
            <div className="flex justify-between items-center my-4 w-full">
                <h1 className="text-4xl text-center flex-grow">Announcements</h1>
                <button className="btn btn-primary" onClick={() => navigate(`/instructor/course/${courseId}/create-announcement`)}>Create New</button>
            </div>
            {announcements.length === 0 ? <p className="text-center text-xl">No announcements found</p> :
                <div className="p-8 border-2 w-full bg-slate-700">
                    {announcements.map((announcement, index) => (
                        <div key={index} className="shadow-md rounded-md p-4  my-4 bg-base-300 cursor-pointer" onClick={() => navigate(`${announcement.id}`)}>
                            <h2 className="text-xl font-bold">{announcement.title}</h2>
                            <p className="text-md  truncate max-w-md">{announcement.content}</p>
                            <p className="text-sm ">Posted on: {new Date(announcement.updatedAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
};

export default ViewAnnouncement;
