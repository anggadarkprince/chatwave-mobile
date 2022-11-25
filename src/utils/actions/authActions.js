import {getFirebaseApp} from '../firebaseHelper';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {child, ref, set, getDatabase} from 'firebase/database';
import {authenticate, logout} from '../../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserData} from './userActions';

let timer;

export const signUp = ({firstName, lastName, email, password}) => {
  return async dispatch => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const {uid, stsTokenManager} = result.user;
      const {accessToken, expirationTime} = stsTokenManager;

      const expiryDate = new Date(expirationTime);
      const userData = await createUser({
        firstName,
        lastName,
        email,
        userId: uid,
      });
      dispatch(authenticate({token: accessToken, userData}));
      await saveDataToStorage(accessToken, uid, expiryDate);
    } catch (error) {
      const errorCode = error.code;
      let message = 'Something went wrong.';
      if (errorCode === 'auth/email-already-in-use') {
        message = 'This email is already in user';
      }
      const err = new Error(message);
      err.code = errorCode;
      throw err;
    }
  };
};

export const signIn = (email, password) => {
  return async dispatch => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const {uid, stsTokenManager} = result.user;
      const {accessToken, expirationTime} = stsTokenManager;

      const expiryDate = new Date(expirationTime);
      const timeNow = new Date();
      const millisecondsUntilExpiry = expiryDate - timeNow;
      const userData = await getUserData(uid);

      timer = setTimeout(() => {
        dispatch(userLogout());
      }, millisecondsUntilExpiry);

      dispatch(authenticate({token: accessToken, userData}));
      await saveDataToStorage(accessToken, uid, expiryDate);
    } catch (error) {
      const errorCode = error.code;
      let message = 'Something went wrong.';
      if (['auth/wrong-password', 'auth/user-not-found'].includes(errorCode)) {
        message = 'This email or password was incorrect';
      }
      const err = new Error(message);
      err.code = errorCode;
      throw err;
    }
  };
};

export const userLogout = () => {
  return async dispatch => {
    clearTimeout(timer);
    dispatch(logout());
    await AsyncStorage.clear();
  };
};

const createUser = async ({firstName, lastName, email, userId}) => {
  const fullName = `${firstName} ${lastName}`.toLowerCase();
  const userData = {
    firstName,
    lastName,
    fullName,
    email,
    userId,
    signUpDate: new Date().toISOString(),
  };
  const dbRef = ref(getDatabase());
  const childRef = child(dbRef, `users/${userId}`);
  await set(childRef, userData);
  return userData;
};

const saveDataToStorage = async (token, userId, expiryDate) => {
  await AsyncStorage.setItem(
    'userData',
    JSON.stringify({token, userId, expiryDate}),
  );
};
