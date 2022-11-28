import {Text, View, ActivityIndicator, FlatList, StyleSheet} from "react-native";
import React, {useEffect, useState} from "react";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import {CustomHeaderButton} from "../../components/Title";
import {searchUsers} from "../../utils/actions/userActions";
import {PageContainer} from "../../components/Containers";
import {
  FaceFrownIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon
} from "react-native-heroicons/outline";
import Colors from "../../components/Utilities/Colors";
import {TextInput} from "../../components/Inputs";
import {DataItem} from "../../components/Elements/Chat/DataItem";

export const NewChatScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState();
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="Close"
              iconName="x-mark"
              onPress={() => navigation.goBack()}/>
          </HeaderButtons>
        )
      },
      headerTitle: "New chat"
    })
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchTerm && searchTerm.trim() !== "") {
        setIsLoading(true);

        const usersResult = await searchUsers(searchTerm);
        setUsers(usersResult);

        if (Object.keys(usersResult).length === 0) {
          setNoResultsFound(true);
        } else {
          setNoResultsFound(false);
        }
        setIsLoading(false);
      } else {
        setNoResultsFound(false);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

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
              style={styles.noResultsIcon}/>
            <Text style={styles.noResultsText}>No users found</Text>
          </View>
        )
      } else {
        return (
          <FlatList
            data={Object.keys(users)}
            renderItem={(itemData) => {
              const userId = itemData.item;
              const userData = users[userId];

              return (
                <DataItem
                  title={`${userData.firstName} ${userData.lastName}`}
                  subTitle={userData.about || userData.email}
                  image={userData.profilePicture}
                />
              )
            }}
          />
        );
      }
    }
  }

  return (
    <PageContainer>
      <View style={styles.searchContainer}>
        <MagnifyingGlassIcon name="search" size={20} color={Colors.lightGray} style={{marginEnd: 10}} />

        <TextInput
          placeholder='Search people'
          style={styles.searchBox}
          containerStyle={{marginBottom: 0}}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>

      {searchTerm && searchTerm.trim() !== '' ? renderListUser() : (
        <View style={styles.middleCenter}>
          <MagnifyingGlassIcon
            size={64}
            color={Colors.fadeGray}
            style={styles.noResultsIcon} />
          <Text style={styles.noResultsText}>
            Enter a name{"\n"}to search for a user
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
    borderRadius: 5
  },
  searchBox: {
    paddingVertical: 5,
    backgroundColor: Colors.white,
  },
  noResultsIcon: {
    marginBottom: 10
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
    alignItems: 'center'
  }
})