import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const login = createAsyncThunk(
  "auth/login",
  async (data) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export default authSlice.reducer;
