import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '../screens/Home';
import {StyleSheet, Text, ActivityIndicator, View, Image} from 'react-native';
import {
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  HeartIcon,
  UserGroupIcon,
} from 'react-native-heroicons/outline';
import {SettingScreen} from '../screens/Setting';
import React, {useEffect, useState} from 'react';
import {ChatScreen} from '../screens/Chat';
import {NewChatScreen} from '../screens/Chat/NewChat';
import {useDispatch, useSelector} from 'react-redux';
import {getFirebaseApp} from '../utils/firebaseHelper';
import {getDatabase, ref, child, onValue, off, get} from '@firebase/database';
import {setChatsData} from '../store/chatSlice';
import Colors from '../components/Utilities/Colors';
import {setStoredUsers} from '../store/userSlice';
import {setChatMessages, setStarredMessages} from '../store/messagesSlice';
import {ContactScreen} from "../screens/Contact";
import {ChatSettingScreen} from "../screens/Chat/ChatSetting";
import {UserListScreen} from "../screens/Chat/UserList";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerLeft: () => (
          <Image
            source={require('../../assets/images/chatwave.png')}
            style={{width: 28, height: 28, borderRadius: 5, marginStart: 20}}
          />
        ),
        headerTitle: 'ChatWave',
        headerTintColor: Colors.primary,
        tabBarActiveTintColor: '#ee4a63',
        tabBarStyle: {
          paddingTop: 10,
          paddingBottom: 7,
          height: 65,
        },
      }}>
      <Tab.Screen
        name="ChatList"
        component={HomeScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                styles.tabBarLabel,
                {color: focused ? '#ee4a63' : '#545454'},
              ]}>
              Chats
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <ChatBubbleLeftEllipsisIcon
              size={25}
              color={focused ? '#ee4a63' : '#2d2d2d'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Groups"
        component={SettingScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                styles.tabBarLabel,
                {color: focused ? '#ee4a63' : '#545454'},
              ]}>
              Groups
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <UserGroupIcon size={25} color={focused ? '#ee4a63' : '#2d2d2d'} />
          ),
        }}
      />
      <Tab.Screen
        name="Status"
        component={SettingScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                styles.tabBarLabel,
                {color: focused ? '#ee4a63' : '#545454'},
              ]}>
              Status
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <HeartIcon size={25} color={focused ? '#ee4a63' : '#2d2d2d'} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                styles.tabBarLabel,
                {color: focused ? '#ee4a63' : '#545454'},
              ]}>
              Settings
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <Cog6ToothIcon size={25} color={focused ? '#ee4a63' : '#2d2d2d'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{title: '', headerBackTitle: 'Back'}}
        />
        <Stack.Screen
          name="ChatSetting"
          component={ChatSettingScreen}
          options={{
            title: '',
            headerBackTitle: 'Back',
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="UserList"
          component={UserListScreen}
          options={{
            title: '',
            headerBackTitle: 'Back',
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="Contact"
          component={ContactScreen}
          options={{title: 'Contact', headerBackTitle: 'Back'}}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: 'containedModal'}}>
        <Stack.Screen name="NewChat" component={NewChatScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export const MainNavigator = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.userData);
  const storedUsers = useSelector(state => state.users.storedUsers);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userChatsRef = child(dbRef, `userChats/${userData.userId}`);
    const refs = [userChatsRef];

    onValue(userChatsRef, querySnapshot => {
      const chatIdsData = querySnapshot.val() || {};
      const chatIds = Object.values(chatIdsData);

      const chatsData = {};
      let chatsFoundCount = 0;
      for (let i = 0; i < chatIds.length; i++) {
        const chatId = chatIds[i];
        const chatRef = child(dbRef, `chats/${chatId}`);
        refs.push(chatRef);

        onValue(chatRef, chatSnapshot => {
          chatsFoundCount++;
          const data = chatSnapshot.val();
          if (data) {
            if (!data.users?.includes(userData.userId)) {
              return;
            }
            data.key = chatSnapshot.key;
            data.users.forEach(userId => {
              if (storedUsers[userId]) {
                return;
              }
              const userRef = child(dbRef, `users/${userId}`);
              get(userRef).then(userSnapshot => {
                const userSnapshotData = userSnapshot.val();
                dispatch(setStoredUsers({newUsers: {userSnapshotData}}));
              });
              refs.push(userRef);
            });
            chatsData[chatSnapshot.key] = data;
          }

          if (chatsFoundCount >= chatIds.length) {
            dispatch(setChatsData({chatsData}));
            setIsLoading(false);
          }
        });

        const messagesRef = child(dbRef, `messages/${chatId}`);
        refs.push(messagesRef);

        onValue(messagesRef, messagesSnapshot => {
          const messagesData = messagesSnapshot.val();
          dispatch(setChatMessages({chatId, messagesData}));
        });

        if (chatsFoundCount === 0) {
          setIsLoading(false);
        }
      }
    });

    const userStarredMessagesRef = child(
      dbRef,
      `userStarredMessages/${userData.userId}`,
    );
    refs.push(userStarredMessagesRef);
    onValue(userStarredMessagesRef, querySnapshot => {
      const starredMessages = querySnapshot.val() ?? {};
      dispatch(setStarredMessages({starredMessages}));
    });

    return () => {
      refs.forEach(refId => off(refId));
      off(userChatsRef);
    };
  }, []);

  return isLoading ? (
    <View style={styles.middleCenter}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : (
    <StackNavigator />
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  middleCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
