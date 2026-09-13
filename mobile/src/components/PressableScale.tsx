import type { PropsWithChildren } from 'react'
import { Pressable, type StyleProp, type ViewStyle } from 'react-native'
import * as Haptics from 'expo-haptics'
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

type Props = PropsWithChildren<{
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  accessibilityLabel?: string
  haptic?: 'selection' | 'light' | false
}>

export function PressableScale({ children, onPress, style, disabled, accessibilityLabel, haptic = 'selection' }: Props) {
  const scale = useSharedValue(1)
  const reducedMotion = useReducedMotion()
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const press = () => {
    if (!reducedMotion && haptic) {
      if (haptic === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined)
      else Haptics.selectionAsync().catch(() => undefined)
    }
    onPress?.()
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={press}
      onPressIn={() => { scale.value = reducedMotion ? 1 : withTiming(0.975, { duration: 90 }) }}
      onPressOut={() => { scale.value = reducedMotion ? 1 : withSpring(1, { damping: 18, stiffness: 260 }) }}
    >
      <Animated.View style={[style, disabled && { opacity: 0.45 }, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  )
}
