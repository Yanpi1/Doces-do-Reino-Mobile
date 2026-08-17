import React, { useState } from 'react';
import HomeScreen from '../screens/HomeScreen';
import AdminNavigator from './AdminNavigator';

export default function RootNavigator() {
  const [showAdmin, setShowAdmin] = useState(false);

  if (showAdmin) {
    return <AdminNavigator onVoltarSite={() => setShowAdmin(false)} />;
  }
  return <HomeScreen onAbrirAdmin={() => setShowAdmin(true)} />;
}
