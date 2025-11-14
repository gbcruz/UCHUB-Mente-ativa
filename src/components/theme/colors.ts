import type { ColorValue } from 'react-native';

export const colors = {
    bg: ['#100022', '#3d0b83', '#5a0bbf'] as readonly ColorValue[],
    white: '#FFFFFF',
    textPrimary: '#1f1b2e',
    textOnDark: '#FFFFFF',
    cardTitle: '#3a2a67',
    pill: '#5b2ca5',
    pillText: '#FFFFFF',
    pillInputBg: 'rgba(255,255,255,0.08)',
    pillInputBorder: 'rgba(255,255,255,0.2)',
    explainA: '#1373ff', // gradiente botão "Explicação"
    explainB: '#0a56c7',
    headerChip: 'rgba(255,255,255,0.16)',
    headerIconBg: 'rgba(255,255,255,0.12)',
} as const;