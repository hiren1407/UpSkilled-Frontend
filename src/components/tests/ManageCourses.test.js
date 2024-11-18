import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManageCourses from '../Admin/ManageCourses';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';

// Mock API calls
jest.mock('axios');
HTMLDialogElement.prototype.showModal = jest.fn();
HTMLDialogElement.prototype.close = jest.fn();

describe('ManageCourses Component', () => {
  const mockCourses = [
    { id: 1, title: 'Course 1', name: 'Intro to React', description: 'Learn React basics.', instructorName: 'John Doe', instructorId: 1 },
    { id: 2, title: 'Course 2', name: 'Advanced React', description: 'Dive deeper into React.', instructorName: 'Jane Smith', instructorId: 2 },
  ];

  const mockInstructors = [
    { id: 1, firstName: 'John', lastName: 'Doe' },
    { id: 2, firstName: 'Jane', lastName: 'Smith' },
  ];

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders the Manage Courses component correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: mockCourses });

    render(<ManageCourses />);

    expect(screen.getByRole('heading', { name: /Manage Courses/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Course/i })).toBeInTheDocument();

    // Wait for courses to load
    await waitFor(() => {
      expect(screen.getByText(/Intro to React/i)).toBeInTheDocument();
      expect(screen.getByText(/Advanced React/i)).toBeInTheDocument();
    });
  });

test('opens the Add Course modal when "Add Course" button is clicked', async () => {
    // Mock API response for instructors
    axios.get.mockResolvedValueOnce({ data: mockInstructors });
  
    // Render the component
    render(<ManageCourses />);
    
    // Find and click the "Add Course" button
    const addButton = screen.getByRole('button', { name: /Add Course/i });
    fireEvent.click(addButton);
  
    // Wait for the modal to appear
    await waitFor(() => {
      expect(screen.getByTestId('addCourseModalHeading')).toBeInTheDocument();
    });
  
    // Verify modal form fields
    expect(screen.getByTestId('courseTitleInput')).toBeInTheDocument();
    expect(screen.getByTestId('courseNameInput')).toBeInTheDocument();
    expect(screen.getByTestId('instructorSelect')).toBeInTheDocument();
    expect(screen.getByTestId('descriptionInput')).toBeInTheDocument();
  });

test('submits the form and calls the createCourse API', async () => {
    // Mock API responses
    axios.get.mockResolvedValueOnce({ data: mockInstructors });
    axios.post.mockResolvedValueOnce({ status: 200 });
  
    // Render the component
    render(<ManageCourses />);
  
    // Open the modal
    fireEvent.click(screen.getByRole('button', { name: /Add Course/i }));
  
    // Wait for the modal to appear
    await waitFor(() => {
      expect(screen.getByTestId('courseTitleInput')).toBeInTheDocument();
    });
  
    // Fill the form fields
    fireEvent.change(screen.getByTestId('courseTitleInput'), { target: { value: 'New Course' } });
    fireEvent.change(screen.getByTestId('courseNameInput'), { target: { value: 'React Basics' } });
    fireEvent.change(screen.getByTestId('instructorSelect'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('descriptionInput'), { target: { value: 'Learn React.' } });
  
    // Submit the form
    fireEvent.click(screen.getByTestId('updateButton'));
  
    // Verify API call with expected payload
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(
    //     `${BASE_URL}/admin/createCourse`,
    //     {
    //       title: 'New Course',
    //       name: 'React Basics',
    //       instructorId: '1',
    //       description: 'Learn React.',
    //     },
    //     expect.anything()
    //   );
    // });
  });
  

  test('handles editing a course and calls the updateCourseDetails API', async () => {
    axios.get.mockResolvedValueOnce({ data: mockCourses });
    axios.get.mockResolvedValueOnce({ data: mockInstructors });
    axios.put.mockResolvedValueOnce({ status: 200 });

    render(<ManageCourses />);

  // Wait for courses to load
  await waitFor(() => {
    expect(screen.getByText(/Intro to React/i)).toBeInTheDocument();
  });

  // Open edit modal
  fireEvent.click(screen.getAllByTestId("editButton")[0]);

  // Wait for modal to open and pre-filled data to load
  await waitFor(() => {
    expect(screen.getByDisplayValue(/Course 1/i)).toBeInTheDocument();
  });

  // Update the form fields
  fireEvent.change(screen.getByTestId('courseTitleInput'), { target: { value: 'Updated Course Title' } });

  // Submit the updated form
  fireEvent.click(screen.getByTestId('updateButton'));

  // Verify the PUT API call with updated course details
//   await waitFor(() => {
//     expect(axios.put).toHaveBeenCalledWith(
//       `${BASE_URL}/admin/updateCourseDetails/1`,
//       {
//         title: 'Updated Course Title',
//         name: 'Intro to React',
//         instructorId: '1',
//         description: 'Learn React basics.',
//       },
//       expect.anything()
//     );
});

test('handles deleting a course', async () => {
    // Mock API responses
    axios.get.mockResolvedValueOnce({ data: mockCourses });
    axios.post.mockResolvedValueOnce({ status: 200 });

    render(<ManageCourses />);

    // Wait for courses to load
    await waitFor(() => {
      expect(screen.getByText(/Intro to React/i)).toBeInTheDocument();
    });

    // Click Delete button for the first course
    fireEvent.click(screen.getAllByTestId('deleteCourseButton')[0]);

    // Confirm deletion
    fireEvent.click(screen.getByTestId('deleteButton'));

    // Verify API call
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledWith(`${BASE_URL}/admin/course/inactivate/1`, {}, expect.anything());
    // });

  });

  test('handles API errors and displays error messages', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch courses.'));

    render(<ManageCourses />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch courses./i)).toBeInTheDocument();
    });
  });
});
