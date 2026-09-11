import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View as RNView } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { useColor } from '@/hooks/useColor';
import { Tabs, router } from 'expo-router';
import { Home, Trophy, Compass, BookOpen, User } from 'lucide-react-native';
import { auth } from '@/services/firebase';

export default function TabsLayout() {
  const primary = useColor('primary');
  const foreground = useColor('foreground');
  const background = useColor('background');

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
      <RNView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: background }}>
        <ActivityIndicator size="large" color={primary} />
      </RNView>
    );
  }

  if (!user || !user.emailVerified) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: foreground,
        tabBarStyle: {
          backgroundColor: background,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name='home'
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon name={Home} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='leaderboard'
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => (
            <Icon name={Trophy} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='explore'
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <Icon name={Compass} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='journal'
        options={{
          title: 'Journal',
          tabBarIcon: ({ color }) => (
            <Icon name={BookOpen} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Icon name={User} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
