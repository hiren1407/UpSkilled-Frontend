import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CourseDashboard = () => {
    document.title = "Course Dashboard";
    const courseDetails = useSelector((state) => state.courseDetails);
    const loading = courseDetails.loading;
    const error = courseDetails.error;
    const navigate = useNavigate();
    const courseId = useSelector((store) => store.courseDetails.course.id);

    const createAnnouncement = () => {
        navigate(`/instructor/course/${courseId}/create-announcement`);
    }

    if (loading) {
        return <span className="loading loading-dots loading-lg"></span>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div className="flex w-1/2 border-2 p-2 m-2 text-center flex-col">
                <label className="px-2 self-center">Quick Links</label>
                <div className="border-white border-2">
                    <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg" onClick={createAnnouncement}>Create Announcements</button>
                    <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg" onClick={() => navigate(`announcements`)}>View Announcements</button>
                    <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg" onClick={() => navigate(`syllabus`)}>Syllabus</button>
                </div>
            </div>
        </div>
    );
}

export default CourseDashboard;