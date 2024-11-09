import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Breadcrumbs = () => {
    const location = useLocation();
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const courses = useSelector((state) => state.courses); // Assume you have a course list in Redux
    const user = useSelector((state) => state.user); // Assume you have a user list in Redux
    const announcements = useSelector((state) => state.announcements);

    useEffect(() => {
        const pathnames = location.pathname.split('/').filter((x) => x).slice(1);
        const breadcrumbPaths = pathnames.map((_, index) => {
            let title, path;

            if (pathnames.includes('course')) {
                path = `/${pathnames.slice(0, index + 2).join('/')}`;
                title = courses.find((course) => course.id === parseInt(pathnames[index]))?.name || 'Course';
            } else if (pathnames.includes('announcements')) {
                path = `/${pathnames.slice(0, index + 2).join('/')}`;
                title = pathnames[index + 1] ? announcements.find((a) => a.id === parseInt(pathnames[index + 1]))?.title : 'Announcements';
            } else {
                path = `/${pathnames.slice(0, index + 1).join('/')}`;
                title = pathnames[index].replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
            }

            return { path, title };
        });

        setBreadcrumbs(breadcrumbPaths);
    }, [location, courses, announcements]);

    return (
        <div aria-label="breadcrumbs">
            <ol>
                <li><Link to={`${user.role}`}>Dashboard</Link></li>
                {breadcrumbs.map((breadcrumb, index) => (
                    <li key={index}>
                        {index === breadcrumbs.length - 1 ? (
                            <span>{breadcrumb.title}</span>
                        ) : (
                            <Link to={breadcrumb.path}>{breadcrumb.title}</Link>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default Breadcrumbs;
