// InstructorDashboard.test.js
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import InstructorDashboard from '../Instructor/InstructorDashboard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BASE_URL } from '../../utils/constants';
import { fetchCourseDetails } from '../../utils/courseSlice';

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));
jest.mock('../../utils/courseSlice', () => ({
  fetchCourseDetails: jest.fn(),
}));

describe('InstructorDashboard Component', () => {
  let mockNavigate;
  let mockDispatch;
  let store;

  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    window.localStorage.__proto__.getItem = jest.fn(() => 'test-token');

    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    const mockStore = configureStore([]);
    store = mockStore({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading spinner during data fetch', async () => {
    axios.get.mockReturnValue(new Promise(() => {})); // Keeps the promise pending

    render(
      <Provider store={store}>
        <InstructorDashboard />
      </Provider>
    );

    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  test('displays error message when data fetch fails', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    render(
      <Provider store={store}>
        <InstructorDashboard />
      </Provider>
    );

    expect(await screen.findByText(/Oops! Something went wrong./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Page/i })).toBeInTheDocument();
  });

  test('reloads the page when "Reload Page" button is clicked', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    const originalLocation = window.location;
    delete window.location;
    window.location = { reload: jest.fn() };

    render(
      <Provider store={store}>
        <InstructorDashboard />
      </Provider>
    );

    const reloadButton = await screen.findByRole('button', { name: /Reload Page/i });

    fireEvent.click(reloadButton);

    expect(window.location.reload).toHaveBeenCalled();

    window.location = originalLocation; // Restore original window.location
  });

  test('renders list of courses after successful data fetch', async () => {
    const coursesData = [
      { id: '1', title: 'Course 1', name: 'Course Name 1' },
      { id: '2', title: 'Course 2', name: 'Course Name 2' },
    ];

    axios.get.mockResolvedValue({ data: coursesData });

    render(
      <Provider store={store}>
        <InstructorDashboard />
      </Provider>
    );

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();

    // Check that courses are displayed
    expect(screen.getByText('Course 1')).toBeInTheDocument();
    expect(screen.getByText('Course Name 1')).toBeInTheDocument();
    expect(screen.getByText('Course 2')).toBeInTheDocument();
    expect(screen.getByText('Course Name 2')).toBeInTheDocument();
  });

  test('navigates to course details when "Go to Course" button is clicked', async () => {
    const coursesData = [
      { id: '1', title: 'Course 1', name: 'Course Name 1' },
    ];

    axios.get.mockResolvedValue({ data: coursesData });

    render(
      <Provider store={store}>
        <InstructorDashboard />
      </Provider>
    );

    const goToCourseButton = await screen.findByRole('button', { name: /Go to Course/i });

    fireEvent.click(goToCourseButton);

    expect(mockDispatch).toHaveBeenCalledWith(fetchCourseDetails({ courseId: '1' }));
    expect(mockNavigate).toHaveBeenCalledWith('/instructor/course/1');
  });

  test('handles empty courses list', async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <Provider store={store}>
        <InstructorDashboard />
      </Provider>
    );

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();

    const courseCards = screen.queryAllByRole('article');
    expect(courseCards.length).toBe(0);
  });

  test('ensures accessibility attributes are set correctly', async () => {
    const coursesData = [
      { id: '1', title: 'Course 1', name: 'Course Name 1' },
    ];

    axios.get.mockResolvedValue({ data: coursesData });

    render(
      <Provider store={store}>
        <InstructorDashboard />
      </Provider>
    );

    expect(await screen.findByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go to course Course 1/i })).toBeInTheDocument();
  });
});
