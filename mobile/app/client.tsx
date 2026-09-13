import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, AppState, StyleSheet, Text, TextInput, View } from 'react-native'
import * as Linking from 'expo-linking'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Screen } from '../src/components/Screen'
import { PressableScale } from '../src/components/PressableScale'
import {
  acceptDocument,
  authorizePaymentPlan,
  beginStripeCheckout,
  commercialConfigured,
  consumeCommercialAuthUrl,
  getCommercialSession,
  getSecureDocumentLink,
  loadPortalData,
  money,
  organizationFromMembership,
  paymentsConfigured,
  requestCommercialMagicLink,
  selectPaymentPlan,
  shortDate,
  signOutCommercial,
  subscribeCommercialSession,
  type PortalData,
  type PortalDocument,
  type PortalInvoice,
  type PortalPlan,
} from '../src/lib/commercialClient'
import { colors, radii, spacing, type } from '../src/theme/tokens'

const emptyData: PortalData = { memberships: [], projects: [], documents: [], acceptances: [], plans: [], installments: [], invoices: [], payments: [], authorizations: [] }
type Tab = 'overview' | 'documents' | 'billing' | 'pay'

function param(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] || '' : value || '' }

export default function ClientWorkspace() {
  const router = useRouter()
  const params = useLocalSearchParams<{ reference?: string | string[]; email?: string | string[]; payment?: string | string[] }>()
  const reference = param(params.reference).trim()
  const emailHint = param(params.email).trim()
  const paymentResult = param(params.payment)
  const [email, setEmail] = useState(emailHint)
  const [sent, setSent] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<PortalData>(emptyData)
  const [activeProjectId, setActiveProjectId] = useState('')
  const [requestedInvoiceId, setRequestedInvoiceId] = useState('')
  const [tab, setTab] = useState<Tab>(reference ? 'pay' : 'overview')
  const [planChoice, setPlanChoice] = useState('')
  const [opened, setOpened] = useState<Set<string>>(new Set())
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [autoPayAccepted, setAutoPayAccepted] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState(paymentResult === 'success' ? 'Payment submitted. The workspace will show it after Stripe confirmation.' : '')
  const [error, setError] = useState('')

  const refresh = async () => {
    const session = await getCommercialSession()
    if (!session) { setAuthenticated(false); return }
    setLoading(true); setError('')
    try {
      const result = await loadPortalData()
      setData(result)
      const wanted = reference.toLowerCase()
      const requestedInvoice = wanted ? result.invoices.find((item) => item.reference.toLowerCase() === wanted) : undefined
      const requestedProject = wanted ? result.projects.find((item) => item.reference.toLowerCase() === wanted) : undefined
      setRequestedInvoiceId(requestedInvoice?.id || '')
      setActiveProjectId((current) => current || requestedInvoice?.project_id || requestedProject?.id || result.projects[0]?.id || '')
      setAuthenticated(true)
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to load your client workspace.') }
    finally { setLoading(false) }
  }

  useEffect(() => {
    let mounted = true
    const consume = async (url: string | null | undefined) => {
      const consumed = await consumeCommercialAuthUrl(url)
      if (consumed && mounted) { setAuthenticated(true); setSent(false); await refresh() }
    }
    const initialize = async () => {
      await consume(await Linking.getInitialURL())
      const session = await getCommercialSession()
      if (mounted) setAuthenticated(Boolean(session))
      if (session) await refresh()
      if (mounted) setInitializing(false)
    }
    void initialize()
    const linkSub = Linking.addEventListener('url', ({ url }) => { void consume(url) })
    const sessionUnsub = subscribeCommercialSession((session) => { if (mounted) setAuthenticated(Boolean(session)) })
    const appSub = AppState.addEventListener('change', (state) => { if (state === 'active') void refresh() })
    return () => { mounted = false; linkSub.remove(); sessionUnsub(); appSub.remove() }
  }, [reference])

  const project = data.projects.find((item) => item.id === activeProjectId) ?? data.projects[0]
  const organization = project ? data.memberships.map(organizationFromMembership).find((item) => item?.id === project.organization_id) ?? null : data.memberships.map(organizationFromMembership)[0] ?? null
  const documents = project ? data.documents.filter((item) => item.project_id === project.id) : []
  const requiredDocuments = documents.filter((item) => item.required_for_acceptance && item.status === 'issued')
  const plans = project ? data.plans.filter((item) => item.project_id === project.id && ['offered','accepted','active'].includes(item.status)) : []
  const selectedPlan = plans.find((item) => item.id === planChoice) ?? plans.find((item) => ['accepted','active'].includes(item.status))
  const invoices = project ? data.invoices.filter((item) => item.project_id === project.id) : []
  const exactInvoice = requestedInvoiceId ? invoices.find((item) => item.id === requestedInvoiceId) : undefined
  const invoiceRemaining = exactInvoice ? Math.max(exactInvoice.amount_due_minor - exactInvoice.amount_paid_minor, 0) : 0
  const exactInvoicePayable = Boolean(exactInvoice && ['open','partially_paid'].includes(exactInvoice.status) && invoiceRemaining > 0)
  const payments = project ? data.payments.filter((item) => item.project_id === project.id && item.status === 'succeeded') : []
  const paid = payments.reduce((sum, item) => sum + item.amount_minor, 0)
  const projectValue = project?.contract_value_minor || selectedPlan?.total_minor || 0
  const outstanding = Math.max(projectValue - paid, 0)
  const accepted = useMemo(() => new Set(data.acceptances.filter((item) => item.project_id === project?.id).map((item) => item.document_id)), [data.acceptances, project?.id])
  const authorizationType = selectedPlan?.plan_type === 'recurring' ? 'recurring_subscription' : 'scheduled_charges'
  const alreadyAuthorized = Boolean(selectedPlan && data.authorizations.some((item) => item.payment_plan_id === selectedPlan.id && item.authorization_type === authorizationType && !item.revoked_at))
  const legalReady = requiredDocuments.length > 0 && requiredDocuments.every((doc) => accepted.has(doc.id) || checked.has(doc.id))
  const authorizationReady = !selectedPlan?.requires_autopay_authorization || alreadyAuthorized || autoPayAccepted
  const checkoutReady = Boolean(project && legalReady && (exactInvoice ? exactInvoicePayable : selectedPlan && authorizationReady))

  useEffect(() => {
    if (!project) return
    const current = data.plans.find((item) => item.project_id === project.id && ['accepted','active'].includes(item.status))
    setPlanChoice(current?.id || '')
    setOpened(new Set()); setChecked(new Set()); setAutoPayAccepted(false)
  }, [project?.id])

  const sendLogin = async () => {
    setError(''); setMessage('')
    if (!email.trim() || !email.includes('@')) { setError('Enter the billing email attached to your 11-11 Tech engagement.'); return }
    try {
      const queryParams: Record<string,string> = {}; if (reference) queryParams.reference = reference
      const redirectTo = Linking.createURL('/client', { queryParams })
      await requestCommercialMagicLink(email, redirectTo)
      setSent(true)
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to send the secure sign-in link.') }
  }

  const openDocument = async (doc: PortalDocument) => {
    setError(''); setMessage('')
    try {
      const link = await getSecureDocumentLink(doc.id)
      setOpened((current) => new Set(current).add(doc.id))
      await Linking.openURL(link.url)
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to open this document securely.') }
  }

  const toggleDocument = (id: string) => setChecked((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next })

  const continueToPayment = async () => {
    if (!project || !checkoutReady) return
    setProcessing(true); setError(''); setMessage('')
    try {
      for (const doc of requiredDocuments) if (!accepted.has(doc.id)) await acceptDocument(doc.id, `accept:${doc.document_type}:v${doc.version}`)
      if (exactInvoice) await beginStripeCheckout({ projectId: project.id, invoiceId: exactInvoice.id })
      else {
        if (!selectedPlan) throw new Error('Choose an approved payment option.')
        if (selectedPlan.status === 'offered') await selectPaymentPlan(selectedPlan.id)
        if (selectedPlan.requires_autopay_authorization && !alreadyAuthorized) await authorizePaymentPlan(selectedPlan.id, selectedPlan.plan_type === 'recurring')
        await beginStripeCheckout({ projectId: project.id, paymentPlanId: selectedPlan.id })
      }
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to continue to secure payment.'); await refresh().catch(() => undefined) }
    finally { setProcessing(false) }
  }

  if (initializing) return <Screen contentStyle={styles.center}><ActivityIndicator color={colors.orange}/><Text style={styles.muted}>Opening secure workspace…</Text></Screen>
  if (!authenticated) return <Login email={email} setEmail={setEmail} sent={sent} onSend={sendLogin} error={error} reference={reference} onBack={()=>router.back()} />

  return (
    <Screen contentStyle={styles.screen} resetScrollKey={`${project?.id || 'none'}-${tab}`}>
      <View style={styles.header}><View><Text style={styles.brand}>11·11 TECH</Text><Text style={styles.eyebrow}>CLIENT WORKSPACE · NATIVE</Text></View><PressableScale accessibilityLabel="Open public app" onPress={()=>router.replace('/')} style={styles.close}><Text style={styles.closeText}>×</Text></PressableScale></View>
      <View style={styles.account}><Text style={styles.accountName}>{organization?.trading_name || organization?.legal_name || 'Your account'}</Text><Text style={styles.muted}>{project ? `${project.reference} · ${project.title}` : 'Secure commercial record'}</Text></View>
      {error ? <Notice danger text={error}/> : null}{message ? <Notice text={message}/> : null}{loading ? <View style={styles.loading}><ActivityIndicator color={colors.orange}/><Text style={styles.muted}>Refreshing authoritative project data…</Text></View> : null}
      {data.projects.length > 1 ? <View style={styles.projectPicker}>{data.projects.map((item)=><PressableScale key={item.id} accessibilityLabel={`Open ${item.title}`} onPress={()=>setActiveProjectId(item.id)} style={[styles.projectChip,project?.id===item.id&&styles.projectChipActive]}><Text style={[styles.projectChipText,project?.id===item.id&&styles.projectChipTextActive]}>{item.reference}</Text></PressableScale>)}</View> : null}
      <View style={styles.tabs}>{(['overview','documents','billing','pay'] as Tab[]).map((item)=><PressableScale key={item} accessibilityLabel={`${item} tab`} accessibilityState={{selected:tab===item}} onPress={()=>setTab(item)} style={[styles.tab,tab===item&&styles.tabActive]}><Text style={[styles.tabText,tab===item&&styles.tabTextActive]}>{item==='pay'?'AGREE & PAY':item.toUpperCase()}</Text></PressableScale>)}</View>
      {!project ? <View style={styles.panel}><Text style={styles.eyebrow}>ACCOUNT READY</Text><Text style={styles.h2}>No commercial project is attached yet.</Text><Text style={styles.body}>When 11-11 Tech issues your proposal or project invitation, it will appear here automatically.</Text></View> : null}
      {project && tab==='overview' ? <Overview project={project} paid={paid} outstanding={outstanding} documents={documents.length} onPay={()=>setTab('pay')}/> : null}
      {project && tab==='documents' ? <Documents documents={documents} accepted={accepted} onOpen={openDocument}/> : null}
      {project && tab==='billing' ? <Billing invoices={invoices} payments={payments} currency={project.currency} paid={paid} outstanding={outstanding} exactInvoice={exactInvoice} onPay={()=>setTab('pay')}/> : null}
      {project && tab==='pay' ? <AgreementPay projectCurrency={project.currency} plans={plans} selectedPlan={selectedPlan} planChoice={planChoice} setPlanChoice={setPlanChoice} exactInvoice={exactInvoice} invoiceRemaining={invoiceRemaining} documents={requiredDocuments} accepted={accepted} opened={opened} checked={checked} toggleDocument={toggleDocument} onOpen={openDocument} autoPayAccepted={alreadyAuthorized||autoPayAccepted} setAutoPayAccepted={setAutoPayAccepted} ready={checkoutReady} processing={processing} onContinue={continueToPayment}/> : null}
      <PressableScale accessibilityLabel="Sign out" onPress={async()=>{await signOutCommercial();setData(emptyData);setAuthenticated(false)}} style={styles.signOut}><Text style={styles.signOutText}>SIGN OUT</Text></PressableScale>
    </Screen>
  )
}

function Login({email,setEmail,sent,onSend,error,reference,onBack}:{email:string;setEmail:(value:string)=>void;sent:boolean;onSend:()=>void;error:string;reference:string;onBack:()=>void}){
  return <Screen contentStyle={styles.login}><View style={styles.header}><View><Text style={styles.brand}>11·11 TECH</Text><Text style={styles.eyebrow}>SECURE CLIENT ACCESS</Text></View><PressableScale accessibilityLabel="Go back" onPress={onBack} style={styles.close}><Text style={styles.closeText}>×</Text></PressableScale></View><View><Text style={styles.hero}>YOUR PROJECTS, AGREEMENTS & PAYMENTS.</Text><Text style={styles.body}>Use the billing email attached to your engagement. We send a secure sign-in link; no password or card data is stored in the app.</Text>{reference?<Text style={styles.reference}>REFERENCE · {reference}</Text>:null}</View>{!commercialConfigured?<Notice danger text="Client authentication is not connected in this build. Configure the 11-11 Tech Supabase public values before commercial UAT."/>:null}{error?<Notice danger text={error}/>:null}{sent?<View style={styles.successBox}><Text style={styles.successTitle}>CHECK YOUR INBOX</Text><Text style={styles.body}>A secure sign-in link was sent to {email}. Open it on this device to return to the app.</Text></View>:<View style={styles.form}><Text style={styles.label}>BILLING EMAIL</Text><TextInput value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" placeholder="you@organisation.com" placeholderTextColor={colors.textMutedDark} style={styles.input}/><PressableScale accessibilityLabel="Send secure sign-in link" disabled={!commercialConfigured} onPress={()=>void onSend()} style={[styles.primary,!commercialConfigured&&styles.disabled]}><Text style={styles.primaryText}>SEND SECURE SIGN-IN LINK →</Text></PressableScale></View>}<View style={styles.securityNote}><Text style={styles.eyebrow}>SAME COMMERCIAL RECORD</Text><Text style={styles.muted}>Web and native read the same tenant-scoped Supabase project, agreements, invoices, payment plans and confirmed payment ledger.</Text></View></Screen>
}

function Overview({project,paid,outstanding,documents,onPay}:any){return <View style={styles.stack}><View style={styles.heroPanel}><View><Text style={styles.eyebrow}>{project.reference}</Text><Text style={styles.h1}>{project.title}</Text></View><Status value={project.status}/><Text style={styles.body}>{project.summary||'Your authoritative 11-11 Tech commercial project record.'}</Text></View><View style={styles.metricGrid}><Metric label="PROJECT VALUE" value={money(project.contract_value_minor,project.currency)}/><Metric label="PAID" value={money(paid,project.currency)}/><Metric label="OUTSTANDING" value={money(outstanding,project.currency)} accent/><Metric label="DOCUMENTS" value={String(documents)}/></View><View style={styles.panel}><Text style={styles.eyebrow}>NEXT ACTION</Text><Text style={styles.h2}>{outstanding>0?'Review agreement & payment':'Account is paid up'}</Text><Text style={styles.body}>{outstanding>0?'Required documents and payment options are enforced by the same backend used on desktop.':'No outstanding project balance is recorded.'}</Text>{outstanding>0?<PressableScale accessibilityLabel="Review agreement and payment" onPress={onPay} style={styles.primary}><Text style={styles.primaryText}>AGREEMENT & PAY →</Text></PressableScale>:null}</View></View>}

function Documents({documents,accepted,onOpen}:{documents:PortalDocument[];accepted:Set<string>;onOpen:(doc:PortalDocument)=>void}){return <View style={styles.stack}><SectionIntro kicker="DOCUMENT VAULT" title="Your commercial record." body="Issued versions remain attached to this project. Accepted versions remain immutable historical evidence."/>{documents.length?documents.map((doc)=><View key={doc.id} style={styles.panel}><View style={styles.rowBetween}><Text style={styles.eyebrow}>{doc.document_type.replaceAll('_',' ').toUpperCase()} · V{doc.version}</Text>{accepted.has(doc.id)?<Text style={styles.accepted}>✓ ACCEPTED</Text>:null}</View><Text style={styles.h3}>{doc.title}</Text><Text style={styles.muted}>{doc.reference||'11-11 Tech document'} · {doc.issued_at?shortDate(doc.issued_at):'Registered'}</Text><PressableScale accessibilityLabel={`Open ${doc.title}`} onPress={()=>void onOpen(doc)} style={styles.secondary}><Text style={styles.secondaryText}>OPEN SECURE PDF ↗</Text></PressableScale></View>):<Notice text="No project documents have been issued yet."/>}</View>}

function Billing({invoices,payments,currency,paid,outstanding,exactInvoice,onPay}:{invoices:PortalInvoice[];payments:any[];currency:string;paid:number;outstanding:number;exactInvoice?:PortalInvoice;onPay:()=>void}){return <View style={styles.stack}>{exactInvoice?<View style={styles.invoiceFocus}><Text style={styles.eyebrow}>REQUESTED INVOICE</Text><Text style={styles.h2}>{exactInvoice.reference}</Text><View style={styles.rowBetween}><Text style={styles.body}>Balance</Text><Text style={styles.invoiceAmount}>{money(Math.max(exactInvoice.amount_due_minor-exactInvoice.amount_paid_minor,0),exactInvoice.currency)}</Text></View><Status value={exactInvoice.status}/>{['open','partially_paid'].includes(exactInvoice.status)&&exactInvoice.amount_due_minor>exactInvoice.amount_paid_minor?<PressableScale accessibilityLabel={`Pay ${exactInvoice.reference}`} onPress={onPay} style={styles.primary}><Text style={styles.primaryText}>PAY THIS INVOICE →</Text></PressableScale>:null}</View>:null}<View style={styles.metricGrid}><Metric label="PAID" value={money(paid,currency)}/><Metric label="OUTSTANDING" value={money(outstanding,currency)} accent/></View><SectionIntro kicker="INVOICES" title="Receivables"/>{invoices.length?invoices.map((item)=><LedgerRow key={item.id} left={item.reference} detail={shortDate(item.due_at)} right={money(Math.max(item.amount_due_minor-item.amount_paid_minor,0),item.currency)} status={item.status}/>):<Notice text="No invoice has been issued yet."/>}<SectionIntro kicker="PAYMENTS & RECEIPTS" title="Confirmed ledger"/>{payments.length?payments.map((item:any)=><LedgerRow key={item.id} left={item.receipt_reference||'Payment'} detail={shortDate(item.received_at||item.created_at)} right={money(item.amount_minor,item.currency)} status={item.method.replaceAll('_',' ')}/>):<Notice text="No confirmed payment is recorded yet."/>}</View>}

function AgreementPay({projectCurrency,plans,selectedPlan,planChoice,setPlanChoice,exactInvoice,invoiceRemaining,documents,accepted,opened,checked,toggleDocument,onOpen,autoPayAccepted,setAutoPayAccepted,ready,processing,onContinue}:any){return <View style={styles.stack}><SectionIntro kicker="STEP 1" title={exactInvoice?'Confirm the exact invoice.':'Choose an approved payment option.'} body={exactInvoice?'This reference is resolved only after authenticated account access. Checkout settles this receivable, not a generic project amount.':'Only options published by 11-11 Tech for this project are available.'}/>{exactInvoice?<View style={[styles.plan,styles.planSelected]}><Text style={styles.eyebrow}>{exactInvoice.reference}</Text><Text style={styles.planAmount}>{money(invoiceRemaining,exactInvoice.currency)}</Text><Text style={styles.muted}>{exactInvoice.status.replaceAll('_',' ')} · due {shortDate(exactInvoice.due_at)}</Text></View>:plans.length?plans.map((plan:PortalPlan)=><PressableScale key={plan.id} accessibilityLabel={`Select ${plan.name}`} accessibilityState={{selected:planChoice===plan.id}} onPress={()=>setPlanChoice(plan.id)} disabled={['accepted','active'].includes(selectedPlan?.status)&&selectedPlan?.id!==plan.id} style={[styles.plan,planChoice===plan.id&&styles.planSelected]}><View style={styles.rowBetween}><View style={{flex:1}}><Text style={styles.eyebrow}>{plan.plan_type.replaceAll('_',' ').toUpperCase()}</Text><Text style={styles.h3}>{plan.name}</Text></View><Text style={styles.planAmount}>{money(plan.total_minor,plan.currency)}</Text></View>{plan.allow_extra_payments?<Text style={styles.muted}>Additional balance payments allowed{plan.minimum_extra_payment_minor?` from ${money(plan.minimum_extra_payment_minor,plan.currency)}`:''}.</Text>:null}</PressableScale>):<Notice danger text="No payment option has been published for this project."/>}<SectionIntro kicker="STEP 2" title="Review required documents." body="Open each mandatory PDF before accepting it. Web and native record acceptance against the same immutable document version and SHA-256 evidence."/>{documents.length?documents.map((doc:PortalDocument)=>{const done=accepted.has(doc.id);const wasOpened=opened.has(doc.id)||done;const isChecked=done||checked.has(doc.id);return <View key={doc.id} style={[styles.panel,done&&styles.acceptedPanel]}><Text style={styles.eyebrow}>{doc.document_type.replaceAll('_',' ').toUpperCase()} · V{doc.version}</Text><Text style={styles.h3}>{doc.title}</Text><PressableScale accessibilityLabel={`Open ${doc.title}`} onPress={()=>void onOpen(doc)} style={styles.secondary}><Text style={styles.secondaryText}>OPEN DOCUMENT ↗</Text></PressableScale><PressableScale accessibilityLabel={`Accept ${doc.title}`} accessibilityState={{checked:isChecked,disabled:done||!wasOpened}} disabled={done||!wasOpened} onPress={()=>toggleDocument(doc.id)} style={[styles.checkRow,isChecked&&styles.checkRowActive]}><Text style={styles.checkMark}>{isChecked?'✓':'□'}</Text><Text style={styles.checkText}>{done?'Accepted and recorded.':wasOpened?'I reviewed this exact issued version and agree.':'Open the document before accepting.'}</Text></PressableScale></View>}):<Notice danger text="The required agreement package has not been issued. Payment remains locked."/>}{!exactInvoice&&selectedPlan?.requires_autopay_authorization?<View style={styles.authorization}><Text style={styles.eyebrow}>STEP 3 · PAYMENT AUTHORISATION</Text><Text style={styles.h2}>Scheduled charge consent.</Text><Text style={styles.body}>You authorize only the displayed schedule. The card used for the interactive Stripe payment becomes the payment method bound to this authorization; scheduled collection never chooses an arbitrary card.</Text><PressableScale accessibilityLabel="Authorize scheduled charges" accessibilityState={{checked:autoPayAccepted}} onPress={()=>setAutoPayAccepted(!autoPayAccepted)} style={[styles.checkRow,autoPayAccepted&&styles.checkRowActive]}><Text style={styles.checkMark}>{autoPayAccepted?'✓':'□'}</Text><Text style={styles.checkText}>I authorize the scheduled automatic charges in this payment plan.</Text></PressableScale></View>:null}<View style={styles.checkout}><Text style={styles.eyebrow}>FINAL REVIEW</Text><Text style={styles.h2}>{exactInvoice?`${money(invoiceRemaining,exactInvoice.currency)} invoice payment`:selectedPlan?money(selectedPlan.total_minor,selectedPlan.currency):money(0,projectCurrency)}</Text><Text style={styles.body}>Card details are entered only on Stripe. Supabase remains the authoritative project, agreement and receivable ledger.</Text><PressableScale accessibilityLabel="Continue to secure Stripe payment" disabled={!ready||processing||!paymentsConfigured} onPress={()=>void onContinue()} style={[styles.primary,(!ready||processing||!paymentsConfigured)&&styles.disabled]}>{processing?<ActivityIndicator color={colors.ink}/>:<Text style={styles.primaryText}>{paymentsConfigured?'CONTINUE TO SECURE PAYMENT →':'STRIPE CONNECTION PENDING'}</Text>}</PressableScale></View></View>}

function SectionIntro({kicker,title,body}:{kicker:string;title:string;body?:string}){return <View style={styles.sectionIntro}><Text style={styles.eyebrow}>{kicker}</Text><Text style={styles.h2}>{title}</Text>{body?<Text style={styles.muted}>{body}</Text>:null}</View>}
function Metric({label,value,accent=false}:{label:string;value:string;accent?:boolean}){return <View style={[styles.metric,accent&&styles.metricAccent]}><Text style={styles.eyebrow}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>}
function LedgerRow({left,detail,right,status}:{left:string;detail:string;right:string;status:string}){return <View style={styles.ledger}><View style={{flex:1}}><Text style={styles.ledgerTitle}>{left}</Text><Text style={styles.mutedSmall}>{detail}</Text></View><View style={styles.ledgerRight}><Text style={styles.ledgerAmount}>{right}</Text><Text style={styles.mutedSmall}>{status.toUpperCase()}</Text></View></View>}
function Status({value}:{value:string}){return <View style={styles.status}><Text style={styles.statusText}>{value.replaceAll('_',' ').toUpperCase()}</Text></View>}
function Notice({text,danger=false}:{text:string;danger?:boolean}){return <View style={[styles.notice,danger&&styles.noticeDanger]}><Text style={[styles.noticeText,danger&&styles.noticeDangerText]}>{text}</Text></View>}

const styles=StyleSheet.create({
  screen:{gap:spacing.lg},login:{minHeight:'100%',gap:spacing.xxl,justifyContent:'space-between'},center:{minHeight:'100%',justifyContent:'center',alignItems:'center',gap:spacing.md},stack:{gap:spacing.md},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:spacing.md},brand:{color:colors.textOnDark,fontFamily:type.display,fontSize:24,letterSpacing:-.7},eyebrow:{color:colors.orange,fontFamily:type.mono,fontSize:10,letterSpacing:1.2},close:{width:48,height:48,borderWidth:StyleSheet.hairlineWidth,borderColor:colors.ruleDark,alignItems:'center',justifyContent:'center'},closeText:{color:colors.textOnDark,fontSize:28,lineHeight:30},hero:{color:colors.textOnDark,fontFamily:type.display,fontSize:44,lineHeight:45,letterSpacing:-1.2,marginBottom:spacing.md},h1:{color:colors.textOnDark,fontFamily:type.display,fontSize:34,lineHeight:36,letterSpacing:-.8},h2:{color:colors.textOnDark,fontFamily:type.display,fontSize:27,lineHeight:30,letterSpacing:-.6},h3:{color:colors.textOnDark,fontFamily:type.display,fontSize:20,lineHeight:23},body:{color:colors.textMutedDark,fontFamily:type.body,fontSize:15,lineHeight:23},muted:{color:colors.textMutedDark,fontFamily:type.body,fontSize:13,lineHeight:19},mutedSmall:{color:colors.textMutedDark,fontFamily:type.mono,fontSize:9,letterSpacing:.5},reference:{color:colors.orange,fontFamily:type.mono,fontSize:11,letterSpacing:1,marginTop:spacing.lg},account:{borderTopWidth:StyleSheet.hairlineWidth,borderBottomWidth:StyleSheet.hairlineWidth,borderColor:colors.ruleDark,paddingVertical:spacing.md,gap:4},accountName:{color:colors.textOnDark,fontFamily:type.display,fontSize:22},tabs:{flexDirection:'row',flexWrap:'wrap',gap:6},tab:{minHeight:44,borderWidth:StyleSheet.hairlineWidth,borderColor:colors.ruleDark,paddingHorizontal:11,alignItems:'center',justifyContent:'center'},tabActive:{backgroundColor:colors.orange,borderColor:colors.orange},tabText:{color:colors.textMutedDark,fontFamily:type.mono,fontSize:9,letterSpacing:.6},tabTextActive:{color:colors.ink},projectPicker:{flexDirection:'row',flexWrap:'wrap',gap:6},projectChip:{borderWidth:StyleSheet.hairlineWidth,borderColor:colors.ruleDark,paddingVertical:8,paddingHorizontal:10},projectChipActive:{borderColor:colors.orange},projectChipText:{color:colors.textMutedDark,fontFamily:type.mono,fontSize:9},projectChipTextActive:{color:colors.orange},heroPanel:{gap:spacing.md,borderBottomWidth:StyleSheet.hairlineWidth,borderColor:colors.ruleDark,paddingBottom:spacing.xl},panel:{backgroundColor:colors.inkRaised,borderWidth:StyleSheet.hairlineWidth,borderColor:colors.ruleDark,borderRadius:radii.sm,padding:spacing.lg,gap:spacing.md},acceptedPanel:{borderColor:colors.success},metricGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},metric:{width:'48%',minHeight:104,borderWidth:StyleSheet.hairlineWidth,borderColor:colors.ruleDark,padding:spacing.md,justifyContent:'space-between'},metricAccent:{borderColor:colors.orange},metricValue:{color:colors.textOnDark,fontFamily:type.display,fontSize:25},primary:{minHeight:52,backgroundColor:colors.orange,alignItems:'center',justifyContent:'center',paddingHorizontal:spacing.lg,borderRadius:radii.sm},primaryText:{color:colors.ink,fontFamily:type.mono,fontSize:11,letterSpacing:.7,fontWeight:'700'},secondary:{minHeight:46,borderWidth:StyleSheet.hairlineWidth,borderColor:colors.ruleDark,alignItems:'center',justifyContent:'center',paddingHorizontal:spacing.md},secondaryText:{color:colors.textOnDark,fontFamily:type.mono,fontSize:10,letterSpacing:.6},disabled:{opacity:.38},notice:{borderLeftWidth:3,borderLeftColor:colors.orange,backgroundColor:colors.inkRaised,padding:spacing.md},noticeDanger:{borderLeftColor:colors.danger},noticeText:{color:colors.textOnDark,fontFamily:type.body,fontSize:13,lineHeight:20},noticeDangerText:{color:'#FFD0D0'},loading:{flexDirection:'row',alignItems:'center',gap:spacing.sm},form:{gap:spacing.sm},label:{color:colors.textMutedDark,fontFamily:type.mono,fontSize:10,letterSpacing:1},input:{minHeight:54,borderWidth:StyleSheet.hairlineWidth,borderColor:colors.ruleDark,borderRadius:radii.sm,paddingHorizontal:spacing.md,color:colors.textOnDark,fontFamily:type.body,fontSize:16,backgroundColor:colors.inkRaised},successBox:{borderWidth:StyleSheet.hairlineWidth,borderColor:colors.success,padding:spacing.lg,gap:spacing.sm},successTitle:{color:colors.success,fontFamily:type.mono,fontSize:11,letterSpacing:1},securityNote:{borderTopWidth:StyleSheet.hairlineWidth,borderColor:colors.ruleDark,paddingTop:spacing.lg,gap:spacing.sm},rowBetween:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:spacing.md},accepted:{color:colors.success,fontFamily:type.mono,fontSize:9,letterSpacing:.5},sectionIntro:{gap:spacing.xs,marginTop:spacing.sm},invoiceFocus:{backgroundColor:colors.orange,padding:spacing.lg,gap:spacing.md,borderRadius:radii.sm},invoiceAmount:{color:colors.ink,fontFamily:type.display,fontSize:32},ledger:{minHeight:68,borderBottomWidth:StyleSheet.hairlineWidth,borderColor:colors.ruleDark,flexDirection:'row',alignItems:'center',gap:spacing.md},ledgerTitle:{color:colors.textOnDark,fontFamily:type.body,fontSize:14,fontWeight:'600'},ledgerRight:{alignItems:'flex-end'},ledgerAmount:{color:colors.textOnDark,fontFamily:type.mono,fontSize:12},status:{alignSelf:'flex-start',borderWidth:StyleSheet.hairlineWidth,borderColor:colors.orange,paddingHorizontal:8,paddingVertical:5},statusText:{color:colors.orange,fontFamily:type.mono,fontSize:9,letterSpacing:.6},plan:{borderWidth:StyleSheet.hairlineWidth,borderColor:colors.ruleDark,padding:spacing.lg,gap:spacing.sm,borderRadius:radii.sm},planSelected:{borderColor:colors.orange,backgroundColor:colors.inkRaised},planAmount:{color:colors.orange,fontFamily:type.display,fontSize:26},checkRow:{minHeight:52,borderWidth:StyleSheet.hairlineWidth,borderColor:colors.ruleDark,padding:spacing.sm,flexDirection:'row',gap:spacing.sm,alignItems:'center'},checkRowActive:{borderColor:colors.success},checkMark:{width:24,color:colors.orange,fontFamily:type.mono,fontSize:18},checkText:{flex:1,color:colors.textMutedDark,fontFamily:type.body,fontSize:13,lineHeight:18},authorization:{borderWidth:StyleSheet.hairlineWidth,borderColor:colors.orange,padding:spacing.lg,gap:spacing.md},checkout:{backgroundColor:colors.inkSoft,padding:spacing.xl,gap:spacing.md,borderTopWidth:3,borderTopColor:colors.orange},signOut:{minHeight:48,alignItems:'center',justifyContent:'center',borderTopWidth:StyleSheet.hairlineWidth,borderColor:colors.ruleDark,marginTop:spacing.lg},signOutText:{color:colors.textMutedDark,fontFamily:type.mono,fontSize:10,letterSpacing:1}
})
