import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type VideoQuality = 'low' | 'medium' | 'high' | 'hd';

export interface Participant {
  id: string;
  name: string;
  role: 'teacher' | 'student' | 'support';
  stream?: MediaStream;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  avatar?: string;
}

export interface ClassroomSession {
  id: string;
  title: string;
  startTime: Date;
  endTime?: Date;
  participants: Participant[];
  isActive: boolean;
}

interface ClassroomState {
  currentSession: ClassroomSession | null;
  localStream: MediaStream | null;
  videoQuality: VideoQuality;
  isCameraEnabled: boolean;
  isMicEnabled: boolean;
  isScreenSharing: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: ClassroomState = {
  currentSession: null,
  localStream: null,
  videoQuality: 'medium',
  isCameraEnabled: false,
  isMicEnabled: false,
  isScreenSharing: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const startSession = createAsyncThunk(
  'classroom/startSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      // TODO: Call API to start session
      return { sessionId };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const endSession = createAsyncThunk(
  'classroom/endSession',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Call API to end session
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const classroomSlice = createSlice({
  name: 'classroom',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<ClassroomSession>) => {
      state.currentSession = action.payload;
    },
    setLocalStream: (state, action: PayloadAction<MediaStream | null>) => {
      state.localStream = action.payload;
    },
    toggleCamera: (state) => {
      state.isCameraEnabled = !state.isCameraEnabled;
      if (state.localStream) {
        const videoTrack = state.localStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = state.isCameraEnabled;
        }
      }
    },
    toggleMic: (state) => {
      state.isMicEnabled = !state.isMicEnabled;
      if (state.localStream) {
        const audioTrack = state.localStream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = state.isMicEnabled;
        }
      }
    },
    toggleScreenShare: (state) => {
      state.isScreenSharing = !state.isScreenSharing;
    },
    setVideoQuality: (state, action: PayloadAction<VideoQuality>) => {
      state.videoQuality = action.payload;
    },
    addParticipant: (state, action: PayloadAction<Participant>) => {
      if (state.currentSession) {
        state.currentSession.participants.push(action.payload);
      }
    },
    removeParticipant: (state, action: PayloadAction<string>) => {
      if (state.currentSession) {
        state.currentSession.participants = state.currentSession.participants.filter(
          (p) => p.id !== action.payload
        );
      }
    },
    updateParticipant: (state, action: PayloadAction<{ id: string; updates: Partial<Participant> }>) => {
      if (state.currentSession) {
        const participant = state.currentSession.participants.find(
          (p) => p.id === action.payload.id
        );
        if (participant) {
          Object.assign(participant, action.payload.updates);
        }
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startSession.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(startSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(endSession.fulfilled, (state) => {
        state.currentSession = null;
        state.localStream = null;
        state.isCameraEnabled = false;
        state.isMicEnabled = false;
        state.isScreenSharing = false;
      });
  },
});

export const {
  setSession,
  setLocalStream,
  toggleCamera,
  toggleMic,
  toggleScreenShare,
  setVideoQuality,
  addParticipant,
  removeParticipant,
  updateParticipant,
  setError,
} = classroomSlice.actions;
export default classroomSlice.reducer;

