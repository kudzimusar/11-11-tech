import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Screen } from '../../src/components/Screen'
import { AppHeader } from '../../src/components/AppHeader'
import { CinematicHero, HorizontalMediaRail, ListRow, MediaCard } from '../../src/components/Editorial'
import { capabilityMedia, media } from '../../../shared/media'
import { capabilities } from '../../../shared/portfolio'
import { useTheme } from '../../src/theme/ThemeProvider'
import { type } from '../../src/theme/tokens'
import { trackNativeEvent } from '../../src/lib/intakeClient'

export default function ExploreScreen(){const router=useRouter();const {theme}=useTheme();useEffect(()=>{trackNativeEvent('page_view','native/explore')},[]);return <Screen><AppHeader/><CinematicHero image={media.intelligence} eyebrow="Explore" title="Start with the change you need." body="Capabilities, industries, pricing, method and trust all connect to the same 11-11 Tech product model."/>
<View style={styles.section}><Text style={[styles.kicker,{color:theme.accent}]}>CAPABILITIES</Text>{capabilities.map(cap=><ListRow key={cap.id} index={cap.index} title={cap.title} detail={cap.proposition} onPress={()=>router.push(`/capability/${cap.id}`)}/>)}</View>
<View style={styles.section}><Text style={[styles.kicker,{color:theme.accent}]}>DISCOVER DIFFERENTLY</Text><HorizontalMediaRail><MediaCard image={media.abstractEditorial} label="Solutions" title="What can we implement?" detail="Browse specific services across design, AI, systems, cloud, talent and assurance." onPress={()=>router.push('/solutions')}/><MediaCard image={media.global} label="Industries" title="Where must it work?" detail="Explore the operating environments shaping delivery." onPress={()=>router.push('/industries')}/><MediaCard image={media.builders} label="Method" title="How do we deliver?" detail="Discover · Design · Build · Launch · Operate · Improve" onPress={()=>router.push('/method')}/><MediaCard image={media.trustEditorial} label="Trust" title="How is risk handled?" detail="Quality, contracting, privacy, AI, IP and assurance." onPress={()=>router.push('/trust')}/></HorizontalMediaRail></View>
<View style={styles.section}><Text style={[styles.kicker,{color:theme.accent}]}>COMMERCIAL</Text><ListRow title="Pricing & investment" detail="Ranges, models, caveats and planning guidance" onPress={()=>router.push('/pricing')}/><ListRow title="11-11 Lab / Vision" detail="Experiments and reusable technology patterns, truth-labeled" onPress={()=>router.push('/lab')}/><ListRow title="About 11-11 Tech" detail="Company model, regions and technology practice" onPress={()=>router.push('/about')}/></View>
<View style={styles.section}><Text style={[styles.kicker,{color:theme.accent}]}>VISUAL PRACTICES</Text><HorizontalMediaRail>{capabilities.slice(0,5).map(cap=><MediaCard key={cap.id} image={capabilityMedia[cap.id]} label={cap.shortTitle} title={cap.proposition} onPress={()=>router.push(`/capability/${cap.id}`)}/>)}</HorizontalMediaRail></View>
</Screen>}
const styles=StyleSheet.create({section:{gap:14,marginTop:44},kicker:{fontFamily:type.mono,fontSize:9,letterSpacing:1.3}})
