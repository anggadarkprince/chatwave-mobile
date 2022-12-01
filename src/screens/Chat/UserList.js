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

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route?.params?.title,
    });
  }, [navigation, route?.params?.title]);

  return (
    <PageContainer>
      <View style={styles.sectionContainer}>
        <Text style={styles.heading}>{chatData.users.length} Participants</Text>

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

        {chatData.users.map(uid => {
          const currentUser = storedUsers[uid];
          return (
            <DataItem
              key={uid}
              image={currentUser.profilePicture}
              title={`${currentUser.firstName} ${currentUser.lastName}`}
              subtitle={currentUser.about}
              type={uid !== userData.userId && 'link'}
              onPress={() =>
                uid !== userData.userId &&
                navigation.navigate('Contact', {uid, chatId})
              }
            />
          );
        })}
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
