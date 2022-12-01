import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import {useSelector} from 'react-redux';
import {PageContainer} from '../../components/Containers';
import {PageTitle} from '../../components/Title';
import {ProfileImage} from '../../components/Images';
import {TextInput} from '../../components/Inputs';
import {reducer} from '../../utils/reducers/formReducer';
import {validateInput} from '../../utils/actions/formActions';
import {
  removeUserFromChat,
  updateChatData,
} from '../../utils/actions/chatActions';
import Colors from '../../components/Utilities/Colors';
import {SubmitButton} from '../../components/Buttons';
import {DataItem} from '../../components/Elements/Chat/DataItem';

export const ChatSettingScreen = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const chatId = route.params.chatId;
  const chatData = useSelector(state => state.chats.chatsData[chatId] || {});
  const userData = useSelector(state => state.auth.userData);
  const storedUsers = useSelector(state => state.users.storedUsers);

  const initialState = {
    inputValues: {chatName: chatData.chatName},
    inputErrors: {chatName: undefined},
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({
        inputId,
        validationResult: result,
        value: inputValue,
      });
    },
    [dispatchFormState],
  );

  const saveHandler = useCallback(async () => {
    const updatedValues = formState.inputValues;

    try {
      setIsLoading(true);
      await updateChatData(chatId, userData.userId, updatedValues);

      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1500);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [formState]);

  const hasChanges = () => {
    const currentValues = formState.inputValues;
    return currentValues.chatName !== chatData.chatName;
  };

  const leaveChat = useCallback(async () => {
    try {
      setIsLoading(true);
      await removeUserFromChat(userData, userData, chatData);
      navigation.popToTop();
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }, [navigation]);

  if (!chatData.users) {
    return null;
  }

  return (
    <PageContainer>
      <PageTitle text="Chat Settings" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ProfileImage
          showEditButton={true}
          size={80}
          chatId={chatId}
          userId={userData.userId}
          uri={chatData.chatImage}
        />
        <TextInput
          id="chatName"
          label="Chat Name"
          autoCapitalize="none"
          initialValue={chatData.chatName}
          allowEmpty={false}
          onInputChanged={inputChangedHandler}
          errorText={formState.inputErrors?.chatName}
        />
        <View style={styles.sectionContainer}>
          <Text style={styles.heading}>
            {chatData.users.length} Participants
          </Text>

          <DataItem title="Add users" icon="plus" type="button" />

          {chatData.users.slice(0, 4).map(uid => {
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
          {chatData.users.length > 4 && (
            <DataItem
              type="link"
              title="View All"
              hideImage={true}
              onPress={() => {
                navigation.navigate('UserList', {
                  data: chatData.users,
                  type: 'users',
                  chatId: chatId,
                  title: 'Participants',
                });
              }}
            />
          )}
        </View>

        {showSuccessMessage && <Text>Chat setting is saved!</Text>}

        {isLoading ? (
          <ActivityIndicator size={'small'} color={Colors.primary} />
        ) : (
          hasChanges() && (
            <SubmitButton
              title="Save Changes"
              color={Colors.primary}
              onPress={saveHandler}
              disabled={!formState.formIsValid}
            />
          )
        )}
      </ScrollView>

      {
        <SubmitButton
          title="Leave chat"
          color={Colors.danger}
          onPress={() => leaveChat()}
          style={{marginBottom: 20}}
        />
      }
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    justifyContent: 'center',
    alignItems: 'center',
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
