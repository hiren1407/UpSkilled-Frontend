import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "./constants";
import { useSelector } from "react-redux";



export const fetchCourseDetails = createAsyncThunk('fetchCourseDetails', async ({ courseId },{getState}) => {
    const role=getState().user.role
    if(role=="instructor"){
    const response = await axios.get(`${BASE_URL}/instructor/course/${courseId}`,
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }
    );
    if (response.status !== 200) {
        throw new Error('Server error');
    }
    return response.data;
}
else{
    const response = await axios.get(`${BASE_URL}/employee/course/${courseId}`,
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }
    );
    if (response.status !== 200) {
        throw new Error('Server error');
    }
    return response.data;
}
    
});

const courseSlice = createSlice({
    name: 'courseDetails',
    initialState: {
        course: [],
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourseDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(fetchCourseDetails.fulfilled, (state, action) => {
                state.course = action.payload;
                state.loading = false;
            }
            )
            .addCase(fetchCourseDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
            )
    }
});
export default courseSlice.reducer;
