import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {PageContainer} from "../../components/Containers";
import Colors from "../../components/Utilities/Colors";
import SignInForm from "../../components/Elements/Auth/SignInForm";
import SignUpForm from "../../components/Elements/Auth/SignUpForm";

export const AuthScreen = props => {
    const [isSignUp, setIsSignUp] = useState(false);

    return (
        <SafeAreaView style={{flex: 1}}>
            <StatusBar barStyle={"dark-content"} backgroundColor="white" />
            <PageContainer>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <KeyboardAvoidingView
                        style={styles.keyboardAvoidingView}
                        behavior={Platform.OS === "ios" ? "height" : undefined}
                        keyboardVerticalOffset={100}>

                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={require('../../../assets/images/chatwave.png')}
                                resizeMode='contain' />
                        </View>

                        {isSignUp ? <SignUpForm /> : <SignInForm />}

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => setIsSignUp(prevState => !prevState)}
                            style={styles.linkContainer}
                        >
                            <Text style={styles.link}>
                                {isSignUp ? "Already have an account? Login" : "Don't have an account? Register"}
                            </Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </ScrollView>
            </PageContainer>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    linkContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15
    },
    link: {
        color: Colors.primary,
        fontFamily: 'Poppins-Regular',
        letterSpacing: 0.3
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 10,
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center'
    }
})