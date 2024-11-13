import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const CourseDashboard = () => {
    const courseDetails = useSelector((state) => state.courseDetails);
    document.title = `${courseDetails.course.title} - Dashboard`;
    const loading = courseDetails.loading;
    const error = courseDetails.error;
    const navigate = useNavigate();
    const { courseId } = useParams();

    const createAnnouncement = () => {
        navigate(`/instructor/course/${courseId}/create-announcement`);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-dots loading-lg"></span>
            </div>
            // <div className="skeleton h-full w-full"></div>
        );
    }

    if (!error) {
        return (
                <div role="alert" className="alert alert-error max-w-md w-full sm:w-auto p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Error! Cannot fetch details.</span>
                </div>
        );
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