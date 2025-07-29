import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import AuthNavigator from './AuthNavigator';
import AdminNavigator from './AdminNavigator';
import PartnerNavigator from './PartnerNavigator';
import { Authcontext } from '../context/Authcontext';

const RootNavigator = () => {
  const { user } = useContext(Authcontext);

  if (!user) return <AuthNavigator />;
  if (user.role === 'Admin') return <AdminNavigator />;
  if (user.role === 'Partner') return <PartnerNavigator />;
};

export default RootNavigator