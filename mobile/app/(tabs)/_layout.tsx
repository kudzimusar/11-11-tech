import { Tabs } from 'expo-router'
import { StyleSheet, Text, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { layout, type } from '../../src/theme/tokens'
import { useTheme } from '../../src/theme/ThemeProvider'

const icons: Record<string, string> = { index: '⌂', explore: '◈', work: '▣', start: '+' }

export default function TabsLayout() {
  const { width } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()
  const tablet = width >= layout.tabletBreakpoint

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarPosition: tablet ? 'left' : 'bottom',
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.muted,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ color, focused }) => <Text style={[styles.icon, { color, transform: [{ scale: focused ? 1.08 : 1 }] }]}>{icons[route.name] ?? '•'}</Text>,
        tabBarStyle: tablet
          ? [styles.rail, { backgroundColor: theme.navigation, borderRightColor: theme.rule, paddingTop: Math.max(insets.top, 20), paddingBottom: Math.max(insets.bottom, 20) }]
          : [styles.bar, { backgroundColor: theme.navigation, borderTopColor: theme.rule, height: 64 + insets.bottom, paddingBottom: Math.max(insets.bottom, 8) }],
        sceneStyle: { backgroundColor: theme.background },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      <Tabs.Screen name="work" options={{ title: 'Work' }} />
      <Tabs.Screen name="start" options={{ title: 'Start' }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  bar: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 8 },
  rail: { width: 100, borderRightWidth: StyleSheet.hairlineWidth },
  label: { fontFamily: type.mono, fontSize: 9, letterSpacing: 0.7 },
  icon: { fontFamily: type.mono, fontSize: 20 },
})
