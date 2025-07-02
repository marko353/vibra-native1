import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type CustomCheckboxProps = {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
};

export default function CustomCheckbox({ value, onValueChange }: CustomCheckboxProps) {
  return (
    <TouchableOpacity
      style={[styles.checkbox, value && styles.checked]}
      onPress={() => onValueChange(!value)}
    >
      {value && <AntDesign name="check" size={18} color="#fff" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4c8bf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checked: {
    backgroundColor: '#4c8bf5',
  },
});
