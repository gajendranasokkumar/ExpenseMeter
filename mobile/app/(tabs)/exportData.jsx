import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as XLSX from "xlsx";
import useTheme from "../../hooks/useTheme";
import useLanguage from "../../hooks/useLanguage";
import createExportDataStyles from "../../styles/exportData.styles";
import api from "../../utils/api";
import { EXPORT_ROUTES } from "../../constants/endPoints";
import { useUser } from "../../context/userContext";

const formatDateTime = (value, fallback = "--") => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const ensureDirectoryAsync = async (dir) => {
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
};

const ExportData = () => {
  const { colors } = useTheme();
  const styles = createExportDataStyles();
  const { t } = useLanguage();
  const { user } = useUser();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [latestFile, setLatestFile] = useState(null);
  const [exportSummary, setExportSummary] = useState(null);

  const counts = exportSummary?.counts ?? {};
  const summaryTotals = exportSummary?.summary ?? {};

  const formattedCounts = useMemo(
    () => [
      { label: t("exportData.counts.transactions"), value: counts.transactions },
      { label: t("exportData.counts.budgets"), value: counts.budgets },
      { label: t("exportData.counts.banks"), value: counts.banks },
      { label: t("exportData.counts.categories"), value: counts.categories },
    ],
    [
      counts.banks,
      counts.budgets,
      counts.categories,
      counts.transactions,
      t,
    ]
  );

  const buildWorkbook = useCallback((payload) => {
    const workbook = XLSX.utils.book_new();

    const profileSheet = XLSX.utils.aoa_to_sheet([
      ["Field", "Value"],
      ["Name", payload.user?.name || ""],
      ["Email", payload.user?.email || ""],
      ["User ID", payload.user?.id || payload.user?._id || ""],
      [
        "Export generated",
        formatDateTime(payload.generatedAt),
      ],
    ]);
    XLSX.utils.book_append_sheet(workbook, profileSheet, "Profile");

    const transactionsSheetData =
      payload.transactions?.length > 0
        ? payload.transactions.map((tx) => ({
            Title: tx.title,
            Amount: tx.amount,
            Category: tx.category?.name || tx.category?.id || "",
            Bank: tx.bank?.name || "",
            Date: formatDateTime(tx.date, tx.date),
          }))
        : [{ Message: "No transactions available" }];
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(transactionsSheetData),
      "Transactions"
    );

    const budgetsSheetData =
      payload.budgets?.length > 0
        ? payload.budgets.map((budget) => ({
            Title: budget.title,
            Amount: budget.amount,
            Spent: budget.spent ?? 0,
            Remaining:
              typeof budget.amount === "number" && typeof budget.spent === "number"
                ? budget.amount - budget.spent
                : "",
            Period: budget.period,
            Category: budget.category_ref?.name || budget.category,
            "Start date": formatDateTime(budget.start_date, budget.start_date),
            "End date": formatDateTime(budget.end_date, budget.end_date),
            "Transactions in period": budget.period_transactions?.length ?? 0,
          }))
        : [{ Message: "No budgets available" }];
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(budgetsSheetData),
      "Budgets"
    );

    const budgetDetailsSheetData =
      payload.budgets?.length > 0
        ? payload.budgets.flatMap((budget) => {
            const periodLabel = `${formatDateTime(
              budget.start_date,
              budget.start_date
            )} → ${formatDateTime(budget.end_date, budget.end_date)}`;
            if (!budget.period_transactions?.length) {
              return [
                {
                  Budget: budget.title,
                  Period: periodLabel,
                  Transaction: "No transactions in this period",
                  Amount: 0,
                  Date: "",
                  Bank: "",
                },
              ];
            }
            return budget.period_transactions.map((tx) => ({
              Budget: budget.title,
              Period: periodLabel,
              Transaction: tx.title,
              Amount: typeof tx.amount === "number" ? Math.abs(tx.amount) : tx.amount,
              Date: formatDateTime(tx.date, tx.date),
              Bank: tx.bank?.name || "",
            }));
          })
        : [{ Message: "No budget data available" }];
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(budgetDetailsSheetData),
      "Budget details"
    );

    const banksSheetData =
      payload.banks?.length > 0
        ? payload.banks.map((bank) => ({
            Name: bank.name,
            IFSC: bank.ifsc,
            Active: bank.isActive ? "Yes" : "No",
            "Created at": formatDateTime(bank.createdAt, bank.createdAt),
          }))
        : [{ Message: "No banks available" }];
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(banksSheetData),
      "Banks"
    );

    const categoriesSheetData =
      payload.categories?.length > 0
        ? payload.categories.map((category) => ({
            Name: category.name,
            Icon: category.icon,
            Color: category.color,
            Active: category.isActive ? "Yes" : "No",
          }))
        : [{ Message: "No categories available" }];
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(categoriesSheetData),
      "Categories"
    );

    const summarySheet = XLSX.utils.aoa_to_sheet([
      ["Metric", "Value"],
      ["Balance", payload.summary?.balance ?? 0],
      ["Income", payload.summary?.income ?? 0],
      ["Expenses", payload.summary?.expenses ?? 0],
      [
        "Top income year",
        payload.stats?.bestIncomeYear
          ? `${payload.stats.bestIncomeYear.year} (${payload.stats.bestIncomeYear.income})`
          : "N/A",
      ],
      [
        "Highest expense year",
        payload.stats?.highestExpenseYear
          ? `${payload.stats.highestExpenseYear.year} (${payload.stats.highestExpenseYear.expense})`
          : "N/A",
      ],
    ]);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

    return workbook;
  }, []);

  const saveWorkbookAsync = useCallback(async (workbook) => {
    const dir = `${FileSystem.documentDirectory || FileSystem.cacheDirectory}exports/`;
    await ensureDirectoryAsync(dir);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `expense-meter-export-${timestamp}.xlsx`;
    const fileUri = `${dir}${fileName}`;
    const wbout = XLSX.write(workbook, {
      type: "base64",
      bookType: "xlsx",
    });
    await FileSystem.writeAsStringAsync(fileUri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    return { uri: fileUri, size: fileInfo.size ?? 0 };
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!user?._id) {
      Alert.alert(t("common.error"), t("exportData.alerts.missingUser"));
      return;
    }
    try {
      setIsGenerating(true);
      const route = EXPORT_ROUTES.USER_EXPORT.replace(":id", user._id);
      const response = await api.get(route);
      const payload = response.data;
      const workbook = buildWorkbook(payload);
      const fileInfo = await saveWorkbookAsync(workbook);
      setLatestFile({
        ...fileInfo,
        generatedAt: payload.generatedAt,
      });
      setExportSummary({
        counts: payload.counts,
        summary: payload.summary,
      });
      Alert.alert(
        t("exportData.alerts.successTitle"),
        t("exportData.alerts.successBody")
      );
    } catch (error) {
      console.error("EXPORT_ERROR", error);
      Alert.alert(
        t("common.error"),
        t("exportData.alerts.fetchError")
      );
    } finally {
      setIsGenerating(false);
    }
  }, [buildWorkbook, saveWorkbookAsync, t, user]);

  const handleShare = useCallback(async () => {
    if (!latestFile?.uri) {
      Alert.alert(t("common.warning"), t("exportData.alerts.fileMissing"));
      return;
    }
    try {
      setIsSharing(true);
      const formattedDate = formatDateTime(
        latestFile.generatedAt,
        new Date().toISOString()
      );
      const template = t("exportData.share.message");
      const message = template?.includes("{date}")
        ? template.replace("{date}", formattedDate)
        : `${template} ${formattedDate}`;

      const mimeType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(latestFile.uri, {
          mimeType,
          dialogTitle: t("exportData.actions.shareDialogTitle"),
        });
      } else {
        let shareUrl = latestFile.uri;
        if (Platform.OS === "android") {
          try {
            shareUrl = await FileSystem.getContentUriAsync(latestFile.uri);
          } catch (uriError) {
            console.warn("EXPORT_SHARE_URI_ERROR", uriError);
          }
        }
        await Share.share(
          {
            url: shareUrl,
            message,
            title: t("exportData.actions.shareDialogTitle"),
          },
          {
            subject: t("exportData.actions.shareDialogTitle"),
          }
        );
      }
    } catch (error) {
      console.error("EXPORT_SHARE_ERROR", error);
      Alert.alert(
        t("common.error"),
        error.message || t("exportData.alerts.whatsappMissing")
      );
    } finally {
      setIsSharing(false);
    }
  }, [latestFile, t]);

  const handleSaveToDevice = useCallback(async () => {
    if (!latestFile?.uri) {
      Alert.alert(t("common.warning"), t("exportData.alerts.fileMissing"));
      return;
    }

    if (Platform.OS !== "android") {
      try {
        setIsSaving(true);
        await Share.share({
          url: latestFile.uri,
          title: t("exportData.actions.shareDialogTitle"),
        });
        Alert.alert(
          t("exportData.alerts.saveSuccessTitle"),
          t("exportData.alerts.saveSuccessBody")
        );
      } catch (error) {
        console.error("EXPORT_SAVE_IOS_ERROR", error);
        Alert.alert(t("common.error"), t("exportData.alerts.saveError"));
      } finally {
        setIsSaving(false);
      }
      return;
    }

    try {
      setIsSaving(true);
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        setIsSaving(false);
        Alert.alert(
          t("common.warning"),
          t("exportData.alerts.saveDenied")
        );
        return;
      }

      const mimeType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const base64 = await FileSystem.readAsStringAsync(latestFile.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const fallbackName = `expense-meter-export-${Date.now()}.xlsx`;
      const fileName =
        latestFile.uri?.split("/").pop() || fallbackName;

      const externalUri =
        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          mimeType
        );

      await FileSystem.writeAsStringAsync(externalUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert(
        t("exportData.alerts.saveSuccessTitle"),
        t("exportData.alerts.saveSuccessBody")
      );
    } catch (error) {
      console.error("EXPORT_SAVE_ERROR", error);
      Alert.alert(t("common.error"), t("exportData.alerts.saveError"));
    } finally {
      setIsSaving(false);
    }
  }, [latestFile, t]);

  const fileSizeLabel = useMemo(() => {
    if (!latestFile?.size) return "--";
    const sizeInMb = latestFile.size / (1024 * 1024);
    if (sizeInMb < 1) {
      return `${(latestFile.size / 1024).toFixed(1)} KB`;
    }
    return `${sizeInMb.toFixed(2)} MB`;
  }, [latestFile]);

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{t("exportData.title")}</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <Text style={styles.description}>{t("exportData.description")}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>
            {t("exportData.meta.lastGenerated")}
          </Text>
          <Text style={styles.metaValue}>
            {formatDateTime(
              latestFile?.generatedAt,
              t("exportData.meta.never")
            )}
          </Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.statLabel}>
                {t("exportData.meta.fileSize")}
              </Text>
              <Text style={styles.statValue}>{fileSizeLabel}</Text>
            </View>
            <View>
              <Text style={styles.statLabel}>
                {t("exportData.summary.balance")}
              </Text>
              <Text style={styles.statValue}>
                {summaryTotals.balance ?? "--"}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View>
              <Text style={styles.statLabel}>
                {t("exportData.summary.income")}
              </Text>
              <Text style={styles.statValue}>
                {summaryTotals.income ?? "--"}
              </Text>
            </View>
            <View>
              <Text style={styles.statLabel}>
                {t("exportData.summary.expense")}
              </Text>
              <Text style={styles.statValue}>
                {summaryTotals.expenses ?? summaryTotals.expense ?? "--"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleGenerate}
            disabled={isGenerating}
            activeOpacity={0.8}
          >
            {isGenerating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons name="download-outline" size={20} color="#fff" />
            )}
            <Text style={styles.buttonText}>
              {isGenerating
                ? t("exportData.actions.generating")
                : t("exportData.actions.download")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleSaveToDevice}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Ionicons
                name="folder-outline"
                size={20}
                color={colors.primary}
              />
            )}
            <Text
              style={[
                styles.buttonText,
                styles.secondaryButtonText,
              ]}
            >
              {isSaving
                ? t("exportData.actions.savingToDevice")
                : t("exportData.actions.saveToDevice")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: "#25D366" },
            ]}
            onPress={handleShare}
            disabled={isSharing}
            activeOpacity={0.85}
          >
            {isSharing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons name="logo-whatsapp" size={20} color="#fff" />
            )}
            <Text style={styles.buttonText}>
              {isSharing
                ? t("exportData.actions.sharing")
                : t("exportData.actions.share")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>
            {t("exportData.meta.recordCounts")}
          </Text>
          {formattedCounts.map((item) => (
            <View key={item.label} style={styles.row}>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={styles.statValue}>
                {item.value ?? 0}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </LinearGradient>
  );
};

export default ExportData;


