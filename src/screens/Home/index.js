import {Text, View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {CustomHeaderButton, PageTitle} from '../../components/Title';
import {useSelector} from 'react-redux';
import {PageContainer} from '../../components/Containers';
import {DataItem} from '../../components/Elements/Chat/DataItem';
import Colors from '../../components/Utilities/Colors';

export const HomeScreen = ({navigation, route}) => {
  const selectedUser = route?.params?.selectedUserId;
  const selectedUserList = route?.params?.selectedUsers;
  const chatName = route?.params?.chatName;

  const userData = useSelector(state => state.auth.userData);
  const storedUsers = useSelector(state => state.users.storedUsers);
  const userChats = useSelector(state => {
    const chatsData = state.chats.chatsData;
    return Object.values(chatsData);
  });

  useEffect(() => {
    if (selectedUser || selectedUserList) {
      let chatData;
      let navigationProps;
      if (selectedUser) {
        chatData = userChats.find(
          cd => !cd.isGroupChat && cd.users.includes(selectedUser),
        );
      }
      if (chatData) {
        navigationProps = {chatId: chatData.key};
      } else {
        const chatUsers = selectedUserList || [selectedUser];
        if (!chatUsers.includes(userData.userId)) {
          chatUsers.push(userData.userId);
        }

        navigationProps = {
          newChatData: {
            users: chatUsers,
            isGroupChat: selectedUserList !== undefined,
            chatName: chatName,
          },
        };
      }
      navigation.navigate('Chat', navigationProps);
    }
  }, [navigation, selectedUser, userData.userId, route?.params]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="New chat"
              iconName="pencil-square"
              onPress={() => navigation.navigate('NewChat')}
            />
          </HeaderButtons>
        );
      },
    });
  }, []);

  return (
    <PageContainer>
      <PageTitle text="Chats" />
      <View>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => navigation.navigate('NewChat', {isGroupChat: true})}>
          <Text style={styles.newGroupText}>New Group</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={userChats}
        renderItem={itemData => {
          const chatData = itemData.item;
          const chatId = chatData.key;
          const isGroupChat = chatData.isGroupChat;

          let title = "";
          const subTitle = chatData.latestMessageText || 'A new chat message';
          let image = "";

          if (isGroupChat) {
            title = chatData.chatName;
            image = chatData.chatImage;
          } else {
            const otherUserId = chatData.users.find(
              uid => uid !== userData.userId,
            );
            const otherUser = storedUsers[otherUserId];

            if (!otherUser) {
              return;
            }

            title = `${otherUser.firstName} ${otherUser.lastName}`;
            image = otherUser.profilePicture;
          }

          return (
            <DataItem
              title={title}
              subTitle={subTitle}
              image={image}
              onPress={() => navigation.navigate('Chat', {chatId})}
            />
          );
        }}
      />
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  newGroupText: {
    color: Colors.primary,
    fontSize: 16,
    marginBottom: 5
  }
})
