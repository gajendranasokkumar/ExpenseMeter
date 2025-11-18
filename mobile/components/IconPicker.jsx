import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTheme from "../hooks/useTheme";
import useLanguage from "../hooks/useLanguage";
import { iconNames } from "../constants/Icons";
import { useFontSize } from "../context/fontSizeContext";

// Get all Ionicons names
const getAllIonicons = () => { 
  // Remove duplicates and sort
  return [...new Set(iconNames)].sort();
};

const IconPicker = ({ visible, onClose, onSelect, selectedIcon }) => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { getFontSizeByKey } = useFontSize();
  const fontSize = (key) => getFontSizeByKey(key);
  const [searchQuery, setSearchQuery] = useState("");
  const allIcons = useMemo(() => getAllIonicons(), []);

  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return allIcons;
    }
    const query = searchQuery.toLowerCase();
    return allIcons.filter((icon) =>
      icon.toLowerCase().includes(query)
    );
  }, [searchQuery, allIcons]);

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: "80%",
      paddingTop: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: fontSize("lg"),
      fontWeight: "600",
      color: colors.text,
    },
    closeButton: {
      padding: 8,
    },
    searchContainer: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
    },
    searchInput: {
      backgroundColor: colors.backgrounds.input,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: fontSize("md"),
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    iconGrid: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    iconRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
    },
    iconItem: {
      width: "12.5%",
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    iconButton: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.backgrounds.input,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    iconButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "20",
      zIndex: 10,
    },
    emptyText: {
      textAlign: "center",
      color: colors.textMuted,
      fontSize: fontSize("md"),
      paddingVertical: 40,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {t("categories.form.selectIcon", { defaultValue: "Select Icon" })}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={t("categories.form.searchIcons", {
                defaultValue: "Search icons...",
              })}
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <FlatList
            data={filteredIcons}
            keyExtractor={(item) => item}
            numColumns={8}
            contentContainerStyle={styles.iconGrid}
            renderItem={({ item }) => {
              const isSelected = selectedIcon === item;
              return (
                <View style={styles.iconItem}>
                  <TouchableOpacity
                    style={[
                      styles.iconButton,
                      isSelected && styles.iconButtonSelected,
                    ]}
                    onPress={() => {
                      onSelect(item);
                      onClose();
                    }}
                  >
                    <Ionicons
                      name={item}
                      size={24}
                      color={isSelected ? colors.primary : colors.text}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {t("common.noResults", { defaultValue: "No icons found" })}
              </Text>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

export default IconPicker;

