import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import useTheme from "../../hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import createAddTransactionStyles from "../../styles/addTransaction.styles";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import api from "../../utils/api";
import { useUser } from "../../context/userContext";
import { useRouter } from "expo-router";

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
  const { user } = useUser();
  const userId = user?._id;
  const router = useRouter();
  
  useEffect(() => {
    setIsError(false);
    setError("");
  }, [selectedControl, amount, date, selectedCategory ]);


  const categories = [
    {
      name: "Food",
      unselectedIcon: "restaurant-outline",
      selectedIcon: "restaurant",
      color: "wheat"
    },
    {
      name: "Transport",
      unselectedIcon: "car-outline",
      selectedIcon: "car",
      color: "yellow"
    },
    {
      name: "Entertainment",
      unselectedIcon: "game-controller-outline",
      selectedIcon: "game-controller",
      color: "lightcoral"
    },
    {
      name: "Shopping",
      unselectedIcon: "cart-outline",
      selectedIcon: "cart",
      color: "aqua"
    },
    {
      name: "Salary",
      unselectedIcon: "cash-outline",
      selectedIcon: "cash",
      color: "lightgreen"
    },
    {
      name: "Investment",
      unselectedIcon: "cash-outline",
      selectedIcon: "cash",
      color: "orange"
    },
    {
      name: "Rent",
      unselectedIcon: "home-outline",
      selectedIcon: "home",
      color: "pink"
    },
    {
      name: "Bills",
      unselectedIcon: "document-text-outline",
      selectedIcon: "document-text",
      color: "lightgray"
    },
    {
      name: "Other",
      unselectedIcon: "ellipsis-horizontal-outline",
      selectedIcon: "ellipsis-horizontal",
      color: "plum"
    },
  ];

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const createTransaction = async (amount, category, date, notes = "") => {
    try {
      amount = selectedControl === "income" ? Number(amount) : -Number(amount);
      if(notes === "") {
        notes = selectedCategory.name;
      }
      // console.log(notes, amount, category, date, userId);
      const response = await api.post('/transactions', { title: notes, amount, category, date, user_id: userId });
      Alert.alert('Success', 'Transaction created successfully');
      router.replace('/history');
    } catch (error) {
      Alert.alert('Error', error.response.data.message);
    }
  };

  const handleSave = () => {
    if (!selectedControl) {
      setError("Please select a type");
      setIsError(true);
      return;
    }
    if (!amount) {
      setError("Please enter an amount");
      setIsError(true);
      return;
    }
    if (!date) {
      setError("Please select a date");
      setIsError(true);
      return;
    }
    if (!selectedCategory) {
      setError("Please select a category");
      setIsError(true);
      return;
    }

    setIsError(false);
    setError("");
    setIsSaving(true);
    
    createTransaction(amount, selectedCategory.name, date, notes);

    setIsSaving(false);
    setSelectedControl(null);
    setAmount("");
    setDate(new Date());
    setSelectedCategory(null);
    setNotes("");
  };

  return (
    <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>New Transaction</Text>
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
              Income
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
              Expense
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
            placeholder="00.00"
            placeholderTextColor={colors.textMuted}
            style={styles.amountInput}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>

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

        <View style={styles.categoriesContainer}>
          <View style={styles.categoriesHeader}>
            <Ionicons
              name="list-outline"
              size={24}
              color={colors.text}
            />
            <Text style={styles.categoriesHeaderText}>Select a category</Text>
          </View>
          <View style={styles.categoriesList}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[styles.category, selectedCategory?.name === category.name && { borderColor: category.color, backgroundColor: colors.surface }]}
                onPress={() => setSelectedCategory(category)}
              >
                <Ionicons
                  name={selectedCategory?.name === category.name ? category.selectedIcon : category.unselectedIcon}
                  size={24}
                  color={
                    selectedCategory?.name === category.name
                      ? category.color
                      : colors.textMuted
                  }
                />
                <Text style={[styles.categoryText, selectedCategory?.name === category.name && { color: category.color }]}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
            <Ionicons name="document-text-outline" size={24} color={colors.text} />
            <Text style={styles.notesHeaderText}>Add a note</Text>
          </View>
          
          <TextInput
            placeholder="Add a note"
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

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <ActivityIndicator size="small" color={colors.surface} />
              <Text style={styles.saveButtonText}>Saving...</Text>
            </>
          ) : (
            <>
              <Ionicons name="save" size={24} color={colors.surface} />
              <Text style={styles.saveButtonText}>Save</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default AddTransaction;
