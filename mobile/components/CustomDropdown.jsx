import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';

const CustomDropdown = ({ 
  data, 
  onSelect, 
  placeholder = "Select an option",
  renderItem,
  style,
  dropdownStyle,
  placeholderStyle,
  selectedValue
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(selectedValue || null);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setIsVisible(false);
    onSelect(item);
  };

  const renderDropdownItem = ({ item }) => {
    if (renderItem) {
      return (
        <TouchableOpacity
          style={styles.dropdownItem}
          onPress={() => handleSelect(item)}
        >
          {renderItem(item)}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => handleSelect(item)}
      >
        <Text style={styles.dropdownItemText}>{item.name || item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.dropdownButton, dropdownStyle]}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[styles.placeholderText, placeholderStyle]}>
          {selectedItem ? (selectedItem.name || selectedItem.label) : placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id?.toString() || item.value?.toString()}
              renderItem={renderDropdownItem}
              showsVerticalScrollIndicator={false}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  arrow: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    borderRadius: 12,
    maxHeight: 300,
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default CustomDropdown;
