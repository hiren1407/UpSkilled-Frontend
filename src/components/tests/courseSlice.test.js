// courseSlice.test.js
import courseReducer, { fetchCourseDetails } from '../../utils/courseSlice';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';

// Mock dependencies
jest.mock('axios');

describe('courseSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      course: [],
      loading: false,
      error: null,
    };
    jest.clearAllMocks();
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => 'fake-token');
  });

  describe('Async Thunks', () => {
    describe('fetchCourseDetails', () => {
      const courseId = 1;
      const courseData = { id: courseId, title: 'Course 1' };
      const errorMessage = 'Network Error';

      it('dispatches fulfilled action when role is instructor and request succeeds', async () => {
        const response = { status: 200, data: courseData };
        axios.get.mockResolvedValue(response);
        const dispatch = jest.fn();
        const getState = () => ({ user: { role: 'instructor' } });
        const thunk = fetchCourseDetails({ courseId });
        const result = await thunk(dispatch, getState, undefined);
        expect(axios.get).toHaveBeenCalledWith(
          `${BASE_URL}/instructor/course/${courseId}`,
          {
            headers: { Authorization: `Bearer fake-token` },
          }
        );
        expect(result.type).toBe('fetchCourseDetails/fulfilled');
        expect(result.payload).toEqual(courseData);
      });

      it('dispatches rejected action when role is instructor and response status is not 200', async () => {
        const response = { status: 500, data: {} };
        axios.get.mockResolvedValue(response);
        const dispatch = jest.fn();
        const getState = () => ({ user: { role: 'instructor' } });
        const thunk = fetchCourseDetails({ courseId });
        const result = await thunk(dispatch, getState, undefined);
        expect(result.type).toBe('fetchCourseDetails/rejected');
        expect(result.error.message).toBe('Server error');
      });

      it('dispatches rejected action when role is instructor and request fails', async () => {
        axios.get.mockRejectedValue(new Error(errorMessage));
        const dispatch = jest.fn();
        const getState = () => ({ user: { role: 'instructor' } });
        const thunk = fetchCourseDetails({ courseId });
        const result = await thunk(dispatch, getState, undefined);
        expect(result.type).toBe('fetchCourseDetails/rejected');
        expect(result.error.message).toBe(errorMessage);
      });

      it('dispatches fulfilled action when role is employee and request succeeds', async () => {
        const response = { status: 200, data: courseData };
        axios.get.mockResolvedValue(response);
        const dispatch = jest.fn();
        const getState = () => ({ user: { role: 'employee' } });
        const thunk = fetchCourseDetails({ courseId });
        const result = await thunk(dispatch, getState, undefined);
        expect(axios.get).toHaveBeenCalledWith(
          `${BASE_URL}/employee/course/${courseId}`,
          {
            headers: { Authorization: `Bearer fake-token` },
          }
        );
        expect(result.type).toBe('fetchCourseDetails/fulfilled');
        expect(result.payload).toEqual(courseData);
      });

      it('dispatches rejected action when role is employee and response status is not 200', async () => {
        const response = { status: 500, data: {} };
        axios.get.mockResolvedValue(response);
        const dispatch = jest.fn();
        const getState = () => ({ user: { role: 'employee' } });
        const thunk = fetchCourseDetails({ courseId });
        const result = await thunk(dispatch, getState, undefined);
        expect(result.type).toBe('fetchCourseDetails/rejected');
        expect(result.error.message).toBe('Server error');
      });

      it('dispatches rejected action when role is employee and request fails', async () => {
        axios.get.mockRejectedValue(new Error(errorMessage));
        const dispatch = jest.fn();
        const getState = () => ({ user: { role: 'employee' } });
        const thunk = fetchCourseDetails({ courseId });
        const result = await thunk(dispatch, getState, undefined);
        expect(result.type).toBe('fetchCourseDetails/rejected');
        expect(result.error.message).toBe(errorMessage);
      });
    });
  });

  describe('Reducers', () => {
    it('should handle clearError', () => {
      const previousState = {
        ...initialState,
        error: 'Some error',
      };
      const action = { type: 'courseDetails/clearError' };
      const state = courseReducer(previousState, action);
      expect(state.error).toBeNull();
    });

    it('handles fetchCourseDetails.pending', () => {
      const action = { type: fetchCourseDetails.pending.type };
      const state = courseReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('handles fetchCourseDetails.fulfilled', () => {
      const action = {
        type: fetchCourseDetails.fulfilled.type,
        payload: { id: 1, title: 'Course 1' },
      };
      const state = courseReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.course).toEqual(action.payload);
    });

    it('handles fetchCourseDetails.rejected', () => {
      const action = {
        type: fetchCourseDetails.rejected.type,
        error: { message: 'Server error' },
      };
      const state = courseReducer(initialState, action);
      expect(state.loading).toBe(false);
     // expect(state.error).toBe('Server error');
    });
  });
});
