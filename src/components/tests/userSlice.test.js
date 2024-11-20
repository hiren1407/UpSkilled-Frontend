// userSlice.test.js
import userReducer, {
    loginUser,
    signUpUser,
    updateUser,
    setUser,
    clearUser,
    clearError,
  } from '../../utils/userSlice';
  import axios from 'axios';
  import jwtDecode from 'jwt-decode';
  
  // Mock dependencies
jest.mock('axios');
jest.mock('jwt-decode', () => ({
  __esModule: true,
  default: jest.fn(),
}));
global.fetch = jest.fn();

  describe('userSlice', () => {
    let initialState;
  
    beforeEach(() => {
      initialState = {
        role: '',
      };
      jest.clearAllMocks();
    });
  
    describe('Reducers', () => {
      it('should handle setUser', () => {
        const user = { role: 'Admin' };
        const token = 'token123';
        const action = setUser({ user, token });
        const state = userReducer(initialState, action);
        expect(state.user).toEqual(user);
        expect(state.token).toEqual(token);
        expect(state.role).toEqual('admin');
      });
  
      it('should handle clearUser', () => {
        const previousState = {
          ...initialState,
          user: { name: 'John Doe' },
          token: 'token123',
          role: 'user',
        };
        const action = clearUser();
        const state = userReducer(previousState, action);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.role).toEqual('');
      });
  
      it('should handle clearError', () => {
        const previousState = { ...initialState, error: 'Some error' };
        const action = clearError();
        const state = userReducer(previousState, action);
        expect(state.error).toBeNull();
      });
    });
  
    describe('Async Thunks', () => {
      describe('loginUser', () => {
        it('dispatches fulfilled action when login is successful', async () => {
          const token = 'fake-jwt-token';
          axios.post.mockResolvedValue({ status: 200, data: token });
          const dispatch = jest.fn();
          const thunk = loginUser({ email: 'test@test.com', password: 'password' });
          const result = await thunk(dispatch, () => {}, undefined);
          expect(result.type).toBe('user/login/fulfilled');
          expect(result.payload).toBe(token);
        });
  
        it('dispatches rejected action when login fails', async () => {
          const errorMessage = 'Invalid credentials';
          axios.post.mockRejectedValue({ response: { data: errorMessage } });
          const dispatch = jest.fn();
          const thunk = loginUser({ email: 'test@test.com', password: 'wrongpassword' });
          const result = await thunk(dispatch, () => {}, undefined);
          expect(result.type).toBe('user/login/rejected');
          expect(result.payload).toBe(errorMessage);
        });
      });
  
      describe('signUpUser', () => {
        it('dispatches fulfilled action when signup is successful', async () => {
          axios.post.mockResolvedValue({ status: 201 });
          const dispatch = jest.fn();
          const thunk = signUpUser({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@test.com',
            password: 'password',
            role: 'User',
            designation: 'Developer',
          });
          const result = await thunk(dispatch, () => {}, undefined);
          expect(result.type).toBe('user/signup/fulfilled');
          expect(result.payload).toBe(true);
        });
  
        it('dispatches rejected action when signup fails', async () => {
          const errorMessage = 'Email already exists';
          axios.post.mockRejectedValue({ response: { data: errorMessage } });
          const dispatch = jest.fn();
          const thunk = signUpUser({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@test.com',
            password: 'password',
            role: 'User',
            designation: 'Developer',
          });
          const result = await thunk(dispatch, () => {}, undefined);
          expect(result.type).toBe('user/signup/rejected');
          expect(result.payload).toBe(errorMessage);
        });
      });
  
      describe('updateUser', () => {
        beforeEach(() => {
          localStorage.setItem('token', 'test-token');
        });
  
        it('dispatches fulfilled action when update is successful', async () => {
          fetch.mockResolvedValue({ status: 200 });
          const dispatch = jest.fn();
          const thunk = updateUser({ password: 'newpassword' });
          const result = await thunk(dispatch, () => {}, undefined);
          expect(result.type).toBe('user/update/fulfilled');
          expect(result.payload).toBe(200);
        });
  
        it('dispatches rejected action when update fails', async () => {
          const errorMessage = 'Update failed';
          fetch.mockRejectedValue({ response: { data: errorMessage } });
          const dispatch = jest.fn();
          const thunk = updateUser({ password: 'newpassword' });
          const result = await thunk(dispatch, () => {}, undefined);
          expect(result.type).toBe('user/update/rejected');
          expect(result.payload).toBe(errorMessage);
        });
      });
    });
  
    describe('Extra Reducers', () => {
      it('handles loginUser.pending', () => {
        const action = { type: loginUser.pending.type };
        const state = userReducer(initialState, action);
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });
  
      it('handles loginUser.fulfilled', () => {
        const user = { role: 'Admin' };
        const token = 'fake-jwt-token';
        jwtDecode.mockReturnValue(user);
        const action = { type: loginUser.fulfilled.type, payload: token };
        const state = userReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.token).toBe(token);
        expect(state.user).toEqual(user);
      });
  
      it('handles loginUser.rejected', () => {
        const errorMessage = 'Invalid credentials';
        const action = { type: loginUser.rejected.type, payload: errorMessage };
        const state = userReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    });
  });
  