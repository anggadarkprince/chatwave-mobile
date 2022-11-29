import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  CameraIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
} from 'react-native-heroicons/outline';
import Colors from '../../components/Utilities/Colors';
import {useSelector} from 'react-redux';
import {PageContainer} from '../../components/Containers';
import {Bubble} from '../../components/Chats';
import {createChat, sendTextMessage} from '../../utils/actions/chatActions';

export const ChatScreen = ({route, navigation}) => {
  const userData = useSelector(state => state.auth.userData);
  const storedUsers = useSelector(state => state.users.storedUsers);
  const storedChats = useSelector(state => state.chats.chatsData);

  const [chatUsers, setChatUsers] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [chatId, setChatId] = useState(route?.params?.chatId);
  const [errorBannerText, setErrorBannerText] = useState('');

  const chatMessages = useSelector(state => {
    if (!chatId) {
      console.log('no chat id');
      return [];
    }
    const chatMessagesData = state.messages.messagesData[chatId];
    if (!chatMessagesData) {
      return chatMessagesData;
    }
    const messageList = [];
    for (const key in chatMessagesData) {
      const message = chatMessagesData[key];
      messageList.push({
        key: key,
        ...message,
      });
    }
    return messageList;
  });

  const chatData = (chatId && storedChats[chatId]) || route?.params?.newChatData;

  const getChatTitleFromName = () => {
    const otherUserId = chatUsers.find(uid => uid !== userData.userId);
    const otherUserData = storedUsers[otherUserId];
    return (
      otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: getChatTitleFromName(),
    });
    setChatUsers(chatData.users);
  }, [chatData.users, chatUsers]);

  const sendMessage = useCallback(async () => {
    if (!messageText || messageText === '') {
      return;
    }
    try {
      let id = chatId;
      if (!id) {
        // no chat id, create the chat
        id = await createChat(userData.userId, route.params.newChatData);
        console.log(id);
        setChatId(id);
      }
      await sendTextMessage(chatId, userData.userId, messageText);
      setMessageText('');
    } catch (error) {
      console.log(error);
      setErrorBannerText('Message failed to send');
      setTimeout(() => setErrorBannerText(''), 5000);
    }
  }, [messageText, chatId]);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}>
        <PageContainer style={styles.chatContainer}>
          {!chatId && (
            <Bubble text="This is a new chat. Say hi!" type="system" />
          )}
          {errorBannerText !== '' && (
            <Bubble text={errorBannerText} type="error" />
          )}
          {chatId && (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={chatMessages}
              renderItem={itemData => {
                const message = itemData.item;
                const isOwnMessage = message.sentBy === userData.userId;
                const messageType = isOwnMessage ? 'myMessage' : 'theirMessage';
                return <Bubble type={messageType} text={message.text} />;
              }}
            />
          )}
        </PageContainer>

        <View style={styles.inputContainer}>
          <TouchableOpacity activeOpacity={0.7} style={styles.mediaButton}>
            <PlusCircleIcon size={28} color={Colors.primary} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={messageText}
            onChangeText={text => setMessageText(text)}
            onSubmitEditing={sendMessage}
            placeholder="Type a message..."
          />

          {messageText === '' && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.mediaButton}
              onPress={() => console.log('Pressed!')}>
              <CameraIcon size={28} color={Colors.primary} />
            </TouchableOpacity>
          )}

          {messageText !== '' && (
            <TouchableOpacity
              onPress={sendMessage}
              activeOpacity={0.7}
              style={{...styles.mediaButton, ...styles.sendButton}}>
              <PaperAirplaneIcon size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: Colors.lightGray,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    fontFamily: 'Poppins-Regular',
  },
  mediaButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 8,
  },
});
