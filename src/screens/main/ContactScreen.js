import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const PROFILE = [
    { id: 1, title: "Email", value: "user@example.com", icon: "email-outline" },
    { id: 2, title: "Username", value: "john_doe", icon: "account-circle-outline" },
    { id: 3, title: "Phone Number", value: "+91 9876543210", icon: "phone-outline" },
    { id: 4, title: "Status", value: "Available", icon: "message-text-outline" },
];

const ContactScreen = () => {
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Icon name={item.icon} size={22} color="#4CAF50" style={styles.cardIcon} />
            <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardValue}>{item.value}</Text>
            </View>
      </View>
  );

    return (
        <View style={styles.container}>
          {/* Profile Header */}
          <View style={styles.header}>
              <Image
                  source={{ uri: 'https://via.placeholder.com/120' }}
                  style={styles.avatar}
              />
              <Text style={styles.name}>John Doe</Text>
              <Text style={styles.subtitle}>Active now</Text>
          </View>

          {/* Profile Info List */}
          <FlatList
              data={PROFILE}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
          />
      </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: '#4CAF50',
        marginBottom: 12,
    },
    name: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
    },
    listContent: {
        padding: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        alignItems: 'flex-start',
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    cardIcon: {
        marginRight: 16,
        marginTop: 4,
    },
    cardTitle: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    cardValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
});
