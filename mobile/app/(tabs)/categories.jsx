import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useTheme from "../../hooks/useTheme";
import createCategoriesStyles from "../../styles/categories.styles";
import { CATEGORY_ROUTES } from "../../constants/endPoints";
import api from "../../utils/api";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "../../context/userContext";
import useLanguage from "../../hooks/useLanguage";
import IconPicker from "../../components/IconPicker";

// Color palette for categories
const COLOR_PALETTE = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#FFA07A", // Light Salmon
  "#98D8C8", // Mint
  "#F7DC6F", // Yellow
  "#BB8FCE", // Purple
  "#85C1E2", // Sky Blue
  "#F8B739", // Orange
  "#52BE80", // Green
  "#EC7063", // Coral
  "#5DADE2", // Light Blue
  "#F1948A", // Pink
  "#73C6B6", // Turquoise
  "#F4D03F", // Gold
  "#AF7AC5", // Lavender
  "#FF8C94", // Rose Pink
  "#6C5CE7", // Periwinkle
  "#00B894", // Emerald
  "#FD79A8", // Hot Pink
  "#A29BFE", // Soft Purple
  "#FF7675", // Watermelon
  "#74B9FF", // Baby Blue
  "#00CEC9", // Cyan
  "#FDCB6E", // Mustard
  "#E17055", // Terracotta
  "#81ECEC", // Aqua
  "#FAB1A0", // Peach
  "#55EFC4", // Seafoam
  "#FF6348", // Tomato
  "#A8E6CF", // Mint Green
  "#FFD93D", // Bright Yellow
  "#6BCF7F", // Lime Green
  "#C56CF0", // Orchid
  "#FF9FF3", // Bubblegum
];

