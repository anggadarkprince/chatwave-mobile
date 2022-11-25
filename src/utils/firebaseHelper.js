import {initializeApp} from "firebase/app";

export const getFirebaseApp = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyBBVdguLLVC5A8-B2XYTh2uV9BbNOXAoLY",
        authDomain: "showcase-be7b4.firebaseapp.com",
        projectId: "showcase-be7b4",
        storageBucket: "showcase-be7b4.appspot.com",
        messagingSenderId: "731221934638",
        appId: "1:731221934638:web:6e322e4ffb8fdf006155bf",
        measurementId: "G-Y0JF6B4GBV"
    };
    return initializeApp(firebaseConfig);
};