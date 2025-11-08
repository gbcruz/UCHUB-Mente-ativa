import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GradientButton from "@/components/gradientButton";

export default function TelaProfessor01({ navigation }: any) {
  const materias = [
    "Filosofia",
    "Matemática",
    "História",
    "Computação",
    "Português",
    "Artes",
  ];

  return (
    <LinearGradient
      colors={["#111b84", "#3c0e71"]}
      style={styles.container}
    >

      {/* ✅ Botão sair agora no canto superior esquerdo */}
      <View style={styles.header}>
        <GradientButton
          title="Sair"
          width={90}
          height={36}
          fontSize={13}
          gradientColor={["#6A3EEA", "#A270FF"]}
          onPress={() => navigation.goBack()}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.titulo}>Matérias</Text>

        <ScrollView style={styles.lista}>
          {materias.map((item, index) => (
            <GradientButton
              key={index}
              title={item}
              width={"100%"}
              height={48}
              fontSize={15}
              gradientColor={["#8E5BF7", "#B98BFF"]}
              style={styles.botaoMateria}
              onPress={() =>
                navigation.navigate("telaProfessor02", { materia: item })
              }
            />
          ))}
        </ScrollView>

        <View style={styles.acoes}>
          <GradientButton
            title="Criar novo"
            width={"48%"}
            height={45}
            fontSize={15}
            gradientColor={["#0656E8", "#00A8FF"]}
          />

          <GradientButton
            title="Deletar"
            width={"48%"}
            height={45}
            fontSize={15}
            gradientColor={["#0656E8", "#00A8FF"]}
          />
        </View>
      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  // ✅ Novo container do botão Sair
  header: {
    width: "85%",
    marginTop: 35,
    alignItems: "flex-start",
  },

  content: {
    width: "85%",
    alignItems: "center",
    marginTop: 10,
  },

  titulo: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 22,
    marginVertical: 18,
  },

  lista: {
    width: "100%",
    marginBottom: 10,
  },

  botaoMateria: {
    marginBottom: 12,
  },

  acoes: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});
