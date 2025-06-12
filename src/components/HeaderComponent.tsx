import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface HeaderComponentProps {
  title?: string;
  chatName?: string;
  avatar?: string;
  status?: string;
  showAvatar?: boolean;
  showIcons?: boolean;
  showBack?: boolean;
  rightIcons?: React.ReactNode;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  title,
  chatName,
  avatar,
  status,
  showAvatar = false,
  showIcons = false,
  showBack = false,
  rightIcons,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

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

        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {chatName || title}
          </Text>
          {status && <Text style={styles.status}>{status}</Text>}
        </View>
      </View>

      {rightIcons && <View style={styles.headerRight}>{rightIcons}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#075E54",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 50,
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "android" ? 20 : 20,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  textContainer: {
    marginLeft: 5,
    flexShrink: 1,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  status: {
    color: "lightgray",
    fontSize: 12,
  },
});

export default HeaderComponent;
