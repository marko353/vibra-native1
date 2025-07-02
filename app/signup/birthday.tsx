import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function BirthdayScreen() {
  const router = useRouter();

  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  const dayRef = useRef<TextInput>(null);
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  const currentYear = new Date().getFullYear();

  const validateStepByStep = () => {
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (day.length === 2 && (isNaN(dayNum) || dayNum < 1 || dayNum > 31)) {
      return '• Invalid day';
    }

    if (
      day.length === 2 &&
      month.length === 2 &&
      (isNaN(monthNum) || monthNum < 1 || monthNum > 12)
    ) {
      return '• Invalid month';
    }

    if (
      day.length === 2 &&
      month.length === 2 &&
      year.length === 4 &&
      (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear)
    ) {
      return '• Invalid year';
    }

    if (
      day.length === 2 &&
      month.length === 2 &&
      year.length === 4
    ) {
      const date = new Date(yearNum, monthNum - 1, dayNum);
      if (
        date.getFullYear() !== yearNum ||
        date.getMonth() !== monthNum - 1 ||
        date.getDate() !== dayNum
      ) {
        return '• Invalid date entered';
      }
    }

    return '';
  };

  const isValid =
    error === '' &&
    day.length === 2 &&
    month.length === 2 &&
    year.length === 4;

  useEffect(() => {
    const validationMessage = validateStepByStep();
    setError(validationMessage);
  }, [day, month, year]);

  const handleNext = () => {
    const validationMessage = validateStepByStep();
    if (!validationMessage) {
      router.push({
        pathname: '/signup/create-account',
        params: { day, month, year },
      });
    } else {
      setError(validationMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <View style={styles.container}>
        {/* Strelica za povratak */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <AntDesign name="arrowleft" size={23} color="#4c8bf5" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Your Birthday</Text>
        <Text style={styles.subtitle}>Only your age will be visible to others</Text>

        <View style={styles.inputRow}>
          <TextInput
            ref={dayRef}
            placeholder="DD"
            maxLength={2}
            keyboardType="numeric"
            style={styles.input}
            value={day}
            onChangeText={(text) => {
              if (/^\d{0,2}$/.test(text)) setDay(text);
            }}
            onBlur={() => {
              if (day.length === 1 && parseInt(day) > 0 && parseInt(day) < 10) {
                setDay('0' + day);
              }
            }}
            returnKeyType="next"
            onSubmitEditing={() => monthRef.current?.focus()}
          />
          <TextInput
            ref={monthRef}
            placeholder="MM"
            maxLength={2}
            keyboardType="numeric"
            style={styles.input}
            value={month}
            onChangeText={(text) => {
              if (/^\d{0,2}$/.test(text)) setMonth(text);
            }}
            onBlur={() => {
              if (month.length === 1 && parseInt(month) > 0 && parseInt(month) < 10) {
                setMonth('0' + month);
              }
            }}
            returnKeyType="next"
            onSubmitEditing={() => yearRef.current?.focus()}
          />
          <TextInput
            ref={yearRef}
            placeholder="YYYY"
            maxLength={4}
            keyboardType="numeric"
            style={styles.input}
            value={year}
            onChangeText={(text) => {
              if (/^\d{0,4}$/.test(text)) setYear(text);
            }}
            returnKeyType="done"
            onSubmitEditing={handleNext}
          />
        </View>

        {error.length > 0 && <Text style={styles.error}>{error}</Text>}

        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[styles.button, !isValid && styles.disabledButton]}
            onPress={handleNext}
            disabled={!isValid}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
    marginTop: 40,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 30,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    width: '30%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    color: '#d00',
    marginTop: 6,
    fontSize: 13,
    textAlign: 'left',
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4c8bf5',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#a0c0f5',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
