import { useState } from 'react'
import { StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '../src/components/Screen'
import { AppHeader } from '../src/components/AppHeader'
import { ActionButton } from '../src/components/ActionButton'
import { useTheme } from '../src/theme/ThemeProvider'
import { radii, spacing, type } from '../src/theme/tokens'

export default function PayInvoiceEntry() {
  const router=useRouter(); const {theme}=useTheme(); const {width}=useWindowDimensions()
  const [reference,setReference]=useState(''); const [email,setEmail]=useState(''); const [error,setError]=useState('')
  const proceed=()=>{const ref=reference.trim();const mail=email.trim().toLowerCase();if(!ref){setError('Enter the invoice or project reference issued by 11-11 Tech.');return}if(!mail||!mail.includes('@')){setError('Enter the billing email attached to the engagement.');return}setError('');router.push({pathname:'/client',params:{reference:ref,email:mail}})}
  return <Screen compactBottom contentStyle={styles.screen}>
    <AppHeader back title="Secure billing"/>
    <View style={styles.heroBlock}><Text style={[styles.eyebrow,{color:theme.accent}]}>PAY / MANAGE A PROJECT</Text><Text maxFontSizeMultiplier={1.3} style={[styles.hero,{color:theme.text,fontSize:width<360?36:43,lineHeight:width<360?37:44}]}>PAY AN INVOICE OR PROJECT BALANCE.</Text><Text style={[styles.body,{color:theme.muted}]}>A reference never exposes financial information by itself. We verify the billing email, open your secure workspace, require the applicable agreement and then hand card entry to Stripe.</Text></View>
    <View style={styles.steps}>{['IDENTIFY · reference + billing email','REVIEW · exact invoice, balance and terms','AGREE · immutable issued documents','PAY · Stripe-hosted secure checkout','KEEP · invoice, receipt and agreement vault'].map((item,index)=><View key={item} style={[styles.step,{borderColor:theme.rule}]}><Text style={[styles.stepNo,{color:theme.accent}]}>{String(index+1).padStart(2,'0')}</Text><Text style={[styles.stepText,{color:theme.text}]}>{item}</Text></View>)}</View>
    <View style={[styles.form,{backgroundColor:theme.surface,borderColor:theme.rule}]}>
      {error?<View style={[styles.error,{backgroundColor:theme.name==='dark'?'#2A1214':'#FFF0F1',borderColor:theme.danger}]}><Text accessibilityRole="alert" style={[styles.errorText,{color:theme.danger}]}>{error}</Text></View>:null}
      <Text style={[styles.label,{color:theme.muted}]}>INVOICE OR PROJECT REFERENCE</Text><TextInput accessibilityLabel="Invoice or project reference" value={reference} onChangeText={setReference} autoCapitalize="characters" autoCorrect={false} placeholder="11T-INV-2026-00042" placeholderTextColor={theme.muted} selectionColor={theme.accent} style={[styles.input,{backgroundColor:theme.input,borderColor:theme.inputBorder,color:theme.text}]}/>
      <Text style={[styles.label,{color:theme.muted}]}>BILLING EMAIL</Text><TextInput accessibilityLabel="Billing email" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" placeholder="accounts@organisation.com" placeholderTextColor={theme.muted} selectionColor={theme.accent} style={[styles.input,{backgroundColor:theme.input,borderColor:theme.inputBorder,color:theme.text}]}/>
      <ActionButton label="Continue securely" detail="Open the authenticated client workspace" onPress={proceed}/><Text style={[styles.note,{color:theme.muted}]}>No card information is collected on this screen or stored by 11-11 Tech. Stripe handles payment details after agreement and authorization gates are complete.</Text>
    </View>
  </Screen>
}
const styles=StyleSheet.create({screen:{gap:spacing.xxl},heroBlock:{gap:spacing.md},eyebrow:{fontFamily:type.mono,fontSize:10,letterSpacing:1.2},hero:{fontFamily:type.display,letterSpacing:-1.1,textTransform:'uppercase'},body:{fontFamily:type.body,fontSize:15,lineHeight:23},steps:{borderTopWidth:StyleSheet.hairlineWidth},step:{minHeight:54,borderBottomWidth:StyleSheet.hairlineWidth,flexDirection:'row',alignItems:'center',gap:spacing.md},stepNo:{fontFamily:type.mono,fontSize:10},stepText:{flex:1,fontFamily:type.mono,fontSize:10,lineHeight:16,letterSpacing:.35},form:{gap:spacing.sm,padding:spacing.lg,borderRadius:radii.sm,borderWidth:StyleSheet.hairlineWidth},label:{fontFamily:type.mono,fontSize:10,letterSpacing:1,marginTop:spacing.sm},input:{minHeight:54,borderWidth:1,borderRadius:radii.sm,paddingHorizontal:spacing.md,fontFamily:type.body,fontSize:16},note:{fontFamily:type.body,fontSize:12,lineHeight:18},error:{borderLeftWidth:3,padding:spacing.sm},errorText:{fontFamily:type.body,fontSize:13,lineHeight:19}})
