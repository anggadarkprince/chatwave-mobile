import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '../screens/Home';
import {StyleSheet, Text} from 'react-native';
import {
    ChatBubbleLeftEllipsisIcon,
    Cog6ToothIcon, HeartIcon, UserGroupIcon,
} from 'react-native-heroicons/outline';
import {SettingScreen} from '../screens/Setting';
import React from 'react';
import {ChatScreen} from '../screens/Chat';
import {NewChatScreen} from "../screens/Chat/NewChat";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle: '',
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

export const MainNavigator = () => {
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
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: 'containedModal'}}>
         <Stack.Screen
           name="NewChat"
           component={NewChatScreen}
         />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
});
