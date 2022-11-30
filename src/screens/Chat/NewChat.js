import {
  Text,
  View,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useRef, useState } from "react";
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {CustomHeaderButton} from '../../components/Title';
import {searchUsers} from '../../utils/actions/userActions';
import {PageContainer} from '../../components/Containers';
import {
  FaceFrownIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/outline';
import Colors from '../../components/Utilities/Colors';
import {TextInput} from '../../components/Inputs';
import {DataItem} from '../../components/Elements/Chat/DataItem';
import {useDispatch, useSelector} from 'react-redux';
import {setStoredUsers} from '../../store/userSlice';
import {ProfileImage} from '../../components/Images';

export const NewChatScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState();
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatName, setChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const userData = useSelector(state => state.auth.userData);
  const storedUsers = useSelector(state => state.users.storedUsers);
  const dispatch = useDispatch();
  const isGroupChat = route?.params?.isGroupChat;
  const isGroupChatDisabled = selectedUsers.length === 0 || chatName === '';

  const selectedUsersFlatList = useRef();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="Close"
              iconName="x-mark"
              onPress={() => navigation.goBack()}
            />
          </HeaderButtons>
        );
      },
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            {isGroupChat && (
              <Item
                title="Create"
                disabled={isGroupChatDisabled}
                color={isGroupChatDisabled ? Colors.lightGray : undefined}
                onPress={() => {
                  navigation.navigate('ChatList', {
                    selectedUsers: selectedUsers,
                    chatName: chatName,
                  });
                }}
              />
            )}
          </HeaderButtons>
        );
      },
      headerTitle: isGroupChat ? 'Add Participants' : 'New chat',
    });
  }, [navigation, isGroupChatDisabled]);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchTerm && searchTerm.trim() !== '') {
        setIsLoading(true);

        const usersResult = await searchUsers(searchTerm);
        delete usersResult[userData.userId];
        setUsers(usersResult);

        if (Object.keys(usersResult).length === 0) {
          setNoResultsFound(true);
        } else {
          setNoResultsFound(false);
          dispatch(setStoredUsers({newUsers: usersResult}));
        }
        setIsLoading(false);
      } else {
        setNoResultsFound(false);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm, userData.userId]);

  const userPressed = userId => {
    if (isGroupChat) {
      const newSelectedUsers = selectedUsers.includes(userId)
        ? selectedUsers.filter(id => id !== userId)
        : selectedUsers.concat(userId);
      setSelectedUsers(newSelectedUsers);
    } else {
      navigation.navigate('ChatList', {
        selectedUserId: userId,
      });
    }
  };

  const renderListUser = () => {
    if (isLoading) {
      return (
        <View style={styles.middleCenter}>
          <ActivityIndicator size={'large'} color={Colors.primary} />
        </View>
      );
    } else {
      if (noResultsFound) {
        return (
          <View style={styles.middleCenter}>
            <FaceFrownIcon
              size={64}
              color={Colors.fadeGray}
              style={styles.noResultsIcon}
            />
            <Text style={styles.noResultsText}>No users found</Text>
          </View>
        );
      } else {
        return (
          <FlatList
            data={Object.keys(users)}
            renderItem={itemData => {
              const userId = itemData.item;
              const userData = users[userId];

              return (
                <DataItem
                  title={`${userData.firstName} ${userData.lastName}`}
                  subTitle={userData.about || userData.email}
                  image={userData.profilePicture}
                  onPress={() => userPressed(userId)}
                  type={isGroupChat ? 'checkbox' : ''}
                  isChecked={selectedUsers.includes(userId)}
                />
              );
            }}
          />
        );
      }
    }
  };

  return (
    <PageContainer>
      {isGroupChat && (
        <>
          <View style={styles.chatNameContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textBox}
                placeholder="Enter a name for your chat"
                autoCorrect={false}
                autoCompleted={false}
                containerStyle={{marginBottom: 0}}
                value={chatName}
                onChangeText={text => setChatName(text)}
              />
            </View>
          </View>
          <View style={styles.selectedUserContainer}>
            <FlatList
              keyExtractor={item => item}
              data={selectedUsers}
              renderItem={({item}) => {
                const user = storedUsers[item];
                return (
                  <ProfileImage
                    size={40}
                    uri={user.profilePicture}
                    onPress={() => userPressed(item)}
                    showRemoveButton={true}
                    style={styles.selectedUserStyle}
                  />
                );
              }}
              horizontal={true}
              style={styles.selectedUserList}
              contentContainerStyle={{alignItems: 'center'}}
              ref={ref => selectedUsersFlatList.current = ref}
              onContentSizeChange={() => selectedUsersFlatList.current.scrollToEnd()}
            />
          </View>
        </>
      )}
      <View style={styles.searchContainer}>
        <MagnifyingGlassIcon
          name="search"
          size={20}
          color={Colors.lightGray}
          style={{marginEnd: 10}}
        />

        <TextInput
          placeholder="Search people"
          style={styles.searchBox}
          containerStyle={{marginBottom: 0}}
          onChangeText={text => setSearchTerm(text)}
        />
      </View>

      {searchTerm && searchTerm.trim() !== '' ? (
        renderListUser()
      ) : (
        <View style={styles.middleCenter}>
          <MagnifyingGlassIcon
            size={64}
            color={Colors.fadeGray}
            style={styles.noResultsIcon}
          />
          <Text style={styles.noResultsText}>
            Enter a name{'\n'}to search for a user
          </Text>
        </View>
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light,
    marginVertical: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
  },
  searchBox: {
    paddingVertical: 5,
    backgroundColor: Colors.white,
  },
  noResultsIcon: {
    marginBottom: 10,
  },
  noResultsText: {
    color: Colors.fadeGray,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    fontSize: 16,
  },
  middleCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatNameContainer: {
    paddingTop: 15,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: Colors.light,
    flexDirection: 'row',
    borderRadius: 5,
  },
  textBox: {
    color: Colors.dark,
    width: '100%',
    fontFamily: 'Poppins-Regular',
    paddingVertical: 5,
    backgroundColor: Colors.white,
  },
  selectedUserContainer: {
    marginTop: 10,
    height: 50,
    justifyContent: 'center',
  },
  selectedUserList: {
    height: '100%',
    paddingTop: 10,
  },
  selectedUserStyle: {
    marginRight: 10,
    marginBottom: 10,
  },
});
