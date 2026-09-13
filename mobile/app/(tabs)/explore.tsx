import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '../../src/components/Screen'
import { AppHeader } from '../../src/components/AppHeader'
import { PressableScale } from '../../src/components/PressableScale'
import { SectionTitle } from '../../src/components/SectionTitle'
import { ActionButton } from '../../src/components/ActionButton'
import { capabilities } from '../../src/data/capabilities'
import { trackNativeEvent } from '../../src/lib/intakeClient'
import { colors, spacing, type } from '../../src/theme/tokens'

export default function ExploreScreen() {
  const router = useRouter()

  useEffect(() => { trackNativeEvent('page_view', 'native/explore') }, [])

  return (
    <Screen>
      <AppHeader />
      <SectionTitle index="03" kicker="Explore" title="Choose the change, not the department." body="Capabilities are presented as outcomes you can act on. Open one to see the operating problem, implementation path and relevant proof." />

      <View style={styles.list}>
        {capabilities.map((capability) => (
          <PressableScale accessibilityLabel={capability.verb} accessibilityHint={`Opens ${capability.title}`} key={capability.id} onPress={() => router.push({ pathname: '/capability/[id]', params: { id: capability.id } })} style={styles.row}>
            <View style={styles.rowTop}>
              <Text style={styles.index}>{capability.index}</Text>
              <Text style={styles.arrow}>→</Text>
            </View>
            <Text style={styles.verb}>{capability.verb.toUpperCase()}</Text>
            <Text style={styles.proposition}>{capability.proposition}</Text>
          </PressableScale>
        ))}
      </View>

      <View style={styles.discovery}>
        <Text style={styles.discoveryKicker}>NOT SURE YET?</Text>
        <Text style={styles.discoveryTitle}>Start with the problem.</Text>
        <Text style={styles.discoveryBody}>The guided intake accepts uncertainty. Describe what is slow, disconnected, risky or difficult; 11-11 Tech can classify the capability during discovery.</Text>
        <ActionButton label="Start discovery" onPress={() => router.push('/start')} />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  list: { marginTop: spacing.xxl, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.ruleDark },
  row: { minHeight: 156, paddingVertical: spacing.xl, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.ruleDark, gap: spacing.sm },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between' },
  index: { color: colors.orange, fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.2 },
  arrow: { color: colors.textMutedDark, fontSize: 20 },
  verb: { color: colors.textOnDark, fontFamily: type.display, fontSize: 28, lineHeight: 29, letterSpacing: -0.9 },
  proposition: { color: colors.textMutedDark, fontFamily: type.body, fontSize: 15, lineHeight: 21, maxWidth: 650 },
  discovery: { backgroundColor: colors.inkRaised, marginTop: spacing.section, padding: spacing.xl, gap: spacing.md, borderLeftWidth: 2, borderLeftColor: colors.orange },
  discoveryKicker: { color: colors.orange, fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.3 },
  discoveryTitle: { color: colors.textOnDark, fontFamily: type.display, fontSize: type.h2, letterSpacing: -1 },
  discoveryBody: { color: colors.textMutedDark, fontFamily: type.body, fontSize: type.bodySize, lineHeight: 23 },
})
