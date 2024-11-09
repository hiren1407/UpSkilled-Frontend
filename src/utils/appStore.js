import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import courseReducer from './courseSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        courseDetails: courseReducer,
    },
});

export default store;