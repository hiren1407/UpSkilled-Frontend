// userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL, LOGIN_URL } from '../utils/constants';
import { jwtDecode } from 'jwt-decode';
const initialState = {
  role: '', // Default role
};

export const loginUser = createAsyncThunk('user/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${LOGIN_URL}`,
      { email, password },);
    if (response.status === 200) {
      const token = response.data;
      return token;
    }
  } catch (error) {
    return rejectWithValue(error.response.data); // Return error message
  }
});

export const signUpUser = createAsyncThunk('user/signup', async ({ firstName, lastName, email, password, role, designation }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signup`, { firstName, lastName, email, password, role, designation }, { withCredentials: true });
    console.log(response) // Return the user data
  } catch (error) {
    return rejectWithValue(error.response.data); // Return error message
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.user.role.toLowerCase();
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload; // Store token in state
        state.user = jwtDecode(action.payload); // Store user data in state
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error message
      })
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Store user data in state
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error message
      });
  }
});

export const { clearError, setUser } = userSlice.actions;
export default userSlice.reducer;