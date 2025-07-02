import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import Constants from 'expo-constants';

export default function CreateAccountScreen() {
  const router = useRouter();
  const { day, month, year } = useLocalSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confPass, setConfPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const emailRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);
  const confRef = useRef<TextInput>(null);

  const API_BASE_URL = Constants.manifest?.extra?.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.6:5000';

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.includes('@')) newErrors.email = 'Enter valid email';
    if (pass.length < 6) newErrors.pass = 'Password too short';
    if (pass !== confPass) newErrors.conf = 'Passwords do not match';
    if (!agree) newErrors.agree = 'You must agree to continue';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    Keyboard.dismiss();

    if (!validate()) return;

    try {
      const username = email.split('@')[0];
      const birthDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name,
        username,
        email,
        password: pass,
        fullName: name,
        birthDate,
      });

      Alert.alert('Success', 'Account created successfully!');
      router.push('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#4c8bf5" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Account</Text>
      </View>

      {/* Name */}
      <TextInput
        style={[styles.input, errors.name && styles.inputError]}
        placeholder="Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={(text) => setName(text)}
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      {/* Email */}
      <TextInput
        ref={emailRef}
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => setEmail(text)}
        returnKeyType="next"
        onSubmitEditing={() => passRef.current?.focus()}
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      {/* Password */}
      <View style={styles.inputPasswordWrapper}>
        <TextInput
          ref={passRef}
          style={[styles.input, styles.flex, errors.pass && styles.inputError]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!showPass}
          value={pass}
          onChangeText={(text) => setPass(text)}
          returnKeyType="next"
          onSubmitEditing={() => confRef.current?.focus()}
        />
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <AntDesign
            name={showPass ? 'eye' : 'eyeo'}
            size={20}
            color="#666"
            style={{ paddingRight: 10 }}
          />
        </TouchableOpacity>
      </View>
      {errors.pass && <Text style={styles.error}>{errors.pass}</Text>}

      {/* Confirm Password */}
      <View style={styles.inputPasswordWrapper}>
        <TextInput
          ref={confRef}
          style={[styles.input, styles.flex, errors.conf && styles.inputError]}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry={!showConf}
          value={confPass}
          onChangeText={(text) => setConfPass(text)}
        />
        <TouchableOpacity onPress={() => setShowConf(!showConf)}>
          <AntDesign
            name={showConf ? 'eye' : 'eyeo'}
            size={20}
            color="#666"
            style={{ paddingRight: 10 }}
          />
        </TouchableOpacity>
      </View>
      {errors.conf && <Text style={styles.error}>{errors.conf}</Text>}

      {/* Agree checkbox */}
      <View style={styles.checkRow}>
        <TouchableOpacity
          style={[styles.checkbox, agree && styles.checkboxChecked]}
          onPress={() => setAgree(!agree)}
        />
        <Text style={styles.checkLabel}>
          I agree to the Terms and Privacy Policy
        </Text>
      </View>
      {errors.agree && <Text style={styles.error}>{errors.agree}</Text>}

      {/* Create Button */}
      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4c8bf5',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    fontSize: 16,
    color: '#222',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputPasswordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  flex: {
    flex: 1,
    padding: 14,
    fontSize: 16,
    color: '#222',
  },
  inputError: {
    borderColor: '#d00',
  },
  error: {
    color: '#d00',
    marginBottom: 10,
    fontSize: 13,
    fontWeight: '600',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#4c8bf5',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#4c8bf5',
  },
  checkLabel: {
    fontSize: 15,
    color: '#333',
    flexShrink: 1,
  },
  createButton: {
    backgroundColor: '#4c8bf5',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