const Categories = () => {
  const { colors } = useTheme();
  const styles = createCategoriesStyles();
  const { t } = useLanguage();
  const { user } = useUser();
  const userId = user?._id;

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [editingCategory, setEditingCategory] = useState(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Form state
  const [categoryName, setCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  if (Platform.OS === "android") {
    const isFabric =
      typeof global !== "undefined" && !!global.nativeFabricUIManager;
    if (!isFabric && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const getAllCategories = useCallback(async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const response = await api.post(CATEGORY_ROUTES.GET_ALL_CATEGORIES, {
        userId: userId,
      });
      setCategories(response.data.data || []);
    } catch (error) {
      Alert.alert(
        t("common.error", { defaultValue: "Error" }),
        error?.response?.data?.message ??
          t("categories.alerts.fetchError", {
            defaultValue: "Unable to load categories.",
          })
      );
    } finally {
      setIsLoading(false);
    }
  }, [t, userId]);

  useFocusEffect(
    useCallback(() => {
      getAllCategories();
    }, [getAllCategories])
  );

  const resetForm = () => {
    setCategoryName("");
    setSelectedIcon(null);
    setSelectedColor(null);
    setEditingCategory(null);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      Alert.alert(
        t("common.error", { defaultValue: "Error" }),
        t("categories.validation.nameRequired", {
          defaultValue: "Category name is required",
        })
      );
      return;
    }

    setIsSaving(true);
    try {
      if (editingCategory) {
        // Update existing category
        await api.put(
          CATEGORY_ROUTES.UPDATE_CATEGORY.replace(":id", editingCategory._id),
          {
            name: categoryName.trim(),
            icon: selectedIcon,
            color: selectedColor,
            userId: userId,
          }
        );
        Alert.alert(
          t("common.success", { defaultValue: "Success" }),
          t("categories.alerts.createSuccess", {
            defaultValue: "Category updated successfully",
          })
        );
      } else {
        // Create new category
        await api.post(CATEGORY_ROUTES.CREATE_CATEGORY, {
          name: categoryName.trim(),
          icon: selectedIcon,
          color: selectedColor,
          user_id: userId,
        });
        Alert.alert(
          t("common.success", { defaultValue: "Success" }),
          t("categories.alerts.createSuccess", {
            defaultValue: "Category created successfully",
          })
        );
      }
      getAllCategories();
      resetForm();
    } catch (error) {
      Alert.alert(
        t("common.error", { defaultValue: "Error" }),
        error?.response?.data?.message ??
          (editingCategory
            ? t("categories.alerts.updateError", {
                defaultValue: "Unable to update category.",
              })
            : t("categories.alerts.createError", {
                defaultValue: "Unable to create category.",
              }))
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name || "");
    setSelectedIcon(category.icon || null);
    setSelectedColor(category.color || null);
    // Scroll to top or show form
  };

  const handleDelete = async (categoryId) => {
    Alert.alert(
      t("categories.dialogs.delete.title", { defaultValue: "Delete Category" }),
      t("categories.dialogs.delete.message", {
        defaultValue: "Are you sure you want to delete this category?",
      }),
      [
        {
          text: t("common.cancel", { defaultValue: "Cancel" }),
          style: "cancel",
        },
        {
          text: t("common.delete", { defaultValue: "Delete" }),
          style: "destructive",
          onPress: () => handleDeleteCategory(categoryId),
        },
      ]
    );
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await api.delete(
        CATEGORY_ROUTES.PERMANENTLY_DELETE_CATEGORY.replace(":id", categoryId).replace(
          ":userId",
          userId
        )
      );
      getAllCategories();
    } catch (error) {
      Alert.alert(
        t("common.error", { defaultValue: "Error" }),
        error?.response?.data?.message ??
          t("categories.alerts.deleteError", {
            defaultValue: "Unable to delete category.",
          })
      );
    }
  };

  const toggleExpand = (categoryId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Memoize the form header to prevent re-renders that close the keyboard
  const formHeader = useMemo(() => (
    <LinearGradient
      colors={colors.gradients.surface}
      style={[styles.section, { marginTop: 8 }]}
    >
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>
          {editingCategory
            ? t("categories.actions.editCategory", {
                defaultValue: "Edit Category",
              })
            : t("categories.actions.addCategory", {
                defaultValue: "Add Category",
              })}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={t("categories.form.categoryNamePlaceholder", {
            defaultValue: "Enter category name",
          })}
          placeholderTextColor={colors.textMuted}
          value={categoryName}
          onChangeText={setCategoryName}
        />
        <TouchableOpacity
          style={styles.iconSelectorButton}
          onPress={() => setShowIconPicker(true)}
        >
          <Text style={styles.iconSelectorButtonText}>
            {selectedIcon
              ? selectedIcon
              : t("categories.form.selectIcon", {
                  defaultValue: "Select Icon",
                })}
          </Text>
          {selectedIcon ? (
            <Ionicons
              name={selectedIcon}
              size={24}
              color={colors.primary}
            />
          ) : (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textMuted}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.colorSelectorButton}
          onPress={() => setShowColorPicker(true)}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Text style={styles.colorSelectorButtonText}>
              {t("categories.form.selectColor", {
                defaultValue: "Select Color",
              })}
            </Text>
            {selectedColor && (
              <View
                style={[
                  styles.colorPreview,
                  { backgroundColor: selectedColor },
                ]}
              />
            )}
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textMuted}
          />
        </TouchableOpacity>
        {editingCategory && (
          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: colors.textMuted, marginTop: 10 },
            ]}
            onPress={resetForm}
          >
            <Text style={styles.saveButtonText}>
              {t("common.cancel", { defaultValue: "Cancel" })}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <ActivityIndicator size="small" color={colors.surface} />
              <Text style={styles.saveButtonText}>
                {editingCategory
                  ? t("categories.actions.updating", {
                      defaultValue: "Updating...",
                    })
                  : t("categories.actions.saving", {
                      defaultValue: "Saving...",
                    })}
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="save" size={24} color={colors.surface} />
              <Text style={styles.saveButtonText}>
                {t("common.save", { defaultValue: "Save" })}
              </Text>
            </>
          )}
        </TouchableOpacity>
        {/* <TouchableOpacity
            style={styles.backButton}
            onPress={() => resetForm()}
            activeOpacity={0.8}
            >
            <Ionicons name="refresh-outline" size={22} color={colors.text} />
        </TouchableOpacity> */}
      </View>
    </LinearGradient>
  ), [editingCategory, categoryName, selectedIcon, selectedColor, isSaving, colors, t]);

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
            <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/(tabs)/more")}
            activeOpacity={0.8}
            >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
            </TouchableOpacity>
          <Text style={styles.title}>
            {t("categories.title", { defaultValue: "Categories" })}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {isLoading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item._id || item.id?.toString()}
            renderItem={({ item }) => {
              const categoryId = item._id || item.id;
              const isExpanded = !!categoryId && expandedIds.has(categoryId);
              return (
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.categoryListItem}
                >
                  <View style={styles.categoryCard}>
                    <View style={styles.categoryLeft}>
                      <View
                        style={[
                          styles.categoryIconContainer,
                          item.color && { backgroundColor: item.color + "20" },
                        ]}
                      >
                        <Ionicons
                          name={item.icon || "pricetag-outline"}
                          size={24}
                          color={item.color || colors.primary}
                        />
                      </View>
                      <View style={styles.categoryText}>
                        <Text style={styles.categoryName}>{item.name}</Text>
                      </View>
                    </View>
                    <View style={styles.categoryRight}>
                      <TouchableOpacity
                        onPress={() => toggleExpand(categoryId)}
                      >
                        <View
                          style={[
                            styles.chevronWrap,
                            isExpanded && styles.chevronWrapExpanded,
                          ]}
                        >
                          <Ionicons
                            name="chevron-down"
                            size={18}
                            color={colors.textMuted}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {isExpanded ? (
                    <View style={styles.expandedContainer}>
                      {/* <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          {t("categories.details.status.label", {
                            defaultValue: "Status",
                          })}
                        </Text>
                        <Text style={styles.detailValue}>
                          {item.isActive
                            ? t("categories.details.status.active", {
                                defaultValue: "Active",
                              })
                            : t("categories.details.status.inactive", {
                                defaultValue: "Inactive",
                              })}
                        </Text>
                      </View>
                      {item.created_at ? (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>
                            {t("categories.details.created", {
                              defaultValue: "Created",
                            })}
                          </Text>
                          <Text style={styles.detailValue}>
                            {new Date(item.created_at).toLocaleDateString()}
                          </Text>
                        </View>
                      ) : null}
                      {item.updated_at ? (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>
                            {t("categories.details.updated", {
                              defaultValue: "Updated",
                            })}
                          </Text>
                          <Text style={styles.detailValue}>
                            {new Date(item.updated_at).toLocaleDateString()}
                          </Text>
                        </View>
                      ) : null} */}
                      <View style={styles.expandedActions}>
                        <TouchableOpacity
                          onPress={() => handleEdit(item)}
                          style={styles.editButton}
                        >
                          <Ionicons
                            name="create-outline"
                            size={18}
                            color={colors.surface}
                          />
                          <Text style={styles.editButtonText}>
                            {t("categories.actions.editCategory", { defaultValue: "Edit" })}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDelete(categoryId)}
                          style={styles.deleteButton}
                        >
                          <Ionicons
                            name="trash"
                            size={18}
                            color={colors.surface}
                          />
                          <Text style={styles.deleteButtonText}>
                            {t("common.delete", { defaultValue: "Delete" })}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            }}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={getAllCategories} />
            }
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={formHeader}
            ListEmptyComponent={() => (
              <View style={{ paddingVertical: 40 }}>
                <Text style={styles.emptyText}>
                  {t("categories.empty", { defaultValue: "No categories found" })}
                </Text>
              </View>
            )}
            ListFooterComponent={() => (
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  {t("categories.footer", { defaultValue: "End of categories" })}
                </Text>
              </View>
            )}
          />
        )}

        <IconPicker
          visible={showIconPicker}
          onClose={() => setShowIconPicker(false)}
          onSelect={setSelectedIcon}
          selectedIcon={selectedIcon}
        />

        {/* Color Picker Modal */}
        <Modal
          visible={showColorPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowColorPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {t("categories.form.selectColor", { defaultValue: "Select Color" })}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 12,
                  justifyContent: "center",
                }}
              >
                {COLOR_PALETTE.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => {
                      setSelectedColor(color);
                      setShowColorPicker(false);
                    }}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: color,
                      borderWidth: selectedColor === color ? 3 : 0,
                      borderColor: colors.text,
                    }}
                  />
                ))}
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={() => setShowColorPicker(false)}
                >
                  <Text style={[styles.modalButtonText, styles.modalButtonTextCancel]}>
                    {t("common.cancel", { defaultValue: "Cancel" })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

export default Categories;

