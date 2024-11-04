import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const ViewAnnouncement = () => {
    const { announcement, loading, error } = useSelector((state) => state.announcement);

    // useEffect(() => {
    //     const courseId = 1;
    //     dispatch(getAnnouncement(courseId));
    // }, [dispatch]);

    useEffect(() => {
        const courseId = 1;
        const response = axios.get(`${BASE_URL}/employee/course/${courseId}/announcements`);
        response.then((res) => {
            console.log(res.data);
        }
        ).catch((err) => {
            console.log(err);
        });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <h1 className="h1 text-center p-2">Announcements</h1>
                    <ul className="p-8">
                        {announcement.map((item, index) => (
                            <li key={index} className="flex justify-between gap-x-6 p-5 border">
                                <div className="flex min-w-0 gap-x-4 ">
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-xl">{item.title}</p>
                                        <p className="mt-1 truncate text-sm ">{item.content}</p>
                                    </div>
                                </div>
                                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                    <p className=""></p>
                                    <p className=""> <time dateTime="2023-01-23T13:23Z"></time></p>
                                </div>
                            </li>
                        ))}
                    </ul>

                </div>
            </div>
        </div>
    );
};

export default ViewAnnouncement;
