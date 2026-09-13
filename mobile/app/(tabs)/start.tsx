import { useEffect, useMemo, useRef, useState } from 'react'
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
import { submitProjectBrief, trackNativeEvent } from '../../src/lib/intakeClient'
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

function newRequestId() {
  return `native-${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`
}

function emptyIntake(capability = ''): Intake {
  return {
    outcome: '', capability, goals: '', currentSystem: '',
    budget: 'I need help determining the budget', timeline: 'Exploring', engagement: 'Not sure yet', preferredContact: 'Email',
    name: '', email: '', organization: '', region: '', website: '', consent: false,
  }
}

function validEmail(value: string) {
  const email = value.trim()
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validWebsite(value: string) {
  const raw = value.trim()
  if (!raw) return true
  try {
    const url = new URL(raw)
    return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password
  } catch {
    return false
  }
}

export default function StartScreen() {
  const params = useLocalSearchParams<{ capability?: string }>()
  const routedCapability = getCapability(params.capability)?.id ?? ''
  const [step, setStep] = useState(0)
  const [sheet, setSheet] = useState<SheetKey>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')
  const requestId = useRef(newRequestId())
  const [intake, setIntake] = useState<Intake>(() => emptyIntake(routedCapability))

  useEffect(() => {
    if (!routedCapability) return
    setIntake((current) => current.capability === routedCapability ? current : { ...current, capability: routedCapability })
  }, [routedCapability])

  useEffect(() => { trackNativeEvent('page_view', 'native/start') }, [])
  useEffect(() => { trackNativeEvent('intake_step_viewed', 'native/start', { step: String(step + 1) }, intake.capability) }, [step])

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

  const validateStep = () => {
    if (step === 0 && !intake.outcome) return 'Choose the business outcome that is closest to the problem.'
    if (step === 1 && !intake.capability) return 'Choose a capability or select the transformation path.'
    if (step === 1 && intake.goals.trim().length < 20) return 'Describe the problem in at least 20 characters so the brief has useful context.'
    if (step === 3 && !intake.name.trim()) return 'Add your name.'
    if (step === 3 && !validEmail(intake.email)) return 'Add a valid work email.'
    if (step === 3 && !validWebsite(intake.website)) return 'Use a valid http or https website URL without embedded credentials.'
    if (step === 4 && !intake.consent) return 'Consent is required before the project brief can be submitted.'
    return ''
  }

  const validateSubmission = () => {
    if (!intake.outcome) return 'Choose the business outcome before submitting.'
    if (!intake.capability) return 'Choose a capability before submitting.'
    if (intake.goals.trim().length < 20) return 'Describe the problem in at least 20 characters.'
    if (!intake.name.trim()) return 'Add your name.'
    if (!validEmail(intake.email)) return 'Add a valid work email.'
    if (!validWebsite(intake.website)) return 'Use a valid http or https website URL without embedded credentials.'
    if (!intake.consent) return 'Consent is required before the project brief can be submitted.'
    return ''
  }

  const showValidation = (message: string) => {
    setError(message)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined)
  }

  const next = () => {
    const message = validateStep()
    if (message) { showValidation(message); return }
    setError('')
    setStep((value) => Math.min(4, value + 1))
  }

  const back = () => {
    setError('')
    setStep((value) => Math.max(0, value - 1))
  }

  const submit = async () => {
    if (submitting) return
    const message = validateSubmission()
    if (message) { showValidation(message); return }

    setSubmitting(true)
    setError('')
    trackNativeEvent('lead_submit_attempt', 'native/start', { step: 'submit' }, intake.capability)
    try {
      const result = await submitProjectBrief({
        name: intake.name.trim(), email: intake.email.trim().toLowerCase(), organization: intake.organization.trim(), region: intake.region.trim(), website: intake.website.trim(),
        industry: '', capability: intake.capability, service: '', outcome: intake.outcome, currentSystem: intake.currentSystem.trim(), goals: intake.goals.trim(),
        budget: intake.budget, timeline: intake.timeline, engagement: intake.engagement, legalNeeds: [], consent: intake.consent,
        preferredContact: intake.preferredContact, referralSource: 'Native app', company_website: '',
      }, requestId.current)
      setReference(result.reference)
      trackNativeEvent('lead_success', 'native/start', { reference: result.reference }, intake.capability)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined)
    } catch (failure) {
      trackNativeEvent('lead_submit_failed', 'native/start', { reason: 'request_failed' }, intake.capability)
      setError(failure instanceof Error ? failure.message : 'Secure submission was unavailable.')
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined)
    } finally {
      setSubmitting(false)
    }
  }

  const emailFallback = () => {
    trackNativeEvent('lead_email_fallback', 'native/start', { step: String(step + 1) }, intake.capability)
    const subject = encodeURIComponent(`11-11 Tech native project brief — ${intake.organization || intake.name || 'New opportunity'}`)
    const body = encodeURIComponent(summary)
    Linking.openURL(`mailto:${contactEmail}?subject=${subject}&body=${body}`).catch(() => setError('Email could not be opened on this device.'))
  }

  const startAnother = () => {
    requestId.current = newRequestId()
    setIntake(emptyIntake(routedCapability))
    setReference('')
    setError('')
    setSheet(null)
    setStep(0)
  }

  if (reference) {
    return (
      <Screen resetScrollKey="success">
        <AppHeader />
        <View style={styles.success}>
          <Text style={styles.successMark}>✓</Text>
          <Text style={styles.kicker}>PROJECT RECEIVED</Text>
          <Text accessibilityRole="header" style={styles.hero}>THE BRIEF IS{`\n`}IN THE SYSTEM.</Text>
          <View style={styles.reference}><Text style={styles.referenceLabel}>REFERENCE</Text><Text selectable style={styles.referenceValue}>{reference}</Text></View>
          <Text style={styles.lead}>The secure intake has stored your structured project brief for follow-up. Keep the reference for your records.</Text>
          <View style={styles.nextSteps}>
            {['We review the business problem', 'We confirm the right capability', 'We respond through your preferred contact route', 'We define the next useful step'].map((item, index) => (
              <View style={styles.nextRow} key={item}><Text style={styles.nextIndex}>0{index + 1}</Text><Text style={styles.nextCopy}>{item}</Text></View>
            ))}
          </View>
          <ActionButton variant="outline" label="Start another brief" onPress={startAnother} />
        </View>
      </Screen>
    )
  }

  return (
    <Screen resetScrollKey={step}>
      <AppHeader />
      <View style={styles.progressHeader}>
        <Text style={styles.kicker}>START A PROJECT</Text>
        <Text accessibilityLabel={`Step ${progress} of 5`} style={styles.progressText}>{String(progress).padStart(2, '0')} / 05</Text>
      </View>
      <View style={styles.progressTrack}>{[0, 1, 2, 3, 4].map((index) => <View key={index} style={[styles.progressSegment, index <= step && styles.progressActive]} />)}</View>

      {step === 0 && (
        <View style={styles.step}>
          <Text accessibilityRole="header" style={styles.hero}>WHAT SHOULD{`\n`}CHANGE?</Text>
          <Text style={styles.lead}>Start with the business outcome. The technology label can come later.</Text>
          <View style={styles.choiceList}>
            {businessOutcomes.map((outcome) => {
              const active = intake.outcome === outcome.id
              return (
                <PressableScale accessibilityLabel={outcome.label} selected={active} key={outcome.id} onPress={() => { update('outcome', outcome.id); if (!intake.capability) update('capability', outcome.capability) }} style={[styles.choice, active && styles.choiceActive]}>
                  <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{outcome.label}</Text><Text style={[styles.choiceArrow, active && styles.choiceTextActive]}>{active ? '●' : '→'}</Text>
                </PressableScale>
              )
            })}
          </View>
        </View>
      )}

      {step === 1 && (
        <View style={styles.step}>
          <Text accessibilityRole="header" style={styles.hero}>ROUTE THE{`\n`}OPPORTUNITY.</Text>
          <Text style={styles.lead}>Confirm the capability, then describe what happens today and what should happen instead.</Text>
          <View style={styles.capabilityGrid}>
            {capabilities.map((capability) => {
              const active = intake.capability === capability.id
              return (
                <PressableScale accessibilityLabel={capability.title} selected={active} key={capability.id} onPress={() => update('capability', capability.id)} style={[styles.capabilityChoice, active && styles.capabilityActive]}>
                  <Text style={[styles.capabilityIndex, active && styles.darkText]}>{capability.index}</Text><Text style={[styles.capabilityText, active && styles.darkText]}>{capability.shortTitle}</Text>
                </PressableScale>
              )
            })}
          </View>
          <FieldLabel label="WHAT SHOULD CHANGE? *" />
          <TextInput multiline maxLength={5000} textAlignVertical="top" selectionColor={colors.orange} value={intake.goals} onChangeText={(value) => update('goals', value)} placeholder="Describe the current problem, who is affected and what a better state would look like." placeholderTextColor={colors.textMutedLight} style={[styles.input, styles.textarea]} />
          <FieldLabel label="CURRENT SYSTEMS / TOOLS" />
          <TextInput maxLength={1000} selectionColor={colors.orange} value={intake.currentSystem} onChangeText={(value) => update('currentSystem', value)} placeholder="Excel, HubSpot, Microsoft 365, legacy app..." placeholderTextColor={colors.textMutedLight} style={styles.input} />
        </View>
      )}

      {step === 2 && (
        <View style={styles.step}>
          <Text accessibilityRole="header" style={styles.hero}>SCOPE THE{`\n`}PRACTICALITIES.</Text>
          <Text style={styles.lead}>Ranges are enough. Tap any row to change it in a native selection sheet.</Text>
          <SelectionRow label="Budget" value={intake.budget} onPress={() => setSheet('budget')} />
          <SelectionRow label="Timeline" value={intake.timeline} onPress={() => setSheet('timeline')} />
          <SelectionRow label="Engagement" value={intake.engagement} onPress={() => setSheet('engagement')} />
          <SelectionRow label="Contact route" value={intake.preferredContact} onPress={() => setSheet('preferredContact')} />
        </View>
      )}

      {step === 3 && (
        <View style={styles.step}>
          <Text accessibilityRole="header" style={styles.hero}>WHO ARE WE{`\n`}SPEAKING WITH?</Text>
          <Text style={styles.lead}>Enough information to route the brief and respond professionally.</Text>
          <FieldLabel label="NAME *" /><TextInput maxLength={160} autoComplete="name" value={intake.name} onChangeText={(value) => update('name', value)} style={styles.input} placeholder="Your name" placeholderTextColor={colors.textMutedLight} selectionColor={colors.orange} />
          <FieldLabel label="WORK EMAIL *" /><TextInput maxLength={254} autoCapitalize="none" autoCorrect={false} autoComplete="email" keyboardType="email-address" value={intake.email} onChangeText={(value) => update('email', value)} style={styles.input} placeholder="you@company.com" placeholderTextColor={colors.textMutedLight} selectionColor={colors.orange} />
          <FieldLabel label="ORGANIZATION" /><TextInput maxLength={200} autoComplete="organization" value={intake.organization} onChangeText={(value) => update('organization', value)} style={styles.input} placeholder="Organization" placeholderTextColor={colors.textMutedLight} selectionColor={colors.orange} />
          <FieldLabel label="REGION" /><TextInput maxLength={100} value={intake.region} onChangeText={(value) => update('region', value)} style={styles.input} placeholder="Japan, Africa, Europe, Americas..." placeholderTextColor={colors.textMutedLight} selectionColor={colors.orange} />
          <FieldLabel label="EXISTING PRODUCT / WEBSITE" /><TextInput maxLength={500} autoCapitalize="none" autoCorrect={false} keyboardType="url" value={intake.website} onChangeText={(value) => update('website', value)} style={styles.input} placeholder="https://" placeholderTextColor={colors.textMutedLight} selectionColor={colors.orange} />
        </View>
      )}

      {step === 4 && (
        <View style={styles.step}>
          <Text accessibilityRole="header" style={styles.hero}>REVIEW THE{`\n`}PROJECT BRIEF.</Text>
          <Text style={styles.lead}>{leadApiConfigured ? 'The final action sends this structure to the same hardened 11-11 Tech lead service used by the website.' : 'The secure endpoint is not configured in this build. Your complete brief can still be opened as an email draft.'}</Text>
          <View style={styles.review}>
            <ReviewRow label="Outcome" value={selectedOutcome?.label || 'Needs discovery'} />
            <ReviewRow label="Capability" value={selectedCapability?.title || 'Needs discovery'} />
            <ReviewRow label="Budget" value={intake.budget} />
            <ReviewRow label="Timeline" value={intake.timeline} />
            <ReviewRow label="Contact" value={`${intake.name} · ${intake.email}`} />
            <ReviewRow label="Organization" value={intake.organization || '—'} />
          </View>
          <View style={styles.problemBlock}><Text style={styles.problemLabel}>PROBLEM</Text><Text style={styles.problemText}>{intake.goals}</Text></View>
          <View style={styles.consentRow}><View style={styles.consentCopy}><Text style={styles.consentTitle}>Contact consent *</Text><Text style={styles.consentBody}>I consent to being contacted about this project inquiry.</Text></View><Switch accessibilityLabel="Consent to project follow-up" value={intake.consent} onValueChange={(value) => update('consent', value)} trackColor={{ false: colors.ruleDark, true: colors.orange }} thumbColor={Platform.OS === 'android' ? colors.paper : undefined} /></View>
        </View>
      )}

      {error ? <View style={styles.error}><Text accessibilityRole="alert" style={styles.errorText}>{error}</Text></View> : null}

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
  return <PressableScale accessibilityLabel={`${label}: ${value}`} accessibilityHint={`Change ${label.toLowerCase()}`} onPress={onPress} style={styles.selectionRow}><View style={styles.selectionCopy}><Text style={styles.selectionLabel}>{label.toUpperCase()}</Text><Text style={styles.selectionValue}>{value}</Text></View><Text style={styles.selectionArrow}>⌄</Text></PressableScale>
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return <View style={styles.reviewRow}><Text style={styles.reviewLabel}>{label.toUpperCase()}</Text><Text style={styles.reviewValue}>{value}</Text></View>
}

