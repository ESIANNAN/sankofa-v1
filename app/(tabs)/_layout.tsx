import React, { useEffect, useState } from 'react';
import { Platform, ActivityIndicator, View as RNView } from 'react-native';
import { useColor } from '@/hooks/useColor';
import MaterialIcons from '@expo/vector-icons/Feather';
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from 'expo-router/unstable-native-tabs';
import { auth } from '@/services/firebase';
import { router } from 'expo-router';

export default function TabsLayout() {
  const red = useColor('red');
  const primary = useColor('primary');
  const foreground = useColor('foreground');

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    // Initial check and subscription to auth state changes
    const unsubscribe = auth.onAuthStateChanged((usr) => {
      setUser(usr);
      if (initializing) setInitializing(false);

      if (!usr) {
        router.replace('/welcome' as any);
      } else if (!usr.emailVerified) {
        router.replace('/confirmation' as any);
      }
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return (
      <RNView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#000000" />
      </RNView>
    );
  }

  if (!user || !user.emailVerified) {
    return null;
  }


  return (
    <NativeTabs
      minimizeBehavior='onScrollDown'
      labelStyle={{
        default: { color: primary },
        selected: { color: foreground },
      }}
      iconColor={{
        default: primary,
        selected: foreground,
      }}
      badgeBackgroundColor={red}
      labelVisibilityMode='labeled'
      disableTransparentOnScrollEdge={true}
    >
      <NativeTabs.Trigger name='home'>
        {Platform.select({
          ios: <Icon sf='house.fill' />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name='home' />} />
          ),
        })}
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='leaderboard'>
        {Platform.select({
          ios: <Icon sf='trophy.fill' />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name='award' />} />
          ),
        })}
        <Label>Leaderboard</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='explore'>
        {Platform.select({
          ios: <Icon sf='globe' />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name='compass' />} />
          ),
        })}
        <Label>Explore</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='journal'>
        {Platform.select({
          ios: <Icon sf='book.closed.fill' />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name='book-open' />} />
          ),
        })}
        <Label>Journal</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='profile'>
        {Platform.select({
          ios: <Icon sf='person.crop.circle.fill' />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name='user' />} />
          ),
        })}
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
