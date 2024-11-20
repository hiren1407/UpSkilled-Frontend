// SideBar.test.js

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SideBar from '../SideBar'; // Adjust the import path based on your project structure
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { fetchCourseDetails } from '../../utils/courseSlice'; // Adjust the import path
import { toggleMenu } from '../../utils/appSlice';
import { faTasks, faUsersCog, faBook, faBullhorn, faChalkboardTeacher, faFolderOpen, faStar, faInbox } from '@fortawesome/free-solid-svg-icons';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useLocation: jest.fn(),
}));

jest.mock('../../utils/courseSlice', () => ({
  fetchCourseDetails: jest.fn(),
}));

jest.mock('../../utils/appSlice', () => ({
  toggleMenu: jest.fn(),
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: jest.fn(() => null),
}));

describe('SideBar Component', () => {
  const mockDispatch = jest.fn();
  const originalInnerWidth = global.innerWidth;

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);
    jest.clearAllMocks();
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  const resizeWindow = (width) => {
    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
      window.dispatchEvent(new Event('resize'));
    });
  };

  test('renders admin sidebar items when role is admin', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { role: 'admin' },
        app: { isMenuOpen: true },
      })
    );

    useParams.mockReturnValue({});
    useLocation.mockReturnValue({ pathname: '/admin/manage-instructors' });

    render(
      <Router>
        <SideBar />
      </Router>
    );

    expect(screen.getByText('Manage Instructors')).toBeInTheDocument();
    expect(screen.getByText('Manage Courses')).toBeInTheDocument();
  });

  test('renders employee sidebar items when role is employee', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { role: 'employee' },
        app: { isMenuOpen: true },
      })
    );

    useParams.mockReturnValue({ courseId: '123' });
    useLocation.mockReturnValue({ pathname: '/employee/course/123' });

    render(
      <Router>
        <SideBar />
      </Router>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Announcements')).toBeInTheDocument();
    expect(screen.getByText('Assignments')).toBeInTheDocument();
    expect(screen.getByText('Modules')).toBeInTheDocument();
    expect(screen.getByText('Syllabus')).toBeInTheDocument();
    expect(screen.getByText('Grades')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  test('renders instructor sidebar items when role is instructor', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { role: 'instructor' },
        app: { isMenuOpen: true },
      })
    );

    useParams.mockReturnValue({ courseId: '456' });
    useLocation.mockReturnValue({ pathname: '/instructor/course/456' });

    render(
      <Router>
        <SideBar />
      </Router>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Announcements')).toBeInTheDocument();
    expect(screen.getByText('Assignments')).toBeInTheDocument();
    expect(screen.getByText('Modules')).toBeInTheDocument();
    expect(screen.getByText('Syllabus')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  test('does not render sidebar when isMobile is true and isMenuOpen is false', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { role: 'admin' },
        app: { isMenuOpen: false },
      })
    );

    useParams.mockReturnValue({});
    useLocation.mockReturnValue({ pathname: '/admin/manage-instructors' });

    resizeWindow(500); // Set window width to mobile size

    render(
      <Router>
        <SideBar />
      </Router>
    );

    expect(screen.queryByText('Manage Instructors')).toBeNull();
  });

  test('renders sidebar when isMobile is true and isMenuOpen is true', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { role: 'admin' },
        app: { isMenuOpen: true },
      })
    );

    useParams.mockReturnValue({});
    useLocation.mockReturnValue({ pathname: '/admin/manage-instructors' });

    resizeWindow(500); // Set window width to mobile size

    render(
      <Router>
        <SideBar />
      </Router>
    );

    expect(screen.getByText('Manage Instructors')).toBeInTheDocument();
  });

  test('dispatches fetchCourseDetails when role is instructor or employee', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { role: 'instructor' },
        app: { isMenuOpen: true },
      })
    );

    useParams.mockReturnValue({ courseId: '789' });
    useLocation.mockReturnValue({ pathname: '/instructor/course/789' });

    render(
      <Router>
        <SideBar />
      </Router>
    );

    expect(mockDispatch).toHaveBeenCalledWith(fetchCourseDetails({ courseId: '789' }));
  });

  test('does not dispatch fetchCourseDetails when role is admin', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { role: 'admin' },
        app: { isMenuOpen: true },
      })
    );

    useParams.mockReturnValue({});
    useLocation.mockReturnValue({ pathname: '/admin/manage-instructors' });

    render(
      <Router>
        <SideBar />
      </Router>
    );

    expect(mockDispatch).not.toHaveBeenCalledWith(fetchCourseDetails(expect.anything()));
  });

  test('handles window resize and updates isMobile state', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { role: 'admin' },
        app: { isMenuOpen: true },
      })
    );

    useParams.mockReturnValue({});
    useLocation.mockReturnValue({ pathname: '/admin/manage-instructors' });

    render(
      <Router>
        <SideBar />
      </Router>
    );

    // Initially desktop view
    expect(screen.getByText('Manage Instructors')).toBeInTheDocument();

    // Resize to mobile view
    resizeWindow(500);

    // Since isMenuOpen is true, sidebar should still be visible
    expect(screen.getByText('Manage Instructors')).toBeInTheDocument();

    // Set isMenuOpen to false
    useSelector.mockImplementation((selector) =>
      selector({
        user: { role: 'admin' },
        app: { isMenuOpen: false },
      })
    );

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    // Sidebar should not be visible
    expect(screen.queryByText('Manage Instructors')).toBeNull();
  });

  test('clicking on a sidebar link dispatches toggleMenu', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { role: 'admin' },
        app: { isMenuOpen: true },
      })
    );

    useParams.mockReturnValue({});
    useLocation.mockReturnValue({ pathname: '/admin/manage-instructors' });

    render(
      <Router>
        <SideBar />
      </Router>
    );

    const link = screen.getByText('Manage Instructors');
    fireEvent.click(link);

    expect(mockDispatch).toHaveBeenCalledWith(toggleMenu());
  });

  test('applies active class to current path', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { role: 'admin' },
        app: { isMenuOpen: true },
      })
    );

    useParams.mockReturnValue({});
    useLocation.mockReturnValue({ pathname: '/admin/manage-courses' });

    render(
      <Router>
        <SideBar />
      </Router>
    );

    const activeLink = screen.getByText('Manage Courses').closest('a');
    expect(activeLink).toHaveClass('bg-cyan-500 text-white');
    expect(activeLink).toHaveAttribute('aria-current', 'page');

    const inactiveLink = screen.getByText('Manage Instructors').closest('a');
    expect(inactiveLink).not.toHaveClass('bg-cyan-500 text-white');
    expect(inactiveLink).not.toHaveAttribute('aria-current');
  });

  test('renders empty div when isMobile is true and isMenuOpen is false', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { role: 'admin' },
        app: { isMenuOpen: false },
      })
    );

    useParams.mockReturnValue({});
    useLocation.mockReturnValue({ pathname: '/admin/manage-instructors' });

    resizeWindow(500); // Set window width to mobile size

    const { container } = render(
      <Router>
        <SideBar />
      </Router>
    );

    // The top-level div should contain an empty div
    expect(container.firstChild).toContainHTML('<div></div>');
  });

  test('renders without crashing when no role is provided', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: {},
        app: { isMenuOpen: true },
      })
    );

    useParams.mockReturnValue({});
    useLocation.mockReturnValue({ pathname: '/' });

    render(
      <Router>
        <SideBar />
      </Router>
    );

    // Should not render any sidebar items
    expect(screen.queryByText('Manage Instructors')).toBeNull();
    expect(screen.queryByText('Dashboard')).toBeNull();
  });

  test('handles unknown role gracefully', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        user: { role: 'unknown' },
        app: { isMenuOpen: true },
      })
    );

    useParams.mockReturnValue({});
    useLocation.mockReturnValue({ pathname: '/' });

    render(
      <Router>
        <SideBar />
      </Router>
    );

    // Should not render any sidebar items
    expect(screen.queryByText('Manage Instructors')).toBeNull();
    expect(screen.queryByText('Dashboard')).toBeNull();
  });
});
