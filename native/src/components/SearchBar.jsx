import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export function SearchBar({
  visible,
  searchQuery,
  onSearchChange,
  onClose
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={16} color={COLORS.secondaryLabel} style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search contests, platforms, div..."
          placeholderTextColor={COLORS.tertiaryLabel}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => onSearchChange('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.clearBtn}
          >
            <Ionicons name="close-circle" size={16} color={COLORS.secondaryLabel} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={onClose}
        activeOpacity={0.6}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
    backgroundColor: COLORS.systemBackground,
    gap: 10
  },
  searchBox: {
    flex: 1,
    height: 36,
    backgroundColor: 'rgba(118, 118, 128, 0.24)',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  searchIcon: {
    marginRight: 6
  },
  input: {
    flex: 1,
    height: '100%',
    color: COLORS.label,
    fontSize: 16,
    paddingVertical: 0
  },
  clearBtn: {
    padding: 2
  },
  cancelBtn: {
    paddingVertical: 4
  },
  cancelText: {
    color: COLORS.systemBlue,
    fontSize: 16,
    fontWeight: '400'
  }
});
