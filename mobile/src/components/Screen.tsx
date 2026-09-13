import { useEffect, useRef, type PropsWithChildren } from 'react'
import { Platform, ScrollView, StyleSheet, useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { layout, palette, spacing } from '../theme/tokens'

type Props = PropsWithChildren<{
  tone?: 'dark' | 'light'
  scroll?: boolean
  contentStyle?: StyleProp<ViewStyle>
  resetScrollKey?: string | number
}>

export function Screen({ children, tone = 'dark', scroll = true, contentStyle, resetScrollKey }: Props) {
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const scrollRef = useRef<ScrollView>(null)
  const colors = palette(tone)
  const tablet = width >= layout.tabletBreakpoint
  const gutter = tablet ? layout.tabletGutter : layout.phoneGutter
  const bottomPadding = tablet ? insets.bottom + spacing.section : insets.bottom + 112

  useEffect(() => {
    if (resetScrollKey === undefined) return
    scrollRef.current?.scrollTo({ y: 0, animated: false })
  }, [resetScrollKey])

  const content = (
    <View style={[styles.content, { paddingHorizontal: gutter, paddingTop: Math.max(insets.top, 12), paddingBottom: bottomPadding }, contentStyle]}>
      {children}
    </View>
  )

  if (!scroll) return <View style={[styles.root, { backgroundColor: colors.background }]}>{content}</View>
  return (
    <ScrollView
      ref={scrollRef}
      style={[styles.root, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      nestedScrollEnabled
    >
      {content}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { width: '100%', maxWidth: layout.maxContent, alignSelf: 'center' },
})
