import { useEffect, useRef, type PropsWithChildren } from 'react'
import { Platform, ScrollView, StyleSheet, useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { layout, spacing, themes } from '../theme/tokens'
import { useTheme } from '../theme/ThemeProvider'

type Props = PropsWithChildren<{
  tone?: 'auto' | 'dark' | 'light'
  scroll?: boolean
  contentStyle?: StyleProp<ViewStyle>
  resetScrollKey?: string | number
  compactBottom?: boolean
}>

export function Screen({ children, tone = 'auto', scroll = true, contentStyle, resetScrollKey, compactBottom = false }: Props) {
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const scrollRef = useRef<ScrollView>(null)
  const { theme } = useTheme()
  const activeTheme = tone === 'auto' ? theme : themes[tone]
  const tablet = width >= layout.tabletBreakpoint
  const gutter = tablet ? layout.tabletGutter : width < layout.compactPhone ? 16 : layout.phoneGutter
  const bottomPadding = compactBottom ? insets.bottom + spacing.xl : tablet ? insets.bottom + spacing.section : insets.bottom + 104

  useEffect(() => {
    if (resetScrollKey === undefined) return
    scrollRef.current?.scrollTo({ y: 0, animated: false })
  }, [resetScrollKey])

  const content = (
    <View style={[styles.content, { paddingHorizontal: gutter, paddingTop: Math.max(insets.top, 12), paddingBottom: bottomPadding }, contentStyle]}>
      {children}
    </View>
  )

  if (!scroll) return <View style={[styles.root, { backgroundColor: activeTheme.background }]}>{content}</View>
  return (
    <ScrollView
      ref={scrollRef}
      style={[styles.root, { backgroundColor: activeTheme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
      nestedScrollEnabled
      contentInsetAdjustmentBehavior="never"
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
