import { useMemo, useRef, useState } from 'react'
import { Linking, Platform, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { Screen } from '../../src/components/Screen'
import { AppHeader } from '../../src/components/AppHeader'
import { ActionButton } from '../../src/components/ActionButton'
import { PressableScale } from '../../src/components/PressableScale'
import { SelectionSheet } from '../../src/components/SelectionSheet'
import { capabilities, getCapability } from '../../src/data/capabilities'
import { budgetOptions, businessOutcomes, contactOptions, engagementOptions, timelineOptions } from '../../src/data/intake'
import { leadApiConfigured } from '../../src/lib/leadApi'
import { submitProjectBrief } from '../../src/lib/intakeClient'
import { colors, spacing, type } from '../../src/theme/tokens'

type SheetKey = 'budget' | 'timeline' | 'engagement' | 'preferredContact' | null

type Intake = {
  outcome: string
  capability: string
  goals: string
  currentSystem: string
  budget: string
  timeline: string
  engagement: string
  preferredContact: string
  name: string
  email: string
  organization: string
  region: string
  website: string
  consent: boolean
}

const contactEmail = 'kudzimusar@gmail.com'

export default function StartScreen() {
  const params = useLocalSearchParams<{ capability?: string }>()
  const initialCapability = getCapability(params.capability)?.id ?? ''
  const [step, setStep] = useState(0)
  const [sheet, setSheet] = useState<SheetKey>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')
  const requestId = useRef(`native-${Date.now()}-${Math.random().toString(36).slice(2)}`)
  const [intake, setIntake] = useState<Intake>({
    outcome: '', capability: initialCapability, goals: '', currentSystem: '',
    budget: 'I need help determining the budget', timeline: 'Exploring', engagement: 'Not sure yet', preferredContact: 'Email',
    name: '', email: '', organization: '', region: '', website: '', consent: false,
  })

  const selectedCapability = getCapability(intake.capability)
  const selectedOutcome = businessOutcomes.find((item) => item.id === intake.outcome)
  const progress = Math.min(step + 1, 5)
  const sheetOptions = sheet === 'budget' ? budgetOptions : sheet === 'timeline' ? timelineOptions : sheet === 'engagement' ? engagementOptions : sheet === 'preferredContact' ? contactOptions : []
  const sheetValue = sheet ? intake[sheet] : ''
  const sheetTitle = sheet === 'budget' ? 'Budget range' : sheet === 'timeline' ? 'Timeline' : sheet === 'engagement' ? 'Engagement model' : 'Preferred contact'

  const summary = useMemo(() => [
    `Outcome: ${selectedOutcome?.label || 'Needs discovery'}`,
    `Capability: ${selectedCapability?.title || 'Needs discovery'}`,
    `Problem: ${intake.goals}`,
    `Current systems: ${intake.currentSystem || 'Not specified'}`,
    `Budget: ${intake.budget}`,
    `Timeline: ${intake.timeline}`,
    `Engagement: ${intake.engagement}`,
    `Contact: ${intake.name} <${intake.email}>`,
    `Organization: ${intake.organization || 'Not specified'}`,
    `Region: ${intake.region || 'Not specified'}`,
    `Website: ${intake.website || 'Not specified'}`,
    `Preferred contact: ${intake.preferredContact}`,
  ].join('\n'), [intake, selectedCapability, selectedOutcome])

  const update = <K extends keyof Intake>(key: K, value: Intake[K]) => setIntake((current) => ({ ...current, [key]: value }))

  const validate = () => {
    if (step === 0 && !intake.outcome) return 'Choose the business outcome that is closest to the problem.'
    if (step === 1 && !intake.capability) return 'Choose a capability or select the transformation path.'
    if (step === 1 && intake.goals.trim().length < 20) return 'Describe the problem in at least 20 characters so the brief has useful context.'
    if (step === 3 && !intake.name.trim()) return 'Add your name.'
    if (step === 3 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(intake.email.trim())) return 'Add a valid work email.'
    if (step === 4 && !intake.consent) return 'Consent is required before the project brief can be submitted.'
    return ''
  }

  const next = () => {
    const message = validate()
    if (message) { setError(message); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined); return }
    setError('')
    setStep((value) => Math.min(4, value + 1))
  }

  const back = () => { setError(''); setStep((value) => Math.max(0, value - 1)) }

  const submit = async () => {
    const message = validate()
    if (message) { setError(message); return }
    setSubmitting(true); setError('')
    try {
      const result = await submitProjectBrief({
        name: intake.name.trim(), email: intake.email.trim(), organization: intake.organization.trim(), region: intake.region.trim(), website: intake.website.trim(),
        industry: '', capability: intake.capability, service: '', outcome: intake.outcome, currentSystem: intake.currentSystem.trim(), goals: intake.goals.trim(),
        budget: intake.budget, timeline: intake.timeline, engagement: intake.engagement, legalNeeds: [], consent: intake.consent,
        preferredContact: intake.preferredContact, referralSource: 'Native app', company_website: '',
      }, requestId.current)
      setReference(result.reference)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Secure submission was unavailable.')
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined)
    } finally {
      setSubmitting(false)
    }
  }

  const emailFallback = () => {
    const subject = encodeURIComponent(`11-11 Tech native project brief — ${intake.organization || intake.name || 'New opportunity'}`)
    const body = encodeURIComponent(summary)
    Linking.openURL(`mailto:${contactEmail}?subject=${subject}&body=${body}`).catch(() => setError('Email could not be opened on this device.'))
  }

  if (reference) {
    return (
      <Screen>
        <AppHeader />
        <View style={styles.success}>
          <Text style={styles.successMark}>✓</Text>
          <Text style={styles.kicker}>PROJECT RECEIVED</Text>
          <Text style={styles.hero}>THE BRIEF IS{`\n`}IN THE SYSTEM.</Text>
          <View style={styles.reference}><Text style={styles.referenceLabel}>REFERENCE</Text><Text style={styles.referenceValue}>{reference}</Text></View>
          <Text style={styles.lead}>The secure intake has stored your structured project brief for follow-up. Keep the reference for your records.</Text>
          <View style={styles.nextSteps}>
            {['We review the business problem', 'We confirm the right capability', 'We respond through your preferred contact route', 'We define the next useful step'].map((item, index) => (
              <View style={styles.nextRow} key={item}><Text style={styles.nextIndex}>0{index + 1}</Text><Text style={styles.nextCopy}>{item}</Text></View>
            ))}
          </View>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <AppHeader />
      <View style={styles.progressHeader}>
        <Text style={styles.kicker}>START A PROJECT</Text>
        <Text style={styles.progressText}>{String(progress).padStart(2, '0')} / 05</Text>
      </View>
      <View style={styles.progressTrack}>{[0,1,2,3,4].map((index) => <View key={index} style={[styles.progressSegment, index <= step && styles.progressActive]} />)}</View>

      {step === 0 && (
        <View style={styles.step}>
          <Text style={styles.hero}>WHAT SHOULD{`\n`}CHANGE?</Text>
          <Text style={styles.lead}>Start with the business outcome. The technology label can come later.</Text>
          <View style={styles.choiceList}>
            {businessOutcomes.map((outcome) => {
              const active = intake.outcome === outcome.id
              return (
                <PressableScale key={outcome.id} onPress={() => { update('outcome', outcome.id); if (!intake.capability) update('capability', outcome.capability) }} style={[styles.choice, active && styles.choiceActive]}>
                  <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{outcome.label}</Text><Text style={[styles.choiceArrow, active && styles.choiceTextActive]}>{active ? '●' : '→'}</Text>
                </PressableScale>
              )
            })}
          </View>
        </View>
      )}

      {step === 1 && (
        <View style={styles.step}>
          <Text style={styles.hero}>ROUTE THE{`\n`}OPPORTUNITY.</Text>
          <Text style={styles.lead}>Confirm the capability, then describe what happens today and what should happen instead.</Text>
          <View style={styles.capabilityGrid}>
            {capabilities.map((capability) => {
              const active = intake.capability === capability.id
              return (
                <PressableScale key={capability.id} onPress={() => update('capability', capability.id)} style={[styles.capabilityChoice, active && styles.capabilityActive]}>
                  <Text style={[styles.capabilityIndex, active && styles.darkText]}>{capability.index}</Text><Text style={[styles.capabilityText, active && styles.darkText]}>{capability.shortTitle}</Text>
                </PressableScale>
              )
            })}
          </View>
          <FieldLabel label="WHAT SHOULD CHANGE? *" />
          <TextInput multiline value={intake.goals} onChangeText={(value) => update('goals', value)} placeholder="Describe the current problem, who is affected and what a better state would look like." placeholderTextColor={colors.textMutedLight} style={[styles.input, styles.textarea]} />
          <FieldLabel label="CURRENT SYSTEMS / TOOLS" />
          <TextInput value={intake.currentSystem} onChangeText={(value) => update('currentSystem', value)} placeholder="Excel, HubSpot, Microsoft 365, legacy app..." placeholderTextColor={colors.textMutedLight} style={styles.input} />
        </View>
      )}

      {step === 2 && (
        <View style={styles.step}>
          <Text style={styles.hero}>SCOPE THE{`\n`}PRACTICALITIES.</Text>
          <Text style={styles.lead}>Ranges are enough. Tap any row to change it in a native selection sheet.</Text>
          <SelectionRow label="Budget" value={intake.budget} onPress={() => setSheet('budget')} />
          <SelectionRow label="Timeline" value={intake.timeline} onPress={() => setSheet('timeline')} />
          <SelectionRow label="Engagement" value={intake.engagement} onPress={() => setSheet('engagement')} />
          <SelectionRow label="Contact route" value={intake.preferredContact} onPress={() => setSheet('preferredContact')} />
        </View>
      )}

      {step === 3 && (
        <View style={styles.step}>
          <Text style={styles.hero}>WHO ARE WE{`\n`}SPEAKING WITH?</Text>
          <Text style={styles.lead}>Enough information to route the brief and respond professionally.</Text>
          <FieldLabel label="NAME *" /><TextInput autoComplete="name" value={intake.name} onChangeText={(value) => update('name', value)} style={styles.input} placeholder="Your name" placeholderTextColor={colors.textMutedLight} />
          <FieldLabel label="WORK EMAIL *" /><TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" value={intake.email} onChangeText={(value) => update('email', value)} style={styles.input} placeholder="you@company.com" placeholderTextColor={colors.textMutedLight} />
          <FieldLabel label="ORGANIZATION" /><TextInput autoComplete="organization" value={intake.organization} onChangeText={(value) => update('organization', value)} style={styles.input} placeholder="Organization" placeholderTextColor={colors.textMutedLight} />
          <FieldLabel label="REGION" /><TextInput value={intake.region} onChangeText={(value) => update('region', value)} style={styles.input} placeholder="Japan, Africa, Europe, Americas..." placeholderTextColor={colors.textMutedLight} />
          <FieldLabel label="EXISTING PRODUCT / WEBSITE" /><TextInput autoCapitalize="none" keyboardType="url" value={intake.website} onChangeText={(value) => update('website', value)} style={styles.input} placeholder="https://" placeholderTextColor={colors.textMutedLight} />
        </View>
      )}

      {step === 4 && (
        <View style={styles.step}>
          <Text style={styles.hero}>REVIEW THE{`\n`}PROJECT BRIEF.</Text>
          <Text style={styles.lead}>{leadApiConfigured ? 'The final action sends this structure to the same secure 11-11 Tech lead service used by the website.' : 'The secure endpoint is not configured in this build. Your complete brief can still be opened as an email draft.'}</Text>
          <View style={styles.review}>
            <ReviewRow label="Outcome" value={selectedOutcome?.label || 'Needs discovery'} />
            <ReviewRow label="Capability" value={selectedCapability?.title || 'Needs discovery'} />
            <ReviewRow label="Budget" value={intake.budget} />
            <ReviewRow label="Timeline" value={intake.timeline} />
            <ReviewRow label="Contact" value={`${intake.name} · ${intake.email}`} />
            <ReviewRow label="Organization" value={intake.organization || '—'} />
          </View>
          <View style={styles.problemBlock}><Text style={styles.problemLabel}>PROBLEM</Text><Text style={styles.problemText}>{intake.goals}</Text></View>
          <View style={styles.consentRow}><View style={styles.consentCopy}><Text style={styles.consentTitle}>Contact consent *</Text><Text style={styles.consentBody}>I consent to being contacted about this project inquiry.</Text></View><Switch value={intake.consent} onValueChange={(value) => update('consent', value)} trackColor={{ false: colors.ruleDark, true: colors.orange }} thumbColor={Platform.OS === 'android' ? colors.paper : undefined} /></View>
        </View>
      )}

      {error ? <View style={styles.error}><Text style={styles.errorText}>{error}</Text></View> : null}

      <View style={styles.actions}>
        {step > 0 ? <ActionButton variant="outline" label="Back" onPress={back} /> : null}
        {step < 4 ? <ActionButton label="Continue" onPress={next} /> : leadApiConfigured ? <ActionButton label={submitting ? 'Submitting…' : 'Submit securely'} onPress={submit} disabled={submitting} /> : <ActionButton label="Open email brief" onPress={emailFallback} />}
        {step === 4 && leadApiConfigured && error ? <ActionButton variant="outline" label="Use email fallback" onPress={emailFallback} /> : null}
      </View>

      <SelectionSheet visible={sheet !== null} title={sheetTitle} options={sheetOptions} value={sheetValue} onSelect={(value) => { if (sheet) update(sheet, value) }} onClose={() => setSheet(null)} />
    </Screen>
  )
}

