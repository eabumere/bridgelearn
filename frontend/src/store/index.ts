import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import classroomReducer from './classroomSlice';
import chatReducer from './chatSlice';
import reactionReducer from './reactionSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    classroom: classroomReducer,
    chat: chatReducer,
    reaction: reactionReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['classroom/setLocalStream'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.stream', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['classroom.localStream'],
      },
    }),
});

// Export types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

