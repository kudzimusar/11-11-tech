import { StyleSheet, Text, View } from 'react-native'
import type { Project } from '../data/projects'
import { colors, spacing, type } from '../theme/tokens'

type Props = { project: Project; compact?: boolean }

export function ProjectScene({ project, compact = false }: Props) {
  return (
    <View style={[styles.frame, compact && styles.compact, { borderColor: project.accent }]}>
      <View style={styles.grid} pointerEvents="none">
        {[18, 42, 66, 82].map((left) => <View key={`v-${left}`} style={[styles.vLine, { left: `${left}%` }]} />)}
        {[24, 52, 78].map((top) => <View key={`h-${top}`} style={[styles.hLine, { top: `${top}%` }]} />)}
      </View>

      <View style={styles.topRow}>
        <Text style={[styles.category, { color: project.accent }]}>{project.category.toUpperCase()}</Text>
        <View style={styles.statusRow}><View style={[styles.dot, { backgroundColor: project.accent }]} /><Text style={styles.status}>{project.status.toUpperCase()}</Text></View>
      </View>

      <View style={styles.scene}>
        <View style={[styles.backPlane, { borderColor: project.accent }]} />
        <View style={styles.device}>
          <View style={styles.deviceBar}><View style={[styles.tinyDot, { backgroundColor: project.accent }]} /><View style={styles.tinyRule} /></View>
          <View style={styles.dataRow}><View style={[styles.dataBlock, { backgroundColor: project.accent }]} /><View style={styles.dataLines}><View style={styles.dataLineWide} /><View style={styles.dataLine} /></View></View>
          <View style={styles.dataRow}><View style={styles.dataBlockMuted} /><View style={styles.dataLines}><View style={styles.dataLineWide} /><View style={styles.dataLine} /></View></View>
        </View>
        <View style={[styles.signal, { borderColor: project.accent }]}><Text style={[styles.signalText, { color: project.accent }]}>11T</Text></View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.name}>{project.name.toUpperCase()}</Text>
        <Text style={styles.region}>{project.region}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  frame: { height: 320, backgroundColor: colors.inkRaised, borderWidth: 1, overflow: 'hidden', padding: spacing.lg, justifyContent: 'space-between' },
  compact: { height: 250 },
  grid: { ...StyleSheet.absoluteFillObject, opacity: 0.24 },
  vLine: { position: 'absolute', top: 0, bottom: 0, width: StyleSheet.hairlineWidth, backgroundColor: colors.ruleDark },
  hLine: { position: 'absolute', left: 0, right: 0, height: StyleSheet.hairlineWidth, backgroundColor: colors.ruleDark },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  category: { fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.3 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { width: 5, height: 5, borderRadius: 99 },
  status: { color: colors.textMutedDark, fontFamily: type.mono, fontSize: 9, letterSpacing: 0.9 },
  scene: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backPlane: { position: 'absolute', width: '72%', height: '58%', borderWidth: 1, opacity: 0.28, transform: [{ rotate: '-5deg' }, { translateX: -10 }] },
  device: { width: '70%', minHeight: 122, backgroundColor: colors.inkSoft, borderWidth: StyleSheet.hairlineWidth, borderColor: '#44484D', padding: 14, gap: 14, transform: [{ rotate: '2deg' }] },
  deviceBar: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tinyDot: { width: 7, height: 7, borderRadius: 10 },
  tinyRule: { width: 54, height: 3, backgroundColor: '#45494E' },
  dataRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dataBlock: { width: 28, height: 28 },
  dataBlockMuted: { width: 28, height: 28, backgroundColor: '#303338' },
  dataLines: { flex: 1, gap: 6 },
  dataLineWide: { width: '86%', height: 4, backgroundColor: '#5A5E63' },
  dataLine: { width: '52%', height: 3, backgroundColor: '#393D42' },
  signal: { position: 'absolute', right: '9%', bottom: '17%', width: 54, height: 54, borderWidth: 1, borderRadius: 99, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ink },
  signalText: { fontFamily: type.mono, fontSize: 11, letterSpacing: 1.2 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: spacing.md },
  name: { color: colors.textOnDark, fontFamily: type.display, fontSize: 27, letterSpacing: -0.9, flexShrink: 1 },
  region: { color: colors.textMutedDark, fontFamily: type.mono, fontSize: 9, textAlign: 'right', maxWidth: 110 },
})
