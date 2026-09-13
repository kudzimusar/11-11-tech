import { Tabs } from 'expo-router'
import { StyleSheet, Text, useWindowDimensions } from 'react-native'
import { colors, layout, type } from '../../src/theme/tokens'

const icons: Record<string, string> = { index: '⌂', explore: '◈', work: '▣', start: '+' }

export default function TabsLayout() {
  const { width } = useWindowDimensions()
  const tablet = width >= layout.tabletBreakpoint

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarPosition: tablet ? 'left' : 'bottom',
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.textMutedDark,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ color, focused }) => <Text style={[styles.icon, { color, transform: [{ scale: focused ? 1.08 : 1 }] }]}>{icons[route.name] ?? '•'}</Text>,
        tabBarStyle: tablet ? styles.rail : styles.bar,
        sceneStyle: { backgroundColor: colors.ink },
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
  bar: { height: 82, backgroundColor: colors.inkRaised, borderTopColor: colors.ruleDark, paddingTop: 9 },
  rail: { width: 96, backgroundColor: colors.inkRaised, borderRightColor: colors.ruleDark, paddingVertical: 20 },
  label: { fontFamily: type.mono, fontSize: 9, letterSpacing: 0.7 },
  icon: { fontFamily: type.mono, fontSize: 20 },
})
