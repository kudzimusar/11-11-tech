import { Platform } from 'react-native'

export const colors = {
  ink: '#050608', inkRaised: '#111315', inkSoft: '#191B1E', paper: '#FFFFFF', warm: '#F3F3F0',
  orange: '#FF8E1E', orangeSoft: '#FF9B39', textOnDark: '#FFFFFF', textMutedDark: '#B7B7B3',
  textOnLight: '#101113', textMutedLight: '#666A70', ruleDark: '#2B2E32', ruleLight: '#D6D6D1',
  success: '#72AF4C', danger: '#FF6B6B',
} as const

export const spacing = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32, section: 48, hero: 64 } as const
export const radii = { sm: 8, md: 14, lg: 20, pill: 999 } as const
export const type = {
  display: Platform.select({ ios: 'AvenirNextCondensed-Heavy', android: 'sans-serif-condensed', default: undefined }),
  body: Platform.select({ ios: 'Avenir Next', android: 'sans-serif', default: undefined }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  hero: 52, h1: 40, h2: 30, h3: 22, bodySize: 16, small: 13, micro: 11,
} as const
export const layout = { phoneGutter: 20, tabletGutter: 36, maxContent: 980, tabletBreakpoint: 768 } as const

export function palette(tone: 'dark' | 'light') {
  return tone === 'dark'
    ? { background: colors.ink, surface: colors.inkRaised, text: colors.textOnDark, muted: colors.textMutedDark, rule: colors.ruleDark }
    : { background: colors.paper, surface: colors.warm, text: colors.textOnLight, muted: colors.textMutedLight, rule: colors.ruleLight }
}
