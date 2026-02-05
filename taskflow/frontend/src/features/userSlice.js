import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchUsers = createAsyncThunk("users/fetchAll", async (_, { rejectWithValue }) => {
    try {
        console.log("FRONTEND: Fetching all users");
        const { data } = await api.get("/api/users");
        return data;
    } catch (err) {
        console.error("FRONTEND: fetchUsers fail", err.response?.data || err.message);
        return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
    }
});

export const createUser = createAsyncThunk("users/create", async (userData, { rejectWithValue }) => {
    try {
        console.log("FRONTEND: Creating user", userData);
        const { data } = await api.post("/api/users", userData);
        console.log("FRONTEND: createUser success", data);
        return data.user;
    } catch (err) {
        console.error("FRONTEND: createUser fail", err.response?.data || err.message);
        return rejectWithValue(err.response?.data?.message || "Failed to create user");
    }
});

export const updateUser = createAsyncThunk("users/update", async ({ id, ...userData }, { rejectWithValue }) => {
    try {
        console.log(`FRONTEND: Updating user ${id}`, userData);
        const { data } = await api.put(`/api/users/${id}`, userData);
        console.log("FRONTEND: User update response:", data);
        return data.user;
    } catch (err) {
        console.error("FRONTEND: User update error:", err.response?.data || err.message);
        return rejectWithValue(err.response?.data?.message || "Failed to update user");
    }
});

export const deleteUser = createAsyncThunk("users/delete", async (id, { rejectWithValue }) => {
    try {
        console.log(`FRONTEND: Deleting user ${id}`);
        await api.delete(`/api/users/${id}`);
        console.log("FRONTEND: deleteUser success");
        return id;
    } catch (err) {
        console.error("FRONTEND: deleteUser fail", err.response?.data || err.message);
        return rejectWithValue(err.response?.data?.message || "Failed to delete user");
    }
});

const userSlice = createSlice({
    name: "users",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.list.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.list = state.list.filter(user => user.id !== action.payload);
            });
    },
});

export default userSlice.reducer;
