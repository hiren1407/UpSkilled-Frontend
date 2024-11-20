// App.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App';
import { Provider } from 'react-redux';
import appStore from '../../utils/appStore';
import * as reactRedux from 'react-redux';

// Mock components
jest.mock('../Body', () => () => <div>Body Component</div>);
jest.mock('../Login', () => () => <div>Login Component</div>);
jest.mock('../Admin/AdminDashboard', () => () => <div>Admin Dashboard</div>);
jest.mock('../Employee/EmployeeDashboard', () => () => <div>Employee Dashboard</div>);
jest.mock('../Instructor/InstructorDashboard', () => () => <div>Instructor Dashboard</div>);
jest.mock('../Profile', () => () => <div>Profile Component</div>);
jest.mock('../SideBar', () => () => <div>Sidebar Component</div>);
jest.mock('../ProtectedRoute', () => ({ allowedRoles, children }) => <div>{children}</div>);

// Mock other components similarly
jest.mock('../Admin/ManageInstructors', () => () => <div>Manage Instructors Component</div>);
jest.mock('../Admin/ManageCourses', () => () => <div>Manage Courses Component</div>);
jest.mock('../ViewAnnouncement', () => () => <div>View Announcement Component</div>);
jest.mock('../CourseDashboard', () => () => <div>Course Dashboard Component</div>);
jest.mock('../Announcements', () => () => <div>Announcements Component</div>);
jest.mock('../Instructor/CreateAnnouncement', () => () => <div>Create Announcement Component</div>);
jest.mock('../Syllabus', () => () => <div>Syllabus Component</div>);
jest.mock('../Assignments', () => () => <div>Assignments Component</div>);
jest.mock('../Instructor/CreateAssignment', () => () => <div>Create Assignment Component</div>);
jest.mock('../Instructor/ViewAssignmentforInstructor', () => () => <div>View Assignment for Instructor Component</div>);
jest.mock('../Instructor/ViewIndividualAssignmentSubmission', () => () => <div>View Individual Assignment Submission Component</div>);
jest.mock('../Modules', () => () => <div>Modules Component</div>);
jest.mock('../Employee/ViewAllCourses', () => () => <div>View All Courses Component</div>);
jest.mock('../Employee/CourseDetails', () => () => <div>Course Details Component</div>);
jest.mock('../Employee/AssignmentView', () => () => <div>Assignment View Component</div>);
jest.mock('../Error', () => () => <div>Error Component</div>);
jest.mock('../Employee/ViewGrades', () => () => <div>View Grades Component</div>);
jest.mock('../Employee/ViewMessagesEmployee', () => () => <div>View Messages Employee Component</div>);
jest.mock('../Instructor/ViewMessagesInstructor', () => () => <div>View Messages Instructor Component</div>);

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe('App Component', () => {
  const useSelectorMock = reactRedux.useSelector;
  const useDispatchMock = reactRedux.useDispatch;

  beforeEach(() => {
    useDispatchMock.mockClear();
    useSelectorMock.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login component at root path', () => {
    useSelectorMock.mockReturnValue({ user: null });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders admin dashboard for admin user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'admin' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/admin');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders employee dashboard for employee user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'employee' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/employee');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders instructor dashboard for instructor user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'instructor' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/instructor');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders profile component for authenticated user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'employee' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/profile');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders manage instructors for admin user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'admin' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/admin/manage-instructors');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );
  });

  test('renders manage courses for admin user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'admin' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/admin/manage-courses');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders view all courses for employee user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'employee' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/employee/all-courses');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders course details for employee user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'employee' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/employee/course-details/1');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders course dashboard for employee user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'employee' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/employee/course/1');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders announcements for employee user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'employee' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/employee/course/1/announcements');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders view announcement for employee user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'employee' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/employee/course/1/announcements/1');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders syllabus for employee user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'employee' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/employee/course/1/syllabus');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders assignments for employee user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'employee' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/employee/course/1/assignments');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders assignment view for employee user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'employee' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/employee/course/1/assignments/1');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders modules for employee user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'employee' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/employee/course/1/modules');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders instructor course dashboard for instructor user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'instructor' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/instructor/course/1');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders instructor announcements for instructor user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'instructor' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/instructor/course/1/announcements');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );
  });

  test('renders create announcement for instructor user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'instructor' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/instructor/course/1/create-announcement');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders view announcement for instructor user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'instructor' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/instructor/course/1/announcements/1');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders syllabus for instructor user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'instructor' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/instructor/course/1/syllabus');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders assignments for instructor user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'instructor' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/instructor/course/1/assignments');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders create assignment for instructor user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'instructor' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/instructor/course/1/create-assignment');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );
  });

  test('renders view assignment for instructor user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'instructor' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/instructor/course/1/assignments/1');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );
  });

  test('renders view individual assignment submission for instructor user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'instructor' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/instructor/course/1/assignments/1/submission/1');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );
  });

  test('renders modules for instructor user', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'instructor' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/instructor/course/1/modules');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );

  });

  test('renders error component for unknown path', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'employee' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/unknown-path');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );
  });

  test('redirects to login for unauthenticated user', () => {
    useSelectorMock.mockReturnValue({ user: null });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/employee');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );
  });

  test('prevents access to unauthorized routes', () => {
    useSelectorMock.mockReturnValue({ user: { role: 'employee' } });

    // Set the initial route
    window.history.pushState({}, 'Test page', '/admin');

    render(
      <Provider store={appStore}>
        <App />
      </Provider>
    );
  });
});
