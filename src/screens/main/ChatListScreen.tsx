import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import HeaderComponent from '../../components/HeaderComponent';
import { supabase } from '../../services/supabase';
import ChatItem from '../../components/ChatItem';
import { useNavigation } from '@react-navigation/native';
import { APP_ROUTES } from '../../navigation/AppStack';

const ChatListScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionUser = supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        console.log('Error fetching user:', error.message);
      } else {
        setUser(data.user);
      }
    });
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('users') 
        .select('id, email, full_name, avatar_url')
        .neq('id', user.id) 
        .order('full_name', { ascending: true });
      if (error) {
        console.log('Error fetching users:', error.message);
      } else {
        setUsers(data);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
    useEffect(() => {
      fetchUsers();
    }, []);

  const filteredUsers = users.filter(u =>
    (u.full_name || u.email).toLowerCase().includes(searchQuery.toLowerCase())
  );


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar backgroundColor="#075E54" barStyle="light-content" /> */}
      <HeaderComponent
  title="Chats"
  showBack={false}
  rightIcons={
    <TouchableOpacity onPress={() => console.log("New Chat")}>
      <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
    </TouchableOpacity>
  }
/>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem
            user={item}
            onPress={() => navigation.navigate('ChatDetail', { chatId: item.id,chatName:item.full_name,avatar:item.avatar_url })}
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#fff' }}>No chats found</Text>
        }
      />
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="chatbubble" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomColor: '#eee',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#075E54',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#ffffff', 
  },
  chatTime: {
    fontSize: 12,
    color: 'gray',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessage: {
    color: 'gray',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#25D366',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#25D366',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerWrapper: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff', 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 13,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
});
