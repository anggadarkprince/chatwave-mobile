import { StyleSheet, Text, View } from "react-native"
import React from "react";
import Colors from "../Utilities/Colors";

export const PageTitle = props => {
    return <View style={styles.container}>
        <Text style={styles.text}>{props.text}</Text>
    </View>
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10
    },
    text: {
        fontSize: 28,
        color: Colors.dark,
        fontFamily: 'Poppins-Bold',
        letterSpacing: 0.2
    }
})