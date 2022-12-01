import {
  child,
  getDatabase,
  ref,
  orderByChild,
  get,
  query,
  startAt,
  endAt,
  remove,
} from 'firebase/database';
import {getFirebaseApp} from '../firebaseHelper';

export const getUserData = async userId => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `users/${userId}`);

    const snapshot = await get(userRef);
    return snapshot.val();
  } catch (e) {
    console.log(e);
  }
};

export const getUserChats = async userId => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `userChats/${userId}`);

    const snapshot = await get(userRef);
    return snapshot.val();
  } catch (e) {
    console.log(e);
  }
};

export const deleteUserChats = async (userId, key) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const chatRef = child(dbRef, `userChats/${userId}/${key}`);
    await remove(chatRef);
  } catch (e) {
    console.log(e);
  }
};

export const searchUsers = async (queryText) => {
  const searchTerm = queryText.toLowerCase();

  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, 'users');

    const queryRef = query(
      userRef,
      orderByChild('fullName'),
      startAt(searchTerm),
      endAt(searchTerm + '\uf8ff'),
    );

    const snapshot = await get(queryRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }

    return {};
  } catch (error) {
    console.log(error);
    throw error;
  }
}