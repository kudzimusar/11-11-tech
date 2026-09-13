import { useEffect, useRef, useState, type PropsWithChildren, type ReactNode } from 'react'
import { AccessibilityInfo, Animated, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { PressableScale } from './PressableScale'
import { colors, radii, spacing, type } from '../theme/tokens'
import { useTheme } from '../theme/ThemeProvider'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => { AccessibilityInfo.isReduceMotionEnabled().then(setReduced); const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced); return () => sub.remove() }, [])
  return reduced
}

export function CinematicHero({ image, eyebrow, title, body, footer }: { image: string; eyebrow: string; title: string; body: string; footer?: ReactNode }) {
  const { width } = useWindowDimensions(); const reduced = useReducedMotion(); const drift = useRef(new Animated.Value(0)).current
  useEffect(() => { if (reduced) return; const loop = Animated.loop(Animated.sequence([Animated.timing(drift,{toValue:1,duration:9000,useNativeDriver:true}),Animated.timing(drift,{toValue:0,duration:9000,useNativeDriver:true})])); loop.start(); return () => loop.stop() }, [drift,reduced])
  const scale = drift.interpolate({ inputRange: [0,1], outputRange: [1.02,1.08] }); const translateY = drift.interpolate({ inputRange: [0,1], outputRange: [0,-8] })
  return <View style={[styles.hero, { minHeight: width < 360 ? 430 : 500 }]}>
    <Animated.View style={[StyleSheet.absoluteFillObject,{ transform: [{ scale },{ translateY }] }]}><ImageBackground source={{ uri: image }} style={StyleSheet.absoluteFillObject} resizeMode="cover" /></Animated.View>
    <View style={styles.heroShade}/><View style={styles.heroSignal}><View style={styles.signalDot}/><Text style={styles.signalText}>SYSTEM FIELD / LIVE</Text></View>
    <View style={styles.heroCopy}><Text style={styles.heroEyebrow}>{eyebrow.toUpperCase()}</Text><Text accessibilityRole="header" maxFontSizeMultiplier={1.25} style={[styles.heroTitle,{fontSize:width<360?44:56,lineHeight:width<360?43:53}]}>{title.toUpperCase()}</Text><Text style={styles.heroBody}>{body}</Text>{footer}</View>
  </View>
}

export function MediaCard({ image, label, title, detail, onPress }: { image: string; label: string; title: string; detail?: string; onPress?: () => void }) {
  return <PressableScale accessibilityLabel={`${title}. ${detail ?? ''}`} onPress={onPress ?? (()=>undefined)} style={styles.mediaCard} haptic={onPress ? 'light' : false}>
    <Image source={{uri:image}} accessibilityIgnoresInvertColors style={styles.mediaImage} resizeMode="cover"/><View style={styles.mediaShade}/><View style={styles.mediaCopy}><Text style={styles.mediaLabel}>{label.toUpperCase()}</Text><Text style={styles.mediaTitle}>{title}</Text>{detail?<Text style={styles.mediaDetail}>{detail}</Text>:null}</View>
  </PressableScale>
}

export function HorizontalMediaRail({ children }: PropsWithChildren) { return <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled directionalLockEnabled contentContainerStyle={styles.rail}>{children}</ScrollView> }

export function Disclosure({ title, summary, children, defaultOpen=false }: PropsWithChildren<{title:string;summary?:string;defaultOpen?:boolean}>) {
  const { theme }=useTheme(); const [open,setOpen]=useState(defaultOpen)
  return <View style={[styles.disclosure,{borderColor:theme.rule}]}><Pressable accessibilityRole="button" accessibilityState={{expanded:open}} accessibilityLabel={title} accessibilityHint={open?'Collapses details':'Expands details'} onPress={()=>setOpen(!open)} style={styles.disclosureHead}><View style={{flex:1}}><Text style={[styles.disclosureTitle,{color:theme.text}]}>{title}</Text>{summary&&!open?<Text numberOfLines={2} style={[styles.disclosureSummary,{color:theme.muted}]}>{summary}</Text>:null}</View><Text style={[styles.plus,{color:theme.accent}]}>{open?'−':'+'}</Text></Pressable>{open?<View style={styles.disclosureBody}>{children}</View>:null}</View>
}

