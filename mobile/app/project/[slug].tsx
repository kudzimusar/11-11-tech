import { StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Screen } from '../../src/components/Screen'
import { ActionButton } from '../../src/components/ActionButton'
import { PressableScale } from '../../src/components/PressableScale'
import { ProjectScene } from '../../src/components/ProjectScene'
import { getProject } from '../../src/data/projects'
import { colors, spacing, type } from '../../src/theme/tokens'

export default function ProjectDetailScreen() {
  const router = useRouter()
  const { slug } = useLocalSearchParams<{ slug?: string }>()
  const project = getProject(slug)

  if (!project) {
    return <Screen><PressableScale onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>← BACK</Text></PressableScale><Text style={styles.title}>PROJECT NOT FOUND.</Text></Screen>
  }

  return (
    <Screen>
      <PressableScale onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>← BACK TO WORK</Text></PressableScale>
      <View style={styles.metaRow}>
        <Text style={[styles.kicker, { color: project.accent }]}>{project.category.toUpperCase()}</Text>
        <Text style={styles.meta}>{project.status.toUpperCase()} · {project.region.toUpperCase()}</Text>
      </View>
      <Text style={styles.title}>{project.name.toUpperCase()}</Text>
      <Text style={styles.lead}>{project.description}</Text>

      <View style={styles.scene}><ProjectScene project={project} /></View>

      <View style={styles.story}>
        <Text style={[styles.sectionLabel, { color: project.accent }]}>WHAT THIS WORK DEMONSTRATES</Text>
        {project.focus.map((item, index) => (
          <View key={item} style={styles.focusRow}>
            <Text style={[styles.focusIndex, { color: project.accent }]}>{String(index + 1).padStart(2, '0')}</Text>
            <Text style={styles.focusCopy}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.truthBlock}>
        <Text style={styles.truthLabel}>MATURITY / TRUTH LABEL</Text>
        <Text style={styles.truthStatus}>{project.status}</Text>
        <Text style={styles.truthCopy}>This app preserves the project’s current public maturity rather than turning every product into a completed client claim.</Text>
      </View>

      <View style={styles.cta}>
        <Text style={styles.ctaLabel}>SEE A RELEVANT PATTERN?</Text>
        <Text style={styles.ctaTitle}>Start with your problem, not this project.</Text>
        <ActionButton label="Start a project brief" onPress={() => router.push('/start')} />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  back: { minHeight: 52, justifyContent: 'center', marginBottom: spacing.xl },
  backText: { color: colors.textMutedDark, fontFamily: type.mono, fontSize: 10, letterSpacing: 1.2 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, marginBottom: spacing.md },
  kicker: { fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.3 },
  meta: { color: colors.textMutedDark, fontFamily: type.mono, fontSize: 8, letterSpacing: 0.8, textAlign: 'right', flexShrink: 1 },
  title: { color: colors.textOnDark, fontFamily: type.display, fontSize: 50, lineHeight: 46, letterSpacing: -1.9 },
  lead: { color: colors.textMutedDark, fontFamily: type.body, fontSize: 17, lineHeight: 25, marginTop: spacing.lg, maxWidth: 680 },
  scene: { marginVertical: spacing.section },
  story: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.ruleDark },
  sectionLabel: { fontFamily: type.mono, fontSize: 9, letterSpacing: 1.25, marginBottom: spacing.md },
  focusRow: { minHeight: 76, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.ruleDark, flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  focusIndex: { fontFamily: type.mono, fontSize: type.micro },
  focusCopy: { color: colors.textOnDark, fontFamily: type.body, fontSize: 16, lineHeight: 22, flex: 1 },
  truthBlock: { marginVertical: spacing.section, borderLeftWidth: 2, borderLeftColor: colors.orange, backgroundColor: colors.inkRaised, padding: spacing.xl, gap: spacing.sm },
  truthLabel: { color: colors.orange, fontFamily: type.mono, fontSize: 9, letterSpacing: 1.2 },
  truthStatus: { color: colors.textOnDark, fontFamily: type.display, fontSize: 30, letterSpacing: -0.9 },
  truthCopy: { color: colors.textMutedDark, fontFamily: type.body, fontSize: 14, lineHeight: 21 },
  cta: { backgroundColor: colors.warm, padding: spacing.xl, gap: spacing.md },
  ctaLabel: { color: colors.orange, fontFamily: type.mono, fontSize: 9, letterSpacing: 1.2 },
  ctaTitle: { color: colors.textOnLight, fontFamily: type.display, fontSize: 30, lineHeight: 31, letterSpacing: -1 },
})
