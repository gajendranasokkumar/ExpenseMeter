import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";

const { width } = Dimensions.get("window");

const SelectionModal = ({
  visible,
  onClose,
  onSelectTransaction,
  onSelectBudget,
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      width: width * 0.85,
      maxWidth: 400,
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textMuted,
      marginBottom: 24,
      textAlign: "center",
    },
    buttonContainer: {
      width: "100%",
      gap: 12,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    buttonIcon: {
      marginRight: 12,
    },
    buttonText: {
      fontSize: 16,
      color: colors.text,
    },
    cancelButton: {
      marginTop: 16,
      padding: 12,
    },
    cancelText: {
      fontSize: 14,
      color: colors.textMuted,
      fontWeight: "700",
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>What would you like to add?</Text>
            <Text style={styles.subtitle}>
              Choose between creating a new transaction or setting up a budget
            </Text>

            <View style={styles.buttonContainer}>
              {/* Transaction Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  onSelectTransaction();
                  onClose();
                }}
              >
                <Ionicons
                  name="swap-horizontal"
                  size={24}
                  color={colors.primary}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Transaction</Text>
              </TouchableOpacity>

              {/* Budget Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  onSelectBudget();
                  onClose();
                }}
              >
                <Ionicons
                  name="wallet"
                  size={24}
                  color={colors.primary}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Budget</Text>
              </TouchableOpacity>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SelectionModal;
