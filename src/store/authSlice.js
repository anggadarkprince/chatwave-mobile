import {createSlice} from '@reduxjs/toolkit';

const defaultState = {
  token: null,
  userData: null,
  didTryAutoLogin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: defaultState,
  reducers: {
    authenticate: (state, action) => {
      const {payload} = action;
      state.token = payload.token;
      state.userData = payload.userData;
      state.didTryAutoLogin = true;
      console.log(state);
    },
    setDidTryAutoLogin: (state, action) => {
      state.didTryAutoLogin = true;
    },
    logout: (state, action) => {
      state.token = defaultState.token;
      state.userData = defaultState.userData;
      state.didTryAutoLogin = defaultState.didTryAutoLogin;
    },
  },
});

export const {authenticate, setDidTryAutoLogin, logout} = authSlice.actions;

export default authSlice.reducer;
