import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderComponent from '../../components/HeaderComponent';

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+91 9123456789' },
  { id: '3', name: 'Arun Kumar', email: 'arun@example.com', phone: '+91 9000000001' },
  { id: '4', name: 'Priya Singh', email: 'priya@example.com', phone: '+91 8888888888' },
];

const ContactScreen: React.FC = () => {
  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.row}>
          <MaterialIcons name="email" size={18} color="#888" />
          <Text style={styles.detail}>{item.email}</Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="phone" size={18} color="#888" />
          <Text style={styles.detail}>{item.phone}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
      <HeaderComponent
        title="Contacts"
        showBack={true}
        showIcons={false}
      />

      <View style={styles.container}>
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef6f9',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#075E54',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  detail: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
});
