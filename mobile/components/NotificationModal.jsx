import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useState, useCallback } from "react";
import createHomeStyles from "../styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";
import api from "../utils/api";
import { NOTIFICATION_ROUTES } from "../constants/endPoints";
import { useUser } from "../context/userContext";
import { formatDate } from "../utils/formatDate";
import { useFocusEffect } from "@react-navigation/native";
import useLanguage from "../hooks/useLanguage";

const NotificationModal = ({ visible, onClose }) => {
  const styles = createHomeStyles();
  const { colors } = useTheme();
  const { user } = useUser();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const userId = user?._id;

  const fetchNotifications = useCallback(
    async (pageToFetch = 1, isRefreshing = false) => {
      try {
        if (!userId) return;

        if (pageToFetch === 1 && !isRefreshing) setIsLoading(true);
        else if (pageToFetch > 1) setLoadingMore(true);

        const response = await api.get(
          `${NOTIFICATION_ROUTES.GET_NOTIFICATIONS_BY_USER_ID.replace(
            ":id",
            userId
          )}?page=${pageToFetch}`
        );

        const items = response.data.items || [];

        if (isRefreshing || pageToFetch === 1) {
          setNotifications(items);
        } else {
          setNotifications((prev) => [...prev, ...items]);
        }

        setPage(response.data.page);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [userId]
  );

  const deleteNotification = async (id) => {
    try {
      Alert.alert(
        t("notifications.alerts.deleteOneTitle", {
          defaultValue: "Delete notification",
        }),
        t("notifications.alerts.deleteOneMessage", {
          defaultValue: "Are you sure you want to delete this notification?",
        }),
        [
          {
            text: t("common.cancel", { defaultValue: "Cancel" }),
            style: "cancel",
          },
          {
            text: t("common.delete", { defaultValue: "Delete" }),
            style: "destructive",
            onPress: async () => {
              await api.delete(
                `${NOTIFICATION_ROUTES.DELETE_NOTIFICATION.replace(":id", id)}`
              );
              await fetchNotifications(1);
            },
          },
        ]
      );
    } catch (error) {
      console.log(error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(
        `${NOTIFICATION_ROUTES.UPDATE_NOTIFICATION_BY_ID.replace(":id", id)}`
      );
      await fetchNotifications(1); // refresh from first page
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllNotifications = async () => {
    Alert.alert(
      t("notifications.alerts.deleteAllTitle", {
        defaultValue: "Delete all notifications",
      }),
      t("notifications.alerts.deleteAllMessage", {
        defaultValue: "Are you sure you want to delete all notifications?",
      }),
      [
        {
          text: t("common.cancel", { defaultValue: "Cancel" }),
          style: "cancel",
        },
        {
          text: t("common.delete", { defaultValue: "Delete" }),
          style: "destructive",
          onPress: async () => {
            await api.delete(`${NOTIFICATION_ROUTES.DELETE_ALL_NOTIFICATIONS}`);
            await fetchNotifications(1);
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications(1);
    }, [fetchNotifications])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications(1, true);
  };

  const NotificationItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => markAsRead(item._id)}
        onLongPress={() => deleteNotification(item._id)}
        style={[
          styles.notificationItemContainer,
          !item.is_read && styles.newNotificationItemContainer,
        ]}
      >
        <Text style={styles.notificationItemTitle}>{item.title}</Text>
        <Text style={styles.notificationItemMessage}>{item.message}</Text>
        <Text style={styles.notificationItemCreatedAt}>
          {formatDate(item.created_at, "dd/MM/yyyy")}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.notificationModal}>
              <View style={styles.notificationModalContent}>
                {isLoading ? (
                  <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                  <FlatList
                    keyExtractor={(item) => item._id.toString()}
                    data={notifications}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{ flex: 1 }}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }
                    ListHeaderComponent={
                      <>
                        <View style={styles.notificationModalContentHeader}>
                          <Text
                            style={styles.notificationModalContentHeaderTitle}
                          >
                            {t("notifications.title", {
                              defaultValue: "Notifications ({count})",
                              replace: { count: notifications.length },
                            })}
                          </Text>

                          <TouchableOpacity
                            onPress={onClose}
                            style={styles.notificationModalContentHeaderClose}
                          >
                            <Ionicons
                              name="close"
                              size={24}
                              color={colors.danger}
                            />
                          </TouchableOpacity>
                        </View>
                        {notifications.length > 0 && (
                          <>
                            <View style={styles.info}>
                              <Ionicons
                                name="information-circle"
                                size={16}
                                style={styles.infoIcon}
                              />
                              <Text style={styles.infoText}>
                                {t("notifications.info", {
                                  defaultValue:
                                    "Tap to mark as read and long press to delete.",
                                })}
                              </Text>
                            </View>
                            
                            <TouchableOpacity
                              onPress={deleteAllNotifications}
                              style={styles.deleteAllButton}
                            >
                              <Ionicons
                                name="trash-outline"
                                size={24}
                                color={colors.text}
                              />
                              <Text style={styles.deleteAllButtonText}>
                                {t("notifications.deleteAll", {
                                  defaultValue: "Delete all notifications",
                                })}
                              </Text>
                            </TouchableOpacity>
                          </>
                        )}
                      </>
                    }
                    renderItem={({ item }) => (
                      <NotificationItem key={item._id} item={item} />
                    )}
                    ListEmptyComponent={
                      <View
                        style={styles.notificationModalContentEmptyContainer}
                      >
                        <Ionicons
                          name="notifications-outline"
                          size={48}
                          color={colors.textMuted}
                        />
                        <Text style={styles.notificationModalContentEmpty}>
                          {t("notifications.empty", {
                            defaultValue: "No notifications found.",
                          })}
                        </Text>
                      </View>
                    }
                    ListFooterComponent={
                      loadingMore ? (
                        <View style={{ padding: 20, alignItems: "center" }}>
                          <ActivityIndicator
                            size="small"
                            color={colors.primary}
                          />
                        </View>
                      ) : notifications.length > 0 ? (
                        <View style={styles.notificationModalContentFooter}>
                          <Text
                            style={styles.notificationModalContentFooterText}
                          >
                            {t("notifications.footer", {
                              defaultValue: "End of notifications.",
                            })}
                          </Text>
                        </View>
                      ) : null
                    }
                    onEndReached={() => {
                      if (!loadingMore && page < totalPages) {
                        fetchNotifications(page + 1);
                      }
                    }}
                    onEndReachedThreshold={0.1}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default NotificationModal;
