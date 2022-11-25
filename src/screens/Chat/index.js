import {View, StyleSheet, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, Text} from "react-native";
import React, {useState, useCallback} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {CameraIcon, PaperAirplaneIcon, PlusCircleIcon} from "react-native-heroicons/outline";
import Colors from "../../components/Utilities/Colors";

export const ChatScreen = () => {
    const [messageText, setMessageText] = useState("");

    const sendMessage = useCallback(() => {
        setMessageText("");
    }, [messageText]);

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
            <KeyboardAvoidingView
                style={styles.chatContainer}
                behavior={ Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={100}>

                <View style={styles.chatContainer}>
                    <Text>chatContainer</Text>
                </View>

                <View style={styles.inputContainer}>
                    <TouchableOpacity activeOpacity={0.7} style={styles.mediaButton}>
                        <PlusCircleIcon size={28} color={Colors.primary} />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setMessageText(text)}
                        onSubmitEditing={sendMessage}
                        placeholder="Type a message..."
                    />

                    {messageText === "" && (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.mediaButton}
                            onPress={() => console.log("Pressed!")}
                        >
                            <CameraIcon size={28} color={Colors.primary} />
                        </TouchableOpacity>
                    )}

                    {messageText !== "" && (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={{ ...styles.mediaButton, ...styles.sendButton }}
                        >
                            <PaperAirplaneIcon size={20} color={Colors.white} />
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    chatContainer: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: Colors.lightGray,
        marginHorizontal: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        fontFamily: 'Poppins-Regular'
    },
    mediaButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 35,
        height: 35,
    },
    sendButton: {
        backgroundColor: Colors.primary,
        borderRadius: 50,
        padding: 8,
    },
})
