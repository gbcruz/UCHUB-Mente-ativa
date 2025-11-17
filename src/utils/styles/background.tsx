// src/utils/styles/background.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GradientProps {
  children?: React.ReactNode;
}

export const Gradient: React.FC<GradientProps> = ({ children }) => {
  return (
    <LinearGradient
      // cores: topo escuro -> centro arroxeado -> base mais escura
      colors={["#150877ff", "#453bb1ff", "#6237daff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      {/* container garante que o conteúdo fique centralizado e o gradiente ocupe a tela inteira */}
      <View style={styles.content}>{children}</View>
    </LinearGradient>
  );
};

export const backgroundStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0C29",
  },
});

const styles = StyleSheet.create({
  gradient: {
    flex: 1,               // ESSENCIAL: ocupa toda a altura disponível
  },
  content: {
    flex: 1,
    width: "100%",
    // Se você quer o conteúdo centrado verticalmente, use:
    // justifyContent: 'center',
    // alignItems: 'center',
    // Mas como suas telas já posicionam (paddingTop, etc.), mantenho flex-start:
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
