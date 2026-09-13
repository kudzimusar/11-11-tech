import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated'
import { Screen } from '../../src/components/Screen'
import { AppHeader } from '../../src/components/AppHeader'
import { ActionButton } from '../../src/components/ActionButton'
import { PressableScale } from '../../src/components/PressableScale'
import { ProjectScene } from '../../src/components/ProjectScene'
import { SectionTitle } from '../../src/components/SectionTitle'
import { capabilities } from '../../src/data/capabilities'
import { projects } from '../../src/data/projects'
import { colors, spacing, type } from '../../src/theme/tokens'

export default function HomeScreen() {
  const router = useRouter()
  const reducedMotion = useReducedMotion()
  const { width } = useWindowDimensions()
  const cardWidth = Math.min(width * 0.82, 520)

  return (
    <Screen>
      <AppHeader />

      <Animated.View entering={reducedMotion ? undefined : FadeInDown.duration(620).springify().damping(18)} style={styles.hero}>
        <Text style={styles.eyebrow}>TOKYO / GLOBAL · TECHNOLOGY IMPLEMENTATION</Text>
        <Text style={styles.heroTitle}>TECHNOLOGY{`\n`}DESIGN &{`\n`}INTELLIGENCE.</Text>
        <Text style={styles.heroBody}>We design and build useful digital systems for organizations ready to improve products, operations, AI adoption and technical delivery.</Text>
        <ActionButton label="Start something" detail="Guided project intake" onPress={() => router.push('/start')} />
      </Animated.View>

      <View style={styles.chapter}>
        <SectionTitle index="01" kicker="Intent first" title="What do you need to change?" body="The native app starts with the task, then routes you to the capability behind it." />
        <View style={styles.intentList}>
          {capabilities.slice(0, 6).map((capability) => (
            <PressableScale key={capability.id} onPress={() => router.push({ pathname: '/capability/[id]', params: { id: capability.id } })} style={styles.intentRow}>
              <View style={styles.intentCopy}>
                <Text style={styles.intentIndex}>{capability.index}</Text>
                <Text style={styles.intentLabel}>{capability.verb}</Text>
              </View>
              <Text style={styles.intentArrow}>→</Text>
            </PressableScale>
          ))}
        </View>
      </View>

      <View style={styles.workSection}>
        <SectionTitle index="02" kicker="Selected work" title="Proof as product stories." body="Each project keeps its real maturity label. Swipe through the work, then open the system story that matters to you." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={cardWidth + spacing.md} decelerationRate="fast" contentContainerStyle={styles.rail}>
          {projects.slice(0, 5).map((project) => (
            <PressableScale key={project.slug} onPress={() => router.push({ pathname: '/project/[slug]', params: { slug: project.slug } })} style={{ width: cardWidth }}>
              <ProjectScene project={project} compact />
            </PressableScale>
          ))}
        </ScrollView>
        <ActionButton variant="outline" label="Explore all selected work" onPress={() => router.push('/work')} />
      </View>

      <View style={styles.lightChapter}>
        <Text style={styles.lightKicker}>11·11 / HOW WE WORK</Text>
        <Text style={styles.lightTitle}>DISCOVER.{`\n`}DESIGN.{`\n`}BUILD.{`\n`}LAUNCH.</Text>
        <Text style={styles.lightBody}>The app is deliberately organized around decisions and journeys rather than mirroring the website navigation. Start with a need, inspect relevant evidence, then send a structured project brief.</Text>
        <ActionButton variant="primary" label="Build the brief" onPress={() => router.push('/start')} />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  hero: { gap: spacing.lg, paddingBottom: spacing.hero },
  eyebrow: { color: colors.orange, fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.3 },
  heroTitle: { color: colors.textOnDark, fontFamily: type.display, fontSize: type.hero, lineHeight: 46, letterSpacing: -2.1 },
  heroBody: { color: colors.textMutedDark, fontFamily: type.body, fontSize: 17, lineHeight: 25, maxWidth: 620 },
  chapter: { gap: spacing.xxl, paddingVertical: spacing.section, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.ruleDark },
  intentList: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.ruleDark },
  intentRow: { minHeight: 74, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.ruleDark, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  intentCopy: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  intentIndex: { color: colors.orange, fontFamily: type.mono, fontSize: type.micro },
  intentLabel: { color: colors.textOnDark, fontFamily: type.body, fontSize: 18, fontWeight: '600', flexShrink: 1 },
  intentArrow: { color: colors.textMutedDark, fontSize: 22 },
  workSection: { gap: spacing.xxl, paddingVertical: spacing.section },
  rail: { gap: spacing.md, paddingRight: spacing.xl },
  lightChapter: { backgroundColor: colors.warm, padding: spacing.xl, gap: spacing.lg, marginTop: spacing.section },
  lightKicker: { color: colors.orange, fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.4 },
  lightTitle: { color: colors.textOnLight, fontFamily: type.display, fontSize: 42, lineHeight: 38, letterSpacing: -1.6 },
  lightBody: { color: colors.textMutedLight, fontFamily: type.body, fontSize: type.bodySize, lineHeight: 23 },
})
