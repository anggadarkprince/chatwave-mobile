import {Text, View, ScrollView, FlatList, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {PageContainer} from '../../components/Containers';
import Colors from '../../components/Utilities/Colors';
import {DataItem} from '../../components/Elements/Chat/DataItem';

export const UserListScreen = ({navigation, route}) => {
  const {data, type, chatId} = route?.params;
  const chatData = useSelector(state => state.chats.chatsData[chatId] || {});
  const userData = useSelector(state => state.auth.userData);
  const storedUsers = useSelector(state => state.users.storedUsers);
  const messagesData = useSelector(state => state.messages.messagesData);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route?.params?.title,
    });
  }, [navigation, route?.params?.title]);

  return (
    <PageContainer>
      <View style={styles.sectionContainer}>
        {type === 'users' && (
          <Text style={styles.heading}>
            {chatData.users.length} Participants
          </Text>
        )}

        <FlatList
          contentContainerStyle={styles.scrollView}
          data={data}
          keyExtractor={item => item}
          renderItem={itemData => {
            let key, onPress, title, image, subtitle, itemType;
            if (type === 'users') {
              const uid = itemData.item;
              const currentUser = storedUsers[uid];
              if (!currentUser) {
                return;
              }
              const isLoggedInUser = uid === userData.userId;

              key = uid;
              image = currentUser.profilePicture;
              title = `${currentUser.firstName} ${currentUser.lastName}`;
              subtitle = currentUser.about;
              itemType = isLoggedInUser ? undefined : 'link';
              onPress = isLoggedInUser
                ? undefined
                : () =>
                    uid !== userData.userId &&
                    navigation.navigate('Contact', {uid, chatId});
            } else if (type === 'messages') {
              const starData = itemData.item;
              const {chatId, messageId} = starData;
              const messagesForChat = messagesData[chatId];

              if (!messagesForChat) {
                return;
              }

              const messageData = messagesForChat[messageId];
              const sender = messageData.sentBy && storedUsers[messageData.sentBy];
              const name = sender && `${sender.firstName} ${sender.lastName}`;

              key = messageId;
              title = name;
              subtitle = messageData.text;
              itemType = '';
              onPress = () => {};
            }
            return (
              <DataItem
                key={key}
                image={image}
                title={title}
                subtitle={subtitle}
                type={itemType}
                onPress={onPress}
              />
            );
          }}
        />
      </View>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingTop: 10,
  },
  sectionContainer: {
    width: '100%',
    marginVertical: 10,
  },
  heading: {
    marginVertical: 8,
    color: Colors.dark,
    fontFamily: 'bold',
  },
});
