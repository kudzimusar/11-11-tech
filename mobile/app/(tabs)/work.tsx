import { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '../../src/components/Screen'
import { AppHeader } from '../../src/components/AppHeader'
import { PressableScale } from '../../src/components/PressableScale'
import { ProjectScene } from '../../src/components/ProjectScene'
import { SectionTitle } from '../../src/components/SectionTitle'
import { projects } from '../../src/data/projects'
import { colors, spacing, type } from '../../src/theme/tokens'

export default function WorkScreen() {
  const router = useRouter()
  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map((project) => project.category)))], [])
  const [category, setCategory] = useState('All')
  const visible = category === 'All' ? projects : projects.filter((project) => project.category === category)

  return (
    <Screen>
      <AppHeader />
      <SectionTitle index="04" kicker="Selected work" title="Systems with real maturity labels." body="The native portfolio keeps commercial proof separate from theatre. Every project says what it is today before it says what it demonstrates." />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {categories.map((item) => {
          const active = item === category
          return (
            <PressableScale key={item} onPress={() => setCategory(item)} style={[styles.filter, active && styles.filterActive]}>
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{item.toUpperCase()}</Text>
            </PressableScale>
          )
        })}
      </ScrollView>

      <View style={styles.list}>
        {visible.map((project, index) => (
          <PressableScale key={project.slug} onPress={() => router.push({ pathname: '/project/[slug]', params: { slug: project.slug } })} style={styles.project}>
            <Text style={styles.number}>{String(index + 1).padStart(2, '0')} / {String(visible.length).padStart(2, '0')}</Text>
            <ProjectScene project={project} />
            <View style={styles.copy}>
              <Text style={styles.description}>{project.description}</Text>
              <Text style={styles.open}>OPEN SYSTEM STORY →</Text>
            </View>
          </PressableScale>
        ))}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  filters: { gap: spacing.xs, paddingVertical: spacing.xxl, paddingRight: spacing.xl },
  filter: { minHeight: 40, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.ruleDark, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
  filterActive: { backgroundColor: colors.orange, borderColor: colors.orange },
  filterText: { color: colors.textMutedDark, fontFamily: type.mono, fontSize: 9, letterSpacing: 1 },
  filterTextActive: { color: colors.ink },
  list: { gap: spacing.section },
  project: { gap: spacing.md },
  number: { color: colors.textMutedDark, fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.2 },
  copy: { gap: spacing.sm, paddingRight: spacing.md },
  description: { color: colors.textMutedDark, fontFamily: type.body, fontSize: 15, lineHeight: 22 },
  open: { color: colors.orange, fontFamily: type.mono, fontSize: 9, letterSpacing: 1.2 },
})
