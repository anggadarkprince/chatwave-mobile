import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useCallback, useEffect, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  CameraIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
} from 'react-native-heroicons/outline';
import Colors from '../../components/Utilities/Colors';
import {useSelector} from 'react-redux';
import {PageContainer} from '../../components/Containers';
import {Bubble, ReplyTo} from '../../components/Chats';
import {
  createChat,
  sendImageMessage,
  sendTextMessage,
} from '../../utils/actions/chatActions';
import {
  launchCameraPicker,
  launchImagePicker,
  uploadImageAsync,
} from '../../utils/imagePickerHelper';
import AwesomeAlert from 'react-native-awesome-alerts';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {CustomHeaderButton} from '../../components/Title';

export const ChatScreen = ({route, navigation}) => {
  const userData = useSelector(state => state.auth.userData);
  const storedUsers = useSelector(state => state.users.storedUsers);
  const storedChats = useSelector(state => state.chats.chatsData);

  const [chatUsers, setChatUsers] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [chatId, setChatId] = useState(route?.params?.chatId);
  const [errorBannerText, setErrorBannerText] = useState('');
  const [replyingTo, setReplyingTo] = useState();
  const [tempImageUri, setTempImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const flatList = useRef();

  const chatMessages = useSelector(state => {
    if (!chatId) {
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

  const chatData =
    (chatId && storedChats[chatId]) || route?.params?.newChatData || {};

  const getChatTitleFromName = () => {
    const otherUserId = chatUsers.find(uid => uid !== userData.userId);
    const otherUserData = storedUsers[otherUserId];
    return (
      otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`
    );
  };

  useEffect(() => {
    if (!chatData) {
      return;
    }

    navigation.setOptions({
      headerTitle: chatData.chatName || getChatTitleFromName(),
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            {chatId && (
              <Item
                title="Chat settings"
                iconName="cog-6-tooth"
                onPress={() =>
                  chatData.isGroupChat
                    ? navigation.navigate('ChatSetting', {chatId: chatId})
                    : navigation.navigate('Contact', {
                        uid: chatUsers.find(uid => uid !== userData.userId),
                      })
                }
              />
            )}
          </HeaderButtons>
        );
      },
    });
    setChatUsers(chatData.users);
  }, [chatData.users, chatUsers, chatData.chatName]);

  const sendMessage = useCallback(async () => {
    if (!messageText || messageText === '') {
      return;
    }
    try {
      let id = chatId;
      if (!id) {
        // no chat id, create the chat
        id = await createChat(userData.userId, route.params.newChatData);
        setChatId(id);
      }
      await sendTextMessage(
        id,
        userData.userId,
        messageText,
        replyingTo && replyingTo.key,
      );
      setMessageText('');
      setReplyingTo(null);
    } catch (error) {
      console.log(error);
      setErrorBannerText('Message failed to send');
      setTimeout(() => setErrorBannerText(''), 5000);
    }
  }, [messageText, chatId]);

  const pickImage = useCallback(async () => {
    const result = await launchImagePicker();
    if (result.error) {
      console.log(result.error);
    } else {
      if (!result.didCancel && result.assets) {
        const tempUri = result.assets[0].uri;
        setTempImageUri(tempUri);
      }
    }
  }, []);

  const takePhoto = useCallback(async () => {
    const result = await launchCameraPicker();
    if (result.error) {
      console.log(result.error);
    } else {
      if (!result.didCancel && result.assets) {
        const tempUri = result.assets[0].uri;
        setTempImageUri(tempUri);
      }
    }
  }, []);

  const uploadImage = useCallback(async () => {
    setIsLoading(true);
    try {
      let id = chatId;
      if (!id) {
        // no chat id, create the chat
        id = await createChat(userData.userId, route.params.newChatData);
        setChatId(id);
      }

      const uploadUrl = await uploadImageAsync(tempImageUri, true);
      await sendImageMessage(
        chatId,
        userData.userId,
        null,
        uploadUrl,
        replyingTo,
      );
      setIsLoading(false);
      setReplyingTo(null);
      setTimeout(() => setTempImageUri(''), 500);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }, [tempImageUri, chatId]);

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
              ref={ref => (flatList.current = ref)}
              onContentSizeChange={() =>
                flatList.current.scrollToEnd({animated: false})
              }
              onLayout={() => flatList.current.scrollToEnd({animated: false})}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingVertical: 15}}
              data={chatMessages}
              renderItem={itemData => {
                const message = itemData.item;
                const isOwnMessage = message.sentBy === userData.userId;
                let messageType;
                if (message.type && message.type === 'info') {
                  messageType = 'info';
                } else if (isOwnMessage) {
                  messageType = 'myMessage';
                } else {
                  messageType = 'theirMessage';
                }
                const sender = message.sentBy && storedUsers[message.sentBy];
                const name = sender && `${sender.firstName} ${sender.lastName}`;
                return (
                  <Bubble
                    type={messageType}
                    text={message.text}
                    date={message.sentAt}
                    name={
                      chatData.isGroupChat || isOwnMessage ? undefined : name
                    }
                    messageId={message.key}
                    userId={userData.userId}
                    chatId={chatId}
                    setReply={() => setReplyingTo(message)}
                    replyingTo={
                      message.replyTo &&
                      chatMessages.find(i => i.key === message.replyTo)
                    }
                    imageUrl={message.imageUrl}
                  />
                );
              }}
            />
          )}
        </PageContainer>
        {replyingTo && (
          <ReplyTo
            user={storedUsers[replyingTo.sentBy]}
            text={replyingTo.text}
            onCancel={() => setReplyingTo(null)}
          />
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.7}
            style={styles.mediaButton}>
            <PlusCircleIcon size={28} color={Colors.primary} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={messageText}
            onChangeText={text => setMessageText(text)}
            onSubmitEditing={sendMessage}
            placeholder="Type a message..."
            placeholderTextColor={Colors.lightGray}
          />

          {messageText === '' && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.mediaButton}
              onPress={takePhoto}>
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
          <AwesomeAlert
            show={tempImageUri !== ''}
            title="Send Image"
            message="Are you sure want to send image?"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            confirmText="Send image"
            confirmButtonColor={Colors.primary}
            cancelButtonColor={Colors.light}
            cancelButtonTextStyle={{color: Colors.dark}}
            titleStyle={styles.popupTitleStyle}
            onCancelPressed={() => setTempImageUri('')}
            onConfirmPressed={uploadImage}
            onDismiss={() => setTempImageUri('')}
            customView={
              <View style={{marginVertical: 10}}>
                {!isLoading && tempImageUri && (
                  <Image
                    source={{uri: tempImageUri}}
                    style={{width: 200, height: 200}}
                  />
                )}
                {isLoading && (
                  <ActivityIndicator size="large" color={Colors.primary} />
                )}
              </View>
            }
          />
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
    color: Colors.dark,
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
  popupTitleStyle: {
    fontFamily: 'Poppins-Medium',
    color: Colors.dark,
  },
});
