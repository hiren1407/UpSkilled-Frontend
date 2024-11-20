// ViewAllCourses.test.js
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import ViewAllCourses from '../Employee/ViewAllCourses';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ViewAllCourses Component', () => {
  const mockStore = configureStore([]);
  let store;
  let mockNavigate;

  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    window.localStorage.__proto__.getItem = jest.fn(() => 'test-token');

    store = mockStore({});

    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading spinner during data fetch', async () => {
    axios.get.mockReturnValue(new Promise(() => {})); // Keeps the promise pending

    render(
      <Provider store={store}>
        <ViewAllCourses />
      </Provider>
    );

    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  test('renders list of available courses after successful fetch', async () => {
    const coursesData = [
      { id: '1', title: 'Course 1', name: 'Course Name 1' },
      { id: '2', title: 'Course 2', name: 'Course Name 2' },
    ];

    axios.get.mockResolvedValue({ data: coursesData });

    render(
      <Provider store={store}>
        <ViewAllCourses />
      </Provider>
    );

    expect(await screen.findByText('Available Courses')).toBeInTheDocument();
    expect(screen.getByText('Course 1')).toBeInTheDocument();
    expect(screen.getByText('Course Name 1')).toBeInTheDocument();
    expect(screen.getByText('Course 2')).toBeInTheDocument();
    expect(screen.getByText('Course Name 2')).toBeInTheDocument();
  });

  test('displays message when no courses are available', async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <Provider store={store}>
        <ViewAllCourses />
      </Provider>
    );

    expect(await screen.findByText('No courses are available at the moment.')).toBeInTheDocument();
    expect(screen.getByTestId("goToCourses")).toBeInTheDocument();
  });

  test('displays error message when data fetch fails', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    render(
      <Provider store={store}>
        <ViewAllCourses />
      </Provider>
    );

    expect(await screen.findByText(/Oops! Something went wrong./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
  });

  test('navigates to course details when "View Course Details" button is clicked', async () => {
    const coursesData = [
      { id: '1', title: 'Course 1', name: 'Course Name 1' },
    ];

    axios.get.mockResolvedValue({ data: coursesData });

    render(
      <Provider store={store}>
        <ViewAllCourses />
      </Provider>
    );

    const viewDetailsButton = screen.getByTestId("viewCourseDetails");

    fireEvent.click(viewDetailsButton);

    expect(mockNavigate).toHaveBeenCalledWith('/employee/course-details/1');
  });

  test('navigates back to My Courses when "⬅️ My Courses" button is clicked', async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <Provider store={store}>
        <ViewAllCourses />
      </Provider>
    );

    const myCoursesButton = screen.findByTestId("myCoursesButton");

    fireEvent.click(myCoursesButton);

    expect(mockNavigate).toHaveBeenCalledWith('/employee');
  });

  test('reloads the page when "Reload Page" button is clicked', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    const originalLocation = window.location;
    delete window.location;
    window.location = { reload: jest.fn() };

    render(
      <Provider store={store}>
        <ViewAllCourses />
      </Provider>
    );

    const reloadButton = await screen.findByRole('button', { name: /reload page/i });

    fireEvent.click(reloadButton);

    expect(window.location.reload).toHaveBeenCalled();

    window.location = originalLocation; // Restore original window.location
  });
});
