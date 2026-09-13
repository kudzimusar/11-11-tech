import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PressableScale } from './PressableScale'
import { colors, spacing, type } from '../theme/tokens'

type Props = {
  visible: boolean
  title: string
  options: string[]
  value?: string
  onSelect: (value: string) => void
  onClose: () => void
}

export function SelectionSheet({ visible, title, options, value, onSelect, onClose }: Props) {
  const insets = useSafeAreaInsets()
  return (
    <Modal visible={visible} transparent animationType="slide" presentationStyle="overFullScreen" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close selection" style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}> 
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.kicker}>SELECT</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
            {options.map((option) => {
              const selected = option === value
              return (
                <PressableScale key={option} onPress={() => { onSelect(option); onClose() }} style={[styles.option, selected && styles.optionSelected]}>
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
                  <Text style={[styles.arrow, selected && styles.optionTextSelected]}>{selected ? '●' : '→'}</Text>
                </PressableScale>
              )
            })}
          </ScrollView>
          <PressableScale onPress={onClose} haptic={false} style={styles.close}><Text style={styles.closeText}>CLOSE</Text></PressableScale>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.64)' },
  sheet: { maxHeight: '78%', backgroundColor: colors.paper, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  handle: { width: 42, height: 4, borderRadius: 4, backgroundColor: colors.ruleLight, alignSelf: 'center', marginBottom: spacing.xl },
  header: { gap: spacing.xs, marginBottom: spacing.lg },
  kicker: { color: colors.orange, fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.4 },
  title: { color: colors.textOnLight, fontFamily: type.display, fontSize: type.h2, lineHeight: 31, letterSpacing: -1 },
  list: { flexGrow: 0 },
  option: { minHeight: 62, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.ruleLight, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  optionSelected: { borderTopColor: colors.orange },
  optionText: { color: colors.textOnLight, fontFamily: type.body, fontSize: type.bodySize, flex: 1 },
  optionTextSelected: { color: colors.orange },
  arrow: { color: colors.textMutedLight, fontSize: 17 },
  close: { marginTop: spacing.lg, minHeight: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ink },
  closeText: { color: colors.textOnDark, fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.4 },
})
