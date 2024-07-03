import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchQuestions } from '../../services/api';

interface Question {
  id: number;
  category: string;
  question: string;
  answer: string;
}

interface QuestionsState {
  questions: Question[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: QuestionsState = {
  questions: [],
  status: 'idle',
  error: null,
};

export const getQuestions = createAsyncThunk('questions/getQuestions', async () => {
  const questions = await fetchQuestions();
  return questions;
});

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getQuestions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload;
      })
      .addCase(getQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      });
  },
});

export default questionsSlice.reducer;
