import { useEffect, useMemo, useRef, useState } from 'react'
import { Linking, Platform, StyleSheet, Switch, Text, TextInput, View, useWindowDimensions } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { Screen } from '../../src/components/Screen'
import { AppHeader } from '../../src/components/AppHeader'
import { ActionButton } from '../../src/components/ActionButton'
import { PressableScale } from '../../src/components/PressableScale'
import { SelectionSheet } from '../../src/components/SelectionSheet'
import { ListRow } from '../../src/components/Editorial'
import { capabilities, getCapability } from '../../src/data/capabilities'
import { budgetOptions, businessOutcomes, contactOptions, engagementOptions, timelineOptions } from '../../src/data/intake'
import { leadApiConfigured } from '../../src/lib/leadApi'
import { submitProjectBrief, trackNativeEvent } from '../../src/lib/intakeClient'
import { useTheme } from '../../src/theme/ThemeProvider'
import { spacing, type } from '../../src/theme/tokens'

type SheetKey = 'budget' | 'timeline' | 'engagement' | 'preferredContact' | null
type CapabilitySource = 'none' | 'derived' | 'manual' | 'routed'

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
    outcome: '',
    capability,
    goals: '',
    currentSystem: '',
    budget: 'I need help determining the budget',
    timeline: 'Exploring',
    engagement: 'Not sure yet',
    preferredContact: 'Email',
    name: '',
    email: '',
    organization: '',
    region: '',
    website: '',
    consent: false,
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
  const { theme } = useTheme()
  const { width } = useWindowDimensions()

  const [step, setStep] = useState(0)
  const [sheet, setSheet] = useState<SheetKey>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [reference, setReference] = useState('')
  const [capabilitySource, setCapabilitySource] = useState<CapabilitySource>(routedCapability ? 'routed' : 'none')
  const requestId = useRef(newRequestId())
  const [intake, setIntake] = useState<Intake>(() => emptyIntake(routedCapability))

  useEffect(() => {
    if (!routedCapability) return
    setIntake((current) => current.capability === routedCapability ? current : { ...current, capability: routedCapability })
    setCapabilitySource('routed')
  }, [routedCapability])

  useEffect(() => {
    trackNativeEvent('page_view', 'native/start')
  }, [])

  useEffect(() => {
    trackNativeEvent('intake_step_viewed', 'native/start', { step: String(step + 1) }, intake.capability)
  }, [step, intake.capability])

  const selectedCapability = getCapability(intake.capability)
  const selectedOutcome = businessOutcomes.find((item) => item.id === intake.outcome)
  const progress = Math.min(step + 1, 5)
  const sheetOptions = sheet === 'budget'
    ? budgetOptions
    : sheet === 'timeline'
      ? timelineOptions
      : sheet === 'engagement'
        ? engagementOptions
        : sheet === 'preferredContact'
          ? contactOptions
          : []
  const sheetValue = sheet ? intake[sheet] : ''
  const sheetTitle = sheet === 'budget'
    ? 'Budget range'
    : sheet === 'timeline'
      ? 'Timeline'
      : sheet === 'engagement'
        ? 'Engagement model'
        : 'Preferred contact'

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

  const reviewRows: Array<{ label: string; value: string }> = [
    { label: 'Outcome', value: selectedOutcome?.label || 'Needs discovery' },
    { label: 'Capability', value: selectedCapability?.title || 'Needs discovery' },
    { label: 'Budget', value: intake.budget },
    { label: 'Timeline', value: intake.timeline },
    { label: 'Contact', value: `${intake.name} · ${intake.email}` },
    { label: 'Organization', value: intake.organization || '—' },
  ]

  const update = <K extends keyof Intake>(key: K, value: Intake[K]) => {
    setIntake((current) => ({ ...current, [key]: value }))
  }

  const selectOutcome = (outcome: (typeof businessOutcomes)[number]) => {
    const preserve = capabilitySource === 'manual' || capabilitySource === 'routed'
    setIntake((current) => ({
      ...current,
      outcome: outcome.id,
      capability: preserve ? current.capability : (outcome.capability ?? ''),
    }))
    if (!preserve) setCapabilitySource('derived')
  }

  const selectCapability = (capability: string) => {
    setCapabilitySource('manual')
    update('capability', capability)
  }

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
    if (message) {
      showValidation(message)
      return
    }
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
    if (message) {
      showValidation(message)
      return
    }

    setSubmitting(true)
    setError('')
    trackNativeEvent('lead_submit_attempt', 'native/start', { step: 'submit' }, intake.capability)

    try {
      const result = await submitProjectBrief({
        name: intake.name.trim(),
        email: intake.email.trim().toLowerCase(),
        organization: intake.organization.trim(),
        region: intake.region.trim(),
        website: intake.website.trim(),
        industry: '',
        capability: intake.capability,
        service: '',
        outcome: intake.outcome,
        currentSystem: intake.currentSystem.trim(),
        goals: intake.goals.trim(),
        budget: intake.budget,
        timeline: intake.timeline,
        engagement: intake.engagement,
        legalNeeds: [],
        consent: intake.consent,
        preferredContact: intake.preferredContact,
        referralSource: 'Native app',
        company_website: '',
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
    const message = validateSubmission()
    if (message) {
      showValidation(message)
      return
    }
    trackNativeEvent('lead_email_fallback', 'native/start', { step: String(step + 1) }, intake.capability)
    const subject = `11-11 Tech native project brief — ${intake.organization || intake.name || 'New opportunity'}`
    Linking.openURL(`mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`)
      .catch(() => setError('Email could not be opened on this device.'))
  }

  const startAnother = () => {
    requestId.current = newRequestId()
    setIntake(emptyIntake(routedCapability))
    setCapabilitySource(routedCapability ? 'routed' : 'none')
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
          <Text style={[styles.successMark, { color: theme.success }]}>✓</Text>
          <Text style={[styles.kicker, { color: theme.accent }]}>PROJECT RECEIVED</Text>
          <Text accessibilityRole="header" style={[styles.hero, { color: theme.text, fontSize: width < 360 ? 38 : 44, lineHeight: width < 360 ? 38 : 42 }]}>THE BRIEF IS{`\n`}IN THE SYSTEM.</Text>
          <View style={[styles.reference, { backgroundColor: theme.surface, borderColor: theme.accent }]}>
            <Text style={[styles.referenceLabel, { color: theme.muted }]}>REFERENCE</Text>
            <Text selectable style={[styles.referenceValue, { color: theme.text }]}>{reference}</Text>
          </View>
          <Text style={[styles.lead, { color: theme.muted }]}>The secure intake stored your structured project brief for follow-up. Keep the reference for your records.</Text>
          {[
            'We review the business problem',
            'We confirm the right capability',
            'We respond through your preferred contact route',
            'We define the next useful step',
          ].map((item, index) => (
            <View key={item} style={[styles.nextRow, { borderColor: theme.rule }]}>
              <Text style={[styles.nextIndex, { color: theme.accent }]}>0{index + 1}</Text>
              <Text style={[styles.nextCopy, { color: theme.text }]}>{item}</Text>
            </View>
          ))}
          <ActionButton variant="outline" label="Start another brief" onPress={startAnother} />
        </View>
      </Screen>
    )
  }

  return (
    <Screen resetScrollKey={step}>
      <AppHeader />
      <View style={styles.progressHeader}>
        <Text style={[styles.kicker, { color: theme.accent }]}>START A PROJECT</Text>
        <Text accessibilityLabel={`Step ${progress} of 5`} style={[styles.progressText, { color: theme.muted }]}>{String(progress).padStart(2, '0')} / 05</Text>
      </View>
      <View style={styles.progressTrack}>
        {[0, 1, 2, 3, 4].map((index) => <View key={index} style={[styles.progressSegment, { backgroundColor: index <= step ? theme.accent : theme.rule }]} />)}
      </View>

      {step === 0 ? (
        <View style={styles.step}>
          <StepTitle title="WHAT SHOULD CHANGE?" body="Start with the business outcome. The technology label can come later." />
          {businessOutcomes.map((outcome) => (
            <ListRow
              key={outcome.id}
              title={outcome.label}
              detail={outcome.capability ? getCapability(outcome.capability)?.shortTitle : 'Needs discovery'}
              selected={intake.outcome === outcome.id}
              onPress={() => selectOutcome(outcome)}
            />
          ))}
        </View>
      ) : null}

      {step === 1 ? (
        <View style={styles.step}>
          <StepTitle title="ROUTE THE OPPORTUNITY." body="Confirm the capability, then describe what happens today and what should happen instead." />
          <View>
            {capabilities.map((capability) => (
              <ListRow
                key={capability.id}
                index={capability.index}
                title={capability.title}
                detail={capability.proposition}
                selected={intake.capability === capability.id}
                onPress={() => selectCapability(capability.id)}
              />
            ))}
          </View>
          <Field label="WHAT SHOULD CHANGE? *" value={intake.goals} multiline maxLength={5000} placeholder="Describe the current problem, who is affected and what a better state would look like." onChange={(value) => update('goals', value)} />
          <Field label="CURRENT SYSTEMS / TOOLS" value={intake.currentSystem} maxLength={1000} placeholder="Excel, HubSpot, Microsoft 365, legacy app..." onChange={(value) => update('currentSystem', value)} />
        </View>
      ) : null}

      {step === 2 ? (
        <View style={styles.step}>
          <StepTitle title="SCOPE THE PRACTICALITIES." body="Ranges are enough. Tap any row to change it in a native selection sheet." />
          <SelectionRow label="Budget" value={intake.budget} onPress={() => setSheet('budget')} />
          <SelectionRow label="Timeline" value={intake.timeline} onPress={() => setSheet('timeline')} />
          <SelectionRow label="Engagement" value={intake.engagement} onPress={() => setSheet('engagement')} />
          <SelectionRow label="Contact route" value={intake.preferredContact} onPress={() => setSheet('preferredContact')} />
        </View>
      ) : null}

      {step === 3 ? (
        <View style={styles.step}>
          <StepTitle title="WHO ARE WE SPEAKING WITH?" body="Enough information to route the brief and respond professionally." />
          <Field label="NAME *" value={intake.name} maxLength={160} placeholder="Your name" autoComplete="name" onChange={(value) => update('name', value)} />
          <Field label="WORK EMAIL *" value={intake.email} maxLength={254} placeholder="you@company.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" onChange={(value) => update('email', value)} />
          <Field label="ORGANIZATION" value={intake.organization} maxLength={200} placeholder="Organization" autoComplete="organization" onChange={(value) => update('organization', value)} />
          <Field label="REGION" value={intake.region} maxLength={100} placeholder="Japan, Africa, Europe, Americas..." onChange={(value) => update('region', value)} />
          <Field label="EXISTING PRODUCT / WEBSITE" value={intake.website} maxLength={500} placeholder="https://" keyboardType="url" autoCapitalize="none" onChange={(value) => update('website', value)} />
        </View>
      ) : null}

      {step === 4 ? (
        <View style={styles.step}>
          <StepTitle
            title="REVIEW THE PROJECT BRIEF."
            body={leadApiConfigured
              ? 'The final action sends this structure to the hardened 11-11 Tech lead service used by the website.'
              : 'The secure endpoint is not configured in this build. Your complete brief can still be opened as an email draft.'}
          />
          <View>{reviewRows.map((row) => <ReviewRow key={row.label} label={row.label} value={row.value} />)}</View>
          <View style={[styles.problemBlock, { backgroundColor: theme.surface, borderColor: theme.accent }]}>
            <Text style={[styles.problemLabel, { color: theme.accent }]}>PROBLEM</Text>
            <Text style={[styles.problemText, { color: theme.text }]}>{intake.goals}</Text>
          </View>
          <View style={[styles.consentRow, { borderColor: theme.rule }]}>
            <View style={styles.consentCopy}>
              <Text style={[styles.consentTitle, { color: theme.text }]}>Contact consent *</Text>
              <Text style={[styles.consentBody, { color: theme.muted }]}>I consent to being contacted about this project inquiry.</Text>
            </View>
            <Switch
              accessibilityLabel="Consent to project follow-up"
              value={intake.consent}
              onValueChange={(value) => update('consent', value)}
              trackColor={{ false: theme.rule, true: theme.accent }}
              thumbColor={Platform.OS === 'android' ? theme.background : undefined}
            />
          </View>
        </View>
      ) : null}

      {error ? (
        <View style={[styles.error, { backgroundColor: theme.name === 'dark' ? '#2A1214' : '#FFF0F1', borderColor: theme.danger }]}>
          <Text accessibilityRole="alert" style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.actions}>
        {step > 0 ? <ActionButton variant="outline" label="Back" onPress={back} /> : null}
        {step < 4
          ? <ActionButton label="Continue" onPress={next} />
          : leadApiConfigured
            ? <ActionButton label={submitting ? 'Submitting…' : 'Submit securely'} onPress={submit} disabled={submitting} />
            : <ActionButton label="Open email brief" onPress={emailFallback} />}
        {step === 4 && leadApiConfigured && error ? <ActionButton variant="outline" label="Use email fallback" onPress={emailFallback} /> : null}
      </View>

      <SelectionSheet
        visible={sheet !== null}
        title={sheetTitle}
        options={sheetOptions}
        value={sheetValue}
        onSelect={(value) => { if (sheet) update(sheet, value) }}
        onClose={() => setSheet(null)}
      />
    </Screen>
  )
}

function StepTitle({ title, body }: { title: string; body: string }) {
  const { theme } = useTheme()
  const { width } = useWindowDimensions()
  return <>
    <Text accessibilityRole="header" maxFontSizeMultiplier={1.3} style={[styles.hero, { color: theme.text, fontSize: width < 360 ? 36 : 44, lineHeight: width < 360 ? 37 : 43 }]}>{title}</Text>
    <Text style={[styles.lead, { color: theme.muted }]}>{body}</Text>
  </>
}

function Field({ label, value, onChange, placeholder, maxLength, multiline, keyboardType, autoCapitalize = 'sentences', autoComplete }: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  maxLength: number
  multiline?: boolean
  keyboardType?: 'default' | 'email-address' | 'url'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  autoComplete?: 'name' | 'email' | 'organization'
}) {
  const { theme } = useTheme()
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: theme.muted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        maxLength={maxLength}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={keyboardType === 'email-address' || keyboardType === 'url' ? false : undefined}
        selectionColor={theme.accent}
        placeholder={placeholder}
        placeholderTextColor={theme.muted}
        style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.inputBorder }, multiline && styles.textarea]}
      />
    </View>
  )
}

function SelectionRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  const { theme } = useTheme()
  return (
    <PressableScale accessibilityLabel={`${label}: ${value}`} accessibilityHint={`Change ${label.toLowerCase()}`} onPress={onPress} style={[styles.selectionRow, { borderColor: theme.rule }]}>
      <View style={styles.selectionCopy}>
        <Text style={[styles.selectionLabel, { color: theme.muted }]}>{label.toUpperCase()}</Text>
        <Text style={[styles.selectionValue, { color: theme.text }]}>{value}</Text>
      </View>
      <Text style={[styles.selectionArrow, { color: theme.accent }]}>⌄</Text>
    </PressableScale>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme()
  return (
    <View style={[styles.reviewRow, { borderColor: theme.rule }]}>
      <Text style={[styles.reviewLabel, { color: theme.muted }]}>{label.toUpperCase()}</Text>
      <Text style={[styles.reviewValue, { color: theme.text }]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md },
  kicker: { fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.4 },
  progressText: { fontFamily: type.mono, fontSize: type.micro, letterSpacing: 1.1 },
  progressTrack: { height: 2, flexDirection: 'row', gap: 4, marginTop: spacing.md, marginBottom: spacing.xxl },
  progressSegment: { flex: 1 },
  step: { gap: spacing.lg },
  hero: { fontFamily: type.display, letterSpacing: -1.5, textTransform: 'uppercase' },
  lead: { fontFamily: type.body, fontSize: 16, lineHeight: 24, maxWidth: 680 },
  field: { gap: 8 },
  fieldLabel: { fontFamily: type.mono, fontSize: 9, letterSpacing: 1.1, marginTop: spacing.sm },
  input: { minHeight: 54, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12, fontFamily: type.body, fontSize: 16 },
  textarea: { minHeight: 150 },
  selectionRow: { minHeight: 72, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  selectionCopy: { flex: 1, gap: 5 },
  selectionLabel: { fontFamily: type.mono, fontSize: 9, letterSpacing: 1.1 },
  selectionValue: { fontFamily: type.body, fontSize: 16 },
  selectionArrow: { fontSize: 20 },
  reviewRow: { minHeight: 62, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.lg },
  reviewLabel: { fontFamily: type.mono, fontSize: 9, letterSpacing: 1.1 },
  reviewValue: { fontFamily: type.body, fontSize: 14, textAlign: 'right', flex: 1 },
  problemBlock: { borderLeftWidth: 2, padding: spacing.lg, gap: spacing.sm },
  problemLabel: { fontFamily: type.mono, fontSize: 9, letterSpacing: 1.1 },
  problemText: { fontFamily: type.body, fontSize: 15, lineHeight: 22 },
  consentRow: { minHeight: 76, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth },
  consentCopy: { flex: 1, gap: 4 },
  consentTitle: { fontFamily: type.body, fontSize: 15, fontWeight: '700' },
  consentBody: { fontFamily: type.body, fontSize: 13, lineHeight: 19 },
  error: { marginTop: spacing.xl, borderLeftWidth: 2, padding: spacing.md },
  errorText: { fontFamily: type.body, fontSize: 14, lineHeight: 20 },
  actions: { gap: spacing.sm, marginTop: spacing.xxl },
  success: { gap: spacing.xl, paddingBottom: spacing.section },
  successMark: { fontSize: 38 },
  reference: { padding: spacing.lg, gap: spacing.xs, borderLeftWidth: 2 },
  referenceLabel: { fontFamily: type.mono, fontSize: 9, letterSpacing: 1.2 },
  referenceValue: { fontFamily: type.mono, fontSize: 20, letterSpacing: 0.8 },
  nextRow: { minHeight: 64, borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  nextIndex: { fontFamily: type.mono, fontSize: type.micro },
  nextCopy: { fontFamily: type.body, fontSize: 15, flex: 1 },
})
