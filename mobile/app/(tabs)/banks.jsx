import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Image } from "expo-image";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import useTheme from "../../hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import createBanksStyles from "../../styles/banks.styles";
import CustomDropdown from "../../components/CustomDropdown";
import { Ionicons } from "@expo/vector-icons";
import * as bankService from "../../services/bankService";
import * as transactionService from "../../services/transactionService";
import { useFocusEffect } from "@react-navigation/native";
import { getBankOptions, fetchIfscOptions } from "../../utils/ifscData";
import { getBankLogoSource, extractBankCode } from "../../utils/bankLogos";
import { useUser } from "../../context/userContext";
import useLanguage from "../../hooks/useLanguage";

const Banks = () => {
  const { colors } = useTheme();
  const styles = createBanksStyles();
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedIfsc, setSelectedIfsc] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [banks, setBanks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const bankOptions = useMemo(() => getBankOptions(), []);
  const [ifscOptions, setIfscOptions] = useState([]);
  const [isIfscLoading, setIsIfscLoading] = useState(false);
  const [ifscError, setIfscError] = useState(null);
  const [isSavingsAccount, setIsSavingsAccount] = useState(false);

  // Bank transfer section
  const [bankBalances, setBankBalances] = useState([]);
  const [transferFrom, setTransferFrom] = useState(null);
  const [transferTo, setTransferTo] = useState(null);
  const [transferAmount, setTransferAmount] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  const { t } = useLanguage();

  const { user } = useUser();
  const userId = user?._id;
  

  useEffect(() => {
    let isActive = true;

    const loadIfscOptions = async () => {
      if (!selectedBank?.code) {
        setIfscOptions([]);
        setSelectedIfsc(null);
        setIfscError(null);
        return;
      }

      setIsIfscLoading(true);
      setIfscError(null);
      try {
        const options = await fetchIfscOptions({ bankCode: selectedBank.code });
        if (isActive) {
          setIfscOptions(options);
          setSelectedIfsc(options.length === 1 ? options[0] : null);
        }
      } catch (error) {
        if (isActive) {
          setIfscOptions([]);
          setSelectedIfsc(null);
          const message =
            error?.message ||
            t("banks.alerts.ifscFetchError", {
              defaultValue: "Unable to load IFSC codes for this bank.",
            });
          setIfscError(message);
          Alert.alert(
            t("common.error", { defaultValue: "Error" }),
            message
          );
        }
      } finally {
        if (isActive) {
          setIsIfscLoading(false);
        }
      }
    };

    loadIfscOptions();

    return () => {
      isActive = false;
    };
  }, [selectedBank, t]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!selectedBank || !selectedIfsc) {
        Alert.alert(
          t("common.error", { defaultValue: "Error" }),
          t("banks.validation.bankAndIfsc", {
            defaultValue: "Please select a bank and IFSC code",
          })
        );
        return;
      }
      const response = await bankService.create({
        name: selectedBank.name,
        logo: "",
        ifsc: selectedIfsc.ifsc,
        userId: userId,
        isSavings: isSavingsAccount,
      });
      Alert.alert(
        t("common.success", { defaultValue: "Success" }),
        t("banks.alerts.createSuccess", {
          defaultValue: "Bank created successfully",
        })
      );
      getAllBanks();
      setSelectedBank(null);
      setSelectedIfsc(null);
      setIsSavingsAccount(false);
    } catch (error) {
      Alert.alert(
        t("common.error", { defaultValue: "Error" }),
        error?.response?.data?.message ??
          error?.message ??
          t("banks.alerts.createError", {
            defaultValue: "Unable to create bank.",
          })
      );
    } finally { 
      setIsSaving(false);
    }
  };

  const getAllBanks = useCallback(async () => {
    try {
      setIsLoading(true);
      const list = await bankService.getAll(userId);
      setBanks(list);
    } catch (error) {
      Alert.alert(
        t("common.error", { defaultValue: "Error" }),
        error?.response?.data?.message ??
          error?.message ??
          t("banks.alerts.fetchError", {
            defaultValue: "Unable to load banks.",
          })
      );
    } finally {
      setIsLoading(false);
    }
  }, [t, userId]);

  const fetchBankBalances = useCallback(async () => {
    if (!userId) return;
    try {
      const summary = await bankService.summary(userId);
      setBankBalances(summary || []);
    } catch (error) {
      setBankBalances([]);
    }
  }, [userId]);

  useFocusEffect(useCallback(() => {
    getAllBanks();
    fetchBankBalances();
  }, [getAllBanks, fetchBankBalances]));

  const handleTransfer = async () => {
    if (!transferFrom || !transferTo) {
      Alert.alert(
        t("common.error", { defaultValue: "Error" }),
        t("banks.transfer.validation.selectBanks", {
          defaultValue: "Please select both source and destination banks",
        })
      );
      return;
    }
    if ((transferFrom._id || transferFrom.id) === (transferTo._id || transferTo.id)) {
      Alert.alert(
        t("common.error", { defaultValue: "Error" }),
        t("banks.transfer.validation.sameBank", {
          defaultValue: "Source and destination banks must be different",
        })
      );
      return;
    }
    const amount = Number(transferAmount);
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      Alert.alert(
        t("common.error", { defaultValue: "Error" }),
        t("banks.transfer.validation.amount", {
          defaultValue: "Please enter a valid amount",
        })
      );
      return;
    }
    try {
      setIsTransferring(true);
      await transactionService.transfer({
        user_id: userId,
        fromBank: transferFrom._id || transferFrom.id,
        toBank: transferTo._id || transferTo.id,
        amount,
      });
      Alert.alert(
        t("common.success", { defaultValue: "Success" }),
        t("banks.transfer.alerts.success", {
          defaultValue: "Transfer completed successfully",
        })
      );
      setTransferFrom(null);
      setTransferTo(null);
      setTransferAmount("");
      getAllBanks();
      fetchBankBalances();
    } catch (error) {
      Alert.alert(
        t("common.error", { defaultValue: "Error" }),
        error?.response?.data?.message ??
          error?.message ??
          t("banks.transfer.alerts.error", {
            defaultValue: "Unable to complete the transfer.",
          })
      );
    } finally {
      setIsTransferring(false);
    }
  };

  const handleDelete = async (bankId) => {
    Alert.alert(
      t("banks.dialogs.delete.title", { defaultValue: "Delete Bank" }),
      t("banks.dialogs.delete.message", {
        defaultValue: "Are you sure you want to delete this bank?",
      }),
      [
        {
          text: t("common.cancel", { defaultValue: "Cancel" }),
          style: "cancel",
        },
        {
          text: t("common.delete", { defaultValue: "Delete" }),
          style: "destructive",
          onPress: () => handleDeleteBank(bankId),
        },
      ]
    );
  };

  const handleDeleteBank = async (bankId) => {
    try {
      await bankService.removePermanent(bankId, userId);
      getAllBanks();
    } catch (error) {
      Alert.alert(
        t("common.error", { defaultValue: "Error" }),
        error?.response?.data?.message ??
          error?.message ??
          t("banks.alerts.deleteError", {
            defaultValue: "Unable to delete bank.",
          })
      );
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

  const isIfscDropdownDisabled = !selectedBank || isIfscLoading;

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
                    <Image
                      source={getBankLogoSource(extractBankCode(item))}
                      style={styles.carouselImage}
                    />
                    <View style={styles.bankText}>
                      <Text style={styles.bankName}>
                        {item.name}
                      </Text>
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
                      <Text style={styles.detailLabel}>
                        {t("banks.details.status.label", {
                          defaultValue: "Status",
                        })}
                      </Text>
                      <Text style={styles.detailValue}>
                        {item.isActive
                          ? t("banks.details.status.active", {
                              defaultValue: "Active",
                            })
                          : t("banks.details.status.inactive", {
                              defaultValue: "Inactive",
                            })}
                      </Text>
                    </View>
                    {item.createdAt ? (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          {t("banks.details.created", {
                            defaultValue: "Created",
                          })}
                        </Text>
                        <Text style={styles.detailValue}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                      </View>
                    ) : null}
                    {item.updatedAt ? (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          {t("banks.details.updated", {
                            defaultValue: "Updated",
                          })}
                        </Text>
                        <Text style={styles.detailValue}>{new Date(item.updatedAt).toLocaleDateString()}</Text>
                      </View>
                    ) : null}
                    <View style={styles.expandedActions}>
                      <TouchableOpacity onPress={() => handleDelete(bankId)} style={styles.deleteButton}>
                        <Ionicons name="trash" size={18} color={colors.surface} />
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
            <RefreshControl refreshing={isLoading} onRefresh={getAllBanks} />
          }
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={(
            <>
            <View style={styles.header}>
              <Text style={styles.title}>
                {t("banks.title", { defaultValue: "Banks" })}
              </Text>
            </View>
            <LinearGradient colors={colors.gradients.surface} style={[styles.section, { marginTop: 8 }]}> 
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownTitle}>
                {t("banks.form.selectBank", {
                  defaultValue: "Select Bank",
                })}
              </Text>
              <CustomDropdown
                data={bankOptions}
                onSelect={setSelectedBank}
                placeholder={t("banks.form.selectBankPlaceholder", {
                  defaultValue: "Choose a bank",
                })}
                renderItem={(item) => (
                  <View style={styles.bankContainer}>
                    <Image
                      source={getBankLogoSource(extractBankCode(item))}
                      style={styles.bankLogo}
                    />
                    <Text style={styles.bankName}>{item.name}</Text>
                  </View>
                )}
                selectedValue={selectedBank}
              />
            </View>
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownTitle}>
                {t("banks.form.selectIfsc", {
                  defaultValue: "Select IFSC Code",
                })}
              </Text>
              <View
                style={[
                  styles.dropdownDisabledWrapper,
                  isIfscDropdownDisabled ? styles.dropdownDisabled : null,
                ]}
                pointerEvents={isIfscDropdownDisabled ? "none" : "auto"}
              >
                <CustomDropdown
                  data={ifscOptions}
                  onSelect={setSelectedIfsc}
                  placeholder={
                    !selectedBank
                      ? t("banks.form.selectBankFirst", {
                          defaultValue: "Choose a bank first",
                        })
                      : isIfscLoading
                      ? t("banks.form.loadingIfsc", {
                          defaultValue: "Loading IFSC options...",
                        })
                      : t("banks.form.selectIfscPlaceholder", {
                          defaultValue: "Choose an IFSC code",
                        })
                  }
                  renderItem={(item) => (
                    <View style={styles.ifscContainer}>
                      <Text style={styles.ifscName}>{item.name}</Text>
                      <Text style={styles.ifsc}>{item.ifsc}</Text>
                    </View>
                  )}
                  selectedValue={selectedIfsc}
                />
              </View>
              {isIfscLoading ? (
                <View style={styles.helperRow}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.helperText}>
                    {t("banks.form.loadingIfsc", {
                      defaultValue: "Fetching IFSC codes...",
                    })}
                  </Text>
                </View>
              ) : null}
              {!isIfscLoading && ifscError ? (
                <Text style={[styles.helperText, styles.helperTextError]}>
                  {ifscError}
                </Text>
              ) : null}
            </View>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIsSavingsAccount((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isSavingsAccount ? "checkbox" : "square-outline"}
                size={24}
                color={isSavingsAccount ? colors.primary : colors.textMuted}
              />
              <Text style={styles.checkboxLabel}>
                {t("banks.form.savingsAccount", {
                  defaultValue: "This is a savings account",
                })}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <ActivityIndicator size="small" color={colors.surface} />
                  <Text style={styles.saveButtonText}>
                    {t("banks.actions.saving", { defaultValue: "Saving..." })}
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
          </LinearGradient>

          {bankBalances.length >= 2 ? (
            <LinearGradient colors={colors.gradients.surface} style={styles.section}>
              <View style={styles.header}>
                <Text style={styles.title}>
                  {t("banks.transfer.title", { defaultValue: "Bank Transfer" })}
                </Text>
                <Text style={styles.helperText}>
                  {t("banks.transfer.subtitle", {
                    defaultValue:
                      "Move money between your banks. Balances update automatically.",
                  })}
                </Text>
              </View>

              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownTitle}>
                  {t("banks.transfer.from", { defaultValue: "From" })}
                </Text>
                <CustomDropdown
                  data={bankBalances}
                  onSelect={setTransferFrom}
                  placeholder={t("banks.transfer.selectSource", {
                    defaultValue: "Select source bank",
                  })}
                  selectedValue={transferFrom}
                  isItemDisabled={(item) =>
                    (item._id || item.id) === (transferTo?._id || transferTo?.id)
                  }
                  renderItem={(item) => (
                    <View style={styles.ifscContainer}>
                      <Text style={styles.ifscName}>{item.name}</Text>
                      <Text style={styles.ifsc}>
                        {Number(item.availableBalance || 0).toLocaleString()}
                      </Text>
                    </View>
                  )}
                />
              </View>

              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownTitle}>
                  {t("banks.transfer.to", { defaultValue: "To" })}
                </Text>
                <CustomDropdown
                  data={bankBalances}
                  onSelect={setTransferTo}
                  placeholder={t("banks.transfer.selectDestination", {
                    defaultValue: "Select destination bank",
                  })}
                  selectedValue={transferTo}
                  isItemDisabled={(item) =>
                    (item._id || item.id) === (transferFrom?._id || transferFrom?.id)
                  }
                  renderItem={(item) => (
                    <View style={styles.ifscContainer}>
                      <Text style={styles.ifscName}>{item.name}</Text>
                      <Text style={styles.ifsc}>
                        {Number(item.availableBalance || 0).toLocaleString()}
                      </Text>
                    </View>
                  )}
                />
              </View>

              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownTitle}>
                  {t("banks.transfer.amount", { defaultValue: "Amount" })}
                </Text>
                <TextInput
                  style={styles.transferInput}
                  value={transferAmount}
                  onChangeText={setTransferAmount}
                  keyboardType="numeric"
                  placeholder={t("banks.transfer.amountPlaceholder", {
                    defaultValue: "Enter amount",
                  })}
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleTransfer}
                disabled={isTransferring}
              >
                {isTransferring ? (
                  <>
                    <ActivityIndicator size="small" color={colors.surface} />
                    <Text style={styles.saveButtonText}>
                      {t("banks.transfer.processing", {
                        defaultValue: "Transferring...",
                      })}
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="swap-horizontal" size={24} color={colors.surface} />
                    <Text style={styles.saveButtonText}>
                      {t("banks.transfer.action", { defaultValue: "Transfer" })}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </LinearGradient>
          ) : null}
          </>
          )}
          ListEmptyComponent={() => (
            <View style={styles.carouselContainer}>
              <Text style={styles.emptyCarouselText}>
                {t("banks.empty", { defaultValue: "No banks found" })}
              </Text>
            </View>
          )}
          ListFooterComponent={(
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {t("banks.footer", { defaultValue: "End of banks" })}
              </Text>
            </View>
          )}
        />
      )}
    </LinearGradient>
  );
};

export default Banks;
