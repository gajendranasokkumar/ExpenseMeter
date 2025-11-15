import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import useTheme from "../../hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import createHistoryStyles from "../../styles/history.styles";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";
import { useUser } from "../../context/userContext";
import { useFocusEffect } from "@react-navigation/native";
import SingleTransaction from "../../components/SingleTransaction";
import { TRANSACTION_ROUTES, BUDGET_ROUTES, CATEGORY_ROUTES } from "../../constants/endPoints";
import SingleBudget from "../../components/SingleBudget";
import DateTimePicker from "@react-native-community/datetimepicker";
import useLanguage from "../../hooks/useLanguage";

const Transactions = () => {
  const { colors } = useTheme();
  const styles = createHistoryStyles();
  // Transaction states
  const [transactionsRefreshing, setTransactionsRefreshing] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsLoadingMore, setTransactionsLoadingMore] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsTotalPages, setTransactionsTotalPages] = useState(1);

  // Budget states
  const [budgetsRefreshing, setBudgetsRefreshing] = useState(false);
  const [budgetsLoading, setBudgetsLoading] = useState(false);
  const [budgetsLoadingMore, setBudgetsLoadingMore] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [budgetsPage, setBudgetsPage] = useState(1);
  const [budgetsTotalPages, setBudgetsTotalPages] = useState(1);

  const [activeScreen, setActiveScreen] = useState("transactions");
  const [userCategories, setUserCategories] = useState([]);
  const { user } = useUser();
  const userId = user?._id;
  const { t } = useLanguage();

  // Date filter state
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const fetchTransactions = useCallback(
    async (pageToFetch = 1, isRefreshing = false) => {
      try {
        if (!userId) return;

        if (pageToFetch === 1 && !isRefreshing) setTransactionsLoading(true);
        else if (pageToFetch > 1) setTransactionsLoadingMore(true);

        const params = new URLSearchParams();
        params.append("page", pageToFetch);
        if (startDate) params.append("startDate", startDate.toISOString());
        if (endDate) params.append("endDate", endDate.toISOString());
        const response = await api.get(
          `${TRANSACTION_ROUTES.GET_TRANSACTIONS_BY_USER_ID.replace(":id", userId)}?${params.toString()}`
        );

        const items = response.data.items || [];

        if (isRefreshing || pageToFetch === 1) {
          setTransactions(items);
        } else {
          setTransactions((prev) => [...prev, ...items]);
        }

        setTransactionsPage(response.data.page);
        setTransactionsTotalPages(response.data.totalPages);
      } catch (error) {
        Alert.alert(
          t("common.error", { defaultValue: "Error" }),
          error?.response?.data?.message ??
            t("history.alerts.fetchTransactionsError", {
              defaultValue: "Something went wrong",
            })
        );
      } finally {
        setTransactionsLoading(false);
        setTransactionsLoadingMore(false);
        setTransactionsRefreshing(false);
      }
    },
    [userId, startDate, endDate]
  );

  const fetchBudgets = useCallback(
    async (pageToFetch = 1, isRefreshing = false) => {
      try {
        if (!userId) return;

        if (pageToFetch === 1 && !isRefreshing) setBudgetsLoading(true);
        else if (pageToFetch > 1) setBudgetsLoadingMore(true);

        const params = new URLSearchParams();
        params.append("page", pageToFetch);
        if (startDate) params.append("startDate", startDate.toISOString());
        if (endDate) params.append("endDate", endDate.toISOString());
        const response = await api.get(
          `${BUDGET_ROUTES.GET_BUDGETS_BY_USER_ID.replace(":id", userId)}?${params.toString()}`
        );

        const items = response.data.items || [];

        if (isRefreshing || pageToFetch === 1) {
          setBudgets(items);
        } else {
          setBudgets((prev) => [...prev, ...items]);
        }

        setBudgetsPage(response.data.page);
        setBudgetsTotalPages(response.data.totalPages);
      } catch (error) {
        Alert.alert(
          t("common.error", { defaultValue: "Error" }),
          error?.response?.data?.message ??
            t("history.alerts.fetchBudgetsError", {
              defaultValue: "Something went wrong",
            })
        );
      } finally {
        setBudgetsLoading(false);
        setBudgetsLoadingMore(false);
        setBudgetsRefreshing(false);
      }
    },
    [userId, startDate, endDate]
  );

  const fetchUserCategories = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await api.post(CATEGORY_ROUTES.GET_ALL_CATEGORIES, {
        userId: userId,
      });
      setUserCategories(res?.data?.data || []);
    } catch (e) {
      // If error, just use empty array (will fall back to default categories)
      setUserCategories([]);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchTransactions(1);
      fetchBudgets(1);
      fetchUserCategories();
    }, [fetchTransactions, fetchBudgets, fetchUserCategories])
  );

  // Refetch when date filters change (handles Clear/Apply cases)
  useEffect(() => {
    if (!userId) return;
    setTransactionsPage(1);
    setBudgetsPage(1);
    fetchTransactions(1, true);
    fetchBudgets(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const onRefreshTransactions = () => {
    setTransactionsRefreshing(true);
    fetchTransactions(1, true);
  };

  const onRefreshBudgets = () => {
    setBudgetsRefreshing(true);
    fetchBudgets(1, true);
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await api.delete(
        `${TRANSACTION_ROUTES.DELETE_TRANSACTION.replace(":id", transactionId)}`
      );
      fetchTransactions(1); // refresh after delete
    } catch (error) {
      Alert.alert(
        t("common.error", { defaultValue: "Error" }),
        error?.response?.data?.message ??
          t("history.alerts.deleteTransactionError", {
            defaultValue: "Something went wrong",
          })
      );
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      await api.delete(
        `${BUDGET_ROUTES.DELETE_BUDGET.replace(":id", budgetId)}`
      );
      fetchBudgets(1); // refresh after delete
    } catch (error) {
      Alert.alert(
        t("common.error", { defaultValue: "Error" }),
        error?.response?.data?.message ??
          t("history.alerts.deleteBudgetError", {
            defaultValue: "Something went wrong",
          })
      );
    }
  };

  const renderLoading = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  const renderTransactionHistory = () => (
    <FlatList
      contentContainerStyle={{ flexGrow: 1 }}
      ListHeaderComponent={
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {t("history.transactions.title", {
                defaultValue: "Transactions",
              })}
            </Text>
            <View style={styles.headerButton}>
              <TouchableOpacity onPress={() => setIsFilterVisible(true)}>
                <Ionicons
                  name="options-outline"
                  size={24}
                  style={styles.optionsIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.info}>
            <Ionicons
              name="information-circle"
              size={16}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              {t("history.transactions.longPressInfo", {
                defaultValue: "Long press a transaction to delete it.",
              })}
            </Text>
          </View>
        </>
      }
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={transactionsRefreshing} onRefresh={onRefreshTransactions} />
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons
              name="wallet-outline"
              size={60}
              color={colors.textMuted}
            />
            <Text style={styles.emptyText}>
              {t("history.transactions.empty", {
                defaultValue: "No transactions found",
              })}
            </Text>
          </View>
        </View>
      }
      ListFooterComponent={
        transactionsLoadingMore ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : transactions.length > 0 ? (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t("history.transactions.footer", {
                defaultValue: "End of transactions history",
              })}
            </Text>
          </View>
        ) : null
      }
      data={transactions}
      renderItem={({ item }) => (
        <SingleTransaction 
          transaction={item} 
          onDelete={handleDeleteTransaction}
          userCategories={userCategories}
        />
      )}
      keyExtractor={(item) => item._id.toString()}
      showsVerticalScrollIndicator={false}
      onEndReached={() => {
        if (!transactionsLoadingMore && transactionsPage < transactionsTotalPages) {
          fetchTransactions(transactionsPage + 1);
        }
      }}
      onEndReachedThreshold={0.1}
    />
  );

  const renderBudgetHistory = () => (
    <FlatList
      contentContainerStyle={{ flexGrow: 1 }}
      ListHeaderComponent={
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {t("history.budgets.title", { defaultValue: "Budgets" })}
            </Text>
            <View style={styles.headerButton}>
              <TouchableOpacity onPress={() => setIsFilterVisible(true)}>
                <Ionicons
                  name="options-outline"
                  size={24}
                  style={styles.optionsIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.info}>
            <Ionicons
              name="information-circle"
              size={16}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              {t("history.budgets.longPressInfo", {
                defaultValue: "Long press a budget to delete it.",
              })}
            </Text>
          </View>
        </>
      }
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={budgetsRefreshing} onRefresh={onRefreshBudgets} />
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons
              name="calendar-outline"
              size={60}
              color={colors.textMuted}
            />
            <Text style={styles.emptyText}>
              {t("history.budgets.empty", {
                defaultValue: "No budgets found",
              })}
            </Text>
          </View>
        </View>
      }
      ListFooterComponent={
        budgetsLoadingMore ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : budgets.length > 0 ? (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t("history.budgets.footer", {
                defaultValue: "End of budgets history",
              })}
            </Text>
          </View>
        ) : null
      }
      data={budgets}
      renderItem={({ item }) => (
        <SingleBudget 
          budget={item} 
          onDelete={handleDeleteBudget}
          userCategories={userCategories}
        />
      )}
      keyExtractor={(item) => item._id.toString()}
      showsVerticalScrollIndicator={false}
      onEndReached={() => {
        if (!budgetsLoadingMore && budgetsPage < budgetsTotalPages) {
          fetchBudgets(budgetsPage + 1);
        }
      }}
      onEndReachedThreshold={0.1}
    />
  );

  return (
    <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
      <View style={styles.content}>
        <View style={styles.controlsContainer}>
        <TouchableOpacity
            style={[
              styles.controls,
              activeScreen === "transactions" && {
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setActiveScreen("transactions")}
          >
            <Ionicons
              name={
                activeScreen === "transactions"
                  ? "wallet"
                  : "wallet-outline"
              }
              size={24}
              style={styles.controlsIcon}
              color={
                activeScreen === "transactions"
                  ? colors.primary
                  : colors.textMuted
              }
            />
            <Text
              style={[
                styles.controlsTitle,
                activeScreen === "transactions" && { color: colors.primary },
              ]}
            >
              {t("history.controls.transactions", {
                defaultValue: "Transactions",
              })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.controls,
              activeScreen === "budgets" && {
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setActiveScreen("budgets")}
          >
            <Ionicons
              name={
                activeScreen === "budgets"
                  ? "calendar"
                  : "calendar-outline"
              }
              size={24}
              style={styles.controlsIcon}
              color={
                activeScreen === "budgets"
                  ? colors.primary
                  : colors.textMuted
              }
            />
            <Text
              style={[
                styles.controlsTitle,
                activeScreen === "budgets" && { color: colors.primary },
              ]}
            >
              {t("history.controls.budgets", {
                defaultValue: "Budgets",
              })}
            </Text>
          </TouchableOpacity>
        </View>

        {(activeScreen === "transactions" && transactionsLoading) || (activeScreen === "budgets" && budgetsLoading) 
          ? renderLoading() 
          : activeScreen === "transactions" 
            ? renderTransactionHistory() 
            : renderBudgetHistory()}

      </View>
      {/* Filter Modal */}
      <Modal visible={isFilterVisible} transparent animationType="fade" onRequestClose={() => setIsFilterVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setIsFilterVisible(false)}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
            <TouchableWithoutFeedback>
            <View style={{ width: "90%", maxWidth: 420, backgroundColor: colors.surface, borderRadius: 16, padding: 16 }}>
              <Text style={{ color: colors.text, fontSize: 18, marginBottom: 12 }}>
                {t("history.filters.title", { defaultValue: "Filter by date" })}
              </Text>
              <View style={{ gap: 12 }}>
                <TouchableOpacity onPress={() => setShowStartPicker(true)} style={{ padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 8, flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="calendar-outline" size={16} color={colors.textMuted} style={{ marginRight: 8 }} />
                  <Text style={{ color: colors.text }}>
                    {startDate
                      ? startDate.toDateString()
                      : t("history.filters.selectStartDate", {
                          defaultValue: "Select start date",
                        })}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEndPicker(true)} style={{ padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 8, flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textMuted} style={{ marginRight: 8 }} />
                  <Text style={{ color: colors.text }}>
                    {endDate
                      ? endDate.toDateString()
                      : t("history.filters.selectEndDate", {
                          defaultValue: "Select end date",
                        })}
                  </Text>
                </TouchableOpacity>
                <View style={{ flexDirection: "row", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setStartDate(null);
                      setEndDate(null);
                      setIsFilterVisible(false);
                      setTransactionsPage(1);
                      setBudgetsPage(1);
                    }}
                    style={{ paddingVertical: 10, paddingHorizontal: 14 }}
                  >
                    <Text style={{ color: colors.textMuted }}>
                      {t("common.clear", { defaultValue: "Clear" })}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setIsFilterVisible(false);
                      setTransactionsPage(1);
                      setBudgetsPage(1);
                    }}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      backgroundColor: colors.primary,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: colors.onPrimary }}>
                      {t("common.apply", { defaultValue: "Apply" })}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {showStartPicker && (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowStartPicker(false);
                    if (date) setStartDate(date);
                  }}
                  maximumDate={endDate || undefined}
                />
              )}
              {showEndPicker && (
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowEndPicker(false);
                    if (date) setEndDate(date);
                  }}
                  minimumDate={startDate || undefined}
                />
              )}
            </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </LinearGradient>
  );
};

export default Transactions;
