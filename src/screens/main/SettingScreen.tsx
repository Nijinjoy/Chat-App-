import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  SectionList,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from '../../components/HeaderComponent';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Or use FontAwesome, Ionicons, etc.

type SectionData = {
  title: string;
  data: { label: string; screen: string; icon: string }[];
};

const sections: SectionData[] = [
  {
    title: 'Account',
    data: [
      { label: 'Profile', screen: 'ProfileScreen', icon: 'person' ,description: 'View and edit your profile'},
      { label: 'Account', screen: 'AccountScreen', icon: 'account-circle' , description: 'Manage account settings'},
    ],
  },
  {
    title: 'App Preferences',
    data: [
      { label: 'Notifications', screen: 'NotificationsScreen', icon: 'notifications',description: 'Manage your notifications' },
      { label: 'Preferences', screen: 'PreferencesScreen', icon: 'tune',description: 'Manage your app preferences' },
    ],
  },
  {
    title: 'Privacy',
    data: [
      { label: 'Privacy', screen: 'PrivacyScreen', icon: 'lock',description: 'Manage your privacy setttings' },
      { label: 'Blocked Users', screen: 'BlockedUsersScreen', icon: 'block',description: 'Manage blocked users' },
    ],
  },
];

const SettingScreen: React.FC = () => {
  const navigation = useNavigation();

  const handlePress = (screen: string) => {
    console.log(`Navigate to ${screen}`);
  };

  const renderItem = ({ item }: { item: { label: string; screen: string; icon: string; description: string } }) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePress(item.screen)}>
      <View style={styles.itemContent}>
        <View style={styles.iconWrapper}>
          <Icon name={item.icon} size={20} color="#fff" />
        </View>
        <View>
          <Text style={styles.itemText}>{item.label}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderSectionHeader = ({ section }: { section: SectionData }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  return (
    <>
      <StatusBar  />
      <SafeAreaView style={styles.safeArea}>
        <HeaderComponent title="Settings" showBack={true} />

        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.label + index}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.sectionList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  sectionList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionHeader: {
    // backgroundColor: '#f2f2f2',
    // paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 16,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  itemText: {
    fontSize: 15,
    color: '#444',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 8,
  },
  iconWrapper: {
    width: 45,
    height: 45,
    borderRadius: 45,
    backgroundColor: '#4CAF50', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDescription: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  
});

export default SettingScreen;
