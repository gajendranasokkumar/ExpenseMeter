import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import useTheme from "../../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import createStyles from "../../styles/addBudget.styles";
import api from "../../utils/api";
import { BUDGET_ROUTES } from "../../constants/endPoints";
import { useUser } from "../../context/userContext";
import { getCurrentMonth, computeEndDate } from "../../utils/formatDate";
import { categories } from "../../constants/Categories";

const AddBudget = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { user } = useUser();
  const userId = user?._id;
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    period: "monthly",
    start_date: "",
    end_date: "",
  });
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isAllCategory, setIsAllCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const listofCategories = ["Monthly Budget", ...categories.map((category) => category.name)];

  const periods = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      const autoEnd = computeEndDate(selectedDate, formData.period);
      setEndDate(autoEnd);
      setFormData((prev) => ({
        ...prev,
        start_date: selectedDate.toISOString(),
        end_date: autoEnd.toISOString(),
      }));
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
      setFormData((prev) => ({
        ...prev,
        end_date: selectedDate.toISOString(),
      }));
    }
  };

  const showStartDatePickerModal = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatePickerModal = () => {
    setShowEndDatePicker(true);
  };

  useEffect(() => {
    // Initialize start_date to today and end_date based on default period
    const today = new Date();
    const initialEnd = computeEndDate(today, formData.period);
    setStartDate(today);
    setEndDate(initialEnd);
    setFormData((prev) => ({
      ...prev,
      start_date: today.toISOString(),
      end_date: initialEnd.toISOString(),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Recompute end date when period or start date changes (but not for Monthly Budget)
    if (formData.start_date && formData.category !== "Monthly Budget") {
      const start = new Date(formData.start_date);
      const newEnd = computeEndDate(start, formData.period);
      setEndDate(newEnd);
      setFormData((prev) => ({
        ...prev,
        end_date: newEnd.toISOString(),
      }));
    }
  }, [formData.period, startDate]);

  useEffect(() => {
    if(formData.category === "Monthly Budget") {
      setIsAllCategory(true);
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      
      setStartDate(monthStart);
      setEndDate(monthEnd);
      setFormData((prev) => ({
        ...prev,
        title: `Budget for ${getCurrentMonth()}`,
        start_date: monthStart.toISOString(),
        end_date: monthEnd.toISOString(),
      }));
    } else {
      setIsAllCategory(false);
    }
  }, [formData.category]);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "Please enter a budget title");
      return;
    }
    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      parseFloat(formData.amount) <= 0
    ) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    if (!formData.category) {
      Alert.alert("Error", "Please select a category");
      return;
    }
    if (!formData.start_date) {
      Alert.alert("Error", "Please select start date");
      return;
    }
    if (!formData.end_date) {
      Alert.alert("Error", "Please select end date");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post(BUDGET_ROUTES.CREATE_BUDGET, {
        ...formData,
        user_id: userId,
        amount: parseFloat(formData.amount),
        start_date: new Date(formData.start_date),
        end_date: new Date(formData.end_date),
        isAllCategory: isAllCategory,
      });
      Alert.alert("Success", "Budget created successfully!");
      setFormData({
        title: "",
        amount: "",
        category: "",
        period: "monthly",
        start_date: "",
        end_date: "",
      });
      setStartDate(new Date());
      setEndDate(new Date());
      setShowStartDatePicker(false);
      setShowEndDatePicker(false);
      setIsAllCategory(false);
      setIsLoading(false);
      router.back();
    } catch (error) {
      Alert.alert("Error", error.response.data.message);
      console.log("Error creating budget:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDateInput = (field, label, date, showPicker, onPress, onChange) => (
    <View style={styles.dateInputContainer}>
      <Text style={styles.inputLabel}>
        {label}
      </Text>
      <TouchableOpacity
        style={styles.dateInputButton}
        onPress={onPress}
      >
        <Text
          style={[
            styles.dateInputText,
            formData[field] ? styles.dateInputTextFilled : styles.dateInputTextPlaceholder
          ]}
        >
          {formData[field] ? date.toLocaleDateString() : `Select ${label}`}
        </Text>
        <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={colors.gradients.background} style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Create Budget
            </Text>
          </View>

          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Budget Title
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter budget title"
                  placeholderTextColor={colors.textMuted}
                  value={formData.title}
                  onChangeText={(text) => handleInputChange("title", text)}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Budget Amount
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter amount"
                  placeholderTextColor={colors.textMuted}
                  value={formData.amount}
                  onChangeText={(text) => handleInputChange("amount", text)}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.categoryContainer}>
                <Text style={styles.inputLabel}>
                  Category
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.categoryScrollView}>
                    {listofCategories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryButton,
                          formData.category === category
                            ? styles.categoryButtonSelected
                            : styles.categoryButtonUnselected
                        ]}
                        onPress={() => handleInputChange("category", category)}
                      >
                        <Text
                          style={[
                            styles.categoryButtonText,
                            formData.category === category
                              ? styles.categoryButtonTextSelected
                              : styles.categoryButtonTextUnselected
                          ]}
                        >
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.periodContainer}>
                <Text style={styles.inputLabel}>
                  Budget Period
                </Text>
                <View style={styles.periodButtonRow}>
                  {periods.map((period) => (
                    <TouchableOpacity
                      key={period.value}
                      style={[
                        styles.periodButton,
                        formData.period === period.value
                          ? styles.periodButtonSelected
                          : styles.periodButtonUnselected
                      ]}
                      onPress={() => handleInputChange("period", period.value)}
                    >
                      <Text
                        style={[
                          styles.periodButtonText,
                          formData.period === period.value
                            ? styles.periodButtonTextSelected
                            : styles.periodButtonTextUnselected
                        ]}
                      >
                        {period.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {getDateInput(
                "start_date", 
                "Start Date", 
                startDate, 
                showStartDatePicker, 
                showStartDatePickerModal, 
                onStartDateChange
              )}

              {getDateInput(
                "end_date", 
                "End Date", 
                endDate, 
                showEndDatePicker, 
                showEndDatePickerModal, 
                onEndDateChange
              )}

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? "Creating..." : "Create Budget"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScrollView>
    </LinearGradient>
  );
};

export default AddBudget;
