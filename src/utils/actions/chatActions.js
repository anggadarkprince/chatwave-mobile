import {getFirebaseApp} from '../firebaseHelper';
import {
  getDatabase,
  ref,
  push,
  child,
  update,
  get,
  set,
  remove,
} from '@firebase/database';
import {addUserChat, deleteUserChats, getUserChats} from "./userActions";

export const createChat = async (loggedInUserId, chatData) => {
  const newChatData = {
    ...chatData,
    createdBy: loggedInUserId,
    updatedBy: loggedInUserId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const app = getFirebaseApp();
  const dbRef = ref(getDatabase(app));
  const newChat = await push(child(dbRef, 'chats'), newChatData);

  const chatUsers = newChatData.users;
  for (let i = 0; i < chatUsers.length; i++) {
    const userId = chatUsers[i];
    await push(child(dbRef, `userChats/${userId}`), newChat.key);
  }
  return newChat.key;
};

export const updateChatData = async (chatId, userId, chatData) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const chatRef = child(dbRef, `chats/${chatId}`);
    await update(chatRef, {
      ...chatData,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendTextMessage = async (
  chatId,
  senderId,
  messageText,
  replyTo,
) => {
  await sendMessage(chatId, senderId, messageText, null, replyTo, null);
};

export const sendImageMessage = async (
  chatId,
  senderId,
  messageText,
  imageUrl,
  replyTo,
) => {
  await sendMessage(chatId, senderId, messageText, imageUrl, replyTo, null);
};

export const sendInfoMessage = async (chatId, senderId, messageText) => {
  await sendMessage(chatId, senderId, messageText, null, null, 'info');
};

const sendMessage = async (
  chatId,
  senderId,
  messageText,
  imageUrl,
  replyTo,
  type,
) => {
  const app = getFirebaseApp();
  const dbRef = ref(getDatabase(app));
  const messagesRef = child(dbRef, `messages/${chatId}`);

  const messageData = {
    sentBy: senderId,
    sentAt: new Date().toISOString(),
    text: messageText,
  };

  if (replyTo) {
    messageData.replyTo = replyTo;
  }

  if (imageUrl) {
    messageData.imageUrl = imageUrl;
  }

  if (type) {
    messageData.type = type;
  }

  await push(messagesRef, messageData);

  const chatRef = child(dbRef, `chats/${chatId}`);
  await update(chatRef, {
    updatedBy: senderId,
    updatedAt: new Date().toISOString(),
    latestMessageText: messageText,
  });
};

export const starMessage = async (messageId, chatId, userId) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const childRef = child(
      dbRef,
      `userStarredMessages/${userId}/${chatId}/${messageId}`,
    );

    const snapshot = await get(childRef);
    if (snapshot.exists()) {
      await remove(childRef);
    } else {
      const starredMessageData = {
        messageId,
        chatId,
        starredAt: new Date().toISOString(),
      };
      await set(childRef, starredMessageData);
    }
  } catch (error) {
    console.log(error);
  }
};

export const removeUserFromChat = async (
  userLoggedInData,
  userToRemoveData,
  chatData,
) => {
  const userToRemoveId = userToRemoveData.userId;
  const newUsers = chatData.users.filter(uid => uid !== userToRemoveId);
  await updateChatData(chatData.key, userLoggedInData.userId, {
    users: newUsers,
  });
  const userChats = await getUserChats(userToRemoveId);
  for (const key in userChats) {
    const currentChatId = userChats[key];
    if (currentChatId === chatData.key) {
      await deleteUserChats(userToRemoveId, key);
      break;
    }
  }

  const messageText =
    userLoggedInData.userId === userToRemoveData.userId
      ? `${userLoggedInData.firstName} left the chat`
      : `${userLoggedInData.firstName} removed ${userToRemoveData.firstName} from the chat`;

  await sendInfoMessage(chatData.key, userLoggedInData.userId, messageText);
};

export const addUsersToChat = async (userLoggedInData, usersToAddData, chatData) => {
  const existingUsers = Object.values(chatData.users);
  const newUsers = [];
  let userAddedName = "";

  for (const userToAdd of usersToAddData) {
    const userToAddId = userToAdd.userId;
    if (existingUsers.includes(userToAddId)) {
      continue;
    }
    newUsers.push(userToAddId);

    await addUserChat(userToAddId, chatData.key);

    userAddedName = `${userToAdd.firstName} ${userToAdd.lastName}`;
  }

  if (newUsers.length === 0) {
    return;
  }

  await updateChatData(chatData.key, userLoggedInData.userId, {
    users: existingUsers.concat(newUsers),
  });

  const moreUsersMessage = newUsers.length > 1 ? `and ${newUsers.length - 1} others ` : '';
  const messageText = `${userLoggedInData.firstName} ${userLoggedInData.lastName} added ${userAddedName} ${moreUsersMessage}to the chat`;

  await sendInfoMessage(chatData.key, userLoggedInData.userId, messageText);

};
