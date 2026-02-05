import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchTasks = createAsyncThunk("tasks/fetchAll", async (projectId, { rejectWithValue }) => {
    try {
        const url = projectId ? `/api/tasks?projectId=${projectId}` : "/api/tasks";
        const { data } = await api.get(url);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to fetch tasks");
    }
});

export const createTask = createAsyncThunk("tasks/create", async (taskData, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/api/tasks", taskData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to create task");
    }
});

export const updateTaskStatus = createAsyncThunk("tasks/updateStatus", async ({ id, status }, { rejectWithValue }) => {
    try {
        console.log(`FRONTEND: Requesting task update id=${id}, status=${status}`);
        const { data } = await api.patch(`/api/tasks/${id}`, { status });
        console.log("FRONTEND: Update success data:", data);
        return data;
    } catch (err) {
        console.error("FRONTEND: Update error:", err.response?.data || err.message);
        return rejectWithValue(err.response?.data?.message || "Failed to update task");
    }
});

export const deleteTask = createAsyncThunk("tasks/delete", async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/api/tasks/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Failed to delete task");
    }
});

const taskSlice = createSlice({
    name: "tasks",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                console.log("REDUX: updateTaskStatus.fulfilled", action.payload);
                const index = state.list.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(updateTaskStatus.rejected, (state, action) => {
                console.error("REDUX: updateTaskStatus.rejected", action.payload);
                state.error = action.payload;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.list = state.list.filter(t => t.id !== action.payload);
            });
    },
});

export default taskSlice.reducer;