export function Pill({ children, accent=false }: PropsWithChildren<{accent?:boolean}>) { const {theme}=useTheme(); return <View style={[styles.pill,{backgroundColor:accent?theme.accent:theme.surface,borderColor:accent?theme.accent:theme.rule}]}><Text style={[styles.pillText,{color:accent?theme.accentOn:theme.text}]}>{children}</Text></View> }

export function ListRow({index,title,detail,onPress,selected=false}: {index?:string;title:string;detail?:string;onPress?:()=>void;selected?:boolean}) { const {theme}=useTheme(); return <PressableScale accessibilityLabel={`${title}. ${detail??''}`} selected={selected} onPress={onPress??(()=>undefined)} haptic={onPress?'selection':false} style={[styles.listRow,{borderColor:theme.rule,backgroundColor:selected?theme.selected:'transparent'}]}><View style={styles.rowIndex}>{index?<Text style={[styles.rowIndexText,{color:theme.accent}]}>{index}</Text>:null}</View><View style={styles.rowCopy}><Text style={[styles.rowTitle,{color:theme.text}]}>{title}</Text>{detail?<Text style={[styles.rowDetail,{color:theme.muted}]}>{detail}</Text>:null}</View><Text style={[styles.rowArrow,{color:selected?theme.accent:theme.muted}]}>{selected?'✓':'→'}</Text></PressableScale> }

const styles=StyleSheet.create({
  hero:{overflow:'hidden',borderRadius:radii.md,justifyContent:'flex-end',backgroundColor:colors.ink},heroShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(3,5,8,0.50)'},heroSignal:{position:'absolute',top:18,left:18,flexDirection:'row',alignItems:'center',gap:7},signalDot:{width:7,height:7,borderRadius:4,backgroundColor:colors.orange},signalText:{color:'#fff',fontFamily:type.mono,fontSize:8,letterSpacing:1.1},heroCopy:{padding:20,gap:14},heroEyebrow:{color:colors.orange,fontFamily:type.mono,fontSize:9,letterSpacing:1.4},heroTitle:{color:'#fff',fontFamily:type.display,letterSpacing:-1.7,maxWidth:620},heroBody:{color:'#E6E7E8',fontFamily:type.body,fontSize:16,lineHeight:23,maxWidth:560},
  mediaCard:{width:276,height:340,borderRadius:radii.md,overflow:'hidden',backgroundColor:colors.inkRaised},mediaImage:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},mediaShade:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.40)'},mediaCopy:{position:'absolute',left:18,right:18,bottom:18,gap:8},mediaLabel:{color:colors.orange,fontFamily:type.mono,fontSize:9,letterSpacing:1.2},mediaTitle:{color:'#fff',fontFamily:type.display,fontSize:28,lineHeight:29,textTransform:'uppercase'},mediaDetail:{color:'#E4E5E7',fontFamily:type.body,fontSize:13,lineHeight:18},rail:{gap:12,paddingRight:24},
  disclosure:{borderTopWidth:StyleSheet.hairlineWidth},disclosureHead:{minHeight:66,paddingVertical:14,flexDirection:'row',alignItems:'center',gap:16},disclosureTitle:{fontFamily:type.body,fontWeight:'700',fontSize:16},disclosureSummary:{fontFamily:type.body,fontSize:13,lineHeight:18,marginTop:4},plus:{fontSize:24,width:24,textAlign:'center'},disclosureBody:{paddingBottom:18,gap:12},
  pill:{borderWidth:StyleSheet.hairlineWidth,borderRadius:radii.pill,paddingHorizontal:12,paddingVertical:7},pillText:{fontFamily:type.mono,fontSize:9,letterSpacing:.7},
  listRow:{minHeight:72,borderTopWidth:StyleSheet.hairlineWidth,flexDirection:'row',alignItems:'center',paddingVertical:12,paddingHorizontal:4,gap:12},rowIndex:{width:28},rowIndexText:{fontFamily:type.mono,fontSize:10},rowCopy:{flex:1,gap:4,minWidth:0},rowTitle:{fontFamily:type.display,fontSize:22,lineHeight:24,textTransform:'uppercase'},rowDetail:{fontFamily:type.body,fontSize:13,lineHeight:18},rowArrow:{fontSize:20,width:24,textAlign:'right'},
})
