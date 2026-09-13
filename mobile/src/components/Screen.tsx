import type { PropsWithChildren } from 'react'
import { ScrollView, StyleSheet, useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { layout, palette } from '../theme/tokens'

type Props = PropsWithChildren<{
  tone?: 'dark' | 'light'
  scroll?: boolean
  contentStyle?: StyleProp<ViewStyle>
}>

export function Screen({ children, tone = 'dark', scroll = true, contentStyle }: Props) {
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const colors = palette(tone)
  const gutter = width >= layout.tabletBreakpoint ? layout.tabletGutter : layout.phoneGutter
  const content = (
    <View style={[styles.content, { paddingHorizontal: gutter, paddingTop: Math.max(insets.top, 12), paddingBottom: insets.bottom + 112 }, contentStyle]}>
      {children}
    </View>
  )

  if (!scroll) return <View style={[styles.root, { backgroundColor: colors.background }]}>{content}</View>
  return (
    <ScrollView style={[styles.root, { backgroundColor: colors.background }]} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {content}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { width: '100%', maxWidth: layout.maxContent, alignSelf: 'center' },
})
