import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Error = () => {
    // Get the user role from the Redux store
    const userRole = useSelector((state) => state.user.role);

    return (
        <div className="flex items-center justify-center h-screen" role="main">
            <div className="text-center px-4 lg:px-0">
                {/* Main heading for the error page */}
                <h1 className="text-9xl font-extrabold text-indigo-500 mb-8" aria-label="Error 404">
                    404
                </h1>
                {/* Subheading for additional context */}
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Oops! Page Not Found
                </h2>
                {/* Description of the error */}
                <p data-testid="errorMessage" className="text-lg text-gray-600 mb-8">
                    The page you’re looking for doesn’t exist.
                </p>
                {/* Link to navigate back to the home page */}
                <Link
                    to={`/${userRole}`}
                    data-testid= "goBackHome"
                    className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition duration-200"
                    aria-label="Go back to home page"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default Error;