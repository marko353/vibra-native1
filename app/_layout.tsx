import { Slot } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { LinkingOptions } from '@react-navigation/native';

type RootStackParamList = {
  resetPassword: { userId: string; token: string };

};

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['vibranativ://'],
  config: {
    screens: {
      resetPassword: 'reset-password',
    },
  },
};

export default function Layout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}