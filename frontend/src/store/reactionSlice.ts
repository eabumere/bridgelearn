import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type ReactionType = '👏' | '👍' | '🔥' | 'Great Job!' | '🎉' | '⭐' | '💯';

export interface Reaction {
  id: string;
  userId: string;
  userName: string;
  type: ReactionType;
  timestamp: Date;
  position?: { x: number; y: number }; // For animated reactions on screen
}

export interface Reward {
  id: string;
  userId: string;
  points: number;
  badge?: string;
  description: string;
  timestamp: Date;
}

interface ReactionState {
  reactions: Reaction[];
  rewards: Reward[];
  totalPoints: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReactionState = {
  reactions: [],
  rewards: [],
  totalPoints: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const sendReaction = createAsyncThunk(
  'reaction/sendReaction',
  async (
    { type, position }: { type: ReactionType; position?: { x: number; y: number } },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Send reaction via Socket.IO
      const reaction: Reaction = {
        id: Date.now().toString(),
        userId: 'current-user-id',
        userName: 'Current User',
        type,
        timestamp: new Date(),
        position,
      };
      return reaction;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addReward = createAsyncThunk(
  'reaction/addReward',
  async (
    { userId, points, badge, description }: {
      userId: string;
      points: number;
      badge?: string;
      description: string;
    },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Call API to add reward
      const reward: Reward = {
        id: Date.now().toString(),
        userId,
        points,
        badge,
        description,
        timestamp: new Date(),
      };
      return reward;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const reactionSlice = createSlice({
  name: 'reaction',
  initialState,
  reducers: {
    receiveReaction: (state, action: PayloadAction<Reaction>) => {
      state.reactions.push(action.payload);
      // Keep only last 50 reactions
      if (state.reactions.length > 50) {
        state.reactions = state.reactions.slice(-50);
      }
    },
    clearReactions: (state) => {
      state.reactions = [];
    },
    receiveReward: (state, action: PayloadAction<Reward>) => {
      state.rewards.push(action.payload);
      state.totalPoints += action.payload.points;
    },
    setTotalPoints: (state, action: PayloadAction<number>) => {
      state.totalPoints = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendReaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendReaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reactions.push(action.payload);
        if (state.reactions.length > 50) {
          state.reactions = state.reactions.slice(-50);
        }
      })
      .addCase(sendReaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addReward.fulfilled, (state, action) => {
        state.rewards.push(action.payload);
        state.totalPoints += action.payload.points;
      });
  },
});

export const {
  receiveReaction,
  clearReactions,
  receiveReward,
  setTotalPoints,
  setError,
} = reactionSlice.actions;
export default reactionSlice.reducer;

