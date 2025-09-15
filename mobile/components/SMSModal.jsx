import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';

const { width, height } = Dimensions.get('window');

const SMSModal = ({ visible, onClose, smsData }) => {
  const { colors } = useTheme();

  // Parse SMS data to extract transaction details
  const parseSMSTransaction = (message) => {
    if (!message) return null;

    const lowerMessage = message.toLowerCase();
    
    // Extract amount using regex patterns
    const amountPatterns = [
      /(?:rs\.?|inr)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
      /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:rs\.?|inr)/i,
      /(\d+(?:,\d{3})*(?:\.\d{2})?)/i
    ];

    let amount = null;
    for (const pattern of amountPatterns) {
      const match = message.match(pattern);
      if (match) {
        amount = match[1].replace(/,/g, '');
        break;
      }
    }

    // Determine transaction type
    const isDebit = lowerMessage.includes('debited') || lowerMessage.includes('debit');
    const isCredit = lowerMessage.includes('credited') || lowerMessage.includes('credit');
    
    // Extract bank name (common patterns)
    const bankPatterns = [
      /(?:from|to)\s+([a-z\s]+?)(?:\s+account|\s+card|\s+upi|\s+wallet)/i,
      /([a-z\s]+?)\s+(?:bank|card|account)/i
    ];

    let bankName = null;
    for (const pattern of bankPatterns) {
      const match = message.match(pattern);
      if (match) {
        bankName = match[1].trim();
        break;
      }
    }

    // Extract account/card number (masked)
    const accountPattern = /(\*{4,}|\d{4,})/;
    const accountMatch = message.match(accountPattern);
    const accountNumber = accountMatch ? accountMatch[1] : null;

    // Extract UPI ID
    const upiPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+)/;
    const upiMatch = message.match(upiPattern);
    const upiId = upiMatch ? upiMatch[1] : null;

    return {
      amount,
      type: isDebit ? 'Debit' : isCredit ? 'Credit' : 'Unknown',
      bankName,
      accountNumber,
      upiId,
      originalMessage: message
    };
  };

  const transactionData = parseSMSTransaction(smsData);

  const formatAmount = (amount) => {
    if (!amount) return 'N/A';
    const numAmount = parseFloat(amount);
    return `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'Debit':
        return 'arrow-down-circle';
      case 'Credit':
        return 'arrow-up-circle';
      default:
        return 'help-circle';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'Debit':
        return '#FF6B6B';
      case 'Credit':
        return '#4ECDC4';
      default:
        return colors.textMuted;
    }
  };

  const styles = {
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modal: {
      width: Math.min(width - 40, 400),
      maxHeight: height * 0.8,
      backgroundColor: colors.surface,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 15,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    closeButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.bg,
    },
    content: {
      padding: 20,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.bg,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    infoLabel: {
      fontSize: 14,
      color: colors.textMuted,
      fontWeight: '500',
    },
    infoValue: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'right',
    },
    messageContainer: {
      backgroundColor: colors.bg,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    messageText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 16,
      color: colors.textMuted,
      textAlign: 'center',
      fontWeight: '500',
      marginTop: 12,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: 8,
    },
    footer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    closeBtn: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
    },
    closeBtnText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modal}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={24}
                    color={colors.primary}
                  />
                  <Text style={styles.headerTitle}>
                    Transaction Details
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                >
                  <Ionicons
                    name="close"
                    size={20}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {transactionData && smsData ? (
                  <>
                    {/* Transaction Details */}
                    <View style={styles.section}>
                      <View style={styles.infoRow}>
                        <View style={styles.infoLeft}>
                          <Ionicons
                            name={getTransactionIcon(transactionData.type)}
                            size={20}
                            color={getTransactionColor(transactionData.type)}
                          />
                          <Text style={styles.infoLabel}>Type</Text>
                        </View>
                        <Text style={[
                          styles.infoValue,
                          { color: getTransactionColor(transactionData.type) }
                        ]}>
                          {transactionData.type}
                        </Text>
                      </View>

                      <View style={styles.infoRow}>
                        <View style={styles.infoLeft}>
                          <Ionicons
                            name="cash-outline"
                            size={20}
                            color={colors.primary}
                          />
                          <Text style={styles.infoLabel}>Amount</Text>
                        </View>
                        <Text style={[
                          styles.infoValue,
                          { color: colors.primary, fontWeight: 'bold' }
                        ]}>
                          {formatAmount(transactionData.amount)}
                        </Text>
                      </View>

                      {transactionData.bankName && (
                        <View style={styles.infoRow}>
                          <View style={styles.infoLeft}>
                            <Ionicons
                              name="business-outline"
                              size={20}
                              color={colors.textMuted}
                            />
                            <Text style={styles.infoLabel}>Bank</Text>
                          </View>
                          <Text style={styles.infoValue}>
                            {transactionData.bankName}
                          </Text>
                        </View>
                      )}

                      {transactionData.accountNumber && (
                        <View style={styles.infoRow}>
                          <View style={styles.infoLeft}>
                            <Ionicons
                              name="card-outline"
                              size={20}
                              color={colors.textMuted}
                            />
                            <Text style={styles.infoLabel}>Account</Text>
                          </View>
                          <Text style={styles.infoValue}>
                            {transactionData.accountNumber}
                          </Text>
                        </View>
                      )}

                      {transactionData.upiId && (
                        <View style={styles.infoRow}>
                          <View style={styles.infoLeft}>
                            <Ionicons
                              name="phone-portrait-outline"
                              size={20}
                              color={colors.textMuted}
                            />
                            <Text style={styles.infoLabel}>UPI ID</Text>
                          </View>
                          <Text style={styles.infoValue}>
                            {transactionData.upiId}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Original SMS */}
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Original SMS</Text>
                      <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>
                          {transactionData.originalMessage}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Ionicons
                      name="warning-outline"
                      size={48}
                      color={colors.textMuted}
                    />
                    <Text style={styles.emptyText}>
                      Unable to parse SMS details
                    </Text>
                    <Text style={styles.emptySubtext}>
                      The SMS format might not be recognized
                    </Text>
                  </View>
                )}
              </ScrollView>

              {/* Footer */}
              <View style={styles.footer}>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeBtn}
                >
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SMSModal;
