import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Error = () => {
    const userRole = useSelector((state) => state.user.role);
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center px-4 lg:px-0">
                <h1 className="text-9xl font-extrabold text-indigo-500 mb-8">404</h1>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Oops! Page Not Found
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    The page you’re looking for doesn’t exist.
                </p>
                <Link
                    to={`/${userRole}`}
                    className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition duration-200"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default Error;