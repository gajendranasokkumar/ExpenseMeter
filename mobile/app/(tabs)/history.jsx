import { 
  View, 
  Text, 
  FlatList, 
  RefreshControl, 
  Alert, 
  ActivityIndicator, 
  TouchableOpacity
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

const Transactions = () => {
  const { colors } = useTheme();
  const styles = createHistoryStyles();
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { user } = useUser();
  const userId = user?._id;

  const fetchTransactions = useCallback(
    async (pageToFetch = 1, isRefreshing = false) => {
      try {
        if (!userId) return;

        if (pageToFetch === 1 && !isRefreshing) setLoading(true);
        else if (pageToFetch > 1) setLoadingMore(true);

        const response = await api.get(
          `/transactions/user/${userId}?page=${pageToFetch}`
        );

        const items = response.data.items || [];

        if (isRefreshing || pageToFetch === 1) {
          setTransactions(items);
        } else {
          setTransactions((prev) => [...prev, ...items]);
        }

        setPage(response.data.page);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        Alert.alert("Error", error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [userId]
  );

  useFocusEffect(
    useCallback(() => {
      fetchTransactions(1);
    }, [fetchTransactions])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions(1, true);
  };

  const handleDelete = async (transactionId) => {
    try {
      await api.delete(`/transactions/${transactionId}`);
      fetchTransactions(1); // refresh after delete
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
      <View style={styles.content}>
        {loading && transactions.length === 0 ? (
          // Initial loading indicator
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            ListHeaderComponent={
              <> 
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Transactions</Text>
                <View style={styles.headerButton}>
                  <TouchableOpacity>
                    <Ionicons name="options-outline" size={24} style={styles.optionsIcon} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.info}>
                <Ionicons name="information-circle" size={16} style={styles.infoIcon} />
                <Text style={styles.infoText}>
                Long press a transaction to delete it.
                </Text>
              </View>
              </>
            }
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
              loadingMore ? (
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
              <SingleTransaction transaction={item} onDelete={handleDelete} />
            )}
            keyExtractor={(item) => item._id.toString()}
            showsVerticalScrollIndicator={false}
            onEndReached={() => {
              if (!loadingMore && page < totalPages) {
                fetchTransactions(page + 1);
              }
            }}
            onEndReachedThreshold={0.1}
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default Transactions;
