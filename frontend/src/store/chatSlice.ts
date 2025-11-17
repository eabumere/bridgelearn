import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userRole: 'teacher' | 'student' | 'support';
  message: string;
  timestamp: Date;
  type: 'class' | 'support';
  avatar?: string;
}

interface ChatState {
  classMessages: ChatMessage[];
  supportMessages: ChatMessage[];
  activeTab: 'class' | 'support';
  isSupportModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  classMessages: [],
  supportMessages: [],
  activeTab: 'class',
  isSupportModalOpen: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (
    { message, type }: { message: string; type: 'class' | 'support' },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Send message via Socket.IO or API
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: 'current-user-id',
        userName: 'Current User',
        userRole: 'student',
        message,
        timestamp: new Date(),
        type,
      };
      return newMessage;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadChatHistory = createAsyncThunk(
  'chat/loadChatHistory',
  async (type: 'class' | 'support', { rejectWithValue }) => {
    try {
      // TODO: Load chat history from API
      return { type, messages: [] };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    receiveMessage: (state, action: PayloadAction<ChatMessage>) => {
      if (action.payload.type === 'class') {
        state.classMessages.push(action.payload);
      } else {
        state.supportMessages.push(action.payload);
      }
    },
    setActiveTab: (state, action: PayloadAction<'class' | 'support'>) => {
      state.activeTab = action.payload;
    },
    openSupportModal: (state) => {
      state.isSupportModalOpen = true;
      state.activeTab = 'support';
    },
    closeSupportModal: (state) => {
      state.isSupportModalOpen = false;
    },
    clearMessages: (state, action: PayloadAction<'class' | 'support'>) => {
      if (action.payload === 'class') {
        state.classMessages = [];
      } else {
        state.supportMessages = [];
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.type === 'class') {
          state.classMessages.push(action.payload);
        } else {
          state.supportMessages.push(action.payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loadChatHistory.fulfilled, (state, action) => {
        if (action.payload.type === 'class') {
          state.classMessages = action.payload.messages;
        } else {
          state.supportMessages = action.payload.messages;
        }
      });
  },
});

export const {
  receiveMessage,
  setActiveTab,
  openSupportModal,
  closeSupportModal,
  clearMessages,
  setError,
} = chatSlice.actions;
export default chatSlice.reducer;

