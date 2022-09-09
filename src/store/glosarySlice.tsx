import {createSlice, configureStore, PayloadAction} from '@reduxjs/toolkit';

export type TypeGlosary = {
  id: string;
  name: string;
  user_id: string;
  description: string;
};

export type InitialState = {
  glossaries: TypeGlosary[];
};

const initialState: InitialState = {
  glossaries: [],
};

const glosarySlice = createSlice({
  name: 'glosary',
  initialState: initialState,
  reducers: {
    addListGlosaries: (state, action: PayloadAction<TypeGlosary[]>) => {
      state.glossaries = action.payload;
    },
    addNewGlossary: (state, action: PayloadAction<TypeGlosary>) => {
      const newList = [...state.glossaries, action.payload];
      state.glossaries = newList;
    },
    removeItemGlossary: (state, action: PayloadAction<string>) => {
      const newList = [...state.glossaries].filter(
        glosary => glosary.id !== action.payload,
      );
      state.glossaries = newList;
    },
  },
});

export const {addListGlosaries, addNewGlossary, removeItemGlossary} =
  glosarySlice.actions;

export default glosarySlice;

const store = configureStore({
  reducer: glosarySlice.reducer,
});

// Can still subscribe to the store
store.subscribe(() => console.log(store.getState()));
