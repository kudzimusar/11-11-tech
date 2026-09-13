import 'react-native-gesture-handler'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider'

function NavigationRoot() {
  const { theme, scheme } = useTheme()
  return <>
    <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} backgroundColor={theme.background} />
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.background }, animation: 'fade_from_bottom' }}>
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      <Stack.Screen name="capability/[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="project/[slug]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="client" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="pay" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="pricing" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="method" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="trust" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="policies" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="about" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="lab" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="solutions" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="industries" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="more" options={{ animation: 'fade_from_bottom', presentation: 'modal' }} />
    </Stack>
  </>
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider><NavigationRoot /></ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
