import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import useTheme from "../../hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import createHomeStyles from "../../styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../context/userContext";
import HomeStats from "../../components/HomeStats";

const Home = () => {
  const { colors } = useTheme();
  const styles = createHomeStyles();
  const { user } = useUser();
  return (
    <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
      <View style={styles.content}>
        <View style={styles.header}>
          {/* <View style={styles.headerLeft}>
            <Ionicons name="person-outline" size={24} style={styles.headerIcon} />
          </View> */}
          <View>
            <Text style={styles.headerSubtitle}>Welcome back,</Text>
            <Text style={styles.headerTitle}>{user?.name || "User"}</Text>
          </View>
          <View style={styles.headerRight}>
            <Ionicons name="notifications-outline" size={24} style={styles.notificationIcon} />
          </View>
        </View>
        <HomeStats />
      </View>
    </LinearGradient>
  );
};

export default Home;
