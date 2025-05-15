// components/HeaderComponent.js
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const HeaderComponent = ({
    title,
    chatName,
    avatar,
    status,
    showAvatar = false,
    showIcons = false,
    showBack = false,
}) => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                {showBack && (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                )}

                {showAvatar && avatar && (
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                )}

                <View>
                    <Text style={styles.title}>{chatName || title}</Text>
                    {status && <Text style={styles.status}>{status}</Text>}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#075E54',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        paddingTop: Platform.OS === 'android' ? 20 : 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 10,
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    status: {
        color: 'lightgray',
        fontSize: 12,
    },
    icon: {
        marginLeft: 15,
    },
});

export default HeaderComponent;
