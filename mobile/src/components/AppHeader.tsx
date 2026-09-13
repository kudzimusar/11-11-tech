import { StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { PressableScale } from './PressableScale'
import { colors, spacing, type } from '../theme/tokens'

type Props = { tone?: 'dark' | 'light'; showMenu?: boolean }

export function AppHeader({ tone = 'dark', showMenu = true }: Props) {
  const router = useRouter()
  const light = tone === 'light'
  const text = light ? colors.textOnLight : colors.textOnDark
  const rule = light ? colors.ruleLight : colors.ruleDark

  return (
    <View style={[styles.header, { borderBottomColor: rule }]}>
      <View style={styles.brandRow}>
        <Text style={[styles.brand, { color: text }]}>11·11 TECH</Text>
        <Text style={styles.native}>NATIVE</Text>
      </View>
      {showMenu && (
        <PressableScale accessibilityLabel="Open app menu" accessibilityHint="Opens navigation and company links" onPress={() => router.push('/more')} style={[styles.menu, { borderColor: rule }]}>
          <Text style={[styles.menuText, { color: text }]}>MENU</Text>
          <View style={styles.menuMark}><View style={[styles.menuLine, { backgroundColor: text }]} /><View style={[styles.menuLine, { backgroundColor: text }]} /></View>
        </PressableScale>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: { minHeight: 68, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xxl },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  brand: { fontFamily: type.display, fontSize: 20, letterSpacing: -0.5 },
  native: { color: colors.orange, fontFamily: type.mono, fontSize: 9, letterSpacing: 1.4 },
  menu: { minHeight: 48, minWidth: 86, paddingHorizontal: 13, borderWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  menuText: { fontFamily: type.mono, fontSize: 10, letterSpacing: 1.2 },
  menuMark: { gap: 4 },
  menuLine: { width: 14, height: 1 },
})
