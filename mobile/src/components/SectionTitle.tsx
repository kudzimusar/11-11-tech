import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { colors, spacing, themes, type } from '../theme/tokens'
import { useTheme } from '../theme/ThemeProvider'

type Props = { index?: string; kicker: string; title: string; body?: string; tone?: 'auto' | 'dark' | 'light' }

export function SectionTitle({ index, kicker, title, body, tone = 'auto' }: Props) {
  const { theme } = useTheme(); const { width } = useWindowDimensions(); const active = tone === 'auto' ? theme : themes[tone]
  return <View style={styles.wrap}>
    <View style={styles.kickerRow}>{index ? <Text style={styles.index}>{index}</Text> : null}<Text style={[styles.kicker, { color: active.muted }]}>{kicker.toUpperCase()}</Text></View>
    <Text maxFontSizeMultiplier={1.35} style={[styles.title, { color: active.text, fontSize: width < 360 ? 27 : type.h2, lineHeight: width < 360 ? 29 : 33 }]}>{title}</Text>
    {body ? <Text style={[styles.body, { color: active.muted }]}>{body}</Text> : null}
  </View>
}
const styles = StyleSheet.create({ wrap: { gap: spacing.md }, kickerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, index: { color: colors.orange, fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.3 }, kicker: { fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.4 }, title: { fontFamily: type.display, letterSpacing: -1.0, textTransform: 'uppercase' }, body: { fontFamily: type.body, fontSize: type.bodySize, lineHeight: 23, maxWidth: 620 } })
