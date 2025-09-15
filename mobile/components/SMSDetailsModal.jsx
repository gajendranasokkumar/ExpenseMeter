import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';
import createSmsDetailsModalStyles from '../styles/smsDetailsModal.styles';

const SMSDetailsModal = ({ visible, onClose, smsData }) => {
  const styles = createSmsDetailsModalStyles();
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
        return colors.danger;
      case 'Credit':
        return colors.success;
      default:
        return colors.textMuted;
    }
  };

  const hasContent = !!(transactionData && smsData);

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalCenterOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.smsDetailsModal}>
              <View style={styles.smsDetailsModalContent}>
                {/* Header */}
                <View style={styles.smsDetailsModalHeader}>
                  <View style={styles.smsDetailsModalHeaderLeft}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={24}
                      color={colors.primary}
                    />
                    <Text style={styles.smsDetailsModalHeaderTitle}>
                      SMS Transaction Details
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.smsDetailsModalHeaderClose}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.smsDetailsModalBody} showsVerticalScrollIndicator={false}>
                  {hasContent ? (
                    <>
                      {/* Transaction Type and Amount */}
                      <View style={styles.smsDetailsSection}>
                        <View style={styles.smsDetailsRow}>
                          <View style={styles.smsDetailsRowLeft}>
                            <Ionicons
                              name={getTransactionIcon(transactionData.type)}
                              size={20}
                              color={getTransactionColor(transactionData.type)}
                            />
                            <Text style={styles.smsDetailsRowLabel}>Transaction Type</Text>
                          </View>
                          <Text style={[
                            styles.smsDetailsRowValue,
                            { color: getTransactionColor(transactionData.type) }
                          ]}>
                            {transactionData.type}
                          </Text>
                        </View>

                        <View style={styles.smsDetailsRow}>
                          <View style={styles.smsDetailsRowLeft}>
                            <Ionicons
                              name="cash-outline"
                              size={20}
                              color={colors.primary}
                            />
                            <Text style={styles.smsDetailsRowLabel}>Amount</Text>
                          </View>
                          <Text style={[styles.smsDetailsRowValue, { color: colors.primary, fontWeight: 'bold' }]}>
                            {formatAmount(transactionData.amount)}
                          </Text>
                        </View>

                        {transactionData.bankName && (
                          <View style={styles.smsDetailsRow}>
                            <View style={styles.smsDetailsRowLeft}>
                              <Ionicons
                                name="business-outline"
                                size={20}
                                color={colors.textMuted}
                              />
                              <Text style={styles.smsDetailsRowLabel}>Bank</Text>
                            </View>
                            <Text style={styles.smsDetailsRowValue}>
                              {transactionData.bankName}
                            </Text>
                          </View>
                        )}

                        {transactionData.accountNumber && (
                          <View style={styles.smsDetailsRow}>
                            <View style={styles.smsDetailsRowLeft}>
                              <Ionicons
                                name="card-outline"
                                size={20}
                                color={colors.textMuted}
                              />
                              <Text style={styles.smsDetailsRowLabel}>Account/Card</Text>
                            </View>
                            <Text style={styles.smsDetailsRowValue}>
                              {transactionData.accountNumber}
                            </Text>
                          </View>
                        )}

                        {transactionData.upiId && (
                          <View style={styles.smsDetailsRow}>
                            <View style={styles.smsDetailsRowLeft}>
                              <Ionicons
                                name="phone-portrait-outline"
                                size={20}
                                color={colors.textMuted}
                              />
                              <Text style={styles.smsDetailsRowLabel}>UPI ID</Text>
                            </View>
                            <Text style={styles.smsDetailsRowValue}>
                              {transactionData.upiId}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Original SMS Message */}
                      <View style={styles.smsDetailsSection}>
                        <Text style={styles.smsDetailsSectionTitle}>Original SMS</Text>
                        <View style={styles.smsDetailsMessageContainer}>
                          <Text style={styles.smsDetailsMessageText}>
                            {transactionData.originalMessage}
                          </Text>
                        </View>
                      </View>
                    </>
                  ) : (
                    <View style={styles.smsDetailsEmptyContainer}>
                      <Ionicons
                        name="warning-outline"
                        size={48}
                        color={colors.textMuted}
                      />
                      <Text style={styles.smsDetailsEmptyText}>
                        Unable to parse SMS details
                      </Text>
                      <Text style={styles.smsDetailsEmptySubtext}>
                        The SMS format might not be recognized
                      </Text>
                    </View>
                  )}
                </ScrollView>

                {/* Footer Actions */}
                <View style={styles.smsDetailsModalFooter}>
                  <TouchableOpacity
                    onPress={onClose}
                    style={[styles.smsDetailsModalButton, styles.smsDetailsModalButtonPrimary]}
                  >
                    <Text style={styles.smsDetailsModalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SMSDetailsModal;
