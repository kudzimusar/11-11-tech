import { StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { PressableScale } from './PressableScale'
import { colors, spacing, themes, type } from '../theme/tokens'
import { useTheme } from '../theme/ThemeProvider'

type Props = { tone?: 'auto' | 'dark' | 'light'; showMenu?: boolean; back?: boolean; title?: string }

export function AppHeader({ tone = 'auto', showMenu = true, back = false, title }: Props) {
  const router = useRouter()
  const { theme } = useTheme()
  const active = tone === 'auto' ? theme : themes[tone]

  return (
    <View style={[styles.header, { borderBottomColor: active.rule }]}>
      <View style={styles.brandRow}>
        {back ? <PressableScale accessibilityLabel="Go back" accessibilityHint="Returns to the previous screen" onPress={() => router.back()} style={[styles.back, { borderColor: active.rule }]}><Text style={[styles.backText, { color: active.text }]}>←</Text></PressableScale> : null}
        <View>
          <Text style={[styles.brand, { color: active.text }]}>{title || '11·11 TECH'}</Text>
          <Text style={styles.native}>{title ? '11·11 TECH' : 'NATIVE'}</Text>
        </View>
      </View>
      {showMenu && !back ? (
        <PressableScale accessibilityLabel="Open app menu" accessibilityHint="Opens navigation, client access and preferences" onPress={() => router.push('/more')} style={[styles.menu, { borderColor: active.rule }]}>
          <Text style={[styles.menuText, { color: active.text }]}>MENU</Text>
          <View style={styles.menuMark}><View style={[styles.menuLine, { backgroundColor: active.text }]} /><View style={[styles.menuLine, { backgroundColor: active.text }]} /></View>
        </PressableScale>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  header: { minHeight: 68, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xxl },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  brand: { fontFamily: type.display, fontSize: 20, letterSpacing: -0.5 },
  native: { color: colors.orange, fontFamily: type.mono, fontSize: 9, letterSpacing: 1.4, marginTop: 2 },
  menu: { minHeight: 48, minWidth: 86, paddingHorizontal: 13, borderWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  menuText: { fontFamily: type.mono, fontSize: 10, letterSpacing: 1.2 },
  menuMark: { gap: 4 },
  menuLine: { width: 14, height: 1 },
  back: { width: 48, height: 48, borderWidth: StyleSheet.hairlineWidth, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 22 },
})
