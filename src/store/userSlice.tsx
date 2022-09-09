import {createSlice, configureStore, PayloadAction} from '@reduxjs/toolkit';
const initialState = {
  accessToken: '',
  isLogin: false,
  user: {
    id: '',
    email: '',
    role: '',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    addUserAuth: (
      state,
      action: PayloadAction<{
        isLogin: boolean;
        user: {id: string; email: string; role: string};
        accessToken: string;
      }>,
    ) => {
      state.isLogin = action.payload.isLogin;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
  },
});

export const {addUserAuth} = userSlice.actions;

export default userSlice;

const store = configureStore({
  reducer: userSlice.reducer,
});

// Can still subscribe to the store
store.subscribe(() => console.log(store.getState()));
