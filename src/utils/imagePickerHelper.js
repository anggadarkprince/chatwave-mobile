import {launchImageLibrary} from "react-native-image-picker";
import {getFirebaseApp} from "./firebaseHelper";
import {getDownloadURL, getStorage, uploadBytesResumable, ref} from "@firebase/storage";
import * as uuid from "uuid";

export const launchImagePicker = async (options, onSuccess, onError) => {
    return await launchImageLibrary(options || {
        mediaType: 'photo',
        maxWidth: 800,
        quality: 0.75,
    });
}

const checkMediaPermission = async () => {
    return Promise.resolve();
}

export const uploadImageAsync = async (uri) => {
    const app = getFirebaseApp();

    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };

        xhr.onerror = function(e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
        };

        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send();
    });

    const pathFolder = 'profilePics';
    const storageRef = ref(getStorage(app), `${pathFolder}/${uuid.v4()}`);

    await uploadBytesResumable(storageRef, blob);

    blob.close();

    return await getDownloadURL(storageRef);
}