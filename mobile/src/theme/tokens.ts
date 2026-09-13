import { Platform } from 'react-native'

export const colors = {
  ink: '#050608', inkRaised: '#111315', inkSoft: '#191B1E', paper: '#FFFFFF', warm: '#F3F3F0', warmRaised: '#EAEAE5',
  orange: '#FF8E1E', orangeSoft: '#FF9B39', textOnDark: '#FFFFFF', textMutedDark: '#B7B7B3', textOnLight: '#101113', textMutedLight: '#62666D',
  ruleDark: '#2B2E32', ruleLight: '#D6D6D1', success: '#72AF4C', warning: '#E2A43A', danger: '#D84B55',
} as const

export const spacing = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32, section: 48, hero: 64 } as const
export const radii = { sm: 8, md: 14, lg: 20, xl: 28, pill: 999 } as const
export const type = {
  display: Platform.select({ ios: 'AvenirNextCondensed-Heavy', android: 'sans-serif-condensed', default: undefined }),
  body: Platform.select({ ios: 'Avenir Next', android: 'sans-serif', default: undefined }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  hero: 52, h1: 40, h2: 30, h3: 22, bodySize: 16, small: 13, micro: 11,
} as const
export const layout = { compactPhone: 360, phoneGutter: 20, tabletGutter: 36, maxContent: 980, tabletBreakpoint: 768 } as const

export type ThemeName = 'light' | 'dark'
export type SemanticTheme = {
  name: ThemeName
  background: string
  surface: string
  elevated: string
  text: string
  muted: string
  inverseText: string
  rule: string
  accent: string
  accentOn: string
  input: string
  inputBorder: string
  selected: string
  navigation: string
  sheet: string
  success: string
  warning: string
  danger: string
  overlay: string
  mediaOverlay: string
  shadow: string
}

export const themes: Record<ThemeName, SemanticTheme> = {
  dark: {
    name: 'dark', background: colors.ink, surface: colors.inkRaised, elevated: colors.inkSoft, text: colors.textOnDark, muted: colors.textMutedDark,
    inverseText: colors.ink, rule: colors.ruleDark, accent: colors.orange, accentOn: colors.ink, input: colors.inkRaised, inputBorder: colors.ruleDark,
    selected: '#2A1A0B', navigation: colors.inkRaised, sheet: '#0B0D0F', success: colors.success, warning: colors.warning, danger: colors.danger,
    overlay: 'rgba(0,0,0,0.58)', mediaOverlay: 'rgba(0,0,0,0.42)', shadow: '#000000',
  },
  light: {
    name: 'light', background: colors.paper, surface: colors.warm, elevated: colors.warmRaised, text: colors.textOnLight, muted: colors.textMutedLight,
    inverseText: colors.paper, rule: colors.ruleLight, accent: colors.orange, accentOn: colors.ink, input: colors.paper, inputBorder: '#C7C8C4',
    selected: '#FFF0DF', navigation: '#FAFAF7', sheet: colors.paper, success: '#4D8631', warning: '#A96D0A', danger: '#B53643',
    overlay: 'rgba(5,6,8,0.46)', mediaOverlay: 'rgba(5,6,8,0.28)', shadow: '#202124',
  },
}

export function palette(tone: 'dark' | 'light') {
  const theme = themes[tone]
  return { background: theme.background, surface: theme.surface, text: theme.text, muted: theme.muted, rule: theme.rule }
}
