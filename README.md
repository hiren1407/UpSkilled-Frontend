UpSkilled - An ELMS Platform

Overview-
UpSkilled is a React-based web application designed to facilitate communication and management between instructors, employees, and administrators in an educational setting. The application provides various features such as dashboards for different user roles, message management, announcements, assignments, and course details.

Features-
User Role Management: Different dashboards for Admins, Instructors, and Employees, each with role-specific functionalities.
Protected Routes: Secure access to routes based on user roles, ensuring that only authorized users can access certain components.
Message Management: Instructors can send and view messages to/from employees.
Announcements: View and create announcements for courses.
Assignments: Manage assignments, including creating, viewing, and grading submissions.
Course Management: Employees can view course details and syllabi, as well as access modules and grades.
Responsive Design: The application is designed to work seamlessly on various devices.

Technologies Used-
React: For building the user interface.
React Router: For handling routing and navigation within the application.
Redux: For state management.
Axios: For making HTTP requests to the backend API.
TailwindCSS: For styling the application.
JavaScript: For application logic.

Usage-
Component Overview
The application consists of several key components, including:

Body: The main layout component that wraps other components.
Login: The login page for user authentication.
Dashboard Components:
AdminDashboard: For admin functionalities such as managing instructors and courses.
EmployeeDashboard: For employee functionalities such as viewing courses and grades.
InstructorDashboard: For instructor functionalities such as managing assignments and messages.
ProtectedRoute: A component that restricts access to certain routes based on user roles.
Announcements: Components for viewing and creating announcements.
Assignments: Components for managing assignments and viewing submissions.
Messages: Components for viewing and sending messages.

User Roles-

The application supports three primary user roles:

Admin: Can manage instructors and courses, access all functionalities.

Instructor: Can manage assignments, view messages, and create announcements.

Employee: Can view courses, grades, and assignments.

Protected Routes: Routes are protected based on user roles. The ProtectedRoute component checks the user's role and redirects unauthorized users to the login page.

Sending Messages: Instructors can send messages to employees through the messaging interface. Messages can be viewed and managed easily.



Download dependencies:
Run npm install to install all the dependencies which the project needs.

Development server:
Run npm start for a dev server. Navigate to http://localhost:3000/. The application will automatically reload if you change any of the source files.

Build:
Run npm build to build the project. The build artifacts will be stored in build directory.

Running unit tests: 
Run npm test to launch the test runner in the interactive watch mode.

Further help: To get more help on the React, go check out the https://react.dev/learn page.
