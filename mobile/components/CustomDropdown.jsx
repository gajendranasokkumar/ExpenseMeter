import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import useTheme from '../hooks/useTheme';
import { useFontSize } from '../context/fontSizeContext';

const CustomDropdown = ({ 
  data, 
  onSelect, 
  placeholder = "Select an option",
  renderItem,
  style,
  dropdownStyle,
  placeholderStyle,
  selectedValue,
  enableSearch = true,
  searchPlaceholder = "Search...",
}) => {
  const { colors } = useTheme();
  const { getFontSizeByKey } = useFontSize();
  const fontSize = (key) => getFontSizeByKey(key);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(selectedValue || null);
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedData = useMemo(() => Array.isArray(data) ? data : [], [data]);
  const filteredData = useMemo(() => {
    if (!enableSearch) {
      return normalizedData;
    }
    const query = searchQuery.trim().toLowerCase();
    if (!query.length) {
      return normalizedData;
    }
    return normalizedData.filter((item) => {
      const label = (item.name || item.label || "").toString().toLowerCase();
      const ifsc = item.ifsc?.toString().toLowerCase();
      return label.includes(query) || (ifsc && ifsc.includes(query));
    });
  }, [normalizedData, searchQuery, enableSearch]);
  
  const dropdownStyles = getStyles(colors, fontSize);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setIsVisible(false);
    onSelect(item);
  };

  const handleOpen = () => {
    setSearchQuery("");
    setIsVisible(true);
  };

  useEffect(() => {
    setSelectedItem(selectedValue || null);
  }, [selectedValue]);

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
        onPress={handleOpen}
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
            {enableSearch ? (
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={searchPlaceholder}
                placeholderTextColor={colors.textMuted}
                style={dropdownStyles.searchInput}
              />
            ) : null}
            <FlatList
              data={filteredData}
              keyExtractor={(item, index) => {
                if (item.id != null) {
                  return `${item.id}-${index}`;
                }
                if (item.value != null) {
                  return `${item.value}-${index}`;
                }
                return `option-${index}`;
              }}
              renderItem={renderDropdownItem}
              showsVerticalScrollIndicator={false}
              style={dropdownStyles.dropdownList}
              ListEmptyComponent={() => (
                <View style={dropdownStyles.emptyState}>
                  <Text style={dropdownStyles.emptyStateText}>No results</Text>
                </View>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const getStyles = (colors, fontSize) => StyleSheet.create({
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
    fontSize: fontSize("md"),
    flex: 1,
  },
  arrow: {
    color: colors.text,
    fontSize: fontSize("sm"),
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
  searchInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 12,
    fontSize: fontSize("md"),
    color: colors.text,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: {
    color: colors.text,
    fontSize: fontSize("md"),
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyStateText: {
    color: colors.textMuted,
    fontSize: fontSize("sm"),
  },
});

export default CustomDropdown;
