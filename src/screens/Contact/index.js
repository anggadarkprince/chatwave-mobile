import {
  Text,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useState, useReducer, useCallback, useEffect} from 'react';
import {PageContainer} from '../../components/Containers';
import {PageTitle} from '../../components/Title';
import {useSelector} from 'react-redux';
import {ProfileImage} from '../../components/Images';
import Colors from '../../components/Utilities/Colors';
import {getUserChats} from '../../utils/actions/userActions';
import {DataItem} from '../../components/Elements/Chat/DataItem';

export const ContactScreen = ({navigation, route}) => {
  const storedUsers = useSelector(state => state.users.storedUsers);
  const currentUser = storedUsers[route?.params?.uid];
  const storedChats = useSelector(state => state.chats.chatsData);
  const [commonChats, setCommonChats] = useState([]);

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
                const chatData = storedChats[cid];
                return (
                  <DataItem
                    key={cid}
                    title={chatData.chatName}
                    subtitle={chatData.latestMessageText}
                    type="link"
                    onPress={() => navigation.push('Chat', {chatId: cid})}
                    image={chatData.chatImage}
                  />
                );
              })}
            </>
          )}
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