const styles = StyleSheet.create({
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md },
  kicker: { color: colors.orange, fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.4 },
  progressText: { color: colors.textMutedDark, fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.1 },
  progressTrack: { height: 2, flexDirection: 'row', gap: 4, marginTop: spacing.md, marginBottom: spacing.xxl },
  progressSegment: { flex: 1, backgroundColor: colors.ruleDark },
  progressActive: { backgroundColor: colors.orange },
  step: { gap: spacing.lg },
  hero: { color: colors.textOnDark, fontFamily: type.display, fontSize: 44, lineHeight: 41, letterSpacing: -1.7 },
  lead: { color: colors.textMutedDark, fontFamily: type.body, fontSize: 16, lineHeight: 24, maxWidth: 680 },
  choiceList: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.ruleDark },
  choice: { minHeight: 66, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.ruleDark, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  choiceActive: { borderTopColor: colors.orange },
  choiceText: { color: colors.textOnDark, fontFamily: type.body, fontSize: 16, flex: 1 },
  choiceTextActive: { color: colors.orange },
  choiceArrow: { color: colors.textMutedDark, fontSize: 18 },
  capabilityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  capabilityChoice: { width: '48%', minHeight: 86, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.ruleDark, padding: spacing.md, justifyContent: 'space-between', gap: spacing.sm },
  capabilityActive: { backgroundColor: colors.orange, borderColor: colors.orange },
  capabilityIndex: { color: colors.orange, fontFamily: type.mono, fontSize: type.micro },
  capabilityText: { color: colors.textOnDark, fontFamily: type.body, fontSize: 14, fontWeight: '700' },
  darkText: { color: colors.ink },
  fieldLabel: { color: colors.textMutedDark, fontFamily: type.mono, fontSize: 9, letterSpacing: 1.1, marginTop: spacing.sm },
  input: { minHeight: 54, backgroundColor: colors.paper, color: colors.textOnLight, borderWidth: 1, borderColor: colors.ruleLight, paddingHorizontal: 14, paddingVertical: 12, fontFamily: type.body, fontSize: 16 },
  textarea: { minHeight: 150 },
  selectionRow: { minHeight: 72, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.ruleDark, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  selectionCopy: { flex: 1, gap: 5 },
  selectionLabel: { color: colors.textMutedDark, fontFamily: type.mono, fontSize: 9, letterSpacing: 1.1 },
  selectionValue: { color: colors.textOnDark, fontFamily: type.body, fontSize: 16 },
  selectionArrow: { color: colors.orange, fontSize: 20 },
  review: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.ruleDark },
  reviewRow: { minHeight: 62, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.ruleDark, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.lg },
  reviewLabel: { color: colors.textMutedDark, fontFamily: type.mono, fontSize: 9, letterSpacing: 1.1 },
  reviewValue: { color: colors.textOnDark, fontFamily: type.body, fontSize: 14, textAlign: 'right', flex: 1 },
  problemBlock: { backgroundColor: colors.inkRaised, borderLeftWidth: 2, borderLeftColor: colors.orange, padding: spacing.lg, gap: spacing.sm },
  problemLabel: { color: colors.orange, fontFamily: type.mono, fontSize: 9, letterSpacing: 1.1 },
  problemText: { color: colors.textOnDark, fontFamily: type.body, fontSize: 15, lineHeight: 22 },
  consentRow: { minHeight: 76, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.ruleDark },
  consentCopy: { flex: 1, gap: 4 },
  consentTitle: { color: colors.textOnDark, fontFamily: type.body, fontSize: 15, fontWeight: '700' },
  consentBody: { color: colors.textMutedDark, fontFamily: type.body, fontSize: 13, lineHeight: 19 },
  error: { marginTop: spacing.xl, backgroundColor: '#2A1214', borderLeftWidth: 2, borderLeftColor: colors.danger, padding: spacing.md },
  errorText: { color: '#FFD9D9', fontFamily: type.body, fontSize: 14, lineHeight: 20 },
  actions: { gap: spacing.sm, marginTop: spacing.xxl },
  success: { gap: spacing.xl, paddingBottom: spacing.section },
  successMark: { color: colors.success, fontSize: 38 },
  reference: { backgroundColor: colors.inkRaised, padding: spacing.lg, gap: spacing.xs, borderLeftWidth: 2, borderLeftColor: colors.orange },
  referenceLabel: { color: colors.textMutedDark, fontFamily: type.mono, fontSize: 9, letterSpacing: 1.2 },
  referenceValue: { color: colors.textOnDark, fontFamily: type.mono, fontSize: 20, letterSpacing: 0.8 },
  nextSteps: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.ruleDark },
  nextRow: { minHeight: 64, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.ruleDark, flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  nextIndex: { color: colors.orange, fontFamily: type.mono, fontSize: type.micro },
  nextCopy: { color: colors.textOnDark, fontFamily: type.body, fontSize: 15, flex: 1 },
})
