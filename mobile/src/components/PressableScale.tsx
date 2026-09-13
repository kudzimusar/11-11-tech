import type { PropsWithChildren } from 'react'
import { Pressable, type AccessibilityRole, type AccessibilityState, type StyleProp, type ViewStyle } from 'react-native'
import * as Haptics from 'expo-haptics'
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

type Props = PropsWithChildren<{
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  selected?: boolean
  accessibilityLabel?: string
  accessibilityHint?: string
  accessibilityRole?: AccessibilityRole
  accessibilityState?: AccessibilityState
  haptic?: 'selection' | 'light' | false
  hitSlop?: number
}>

export function PressableScale({ children, onPress, style, disabled, selected, accessibilityLabel, accessibilityHint, accessibilityRole = 'button', accessibilityState, haptic = 'selection', hitSlop = 6 }: Props) {
  const scale = useSharedValue(1)
  const reducedMotion = useReducedMotion()
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))
  const state: AccessibilityState = { ...accessibilityState, disabled: Boolean(disabled || accessibilityState?.disabled), selected: selected ?? accessibilityState?.selected }

  const press = () => {
    if (haptic) {
      if (haptic === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined)
      else Haptics.selectionAsync().catch(() => undefined)
    }
    onPress?.()
  }

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={state}
      disabled={disabled}
      hitSlop={hitSlop}
      onPress={press}
      onPressIn={() => { scale.value = reducedMotion ? 1 : withTiming(0.975, { duration: 90 }) }}
      onPressOut={() => { scale.value = reducedMotion ? 1 : withSpring(1, { damping: 18, stiffness: 260 }) }}
    >
      <Animated.View style={[style, disabled && { opacity: 0.45 }, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  )
}
