import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { useColorScheme } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { themes, type SemanticTheme, type ThemeName } from './tokens'

export type ThemePreference = 'system' | ThemeName

type ThemeContextValue = {
  preference: ThemePreference
  scheme: ThemeName
  theme: SemanticTheme
  setPreference: (value: ThemePreference) => Promise<void>
}

const storageKey = '11t.appearance.preference.v1'
const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme() === 'light' ? 'light' : 'dark'
  const [preference, setPreferenceState] = useState<ThemePreference>('system')

  useEffect(() => {
    let active = true
    SecureStore.getItemAsync(storageKey).then((stored) => {
      if (!active) return
      if (stored === 'system' || stored === 'light' || stored === 'dark') setPreferenceState(stored)
    }).catch(() => undefined)
    return () => { active = false }
  }, [])

  const setPreference = useCallback(async (value: ThemePreference) => {
    setPreferenceState(value)
    await SecureStore.setItemAsync(storageKey, value, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY }).catch(() => undefined)
  }, [])

  const scheme: ThemeName = preference === 'system' ? systemScheme : preference
  const value = useMemo(() => ({ preference, scheme, theme: themes[scheme], setPreference }), [preference, scheme, setPreference])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme must be used inside ThemeProvider')
  return value
}
