import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Question {
  id: number;
  category: string;
  question: string;
  answer: string;
}

interface QuestionsState {
  questions: Question[];
}

const initialState: QuestionsState = {
  questions: [],
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestions(state, action: PayloadAction<Question[]>) {
      state.questions = action.payload;
    },
  },
});

export const { setQuestions } = questionsSlice.actions;
export default questionsSlice.reducer;
