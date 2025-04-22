import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HeaderComponent = () => {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.innerContainer}>
                <Text style={styles.headerTitle}>WeChat</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Icon name="search" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Icon name="more-vert" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 100,
        backgroundColor: '#075E54',
        justifyContent: 'flex-end',
        paddingBottom: 20,
        paddingHorizontal: 16,
        elevation: 4,
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 16,
    },
});

export default HeaderComponent;

