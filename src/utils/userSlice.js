// userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { jwtDecode } from 'jwt-decode';
const initialState = {
  role: '', // Default role
};

export const loginUser = createAsyncThunk('user/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`,
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
    // Return the user data
    return response.status
  } catch (error) {
    return rejectWithValue(error.response.data); // Return error message
  }
});

export const updateUser  = createAsyncThunk('user/update', async ({designation,password}, { rejectWithValue }) => {
    try {
      
      const token = localStorage.getItem('token')
      const response = await fetch(`${BASE_URL}/auth/update-profile`,{
        method:'POST',
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json'
          
        },
        body:JSON.stringify({designation,password})
      
      }); // Adjust the URL as needed
      return response.status; // Return updated user data
    } catch (error) {
      return rejectWithValue(error.response.data);
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
    clearUser(state) {
        state.user = null;
        state.token = null;
        state.role = '';
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
      })
      .addCase(updateUser .pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser .fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Update user data in state
      })
      .addCase(updateUser .rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error message
      });
  }
});

export const { clearError, setUser,clearUser } = userSlice.actions;
export default userSlice.reducer;