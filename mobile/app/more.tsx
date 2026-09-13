import { Linking, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '../src/components/Screen'
import { PressableScale } from '../src/components/PressableScale'
import { colors, spacing, type } from '../src/theme/tokens'

const webBase = 'https://kudzimusar.github.io/11-11-tech'

export default function MoreScreen() {
  const router = useRouter()
  const navigate = (path: '/home' | '/explore' | '/work' | '/start') => {
    if (path === '/home') router.replace('/')
    else router.replace(path)
  }

  return (
    <Screen scroll={false} contentStyle={styles.screen}>
      <View style={styles.top}>
        <View><Text style={styles.brand}>11·11 TECH</Text><Text style={styles.native}>NATIVE MOBILE</Text></View>
        <PressableScale accessibilityLabel="Close menu" onPress={() => router.back()} style={styles.close}><Text style={styles.closeText}>×</Text></PressableScale>
      </View>

      <View style={styles.primary}>
        <MenuRow index="01" label="Home" onPress={() => navigate('/home')} />
        <MenuRow index="02" label="Explore" onPress={() => navigate('/explore')} />
        <MenuRow index="03" label="Work" onPress={() => navigate('/work')} />
        <MenuRow index="04" label="Start a project" accent onPress={() => navigate('/start')} />
      </View>

      <View style={styles.secondary}>
        <Text style={styles.secondaryLabel}>WEB / COMPANY</Text>
        <PressableScale onPress={() => Linking.openURL(`${webBase}/about`)} style={styles.secondaryRow}><Text style={styles.secondaryText}>About 11-11 Tech</Text><Text style={styles.arrow}>↗</Text></PressableScale>
        <PressableScale onPress={() => Linking.openURL(`${webBase}/trust`)} style={styles.secondaryRow}><Text style={styles.secondaryText}>Trust Center</Text><Text style={styles.arrow}>↗</Text></PressableScale>
        <PressableScale onPress={() => Linking.openURL(`${webBase}/policies`)} style={styles.secondaryRow}><Text style={styles.secondaryText}>Privacy & policies</Text><Text style={styles.arrow}>↗</Text></PressableScale>
        <PressableScale onPress={() => Linking.openURL('mailto:kudzimusar@gmail.com')} style={styles.secondaryRow}><Text style={styles.secondaryText}>Email directly</Text><Text style={styles.arrow}>↗</Text></PressableScale>
      </View>

      <View style={styles.footer}><Text style={styles.footerText}>TOKYO · GLOBAL DELIVERY</Text><Text style={styles.footerText}>11·11 TECH / 2026</Text></View>
    </Screen>
  )
}

function MenuRow({ index, label, onPress, accent = false }: { index: string; label: string; onPress: () => void; accent?: boolean }) {
  return (
    <PressableScale onPress={onPress} style={[styles.menuRow, accent && styles.menuRowAccent]}>
      <Text style={[styles.index, accent && styles.darkText]}>{index}</Text>
      <Text style={[styles.menuLabel, accent && styles.darkText]}>{label.toUpperCase()}</Text>
      <Text style={[styles.menuArrow, accent && styles.darkText]}>→</Text>
    </PressableScale>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'space-between' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: colors.textOnDark, fontFamily: type.display, fontSize: 22, letterSpacing: -0.6 },
  native: { color: colors.orange, fontFamily: type.mono, fontSize: 8, letterSpacing: 1.3, marginTop: 3 },
  close: { width: 46, height: 46, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.ruleDark, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: colors.textOnDark, fontFamily: type.body, fontSize: 30, lineHeight: 32 },
  primary: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.ruleDark },
  menuRow: { minHeight: 76, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.ruleDark, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.sm },
  menuRowAccent: { backgroundColor: colors.orange, borderTopColor: colors.orange },
  index: { color: colors.orange, fontFamily: type.mono, fontSize: type.micro },
  menuLabel: { color: colors.textOnDark, fontFamily: type.display, fontSize: 28, letterSpacing: -0.8, flex: 1 },
  menuArrow: { color: colors.textMutedDark, fontSize: 20 },
  darkText: { color: colors.ink },
  secondary: { gap: 0 },
  secondaryLabel: { color: colors.textMutedDark, fontFamily: type.mono, fontSize: 9, letterSpacing: 1.2, marginBottom: spacing.xs },
  secondaryRow: { minHeight: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  secondaryText: { color: colors.textMutedDark, fontFamily: type.body, fontSize: 14 },
  arrow: { color: colors.textMutedDark },
  footer: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.ruleDark, paddingTop: spacing.md },
  footerText: { color: colors.textMutedDark, fontFamily: type.mono, fontSize: 8, letterSpacing: 0.9 },
})
