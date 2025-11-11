import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";

interface MateriaButtonProps {
  nome: string;
  onPress?: () => void;
}

export const MateriaButton: React.FC<MateriaButtonProps> = ({ nome, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>{nome}</Text>
    </TouchableOpacity>
  );
};