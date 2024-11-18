import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../Admin/AdminDashboard';

describe('AdminDashboard Component', () => {
  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  test('renders the Admin Dashboard title', () => {
    renderWithRouter(<AdminDashboard />);
    expect(
      screen.getByRole('heading', { name: /Admin Dashboard/i })
    ).toBeInTheDocument();
  });

  test('renders the Manage Courses card with an image, title, description, and Go button', () => {
    renderWithRouter(<AdminDashboard />);
    const manageCoursesCard = screen.getByText(/Manage Courses/i);
    expect(manageCoursesCard).toBeInTheDocument();

    const coursesImage = screen.getByAltText(/courses/i);
    expect(coursesImage).toBeInTheDocument();
    expect(coursesImage.src).toContain(
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCsyMDy2-FEk2nyC4O3JxTOHuB3C6Vdnv3mA&s'
    );

    const coursesDescription = screen.getByText(
      /View all details of courses here/i
    );
    expect(coursesDescription).toBeInTheDocument();

    const goButtonCourses = screen.getByTestId("manageCoursesButton");
    expect(goButtonCourses).toBeInTheDocument();
  });

  test('renders the Manage Instructors card with an image, title, description, and Go button', () => {
    renderWithRouter(<AdminDashboard />);
    const manageInstructorsCard = screen.getByText(/Manage Instructors/i);
    expect(manageInstructorsCard).toBeInTheDocument();

    const instructorsImage = screen.getByAltText(/instructors/i);
    expect(instructorsImage).toBeInTheDocument();
    expect(instructorsImage.src).toContain('instructor.jpg');

    const instructorsDescription = screen.getByText(
      /View all details of instructors here/i
    );
    expect(instructorsDescription).toBeInTheDocument();

    const goButtonInstructors = screen.getAllByRole('button', { name: /Go/i })[1];
    expect(goButtonInstructors).toBeInTheDocument();
  });

test('renders the correct links for Manage Courses and Manage Instructors', () => {
    renderWithRouter(<AdminDashboard />);
  
    // Find the "Go" button for Manage Courses
    const manageCoursesLink = screen.getByTestId('manageCoursesLink');
    const manageCoursesButton = screen.getByTestId('manageCoursesButton');
    expect(manageCoursesLink).toHaveAttribute('href', '/admin/manage-courses');
    expect(manageCoursesButton).toBeInTheDocument();

    // Find the "Go" button for Manage Instructors
    const manageInstructorsLink = screen.getByTestId('manageInstructorsLink');
    const manageInstructorsButton = screen.getByTestId('manageInstructorsButton');
    expect(manageInstructorsLink).toHaveAttribute('href', '/admin/manage-instructors');
    expect(manageInstructorsButton).toBeInTheDocument();
});
  
});