function FieldLabel({ label }: { label: string }) { return <Text style={styles.fieldLabel}>{label}</Text> }

function SelectionRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return <PressableScale onPress={onPress} style={styles.selectionRow}><View style={styles.selectionCopy}><Text style={styles.selectionLabel}>{label.toUpperCase()}</Text><Text style={styles.selectionValue}>{value}</Text></View><Text style={styles.selectionArrow}>⌄</Text></PressableScale>
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return <View style={styles.reviewRow}><Text style={styles.reviewLabel}>{label.toUpperCase()}</Text><Text style={styles.reviewValue}>{value}</Text></View>
}

const styles = StyleSheet.create({
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: { color: colors.orange, fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.4 },
  progressText: { color: colors.textMutedDark, fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.1 },
  progressTrack: { height: 2, flexDirection: 'row', gap: 4, marginTop: spacing.md, marginBottom: spacing.xxl },
  progressSegment: { flex: 1, backgroundColor: colors.ruleDark },
  progressActive: { backgroundColor: colors.orange },
  step: { gap: spacing.md },
  hero: { color: colors.textOnDark, fontFamily: type.display, fontSize: 43, lineHeight: 39, letterSpacing: -1.7 },
  lead: { color: colors.textMutedDark, fontFamily: type.body, fontSize: type.bodySize, lineHeight: 23, maxWidth: 650 },
  choiceList: { marginTop: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.ruleDark },
  choice: { minHeight: 64, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.ruleDark, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  choiceActive: { borderTopColor: colors.orange },
  choiceText: { color: colors.textOnDark, fontFamily: type.body, fontSize: 16, flex: 1 },
  choiceTextActive: { color: colors.orange },
  choiceArrow: { color: colors.textMutedDark, fontSize: 16 },
  capabilityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginVertical: spacing.md },
  capabilityChoice: { width: '48%', minHeight: 80, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.ruleDark, padding: spacing.sm, justifyContent: 'space-between' },
  capabilityActive: { backgroundColor: colors.orange, borderColor: colors.orange },
  capabilityIndex: { color: colors.orange, fontFamily: type.mono, fontSize: type.micro },
  capabilityText: { color: colors.textOnDark, fontFamily: type.body, fontSize: 13, fontWeight: '600' },
  darkText: { color: colors.ink },
  fieldLabel: { color: colors.textMutedDark, fontFamily: type.mono, fontSize: 9, letterSpacing: 1.2, marginTop: spacing.sm },
  input: { minHeight: 54, backgroundColor: colors.warm, color: colors.textOnLight, paddingHorizontal: spacing.md, fontFamily: type.body, fontSize: 16, borderWidth: 1, borderColor: colors.warm },
  textarea: { minHeight: 142, paddingTop: spacing.md, textAlignVertical: 'top' },
  selectionRow: { minHeight: 78, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.ruleDark, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  selectionCopy: { gap: 6, flex: 1 },
  selectionLabel: { color: colors.orange, fontFamily: type.mono, fontSize: 9, letterSpacing: 1.1 },
  selectionValue: { color: colors.textOnDark, fontFamily: type.body, fontSize: 17 },
  selectionArrow: { color: colors.textMutedDark, fontSize: 20 },
  review: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.ruleDark, marginTop: spacing.sm },
  reviewRow: { minHeight: 62, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.ruleDark, paddingVertical: spacing.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.lg },
  reviewLabel: { color: colors.textMutedDark, fontFamily: type.mono, fontSize: 9, letterSpacing: 1 },
  reviewValue: { color: colors.textOnDark, fontFamily: type.body, fontSize: 14, textAlign: 'right', flex: 1 },
  problemBlock: { backgroundColor: colors.inkRaised, padding: spacing.md, gap: spacing.sm, borderLeftWidth: 2, borderLeftColor: colors.orange },
  problemLabel: { color: colors.orange, fontFamily: type.mono, fontSize: 9, letterSpacing: 1.1 },
  problemText: { color: colors.textOnDark, fontFamily: type.body, fontSize: 15, lineHeight: 22 },
  consentRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  consentCopy: { flex: 1, gap: 4 },
  consentTitle: { color: colors.textOnDark, fontFamily: type.body, fontSize: 15, fontWeight: '700' },
  consentBody: { color: colors.textMutedDark, fontFamily: type.body, fontSize: 12, lineHeight: 18 },
  actions: { gap: spacing.sm, marginTop: spacing.xxl },
  error: { marginTop: spacing.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.danger, backgroundColor: '#241315' },
  errorText: { color: '#FFD1D1', fontFamily: type.body, fontSize: 13, lineHeight: 19 },
  success: { gap: spacing.lg, paddingTop: spacing.xl },
  successMark: { color: colors.success, fontSize: 46 },
  reference: { borderWidth: 1, borderColor: colors.orange, padding: spacing.lg, gap: 8 },
  referenceLabel: { color: colors.orange, fontFamily: type.mono, fontSize: 9, letterSpacing: 1.2 },
  referenceValue: { color: colors.textOnDark, fontFamily: type.mono, fontSize: 18 },
  nextSteps: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.ruleDark },
  nextRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.ruleDark },
  nextIndex: { color: colors.orange, fontFamily: type.mono, fontSize: type.micro },
  nextCopy: { color: colors.textOnDark, fontFamily: type.body, fontSize: 15, flex: 1 },
})
