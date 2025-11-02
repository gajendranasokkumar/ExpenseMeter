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
import useTheme from '../hooks/useTheme';

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
  const { colors } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(selectedValue || null);
  
  const dropdownStyles = getStyles(colors);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setIsVisible(false);
    onSelect(item);
  };

  const renderDropdownItem = ({ item }) => {
    if (renderItem) {
      return (
        <TouchableOpacity
          style={[dropdownStyles.dropdownItem]}
          onPress={() => handleSelect(item)}
        >
          {renderItem(item)}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[dropdownStyles.dropdownItem]}
        onPress={() => handleSelect(item)}
      >
        <Text style={dropdownStyles.dropdownItemText}>{item.name || item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[dropdownStyles.container, style]}>
      <TouchableOpacity
        style={[dropdownStyles.dropdownButton, dropdownStyle]}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[dropdownStyles.placeholderText, placeholderStyle]}>
          {selectedItem ? (selectedItem.name || selectedItem.label) : placeholder}
        </Text>
        <Text style={dropdownStyles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={dropdownStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={dropdownStyles.modalContent}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id?.toString() || item.value?.toString()}
              renderItem={renderDropdownItem}
              showsVerticalScrollIndicator={false}
              style={dropdownStyles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgrounds?.input || colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeholderText: {
    color: colors.text,
    fontSize: 16,
    flex: 1,
  },
  arrow: {
    color: colors.text,
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
    backgroundColor: colors.surface,
    borderRadius: 12,
    maxHeight: 300,
    width: '80%',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: {
    color: colors.text,
    fontSize: 16,
  },
});

export default CustomDropdown;
