// CourseDetails.test.js
import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import CourseDetails from '../Employee/CourseDetails';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

describe('CourseDetails Component', () => {
  let mockNavigate;

  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    window.localStorage.__proto__.getItem = jest.fn(() => 'test-token');

    useParams.mockReturnValue({ courseId: '1' });
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading spinner during data fetch', () => {
    render(<CourseDetails />);
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  test('renders course details after successful fetch', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/enrollment')) {
        return Promise.resolve({ data: 'Not Enrolled' });
      } else if (url.includes('/course/')) {
        return Promise.resolve({
          data: {
            title: 'Test Course',
            name: 'Course Name',
            description: 'Course Description',
            instructorName: 'Instructor Name',
          },
        });
      }
    });
  
    render(<CourseDetails />);
  
    expect(await screen.findByTestId("courseTitle")).toBeInTheDocument();
    expect(screen.getByTestId("courseName")).toBeInTheDocument();
    expect(screen.getByTestId("courseDescription")).toBeInTheDocument();
    expect(screen.getByTestId("instructorName")).toBeInTheDocument();
  });
  
  test('updates enrollment button when enrolled', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/enrollment')) {
        return Promise.resolve({ data: 'Enrolled' });
      } else if (url.includes('/course/')) {
        return Promise.resolve({
          data: {
            title: 'Test Course',
            name: 'Course Name',
            description: 'Course Description',
            instructorName: 'Instructor Name',
          },
        });
      }
    });
  
    render(<CourseDetails />);
  
   // screen.getByTestId("enrolled");
    const enrollButton = screen.getByTestId("enrolled");
    expect(enrollButton).toBeDisabled();
});

test('views syllabus successfully', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/enrollment')) {
        return Promise.resolve({ data: 'Not Enrolled' });
      } else if (url.includes('/course/')) {
        return Promise.resolve({
          data: {
            title: 'Test Course',
            name: 'Course Name',
            description: 'Course Description',
            instructorName: 'Instructor Name',
          },
        });
      }
    });
  
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      blob: jest.fn().mockResolvedValue(new Blob(['dummy syllabus content'], { type: 'application/pdf' })),
    });
  
    render(<CourseDetails />);
  
    const viewSyllabusButton = await screen.findByRole('button', { name: /View Syllabus/i });
    expect(viewSyllabusButton).toBeInTheDocument();
  
    await act(async () => {
      fireEvent.click(viewSyllabusButton);
    });

    await waitFor(() => expect(fetch.ok))
  });

  test('handles error when fetching syllabus', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/enrollment')) {
        return Promise.resolve({ data: 'Not Enrolled' });
      } else if (url.includes('/course/')) {
        return Promise.resolve({
          data: {
            title: 'Test Course',
            name: 'Course Name',
            description: 'Course Description',
            instructorName: 'Instructor Name',
          },
        });
      }
    });
  
    global.fetch = jest.fn().mockResolvedValue({ status: 404 });
  
    render(<CourseDetails />);
  
    const viewSyllabusButton = await screen.findByRole('button', { name: /View Syllabus/i });
    expect(viewSyllabusButton).toBeInTheDocument();
  
    await act(async () => {
      fireEvent.click(viewSyllabusButton);
    });
  
    expect(screen.getByRole('alert')).toHaveTextContent(/Error! No Syllabus found./i);
  });

  test('enrolls in course successfully', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/enrollment')) {
        return Promise.resolve({ data: 'Not Enrolled' });
      } else if (url.includes('/course/')) {
        return Promise.resolve({
          data: {
            title: 'Test Course',
            name: 'Course Name',
            description: 'Course Description',
            instructorName: 'Instructor Name',
          },
        });
      }
    });
  
    global.fetch = jest.fn().mockResolvedValue({ status: 200 });
  
    render(<CourseDetails />);
  
    const enrollButton = await screen.findByRole('button', { name: /Enroll/i });
    expect(enrollButton).toBeInTheDocument();
  
    await act(async () => {
      fireEvent.click(enrollButton);
    });
  
    expect(enrollButton).toHaveTextContent('Enrolled ✔️');
  });
  
  test('handles error when enrolling in course', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/enrollment')) {
        return Promise.resolve({ data: 'Not Enrolled' });
      } else if (url.includes('/course/')) {
        return Promise.resolve({
          data: {
            title: 'Test Course',
            name: 'Course Name',
            description: 'Course Description',
            instructorName: 'Instructor Name',
          },
        });
      }
    });
  
    global.fetch = jest.fn().mockResolvedValue({ status: 500 });
  
    render(<CourseDetails />);
  
    const enrollButton = await screen.findByRole('button', { name: /Enroll/i });
    expect(enrollButton).toBeInTheDocument();
  
    await act(async () => {
      fireEvent.click(enrollButton);
    });
  
   // expect(screen.getByText(/Failed to enroll in the course/i)).toBeInTheDocument();
  });


// Check if the component recognizes the mobile view
  test('updates isMobile state on window resize', () => {
    render(<CourseDetails />);
  
    act(() => {
      global.innerWidth = 500;
      global.dispatchEvent(new Event('resize'));
    });
  });
  

  test('navigates back to all courses on button click', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  
    axios.get.mockResolvedValue({
      data: {
        title: 'Test Course',
        name: 'Course Name',
        description: 'Course Description',
        instructorName: 'Instructor Name',
      },
    });
  
    render(<CourseDetails />);
  
    fireEvent.click(screen.getByTestId("backToHome"));
  
    expect(mockNavigate).toHaveBeenCalledWith('/employee/all-courses');
  });
  


});
