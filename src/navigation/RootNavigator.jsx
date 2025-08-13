import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import AuthNavigator from './AuthNavigator';
import AdminNavigator from './AdminNavigator';
import PartnerNavigator from './PartnerNavigator';
import { Authcontext } from '../context/Authcontext';

const RootNavigator = () => {
  const { user, activeRole } = useContext(Authcontext);

  if (!user) return <AuthNavigator />;
  if (activeRole === 'Admin') return <AdminNavigator />;
  if (activeRole === 'Partner') return <PartnerNavigator />;
};

export default RootNavigator 