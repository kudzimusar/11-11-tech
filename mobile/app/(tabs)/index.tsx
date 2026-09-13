import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '../../src/components/Screen'
import { AppHeader } from '../../src/components/AppHeader'
import { ActionButton } from '../../src/components/ActionButton'
import { CinematicHero, HorizontalMediaRail, ListRow, MediaCard, Pill } from '../../src/components/Editorial'
import { capabilities, industries } from '../../../shared/portfolio'
import { capabilityMedia, industryMedia, media } from '../../../shared/media'
import { deliveryLifecycle } from '../../../shared/method'
import { useTheme } from '../../src/theme/ThemeProvider'
import { spacing, type } from '../../src/theme/tokens'
import { trackNativeEvent } from '../../src/lib/intakeClient'

export default function HomeScreen() {
  const router = useRouter(); const { theme } = useTheme()
  useEffect(()=>{trackNativeEvent('page_view','native/home')},[])
  return <Screen contentStyle={styles.screen}>
    <AppHeader />
    <CinematicHero image={media.heroStill} eyebrow="11-11 Tech · Technology Design & Intelligence" title="Technology that makes business work better." body="We design, build and improve the digital systems organizations depend on." footer={<View style={styles.heroActions}><ActionButton label="Start a project" detail="Tell us what needs to change" onPress={()=>router.push('/start')} /><ActionButton label="Explore capabilities" variant="surface" onPress={()=>router.push('/explore')} /></View>} />

    <View style={styles.section}><Text style={[styles.kicker,{color:theme.accent}]}>PEOPLE · PLACES · SYSTEMS</Text><Text style={[styles.heading,{color:theme.text}]}>Technology has to fit the world where people actually use it.</Text><Text style={[styles.body,{color:theme.muted}]}>International perspective, local context and practical engineering in the same engagement.</Text><HorizontalMediaRail><MediaCard image={media.crossCulture} label="Context" title="Cross-cultural product thinking" detail="People and systems designed across real operating environments."/><MediaCard image={media.tokyoBusiness} label="Tokyo" title="Precision" detail="Product discipline, quality and dependable delivery."/><MediaCard image={media.harareBusiness} label="Harare" title="Adaptability" detail="Technology shaped for practical constraints and opportunity."/></HorizontalMediaRail></View>

    <View style={styles.section}><View style={styles.sectionHead}><View><Text style={[styles.kicker,{color:theme.accent}]}>WHAT WE DO</Text><Text style={[styles.heading,{color:theme.text}]}>Choose a capability.</Text></View><Pill>7 PRACTICES</Pill></View>{capabilities.map((cap)=> <ListRow key={cap.id} index={cap.index} title={cap.title} detail={`${cap.proposition} · ${cap.typicalRange}`} onPress={()=>router.push(`/capability/${cap.id}`)} />)}</View>

    <View style={styles.section}><Text style={[styles.kicker,{color:theme.accent}]}>VISUAL SERVICE STORIES</Text><HorizontalMediaRail>{capabilities.slice(0,4).map((cap)=><MediaCard key={cap.id} image={capabilityMedia[cap.id]} label={cap.shortTitle} title={cap.proposition} detail={cap.services.slice(0,3).map(s=>s.name).join(' · ')} onPress={()=>router.push(`/capability/${cap.id}`)}/>)}</HorizontalMediaRail></View>

    <View style={styles.section}><Text style={[styles.kicker,{color:theme.accent}]}>INDUSTRIES</Text><Text style={[styles.heading,{color:theme.text}]}>Built for your environment.</Text><HorizontalMediaRail>{industries.slice(0,6).map((industry)=><MediaCard key={industry.id} image={industryMedia[industry.id as keyof typeof industryMedia] || media.abstractEditorial} label="Industry" title={industry.name} detail={industry.summary} onPress={()=>router.push('/industries')}/>)}</HorizontalMediaRail></View>

    <View style={styles.section}><MediaCard image={media.globalBridge} label="Tokyo → world" title="Tokyo-built. Africa-aware. Global by design." detail="One technology practice shaped by different markets, users and operating realities." onPress={()=>router.push('/about')}/></View>

    <View style={styles.section}><Text style={[styles.kicker,{color:theme.accent}]}>HOW WE WORK</Text><View style={styles.lifecycle}>{deliveryLifecycle.map(step=><View key={step.id} style={[styles.lifeStep,{borderColor:theme.rule}]}><Text style={[styles.lifeIndex,{color:theme.accent}]}>{step.index}</Text><Text style={[styles.lifeTitle,{color:theme.text}]}>{step.title}</Text></View>)}</View><View style={styles.snapshot}><ActionButton label="See delivery method" variant="outline" onPress={()=>router.push('/method')}/><ActionButton label="See investment ranges" variant="outline" onPress={()=>router.push('/pricing')}/><ActionButton label="Trust & contracting" variant="outline" onPress={()=>router.push('/trust')}/></View></View>

    <View style={styles.section}><Text style={[styles.kicker,{color:theme.accent}]}>START HERE</Text><Text style={[styles.heading,{color:theme.text}]}>What needs to work better?</Text><Text style={[styles.body,{color:theme.muted}]}>Tell us the business problem. We will help define the right technology response.</Text><ActionButton label="Scope my project" onPress={()=>router.push('/start')}/></View>
  </Screen>
}
const styles=StyleSheet.create({screen:{gap:0},heroActions:{gap:10,marginTop:6},section:{gap:16,marginTop:48},sectionHead:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',gap:12},kicker:{fontFamily:type.mono,fontSize:9,letterSpacing:1.3},heading:{fontFamily:type.display,fontSize:32,lineHeight:33,textTransform:'uppercase',letterSpacing:-1.1,maxWidth:650},body:{fontFamily:type.body,fontSize:16,lineHeight:23,maxWidth:620},lifecycle:{flexDirection:'row',flexWrap:'wrap'},lifeStep:{width:'50%',borderTopWidth:StyleSheet.hairlineWidth,paddingVertical:12,paddingRight:8,flexDirection:'row',gap:8,alignItems:'center'},lifeIndex:{fontFamily:type.mono,fontSize:9},lifeTitle:{fontFamily:type.body,fontSize:13,fontWeight:'700'},snapshot:{gap:10},})
