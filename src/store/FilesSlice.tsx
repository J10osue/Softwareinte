import {createSlice, configureStore, PayloadAction} from '@reduxjs/toolkit';

export type TypeFile = {
  id: string;
  file: string;
  user_id: string;
};

export type InitialState = {
  files: TypeFile[];
};

const initialState: InitialState = {
  files: [],
};

const fileSlice = createSlice({
  name: 'files',
  initialState: initialState,
  reducers: {
    addListFiles: (state, action: PayloadAction<TypeFile[]>) => {
      state.files = action.payload;
    },
    addNewFile: (state, action: PayloadAction<TypeFile>) => {
      const newList = [...state.files, action.payload];
      state.files = newList;
    },
    removeItemFile: (state, action: PayloadAction<string>) => {
      const newList = [...state.files].filter(
        glosary => glosary.id !== action.payload,
      );
      state.files = newList;
    },
  },
});

export const {addListFiles, addNewFile, removeItemFile} = fileSlice.actions;

export default fileSlice;

const store = configureStore({
  reducer: fileSlice.reducer,
});

// Can still subscribe to the store
store.subscribe(() => console.log(store.getState()));
