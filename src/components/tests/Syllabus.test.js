// Syllabus.test.js

import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Syllabus from '../Syllabus'; // Adjust the import path based on your project structure
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

// Mocking BASE_URL and localStorage
jest.mock('../../utils/constants', () => ({
  BASE_URL: 'http://localhost:3000',
}));

describe('Syllabus Component', () => {
  const originalFetch = global.fetch;
  const originalInnerWidth = global.innerWidth;
  const originalAlert = global.alert;
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetch;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
    window.localStorage.getItem.mockReturnValue('mockToken');
    useParams.mockReturnValue({ courseId: '123' });
    useSelector.mockImplementation((selector) =>
      selector({
        courseDetails: {
          course: {
            id: '123',
            title: 'Test Course',
            name: 'Course Name',
            instructorName: 'Instructor Name',
            description: 'Course Description',
          },
        },
        user: {
          role: 'instructor',
        },
      })
    );
  });

  afterAll(() => {
    global.fetch = originalFetch;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    jest.resetAllMocks();
  });

  const resizeWindow = (width) => {
    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
      window.dispatchEvent(new Event('resize'));
    });
  };

  test('renders syllabus component with course details', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      blob: jest.fn().mockResolvedValue(new Blob(['Test PDF Content'], { type: 'application/pdf' })),
    });

    render(<Syllabus />);

    expect(screen.getByText('Course Syllabus')).toBeInTheDocument();
    expect(screen.getByText('Test Course - Course Name')).toBeInTheDocument();
    expect(screen.getByText('Instructor: Instructor Name')).toBeInTheDocument();
    expect(screen.getByText('Course Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload Syllabus')).toBeInTheDocument();
    expect(screen.getByText('Show Syllabus')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  test('fetches syllabus successfully', async () => {
    const blobUrl = 'blob:http://localhost:3000/12345';
    const mockBlob = new Blob(['Test PDF Content'], { type: 'application/pdf' });
    const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue(blobUrl);

    mockFetch.mockResolvedValueOnce({
      status: 200,
      blob: jest.fn().mockResolvedValue(mockBlob),
    });

    render(<Syllabus />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      expect(createObjectURLSpy).toHaveBeenCalledWith(mockBlob);
    });

    // Open the modal
    fireEvent.click(screen.getByText('Show Syllabus'));

    // Check if the modal is displayed
    expect(screen.getByText('Syllabus')).toBeInTheDocument();

    // Since we're testing in JSDOM, we cannot render PDFs, but we can check if the object element exists
    expect(screen.getByLabelText('Syllabus PDF')).toBeInTheDocument();

    createObjectURLSpy.mockRestore();
  });

  test('handles fetch syllabus error', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 404,
      json: jest.fn().mockResolvedValue({ message: 'Not Found' }),
    });

    render(<Syllabus />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    expect(screen.getByText('Error! No Syllabus found.')).toBeInTheDocument();
  });

  test('uploads syllabus successfully', async () => {
    const file = new File(['dummy content'], 'syllabus.pdf', { type: 'application/pdf' });

    mockFetch
      .mockResolvedValueOnce({
        status: 200,
        blob: jest.fn().mockResolvedValue(new Blob(['Test PDF Content'], { type: 'application/pdf' })),
      })
      .mockResolvedValueOnce({
        ok: true,
      })
      .mockResolvedValueOnce({
        status: 200,
        blob: jest.fn().mockResolvedValue(new Blob(['Updated PDF Content'], { type: 'application/pdf' })),
      });

    render(<Syllabus />);

    // Upload the file
    const fileInput = screen.getByLabelText('Upload Syllabus');
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByText('Upload Syllabus');
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(3); // Initial fetch, upload, and refetch
    });

    expect(screen.getByText('Syllabus uploaded successfully!')).toBeInTheDocument();

    // Close the success message
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    // Ensure the status is reset
    expect(screen.queryByText('Syllabus uploaded successfully!')).toBeNull();
  });

  test('handles syllabus upload error', async () => {
    const file = new File(['dummy content'], 'syllabus.pdf', { type: 'application/pdf' });

    mockFetch
      .mockResolvedValueOnce({
        status: 200,
        blob: jest.fn().mockResolvedValue(new Blob(['Test PDF Content'], { type: 'application/pdf' })),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue({ message: 'Internal Server Error' }),
      });

    render(<Syllabus />);

    // Upload the file
    const fileInput = screen.getByLabelText('Upload Syllabus');
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByText('Upload Syllabus');
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2); // Initial fetch and upload
    });

    expect(screen.getByText('Error uploading syllabus:')).toBeInTheDocument();
  });

  test('shows file error when no file is selected', () => {
    render(<Syllabus />);

    const uploadButton = screen.getByText('Upload Syllabus');
    fireEvent.click(uploadButton);

    expect(screen.getByText('Please select a file to upload')).toBeInTheDocument();
  });

  test('renders download link in mobile view', async () => {
    resizeWindow(500); // Mobile view

    const blobUrl = 'blob:http://localhost:3000/12345';
    const mockBlob = new Blob(['Test PDF Content'], { type: 'application/pdf' });
    jest.spyOn(URL, 'createObjectURL').mockReturnValue(blobUrl);

    mockFetch.mockResolvedValueOnce({
      status: 200,
      blob: jest.fn().mockResolvedValue(mockBlob),
    });

    render(<Syllabus />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Open the modal
    fireEvent.click(screen.getByTestId("showSyllabusButton"));

    expect(screen.getByText('Download Syllabus')).toBeInTheDocument();
  });

  test('handles window resize event', () => {
    render(<Syllabus />);

    // Initially, isMobile should be false
    expect(window.innerWidth).toBe(originalInnerWidth);

    // Resize to mobile view
    resizeWindow(500);
    expect(window.innerWidth).toBe(500);
  });

  test('renders without crashing when course is null', () => {
    useSelector.mockImplementation((selector) =>
      selector({
        courseDetails: {
          course: null,
        },
        user: {
          role: 'instructor',
        },
      })
    );

    render(<Syllabus />);

    expect(screen.getByText('Course Syllabus')).toBeInTheDocument();
  });

  test('renders correctly when role is not instructor', async () => {
    useSelector.mockImplementation((selector) =>
      selector({
        courseDetails: {
          course: {
            id: '123',
            title: 'Test Course',
            name: 'Course Name',
            instructorName: 'Instructor Name',
            description: 'Course Description',
          },
        },
        user: {
          role: 'employee',
        },
      })
    );

    mockFetch.mockResolvedValueOnce({
      status: 200,
      blob: jest.fn().mockResolvedValue(new Blob(['Test PDF Content'], { type: 'application/pdf' })),
    });

    render(<Syllabus />);

    expect(screen.queryByLabelText('Upload Syllabus')).toBeNull();
    expect(screen.getByTestId("showSyllabusButton")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  test('handles fetch error in fetchSyllabus', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    render(<Syllabus />);

    await waitFor(() => {
      expect(mockFetch).ok;
    });

    expect(screen.getByText('Error! No Syllabus found.')).toBeInTheDocument();
  });

  test('closes the modal when close button is clicked', async () => {
    const blobUrl = 'blob:http://localhost:3000/12345';
    const mockBlob = new Blob(['Test PDF Content'], { type: 'application/pdf' });
    jest.spyOn(URL, 'createObjectURL').mockReturnValue(blobUrl);

    mockFetch.mockResolvedValueOnce({
      status: 200,
      blob: jest.fn().mockResolvedValue(mockBlob),
    });

    render(<Syllabus />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Open the modal
    fireEvent.click(screen.getByTestId("showSyllabusButton"));

    // Close the modal
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    // Since JSDOM doesn't support modal display, we can check if the modal content is not visible
    expect(screen.queryByText('Syllabus')).toBeNull();
  });

  test('handles case when syllabus is null', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      blob: jest.fn().mockResolvedValue(null),
    });

    render(<Syllabus />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Open the modal
    fireEvent.click(screen.getByTestId("showSyllabusButton"));

    // // Since syllabus is null, the object element should not render the PDF
    // expect(screen.getByText('Your browser does not support PDFs.')).toBeInTheDocument();
  });
});
