import { StyleSheet, Text, View } from 'react-native'
import { colors, spacing, type } from '../theme/tokens'

type Props = {
  index?: string
  kicker: string
  title: string
  body?: string
  tone?: 'dark' | 'light'
}

export function SectionTitle({ index, kicker, title, body, tone = 'dark' }: Props) {
  const light = tone === 'light'
  const text = light ? colors.textOnLight : colors.textOnDark
  const muted = light ? colors.textMutedLight : colors.textMutedDark

  return (
    <View style={styles.wrap}>
      <View style={styles.kickerRow}>
        {index ? <Text style={styles.index}>{index}</Text> : null}
        <Text style={[styles.kicker, { color: muted }]}>{kicker.toUpperCase()}</Text>
      </View>
      <Text style={[styles.title, { color: text }]}>{title}</Text>
      {body ? <Text style={[styles.body, { color: muted }]}>{body}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  kickerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  index: { color: colors.orange, fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.3 },
  kicker: { fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.4 },
  title: { fontFamily: type.display, fontSize: type.h2, lineHeight: 31, letterSpacing: -1.1, textTransform: 'uppercase' },
  body: { fontFamily: type.body, fontSize: type.bodySize, lineHeight: 23, maxWidth: 620 },
})
