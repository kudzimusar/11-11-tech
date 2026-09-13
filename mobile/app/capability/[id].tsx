import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Screen } from '../../src/components/Screen'
import { ActionButton } from '../../src/components/ActionButton'
import { PressableScale } from '../../src/components/PressableScale'
import { ProjectScene } from '../../src/components/ProjectScene'
import { getCapability } from '../../src/data/capabilities'
import { getProject } from '../../src/data/projects'
import { trackNativeEvent } from '../../src/lib/intakeClient'
import { colors, spacing, type } from '../../src/theme/tokens'

export default function CapabilityDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const capability = getCapability(id)

  useEffect(() => {
    if (capability) trackNativeEvent('page_view', `native/capability/${capability.id}`, {}, capability.id)
  }, [capability?.id])

  if (!capability) {
    return <Screen><PressableScale accessibilityLabel="Back" onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>← BACK</Text></PressableScale><Text style={styles.title}>CAPABILITY NOT FOUND.</Text></Screen>
  }

  const proof = capability.projects.map(getProject).filter(Boolean)

  return (
    <Screen>
      <PressableScale accessibilityLabel="Back" accessibilityHint="Returns to the previous screen" onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>← BACK</Text></PressableScale>
      <View style={styles.hero}>
        <Text style={styles.kicker}>{capability.index} · {capability.shortTitle.toUpperCase()}</Text>
        <Text accessibilityRole="header" style={styles.title}>{capability.verb.toUpperCase()}.</Text>
        <Text style={styles.proposition}>{capability.proposition}</Text>
      </View>

      <View style={styles.darkChapter}>
        <Text style={styles.sectionLabel}>THE OPERATING PROBLEM</Text>
        <Text style={styles.problem}>{capability.problem}</Text>
      </View>

      <View style={styles.implementation}>
        <Text style={styles.sectionLabel}>WHAT IMPLEMENTATION LOOKS LIKE</Text>
        {capability.implementation.map((item, index) => (
          <View key={item} style={styles.implementationRow}><Text style={styles.rowIndex}>0{index + 1}</Text><Text style={styles.rowCopy}>{item}</Text></View>
        ))}
      </View>

      {proof.length > 0 ? (
        <View style={styles.proof}>
          <Text style={styles.sectionLabel}>RELEVANT 11·11 PROOF</Text>
          {proof.map((project) => project ? (
            <PressableScale accessibilityLabel={project.name} accessibilityHint="Opens the project system story" key={project.slug} onPress={() => router.push({ pathname: '/project/[slug]', params: { slug: project.slug } })} style={styles.project}>
              <ProjectScene project={project} compact />
            </PressableScale>
          ) : null)}
        </View>
      ) : null}

      <View style={styles.cta}>
        <Text style={styles.ctaLabel}>NEXT STEP</Text>
        <Text style={styles.ctaTitle}>Turn the capability into a project brief.</Text>
        <ActionButton label={`Discuss ${capability.shortTitle}`} onPress={() => router.push({ pathname: '/start', params: { capability: capability.id } })} />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  back: { minHeight: 52, justifyContent: 'center', marginBottom: spacing.xl },
  backText: { color: colors.textMutedDark, fontFamily: type.mono, fontSize: 10, letterSpacing: 1.2 },
  hero: { gap: spacing.lg, paddingBottom: spacing.section },
  kicker: { color: colors.orange, fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.3 },
  title: { color: colors.textOnDark, fontFamily: type.display, fontSize: 48, lineHeight: 44, letterSpacing: -1.8 },
  proposition: { color: colors.textMutedDark, fontFamily: type.body, fontSize: 18, lineHeight: 26, maxWidth: 650 },
  darkChapter: { backgroundColor: colors.inkRaised, padding: spacing.xl, gap: spacing.md, borderTopWidth: 1, borderTopColor: colors.orange },
  sectionLabel: { color: colors.orange, fontFamily: type.mono, fontSize: 9, letterSpacing: 1.3 },
  problem: { color: colors.textOnDark, fontFamily: type.body, fontSize: 18, lineHeight: 27 },
  implementation: { paddingVertical: spacing.section, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.ruleDark },
  implementationRow: { minHeight: 68, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.ruleDark, flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  rowIndex: { color: colors.orange, fontFamily: type.mono, fontSize: type.micro },
  rowCopy: { color: colors.textOnDark, fontFamily: type.body, fontSize: 16, flex: 1 },
  proof: { gap: spacing.lg, paddingVertical: spacing.section },
  project: { marginBottom: spacing.sm },
  cta: { backgroundColor: colors.warm, padding: spacing.xl, gap: spacing.md },
  ctaLabel: { color: colors.orange, fontFamily: type.mono, fontSize: 9, letterSpacing: 1.2 },
  ctaTitle: { color: colors.textOnLight, fontFamily: type.display, fontSize: 30, lineHeight: 31, letterSpacing: -1 },
})
