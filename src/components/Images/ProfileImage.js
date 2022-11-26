import React, {useState} from 'react';
import {Image, View, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import userImage from '../../../assets/images/user.jpg';
import Colors from "../Utilities/Colors";
import {PencilSquareIcon} from "react-native-heroicons/outline";
import {launchImagePicker, uploadImageAsync} from "../../utils/imagePickerHelper";
import {updateSignedInUserData} from "../../utils/actions/authActions";
import {updateLoggedInUserData} from "../../store/authSlice";
import {useDispatch} from "react-redux";

export const ProfileImage = props => {
    const source = props.uri ? {uri: props.uri} : userImage;
    const [image, setImage] = useState(source);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

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
                    throw new Error("Could not upload image");
                }

                const newData = {profilePicture: uploadUrl};
                dispatch(updateLoggedInUserData({newData: newData}));
                await updateSignedInUserData(userId, newData);
                setImage({uri: uploadUrl});
                setIsLoading(false);
            }
        }
    };

    return (
        <TouchableOpacity onPress={pickImage} activeOpacity={0.75} disabled={isLoading} style={[styles.container, {width: props.size + 20, height: props.size + 20, borderRadius: (props.size + 20) / 2}]}>
            <Image
                style={{...styles.image, ...{width: props.size, height: props.size, borderRadius: props.size / 2}}}
                source={image}
            />

            {isLoading && (
                <ActivityIndicator
                    style={[styles.loading, {width: props.size + 16, height: props.size + 16}]}
                    color={Colors.primary}
                    size="large"
                />
            )}

            <View style={styles.editIconContainer}>
                <PencilSquareIcon size={18} color={Colors.dark}/>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 50,
        borderColor: Colors.light,
        borderWidth: 2,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        borderRadius: 50,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.fade,
        borderRadius: 20,
        padding: 8
    },
    loading: {
        position: 'absolute',
        left: 0,
        top: 0,
        backgroundColor: '#FFFFFFAA',
        borderRadius: 75,
    },
})