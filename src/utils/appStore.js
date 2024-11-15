import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import courseReducer from './courseSlice';
import appReducer from './appSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        courseDetails: courseReducer,
        app:appReducer
    },
});

export default store;