import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import useTheme from "../../hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import createAddTransactionStyles from "../../styles/addTransaction.styles";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as categoryService from "../../services/categoryService";
import * as bankService from "../../services/bankService";
import * as transactionService from "../../services/transactionService";
import { useUser } from "../../context/userContext";
import { useRouter } from "expo-router";
import { categories } from "../../constants/Categories";
import CustomDropdown from "../../components/CustomDropdown";
import { useFocusEffect } from "@react-navigation/native";
import useLanguage from "../../hooks/useLanguage";

const AddTransaction = () => {
  const { colors } = useTheme();
  const styles = createAddTransactionStyles();
  const [selectedControl, setSelectedControl] = useState(null);
  const [amount, setAmount] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [userCategories, setUserCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isTransfer, setIsTransfer] = useState(false);
  const [sourceBank, setSourceBank] = useState(null);
  const { user } = useUser();
  const userId = user?._id;
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    setIsError(false);
    setError("");
  }, [selectedControl, amount, date, selectedCategory, selectedBank]);

  useEffect(() => {
    // Transfer option only applies to savings.
    if (selectedControl !== "savings") {
      setIsTransfer(false);
      setSourceBank(null);
    }
    // Savings can only target a savings account; drop an invalid selection.
    if (selectedControl === "savings" && selectedBank && !selectedBank.isSavings) {
      setSelectedBank(null);
    }
  }, [selectedControl, selectedBank]);

  const fetchUserCategories = useCallback(async () => {
    if (!userId) return;
    try {
      const userCats = (await categoryService.getAll(userId)) || [];
      setUserCategories(userCats);
      
      // Combine default categories with user categories
      const defaultCats = categories.map(cat => ({
        ...cat,
        isCustom: false,
        _id: null,
      }));
      
      const customCats = userCats.map(cat => ({
        name: cat.name,
        unselectedIcon: cat.icon || "pricetag-outline",
        selectedIcon: cat.icon || "pricetag",
        color: cat.color || colors.primary,
        isCustom: true,
        _id: cat._id,
      }));
      
      setAllCategories([...defaultCats, ...customCats]);
    } catch (e) {
      // If error, just use default categories
      const defaultCats = categories.map(cat => ({
        ...cat,
        isCustom: false,
        _id: null,
      }));
      setAllCategories(defaultCats);
    }
  }, [userId, colors.primary]);

  const fetchBanks = useCallback(async () => {
    if (!userId) return;
    try {
      const list = (await bankService.getAll(userId)) || [];
      setBanks(list.map((b) => ({ id: b._id, name: b.name, logo: b.logo, isSavings: b.isSavings })));
    } catch (e) {
      // silently ignore
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchBanks();
      fetchUserCategories();
    }, [fetchBanks, fetchUserCategories])
  );

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const resetForm = () => {
    setSelectedControl(null);
    setAmount("");
    setDate(new Date());
    setSelectedCategory(null);
    setSelectedBank(null);
    setNotes("");
    setIsTransfer(false);
    setSourceBank(null);
  };

  const handleSave = async () => {
    if (!selectedControl) {
      setError(
        t("transactions.add.validation.type", {
          defaultValue: "Please select a type",
        })
      );
      setIsError(true);
      return;
    }
    if (!amount) {
      setError(
        t("transactions.add.validation.amount", {
          defaultValue: "Please enter an amount",
        })
      );
      setIsError(true);
      return;
    }
    if (!date) {
      setError(
        t("transactions.add.validation.date", {
          defaultValue: "Please select a date",
        })
      );
      setIsError(true);
      return;
    }
    if (!selectedBank) {
      setError(
        t("transactions.add.validation.bank", {
          defaultValue: "Please select a bank",
        })
      );
      setIsError(true);
      return;
    }
    if (selectedControl !== "savings" && !selectedCategory) {
      setError(
        t("transactions.add.validation.category", {
          defaultValue: "Please select a category",
        })
      );
      setIsError(true);
      return;
    }
    if (selectedControl === "savings" && isTransfer) {
      if (!sourceBank) {
        setError(
          t("transactions.add.validation.sourceBank", {
            defaultValue: "Please select the source bank",
          })
        );
        setIsError(true);
        return;
      }
      if (sourceBank.id === selectedBank.id) {
        setError(
          t("transactions.add.validation.sameBank", {
            defaultValue: "Source and destination banks must be different",
          })
        );
        setIsError(true);
        return;
      }
    }

    setIsError(false);
    setError("");
    setIsSaving(true);

    try {
      if (selectedControl === "savings" && isTransfer) {
        // Move money from another bank into this (savings) bank.
        await transactionService.transfer({
          user_id: userId,
          fromBank: sourceBank.id,
          toBank: selectedBank.id,
          amount: Number(amount),
        });
      } else if (selectedControl === "savings") {
        // New money added to savings (counts as income, category "Savings").
        await transactionService.create({
          title: notes || "Savings",
          amount: Number(amount),
          category: "Savings",
          bank: selectedBank.id,
          date,
          user_id: userId,
        });
      } else {
        const signedAmount =
          selectedControl === "income" ? Number(amount) : -Number(amount);
        await transactionService.create({
          title: notes || selectedCategory.name,
          amount: signedAmount,
          category: selectedCategory.name,
          category_id: selectedCategory.isCustom ? selectedCategory._id : null,
          bank: selectedBank.id,
          date,
          user_id: userId,
        });
      }

      Alert.alert(
        t("common.success", { defaultValue: "Success" }),
        t("transactions.add.alerts.createSuccess", {
          defaultValue: "Transaction created successfully",
        })
      );
      resetForm();
      router.replace("/history");
    } catch (error) {
      Alert.alert(
        t("common.error", { defaultValue: "Error" }),
        error?.response?.data?.message ??
          error?.message ??
          t("transactions.add.alerts.createError", {
            defaultValue: "Unable to create transaction.",
          })
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {t("transactions.add.title", {
              defaultValue: "New Transaction",
            })}
          </Text>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[
              styles.controls,
              selectedControl === "income" && {
                borderColor: colors.incomeMuted,
              },
            ]}
            onPress={() => setSelectedControl("income")}
          >
            <Ionicons
              name={
                selectedControl === "income"
                  ? "arrow-down-circle"
                  : "arrow-down-circle-outline"
              }
              size={24}
              style={styles.controlsIcon}
              color={
                selectedControl === "income"
                  ? colors.incomeMuted
                  : colors.textMuted
              }
            />
            <Text
              style={[
                styles.controlsTitle,
                selectedControl === "income" && { color: colors.incomeMuted },
              ]}
            >
              {t("transactions.common.income", {
                defaultValue: "Income",
              })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.controls,
              selectedControl === "expense" && {
                borderColor: colors.expenseMuted,
              },
            ]}
            onPress={() => setSelectedControl("expense")}
          >
            <Ionicons
              name={
                selectedControl === "expense"
                  ? "arrow-up-circle"
                  : "arrow-up-circle-outline"
              }
              size={24}
              style={styles.controlsIcon}
              color={
                selectedControl === "expense"
                  ? colors.expenseMuted
                  : colors.textMuted
              }
            />
            <Text
              style={[
                styles.controlsTitle,
                selectedControl === "expense" && { color: colors.expenseMuted },
              ]}
            >
              {t("transactions.common.expense", {
                defaultValue: "Expense",
              })}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.controlsContainer, { marginTop: 10 }]}>
          <TouchableOpacity
            style={[
              styles.controls,
              selectedControl === "savings" && {
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setSelectedControl("savings")}
          >
            <Ionicons
              name={selectedControl === "savings" ? "wallet" : "wallet-outline"}
              size={24}
              style={styles.controlsIcon}
              color={
                selectedControl === "savings" ? colors.primary : colors.textMuted
              }
            />
            <Text
              style={[
                styles.controlsTitle,
                selectedControl === "savings" && { color: colors.primary },
              ]}
            >
              {t("transactions.common.savings", {
                defaultValue: "Savings",
              })}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.amountInputContainer,
            isFocused && { borderColor: colors.text },
          ]}
        >
          <Ionicons
            name="cash-outline"
            size={24}
            style={styles.amountInputIcon}
            color={isFocused ? colors.text : colors.textMuted}
          />
          <TextInput
            placeholder={t("transactions.add.form.amountPlaceholder", {
              defaultValue: "00.00",
            })}
            placeholderTextColor={colors.textMuted}
            style={styles.amountInput}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>

        <View style={styles.dateContainer}>
          <Ionicons
            name="business-outline"
            size={24}
            style={styles.dateIcon}
            color={colors.textMuted}
          />
          <View style={{ flex: 1 }}>
            <CustomDropdown
              data={
                selectedControl === "savings"
                  ? banks.filter((b) => b.isSavings)
                  : banks
              }
              selectedValue={selectedBank}
              onSelect={setSelectedBank}
              placeholder={t("transactions.add.form.selectBank", {
                defaultValue: "Select bank",
              })}
              dropdownStyle={{
                backgroundColor: "transparent",
                borderWidth: 0,
                paddingVertical: 0,
                paddingHorizontal: 0,
              }}
              placeholderStyle={styles.dateText}
              style={{}}
            />
          </View>
        </View>

        {selectedControl === "savings" && (
          <>
            <TouchableOpacity
              style={styles.transferCheckboxRow}
              activeOpacity={0.7}
              onPress={() => {
                setIsTransfer((prev) => !prev);
                setSourceBank(null);
              }}
            >
              <Ionicons
                name={isTransfer ? "checkbox" : "square-outline"}
                size={24}
                color={isTransfer ? colors.primary : colors.textMuted}
              />
              <Text style={styles.transferCheckboxLabel}>
                {t("transactions.add.form.fromAnotherBank", {
                  defaultValue: "From another bank (Transfer)",
                })}
              </Text>
            </TouchableOpacity>

            {isTransfer && (
              <View style={styles.dateContainer}>
                <Ionicons
                  name="swap-horizontal-outline"
                  size={24}
                  style={styles.dateIcon}
                  color={colors.textMuted}
                />
                <View style={{ flex: 1 }}>
                  <CustomDropdown
                    data={banks.filter((b) => b.id !== selectedBank?.id)}
                    selectedValue={sourceBank}
                    onSelect={setSourceBank}
                    placeholder={t("transactions.add.form.selectSourceBank", {
                      defaultValue: "Select source bank",
                    })}
                    dropdownStyle={{
                      backgroundColor: "transparent",
                      borderWidth: 0,
                      paddingVertical: 0,
                      paddingHorizontal: 0,
                    }}
                    placeholderStyle={styles.dateText}
                    style={{}}
                  />
                </View>
              </View>
            )}
          </>
        )}

        <TouchableOpacity
          onPress={showDatePickerModal}
          style={styles.dateContainer}
        >
          <Ionicons
            name="calendar-outline"
            size={24}
            style={styles.dateIcon}
            color={colors.textMuted}
          />
          <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </TouchableOpacity>

        {selectedControl !== "savings" && (
        <View style={styles.categoriesContainer}>
          <View style={styles.categoriesHeader}>
            <Ionicons name="list-outline" size={24} color={colors.text} />
            <Text style={styles.categoriesHeaderText}>
              {t("transactions.add.form.selectCategory", {
                defaultValue: "Select a category",
              })}
            </Text>
          </View>
          <View style={styles.categoriesList}>
            {allCategories.map((category) => (
              <TouchableOpacity
                key={category.isCustom ? category._id : category.name}
                style={[
                  styles.category,
                  selectedCategory?.name === category.name && {
                    borderColor: category.color,
                    backgroundColor: colors.surface,
                  },
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Ionicons
                  name={
                    selectedCategory?.name === category.name
                      ? category.selectedIcon
                      : category.unselectedIcon
                  }
                  size={24}
                  color={
                    selectedCategory?.name === category.name
                      ? category.color
                      : colors.textMuted
                  }
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory?.name === category.name && {
                      color: category.color,
                    },
                  ]}
                >
                  {t(`categories.${category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, {
                    defaultValue: category.name,
                  })}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        )}
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={100}
          // keyboardDismissMode="on-drag"
          // keyboardShouldPersistTaps="handled"
        >
          <View style={styles.notesContainer}>
            <View style={styles.notesHeader}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color={colors.text}
              />
              <Text style={styles.notesHeaderText}>
                {t("transactions.add.form.addNoteLabel", {
                  defaultValue: "Add a note",
                })}
              </Text>
            </View>

            <TextInput
              placeholder={t("transactions.add.form.addNotePlaceholder", {
                defaultValue: "Add a note",
              })}
              placeholderTextColor={colors.textMuted}
              style={styles.notesInput}
              multiline={true}
              numberOfLines={2}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </KeyboardAwareScrollView>

        {isError && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
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
                {t("transactions.add.actions.saving", {
                  defaultValue: "Saving...",
                })}
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="save" size={24} color={colors.surface} />
              <Text style={styles.saveButtonText}>
                {t("transactions.add.actions.save", {
                  defaultValue: "Save",
                })}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default AddTransaction;
