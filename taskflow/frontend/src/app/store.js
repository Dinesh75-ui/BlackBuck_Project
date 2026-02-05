import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/userSlice";
import projectReducer from "../features/projectSlice";
import taskReducer from "../features/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    projects: projectReducer,
    tasks: taskReducer,
  },
});
