import { View, Text, TouchableOpacity, Alert, ActivityIndicator, FlatList, RefreshControl, LayoutAnimation, Platform, UIManager } from "react-native";
import { Image } from "expo-image";
import React, { useState, useCallback } from "react";
import useTheme from "../../hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import createBanksStyles from "../../styles/banks.styles";
import CustomDropdown from "../../components/CustomDropdown";
import { Ionicons } from "@expo/vector-icons";
import { BANK_ROUTES } from "../../constants/endPoints";
import api from "../../utils/api";
import { useFocusEffect } from "@react-navigation/native";
import { defaultBanks, IfscCodes } from "../../constants/BankNamesAndIfsc";
import { useUser } from "../../context/userContext";

const Banks = () => {
  const { colors } = useTheme();
  const styles = createBanksStyles();
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedIfsc, setSelectedIfsc] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [banks, setBanks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const { user } = useUser();
  const userId = user?._id;
  

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!selectedBank || !selectedIfsc) {
        Alert.alert('Error', 'Please select a bank and IFSC code');
        return;
      }
      const response = await api.post(BANK_ROUTES.CREATE_BANK, {
        name: selectedBank.name,
        logo: selectedBank.logo,
        ifsc: selectedIfsc.ifsc,
        userId: userId,
      });
      Alert.alert('Success', 'Bank created successfully');
      getAllBanks();
      setSelectedBank(null);
      setSelectedIfsc(null);
    } catch (error) {
      Alert.alert('Error', error.response.data.message);
    } finally { 
      setIsSaving(false);
    }
  };

  const getAllBanks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.post(BANK_ROUTES.GET_ALL_BANKS, {
        userId: userId,
      });
      setBanks(response.data.data);
    } catch (error) {
      Alert.alert('Error', error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    getAllBanks();
  }, [getAllBanks]));

  const handleDelete = async (bankId) => {
    Alert.alert('Delete Bank', 'Are you sure you want to delete this bank?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDeleteBank(bankId) },
    ]);
  };

  const handleDeleteBank = async (bankId) => {
    try {
      await api.delete(BANK_ROUTES.PERMANENTLY_DELETE_BANK.replace(":id", bankId).replace(":userId", userId));
      getAllBanks();
    } catch (error) {
      Alert.alert('Error', error.response.data.message);
    }
  };

  if (Platform.OS === 'android') {
    const isFabric = typeof global !== 'undefined' && !!global.nativeFabricUIManager;
    if (!isFabric && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const [expandedIds, setExpandedIds] = useState(new Set());
  const toggleExpand = (bankId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(bankId)) {
        next.delete(bankId);
      } else {
        next.add(bankId);
      }
      return next;
    });
  };

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      {isLoading ? (
        <View style={[styles.carouselContainer, { width: "100%", height: "100%" }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          style={styles.content}
          // contentContainerStyle={styles.listContentContainer}
          data={banks}
          keyExtractor={(item) => item._id || item.id?.toString()}
          renderItem={({ item }) => {
            const bankId = item._id || item.id;
            const isExpanded = !!bankId && expandedIds.has(bankId);
            return (
              <TouchableOpacity activeOpacity={0.85} style={styles.bankListItem} >
                <View style={styles.bankCard}>
                  <View style={styles.bankLeft}>
                    {item.logo ? (
                      <Image source={{ uri: item.logo }} style={styles.carouselImage} />
                    ) : null}
                    <View style={styles.bankText}>
                      <Text style={styles.bankName}>{item.name}</Text>
                      {item.ifsc ? (
                        <View style={styles.ifscBadge}>
                          <Text style={styles.ifscBadgeText}>{item.ifsc}</Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                  <View style={styles.bankRight}>
                    <TouchableOpacity onPress={() => toggleExpand(bankId)}>
                      <View style={[styles.chevronWrap, isExpanded ? styles.chevronWrapExpanded : null]}>
                        <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                {isExpanded ? (
                  <View style={styles.expandedContainer}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Status</Text>
                      <Text style={styles.detailValue}>{item.isActive ? 'Active' : 'Inactive'}</Text>
                    </View>
                    {item.createdAt ? (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Created</Text>
                        <Text style={styles.detailValue}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                      </View>
                    ) : null}
                    {item.updatedAt ? (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Updated</Text>
                        <Text style={styles.detailValue}>{new Date(item.updatedAt).toLocaleDateString()}</Text>
                      </View>
                    ) : null}
                    <View style={styles.expandedActions}>
                      <TouchableOpacity onPress={() => handleDelete(bankId)} style={styles.deleteButton}>
                        <Ionicons name="trash" size={18} color={colors.surface} />
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={getAllBanks} />
          }
          ListHeaderComponent={() => (
            <>
            <View style={styles.header}>
              <Text style={styles.title}>Banks</Text>
            </View>
            <LinearGradient colors={colors.gradients.surface} style={[styles.section, { marginTop: 8 }]}> 
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownTitle}>Select Bank</Text>
              <CustomDropdown
                data={defaultBanks}
                onSelect={setSelectedBank}
                placeholder="Choose a bank"
                renderItem={(item) => (
                  <View style={styles.bankContainer}>
                    <Image source={{ uri: item.logo }} style={styles.bankLogo} />
                    <Text style={styles.bankName}>{item.name}</Text>
                  </View>
                )}
                selectedValue={selectedBank}
              />
            </View>
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownTitle}>Select IFSC Code</Text>
              <CustomDropdown
                data={IfscCodes}
                onSelect={setSelectedIfsc}
                placeholder="Choose an IFSC code"
                renderItem={(item) => (
                  <View style={styles.ifscContainer}>
                    <Text style={styles.ifscName}>{item.name}</Text>
                    <Text style={styles.ifsc}>{item.ifsc}</Text>
                  </View>
                )}
                selectedValue={selectedIfsc}
              />
            </View>
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
          </LinearGradient>
          </>
          )}
          ListEmptyComponent={() => (
            <View style={styles.carouselContainer}>
              <Text style={styles.emptyCarouselText}>No banks found</Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View style={styles.footer}>
              <Text style={styles.footerText}>End of banks</Text>
            </View>
          )}
        />
      )}
    </LinearGradient>
  );
};

export default Banks;
