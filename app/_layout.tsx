import React, { useState } from 'react';
import { Slot } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import AnimatedSplash from './AnimatedSplash';

export default function Layout() {
  const [isSplashVisible, setSplashVisible] = useState(true);

  if (isSplashVisible) {
    return <AnimatedSplash onFinish={() => setSplashVisible(false)} />;
  }

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
