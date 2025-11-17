import React from "react";
import { View, Text } from "react-native";
import { styles } from "./style";

interface QuestionCardProps {
  question: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{question}</Text>
    </View>
  );
};
