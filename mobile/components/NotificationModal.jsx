import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import React from "react";
import createHomeStyles from "../styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";

const NotificationModal = ({ visible, onClose }) => {
  const styles = createHomeStyles();
  const { colors } = useTheme();
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
                <FlatList
                  keyExtractor={(item) => item._id.toString()}
                  data={[]}
                  contentContainerStyle={{ flexGrow: 1 }}
                  style={{ flex: 1 }}
                  ListHeaderComponent={
                    <View style={styles.notificationModalContentHeader}>
                      <Text style={styles.notificationModalContentHeaderTitle}>
                        Notifications (0)
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
                  }
                  renderItem={({ item }) => <NotificationItem item={item} />}
                  ListEmptyComponent={
                    <View style={styles.notificationModalContentEmptyContainer}>
                      <Ionicons
                        name="notifications-outline"
                        size={48}
                        color={colors.textMuted}
                      />
                      <Text style={styles.notificationModalContentEmpty}>
                        No notifications found.
                      </Text>
                    </View>
                  }
                  ListFooterComponent={
                    <View style={styles.notificationModalContentFooter}>
                      <Text style={styles.notificationModalContentFooterText}>
                        End of notifications.
                      </Text>
                    </View>
                  }
                  onEndReached={() => {}}
                  onEndReachedThreshold={0.5}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default NotificationModal;
