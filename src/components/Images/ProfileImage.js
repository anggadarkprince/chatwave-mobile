import React, {useState} from 'react';
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import userImage from '../../../assets/images/user.jpg';
import Colors from '../Utilities/Colors';
import { PencilSquareIcon, XCircleIcon } from "react-native-heroicons/outline";
import {
  launchImagePicker,
  uploadImageAsync,
} from '../../utils/imagePickerHelper';
import {updateSignedInUserData} from '../../utils/actions/authActions';
import {updateLoggedInUserData} from '../../store/authSlice';
import {useDispatch} from 'react-redux';
import { XMarkIcon } from "react-native-heroicons/solid";

export const ProfileImage = props => {
  const source = props.uri ? {uri: props.uri} : userImage;
  const [image, setImage] = useState(source);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const showEditButton = props?.showEditButton && props.showEditButton === true;
  const showRemoveButton = props?.showRemoveButton && props.showRemoveButton === true;
  const userId = props.userId;

  const pickImage = async () => {
    const result = await launchImagePicker();
    if (result.error) {
      console.log(result.error);
    } else {
      if (!result.didCancel && result.assets) {
        const pickedImage = result.assets[0].uri;
        setIsLoading(true);
        const uploadUrl = await uploadImageAsync(pickedImage);
        if (!uploadUrl) {
          setIsLoading(false);
          throw new Error('Could not upload image');
        }

        const newData = {profilePicture: uploadUrl};
        dispatch(updateLoggedInUserData({newData: newData}));
        await updateSignedInUserData(userId, newData);
        setImage({uri: uploadUrl});
        setIsLoading(false);
      }
    }
  };

  const Container = showEditButton || props.onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={props.onPress || pickImage}
      activeOpacity={0.75}
      disabled={isLoading}
      style={[
        styles.container,
        props.style,
        {
          width: props.size + 4,
          height: props.size + 4,
          borderRadius: (props.size + 4) / 2,
        },
      ]}>
      <Image
        style={{
          ...styles.image,
          ...{
            width: props.size,
            height: props.size,
            borderRadius: props.size / 2,
          },
        }}
        source={image}
      />

      {isLoading && (
        <ActivityIndicator
          style={[
            styles.loading,
            {
              width: props.size,
              height: props.size,
              borderRadius: props.size / 2,
            },
          ]}
          color={Colors.primary}
          size="large"
        />
      )}

      {showEditButton && !isLoading && (
        <View style={styles.editIconContainer}>
          <PencilSquareIcon size={18} color={Colors.dark} />
        </View>
      )}

      {showRemoveButton && !isLoading && (
        <View style={styles.removeIconContainer}>
          <XMarkIcon size={12} color={Colors.white} />
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    borderColor: Colors.light,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: Colors.fade,
    borderRadius: 20,
    padding: 8,
  },
  removeIconContainer: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: Colors.danger,
    borderRadius: 20,
    padding: 3,
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: '#FFFFFFAA',
    borderRadius: 75,
  },
});
