import React from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/admin/LoginScreen';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';

function AdminInner({ onVoltarSite }: { onVoltarSite: () => void }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <LoginScreen onVoltar={onVoltarSite} />;
  return <AdminHomeScreen onVoltarSite={onVoltarSite} />;
}

export default function AdminNavigator({ onVoltarSite }: { onVoltarSite: () => void }) {
  return (
    <AuthProvider>
      <AdminInner onVoltarSite={onVoltarSite} />
    </AuthProvider>
  );
}
