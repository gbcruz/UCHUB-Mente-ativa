import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { radius } from '../theme/spacing';

type ExplicacaoProps = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
};

/** Botão com gradiente (reutilizável) */
export default function CardExplicacao({ label, onPress, style }: ExplicacaoProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={style}>
      <LinearGradient colors={[colors.explainA, colors.explainB]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.btn}>
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 50, borderRadius: radius.pill,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#0a3c8a', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  label: { color: colors.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
});