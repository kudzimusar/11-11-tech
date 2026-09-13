import { StyleSheet, Text, View } from 'react-native'
import { PressableScale } from './PressableScale'
import { spacing, type } from '../theme/tokens'
import { useTheme } from '../theme/ThemeProvider'

type Props = { label: string; onPress: () => void; variant?: 'primary' | 'outline' | 'surface'; disabled?: boolean; detail?: string }

export function ActionButton({ label, onPress, variant = 'primary', disabled, detail }: Props) {
  const { theme } = useTheme()
  const primary = variant === 'primary'
  const backgroundColor = primary ? theme.accent : variant === 'surface' ? theme.surface : 'transparent'
  const borderColor = primary ? theme.accent : theme.rule
  const textColor = primary ? theme.accentOn : theme.text
  return (
    <PressableScale accessibilityLabel={label} accessibilityHint={detail} onPress={onPress} disabled={disabled} haptic="light" style={[styles.button, { backgroundColor, borderColor, opacity: disabled ? 0.48 : 1 }]}> 
      <View style={styles.copy}>{detail ? <Text style={[styles.detail, { color: textColor }]}>{detail.toUpperCase()}</Text> : null}<Text style={[styles.label, { color: textColor }]}>{label}</Text></View>
      <Text style={[styles.arrow, { color: textColor }]}>→</Text>
    </PressableScale>
  )
}

const styles = StyleSheet.create({
  button: { minHeight: 58, borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  copy: { gap: 3, flex: 1 }, detail: { fontFamily: type.mono, fontSize: 8, letterSpacing: 1.1, opacity: 0.72 }, label: { fontFamily: type.body, fontWeight: '700', fontSize: 15 }, arrow: { fontSize: 21 },
})
