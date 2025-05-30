import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import HeaderComponent from '../../components/HeaderComponent';

type CallType = 'missed' | 'incoming' | 'outgoing';

interface CallItem {
  id: string;
  name: string;
  time: string;
  type: CallType;
  avatar: string;
}

const callHistoryData: CallItem[] = [
  {
    id: '1',
    name: 'John Doe',
    time: 'Today, 10:30 AM',
    type: 'incoming',
    avatar: 'https://via.placeholder.com/100',
  },
  {
    id: '2',
    name: 'Jane Smith',
    time: 'Yesterday, 4:15 PM',
    type: 'missed',
    avatar: 'https://via.placeholder.com/100',
  },
  {
    id: '3',
    name: 'Michael Lee',
    time: 'Yesterday, 8:45 AM',
    type: 'outgoing',
    avatar: 'https://via.placeholder.com/100',
  },
];

const CallHistoryScreen: React.FC = () => {
  const renderItem = ({ item }: { item: CallItem }) => {
    const iconColor = item.type === 'missed' ? 'red' : 'green';
    const iconName =
      item.type === 'incoming'
        ? 'call-received'
        : item.type === 'outgoing'
        ? 'call-made'
        : 'call-missed';

    return (
      <TouchableOpacity style={styles.callItem}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.callDetails}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.callMeta}>
            <MaterialIcons name={iconName} size={16} color={iconColor} />
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>
        <Feather name="info" size={20} color="#999" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderComponent title="Calls" showBack={true} />
      <FlatList
        data={callHistoryData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default CallHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  callDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  callMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  time: {
    marginLeft: 6,
    color: '#666',
    fontSize: 12,
  },
});
