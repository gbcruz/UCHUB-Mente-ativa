import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { colors } from '../theme/colors';
import { radius, space } from '../theme/spacing';

type AlternativeItemProps = {
  label: string;                // "Alternativa A", etc.
  value: string;                // texto da alternativa
  onChangeText: (v: string) => void;
};

export default function CardAlternativas({ label, value, onChangeText }: AlternativeItemProps) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const enterEdit = () => {
    setEditing(true);
    // dar um pequeno delay ajuda o focus em Android
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const exitEdit = () => setEditing(false);

  return (
    <View style={styles.wrapper}>
      {/* "Pílula" que vira input quando está editando */}
      {!editing ? (
        <Pressable style={styles.pill} onPress={enterEdit}>
          <Text style={styles.pillText}>
            {value?.trim() ? value : label}
          </Text>
        </Pressable>
      ) : (
        <TextInput
          ref={inputRef}
          style={[styles.pill, styles.inputAsPill]}
          value={value}
          onChangeText={onChangeText}
          onBlur={exitEdit}
          placeholder={`Texto da ${label.toLowerCase()}`}
          placeholderTextColor="#c9c3e2"
          returnKeyType="done"
          onSubmitEditing={exitEdit}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: space.md },
  pill: {
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  pillText: { color: colors.pillText, fontWeight: '700' },
  inputAsPill: {
    textAlign: 'center',
    color: '#fff',
  },
});