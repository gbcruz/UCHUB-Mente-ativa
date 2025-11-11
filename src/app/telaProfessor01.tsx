import GradientButton from "@/components/gradientButton";
import { MateriaButton } from "@/components/materiaButton";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

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

      {/* Botão sair no canto superior esquerdo */}
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

      <Text style={styles.titulo}>Matérias</Text>

      {/* Lista de matérias */}
      <ScrollView 
        style={styles.lista}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaContent}
      >
        {materias.map((materia, index) => (
          <MateriaButton
            key={index}
            nome={materia}
            onPress={() =>
              navigation.navigate("telaProfessor02", { materia })
            }
          />
        ))}
      </ScrollView>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: height * 0.04,
    paddingHorizontal: width * 0.08,
  },

  header: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: height * 0.02,
  },

  titulo: {
    color: "#fff",
    fontWeight: "700",
    fontSize: width * 0.06,
    textAlign: "center",
    marginBottom: height * 0.03,
  },

  lista: {
    width: "100%",
    flex: 1,
  },

  listaContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});