import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchAll',
    async ({ page = 1, filter = 'all' } = {}, { rejectWithValue }) => {
        try {
            const res = await api.get(`/notifications?page=${page}&filter=${filter}&limit=20`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch notifications');
        }
    }
);

export const fetchUnreadCount = createAsyncThunk(
    'notifications/fetchUnreadCount',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/notifications/unread-count');
            return res.data.data.count;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

export const markOneRead = createAsyncThunk(
    'notifications/markOneRead',
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.put(`/notifications/${id}/read`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

export const markAllRead = createAsyncThunk(
    'notifications/markAllRead',
    async (_, { rejectWithValue }) => {
        try {
            await api.put('/notifications/mark-all-read');
            return true;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

export const deleteOne = createAsyncThunk(
    'notifications/deleteOne',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/notifications/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

export const clearAll = createAsyncThunk(
    'notifications/clearAll',
    async (_, { rejectWithValue }) => {
        try {
            await api.delete('/notifications/clear-all');
            return true;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

export const seedTestNotifications = createAsyncThunk(
    'notifications/seed',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.post('/notifications/seed-test');
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const notificationSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        unreadCount: 0,
        pagination: { page: 1, pages: 1, total: 0 },
        isLoading: false,
        drawerOpen: false,
        error: null
    },
    reducers: {
        // Called by SSE handler to push a new notification in real-time
        pushNotification: (state, action) => {
            state.items.unshift(action.payload);
            state.unreadCount += 1;
        },
        toggleDrawer: (state) => {
            state.drawerOpen = !state.drawerOpen;
        },
        closeDrawer: (state) => {
            state.drawerOpen = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchNotifications
            .addCase(fetchNotifications.pending, (state) => { state.isLoading = true; })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload.notifications;
                state.unreadCount = action.payload.unreadCount;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // fetchUnreadCount
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            })
            // markOneRead
            .addCase(markOneRead.fulfilled, (state, action) => {
                const idx = state.items.findIndex(n => n._id === action.payload._id);
                if (idx !== -1) {
                    state.items[idx].isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            // markAllRead
            .addCase(markAllRead.fulfilled, (state) => {
                state.items = state.items.map(n => ({ ...n, isRead: true }));
                state.unreadCount = 0;
            })
            // deleteOne
            .addCase(deleteOne.fulfilled, (state, action) => {
                const removed = state.items.find(n => n._id === action.payload);
                if (removed && !removed.isRead) state.unreadCount = Math.max(0, state.unreadCount - 1);
                state.items = state.items.filter(n => n._id !== action.payload);
            })
            // clearAll
            .addCase(clearAll.fulfilled, (state) => {
                state.items = [];
                state.unreadCount = 0;
            })
            // seed
            .addCase(seedTestNotifications.fulfilled, (state, action) => {
                state.items = [...action.payload, ...state.items];
                state.unreadCount += action.payload.length;
            });
    }
});

export const { pushNotification, toggleDrawer, closeDrawer } = notificationSlice.actions;
export default notificationSlice.reducer;
