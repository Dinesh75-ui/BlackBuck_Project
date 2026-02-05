import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import { createTask } from "./taskSlice"; // import creation thunk

// simple fetch project list
export const fetchProjects = createAsyncThunk("projects/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get("/projects");
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "fetch fail");
    }
});

// create new project
export const createProject = createAsyncThunk("projects/create", async (projectData, { rejectWithValue }) => {
    try {
        const { data } = await api.post("/projects", projectData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "create fail");
    }
});

// updating project details
export const updateProject = createAsyncThunk("projects/update", async ({ id, ...data }, { rejectWithValue }) => {
    try {
        const { data: updatedProject } = await api.put(`/projects/${id}`, data);
        return updatedProject;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "update fail");
    }
});

// adding member to team
export const addMember = createAsyncThunk("projects/addMember", async ({ id, userId }, { rejectWithValue }) => {
    try {
        const { data: updatedProject } = await api.post(`/projects/${id}/members`, { userId });
        return updatedProject;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "add memb fail");
    }
});

// remove member from team
export const removeMember = createAsyncThunk("projects/removeMember", async ({ id, userId }, { rejectWithValue }) => {
    try {
        await api.delete(`/projects/${id}/members/${userId}`);
        return { id, userId };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "rm memb fail");
    }
});

// delete project
export const deleteProject = createAsyncThunk("projects/delete", async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/projects/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "del fail");
    }
});

const projectSlice = createSlice({
    name: "projects",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => { state.loading = true; })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                const index = state.list.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(addMember.fulfilled, (state, action) => {
                const index = state.list.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(removeMember.fulfilled, (state, action) => {
                const index = state.list.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    // manualy remove member from local state
                    const project = state.list[index];
                    if (project.members) {
                        project.members = project.members.filter(m => m.id !== action.payload.userId);
                    }
                }
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.list = state.list.filter(p => p.id !== action.payload);
            })
            // Lisetn for task create to update count
            .addCase(createTask.fulfilled, (state, action) => {
                const project = state.list.find(p => p.id === action.payload.projectId);
                if (project) {
                    if (!project._count) project._count = { tasks: 0 };
                    project._count.tasks += 1;
                }
            });
    },
});

export default projectSlice.reducer;
