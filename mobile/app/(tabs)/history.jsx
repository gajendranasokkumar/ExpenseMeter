import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState, useCallback } from "react";
import useTheme from "../../hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import createHistoryStyles from "../../styles/history.styles";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";
import { useUser } from "../../context/userContext";
import { useFocusEffect } from "@react-navigation/native";
import SingleTransaction from "../../components/SingleTransaction";
import { TRANSACTION_ROUTES } from "../../constants/endPoints";
import { BUDGET_ROUTES } from "../../constants/endPoints";
import SingleBudget from "../../components/SingleBudget";

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
  const { user } = useUser();
  const userId = user?._id;

  const fetchTransactions = useCallback(
    async (pageToFetch = 1, isRefreshing = false) => {
      try {
        if (!userId) return;

        if (pageToFetch === 1 && !isRefreshing) setTransactionsLoading(true);
        else if (pageToFetch > 1) setTransactionsLoadingMore(true);

        const response = await api.get(
          `${TRANSACTION_ROUTES.GET_TRANSACTIONS_BY_USER_ID.replace(":id", userId)}?page=${pageToFetch}`
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
          "Error",
          error.response?.data?.message || "Something went wrong"
        );
      } finally {
        setTransactionsLoading(false);
        setTransactionsLoadingMore(false);
        setTransactionsRefreshing(false);
      }
    },
    [userId]
  );

  const fetchBudgets = useCallback(
    async (pageToFetch = 1, isRefreshing = false) => {
      try {
        if (!userId) return;

        if (pageToFetch === 1 && !isRefreshing) setBudgetsLoading(true);
        else if (pageToFetch > 1) setBudgetsLoadingMore(true);

        const response = await api.get(
          `${BUDGET_ROUTES.GET_BUDGETS_BY_USER_ID.replace(":id", userId)}?page=${pageToFetch}`
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
          "Error",
          error.response?.data?.message || "Something went wrong"
        );
      } finally {
        setBudgetsLoading(false);
        setBudgetsLoadingMore(false);
        setBudgetsRefreshing(false);
      }
    },
    [userId]
  );

  useFocusEffect(
    useCallback(() => {
      fetchTransactions(1);
      fetchBudgets(1);
    }, [fetchTransactions, fetchBudgets])
  );

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
        "Error",
        error.response?.data?.message || "Something went wrong"
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
        "Error",
        error.response?.data?.message || "Something went wrong"
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
            <Text style={styles.headerTitle}>Transactions</Text>
            <View style={styles.headerButton}>
              <TouchableOpacity>
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
              Long press a transaction to delete it.
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
            <Text style={styles.emptyText}>No transactions found</Text>
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
            <Text style={styles.footerText}>End of transactions history</Text>
          </View>
        ) : null
      }
      data={transactions}
      renderItem={({ item }) => (
        <SingleTransaction transaction={item} onDelete={handleDeleteTransaction} />
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
            <Text style={styles.headerTitle}>Budgets</Text>
            <View style={styles.headerButton}>
              <TouchableOpacity>
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
              Long press a budget to delete it.
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
            <Text style={styles.emptyText}>No budgets found</Text>
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
            <Text style={styles.footerText}>End of budgets history</Text>
          </View>
        ) : null
      }
      data={budgets}
      renderItem={({ item }) => (
        <SingleBudget budget={item} onDelete={handleDeleteBudget} />
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
              Transactions
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
              Budgets
            </Text>
          </TouchableOpacity>
        </View>

        {(activeScreen === "transactions" && transactionsLoading) || (activeScreen === "budgets" && budgetsLoading) 
          ? renderLoading() 
          : activeScreen === "transactions" 
            ? renderTransactionHistory() 
            : renderBudgetHistory()}

      </View>
    </LinearGradient>
  );
};

export default Transactions;
