import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PressableScale } from './PressableScale'
import { spacing, type } from '../theme/tokens'
import { useTheme } from '../theme/ThemeProvider'

type Props = { visible: boolean; title: string; options: string[]; value?: string; onSelect: (value: string) => void; onClose: () => void }

export function SelectionSheet({ visible, title, options, value, onSelect, onClose }: Props) {
  const insets = useSafeAreaInsets(); const { theme } = useTheme()
  return <Modal visible={visible} transparent animationType="slide" presentationStyle="overFullScreen" statusBarTranslucent onRequestClose={onClose}>
    <View style={styles.root}>
      <Pressable accessibilityRole="button" accessibilityLabel="Close selection" style={[styles.backdrop,{backgroundColor:theme.overlay}]} onPress={onClose}/>
      <View accessibilityViewIsModal style={[styles.sheet,{backgroundColor:theme.sheet,paddingBottom:Math.max(insets.bottom,spacing.lg)}]}>
        <View style={[styles.handle,{backgroundColor:theme.rule}]} importantForAccessibility="no-hide-descendants"/>
        <View style={styles.header}><Text style={[styles.kicker,{color:theme.accent}]}>SELECT</Text><Text accessibilityRole="header" style={[styles.title,{color:theme.text}]}>{title}</Text></View>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.list} nestedScrollEnabled keyboardShouldPersistTaps="handled">
          {options.map(option=>{const selected=option===value;return <PressableScale key={option} selected={selected} accessibilityLabel={option} accessibilityHint={selected?'Currently selected':`Select ${option}`} onPress={()=>{onSelect(option);onClose()}} style={[styles.option,{borderColor:selected?theme.accent:theme.rule,backgroundColor:selected?theme.selected:'transparent'}]}><Text style={[styles.optionText,{color:selected?theme.accent:theme.text}]}>{option}</Text><Text style={[styles.arrow,{color:selected?theme.accent:theme.muted}]}>{selected?'●':'→'}</Text></PressableScale>})}
        </ScrollView>
        <PressableScale accessibilityLabel="Close selection" onPress={onClose} haptic={false} style={[styles.close,{backgroundColor:theme.text}]}><Text style={[styles.closeText,{color:theme.background}]}>CLOSE</Text></PressableScale>
      </View>
    </View>
  </Modal>
}
const styles=StyleSheet.create({root:{flex:1,justifyContent:'flex-end'},backdrop:{position:'absolute',top:0,right:0,bottom:0,left:0},sheet:{maxHeight:'82%',paddingHorizontal:spacing.lg,paddingTop:spacing.sm,borderTopLeftRadius:24,borderTopRightRadius:24},handle:{width:42,height:4,borderRadius:4,alignSelf:'center',marginBottom:spacing.xl},header:{gap:spacing.xs,marginBottom:spacing.lg},kicker:{fontFamily:type.mono,fontSize:type.micro,letterSpacing:1.4},title:{fontFamily:type.display,fontSize:type.h2,lineHeight:32,letterSpacing:-1},list:{flexGrow:0},option:{minHeight:62,borderTopWidth:StyleSheet.hairlineWidth,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:spacing.md,paddingHorizontal:4},optionText:{fontFamily:type.body,fontSize:type.bodySize,flex:1},arrow:{fontSize:17},close:{marginTop:spacing.lg,minHeight:50,alignItems:'center',justifyContent:'center'},closeText:{fontFamily:type.mono,fontSize:type.micro,letterSpacing:1.4}})
