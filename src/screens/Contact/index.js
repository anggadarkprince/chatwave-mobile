import {
  Text,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {PageContainer} from '../../components/Containers';
import {PageTitle} from '../../components/Title';
import {useSelector} from 'react-redux';
import {ProfileImage} from '../../components/Images';
import Colors from '../../components/Utilities/Colors';
import {getUserChats} from '../../utils/actions/userActions';
import {DataItem} from '../../components/Elements/Chat/DataItem';
import {SubmitButton} from '../../components/Buttons';
import {removeUserFromChat} from '../../utils/actions/chatActions';

export const ContactScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const storedUsers = useSelector(state => state.users.storedUsers);
  const userData = useSelector(state => state.auth.userData);
  const currentUser = storedUsers[route?.params?.uid];

  const storedChats = useSelector(state => state.chats.chatsData);
  const [commonChats, setCommonChats] = useState([]);

  const chatId = route?.params?.chatId;
  const chatData = chatId && storedChats[chatId];

  useEffect(() => {
    const getCommonChats = async () => {
      const currentUserChats = await getUserChats(currentUser.userId);
      setCommonChats(
        Object.values(currentUserChats).filter(
          cid => storedChats[cid] && storedUsers[cid]?.isGroupChat,
        ),
      );
    };
    getCommonChats();
  }, []);

  const removeFromChat = useCallback(async () => {
    try {
      setIsLoading(true);
      await removeUserFromChat(userData, currentUser, chatData);
      navigation.goBack();
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }, [navigation]);

  return (
    <PageContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'height' : undefined}
          keyboardVerticalOffset={100}>
          <View style={styles.topContainer}>
            <ProfileImage
              uri={currentUser.profilePicture}
              size={80}
              style={{marginBottom: 20}}
            />
            <PageTitle
              text={`${currentUser.firstName} ${currentUser.lastName}`}
              style={{marginBottom: 0}}
            />
            {currentUser.about && (
              <Text numerOfLines={2} style={styles.about}>
                {currentUser.about}
              </Text>
            )}
          </View>
          {commonChats.length > 0 && (
            <>
              <Text style={styles.heading}>
                {commonChats.length}{' '}
                {commonChats.length === 1 ? 'Group' : 'Groups'} in common
              </Text>
              {commonChats.map(cid => {
                const chatItem = storedChats[cid];
                return (
                  <DataItem
                    key={cid}
                    title={chatItem.chatName}
                    subtitle={chatItem.latestMessageText}
                    type="link"
                    onPress={() => navigation.push('Chat', {chatId: cid})}
                    image={chatItem.chatImage}
                  />
                );
              })}
            </>
          )}

          {chatData &&
            chatData.isGroupChat &&
            (isLoading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <SubmitButton
                title="Remove from chat"
                color={Colors.danger}
                onPress={removeFromChat}
              />
            ))}
        </KeyboardAvoidingView>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  about: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: Colors.gray,
  },
  heading: {
    fontFamily: 'Poppins-SemiBold',
    color: Colors.dark,
    marginVertical: 8,
  },
});
