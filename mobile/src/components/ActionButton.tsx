import { StyleSheet, Text, View } from 'react-native'
import { PressableScale } from './PressableScale'
import { colors, spacing, type } from '../theme/tokens'

type Props = {
  label: string
  onPress: () => void
  variant?: 'primary' | 'outline' | 'light'
  disabled?: boolean
  detail?: string
}

export function ActionButton({ label, onPress, variant = 'primary', disabled, detail }: Props) {
  const primary = variant === 'primary'
  const light = variant === 'light'
  const backgroundColor = primary ? colors.orange : light ? colors.paper : 'transparent'
  const borderColor = primary ? colors.orange : light ? colors.paper : colors.ruleDark
  const textColor = primary || light ? colors.ink : colors.textOnDark

  return (
    <PressableScale accessibilityLabel={label} accessibilityHint={detail} onPress={onPress} disabled={disabled} haptic="light" style={[styles.button, { backgroundColor, borderColor }]}> 
      <View style={styles.copy}>
        {detail ? <Text style={[styles.detail, { color: textColor }]}>{detail.toUpperCase()}</Text> : null}
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      </View>
      <Text style={[styles.arrow, { color: textColor }]}>→</Text>
    </PressableScale>
  )
}

const styles = StyleSheet.create({
  button: { minHeight: 58, borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  copy: { gap: 3, flex: 1 },
  detail: { fontFamily: type.mono, fontSize: 8, letterSpacing: 1.1, opacity: 0.72 },
  label: { fontFamily: type.body, fontWeight: '700', fontSize: 15 },
  arrow: { fontSize: 21 },
})
