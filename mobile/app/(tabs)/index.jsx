import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import useTheme from "../../hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import createHomeStyles from "../../styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../../context/userContext";
import HomeStats from "../../components/HomeStats";
import BudgetSummary from "../../components/BudgetSummary";
import CurrentMonth from "../../components/CurrentMonth";
import NotificationModal from "../../components/NotificationModal";
import api from "../../utils/api";
import { NOTIFICATION_ROUTES } from "../../constants/endPoints";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import CategoriesBudgetSummary from "../../components/CategoriesBudgetSummary";

const Home = () => {
  const { colors } = useTheme();
  const styles = createHomeStyles();
  const { user } = useUser();  
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  
  const fetchNotifications = async () => {
    try {
      const response = await api.get(`${NOTIFICATION_ROUTES.GET_UNREAD_NOTIFICATIONS_BY_USER_ID.replace(":id", user?._id)}`);
      setNotificationCount(response.data.length);
    } catch (error) {
      // ignore error
      console.log(error);
    } 
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  fetchNotifications();


  return (
    <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
      <ScrollView style={styles.content}  showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {
              user?.avatar 
              ? 
              <Image source={{ uri: `data:image/png;base64,${user.avatar}` }} style={styles.headerIconImage} /> 
              : 
              <Ionicons name="person-outline" size={24} style={styles.headerIcon} />
              }
          </View>
          <View>
            <Text style={styles.headerSubtitle}>Welcome back,</Text>
            <Text style={styles.headerTitle}>{user?.name || "User"}</Text>
          </View>
          <View style={styles.headerRight}>
            <NotificationModal visible={isNotificationModalVisible} onClose={() => setIsNotificationModalVisible(false)} />
            <TouchableOpacity onPress={() => {
              setIsNotificationModalVisible(true);
            }}>
              <Ionicons name="notifications-outline" size={24} style={styles.notificationIcon} />
              {notificationCount > 0 && <View style={styles.notificationIconText} />}
            </TouchableOpacity>
          </View>
        </View>
        <HomeStats />
        <CurrentMonth />
        <BudgetSummary />
        <CategoriesBudgetSummary />
      </ScrollView>
    </LinearGradient>
  );
};

export default Home;
