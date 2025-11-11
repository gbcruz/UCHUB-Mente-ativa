import IconBack from "@/components/icons/iconBack";
import IconHome from "@/components/icons/iconHome";
import IconNext from "@/components/icons/iconNext";
import { MateriaButton } from "@/components/materiaButton";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function telaProfessor02({ navigation, route }: any) {
  
  const materia = route?.params?.materia || "Matéria";

  const anos = ["6º ano", "7º ano", "8º ano", "9º ano", "1º ano EM"];

  return (
    <LinearGradient colors={["#111b84", "#3c0e71"]} style={styles.container}>

      {/* Ícones topo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconBack />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("telaProfessor01")}>
          <IconHome />
        </TouchableOpacity>
      </View>

      {/* Título */}
      <Text style={styles.titulo}>{materia}</Text>

      {/* Botões dos anos */}
      <ScrollView 
        style={styles.lista}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaContent}
      >
        {anos.map((ano, index) => (
          <MateriaButton
            key={index}
            nome={ano}
            onPress={() =>
              navigation.navigate("telaProfessor03", { materia, ano })
            }
          />
        ))}
      </ScrollView>

      {/* Botão próximo automático */}
      <View style={styles.nextArea}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("telaProfessor03", {
              materia,
              ano: anos[anos.length - 1],
            })
          }
        >
          <IconNext />
        </TouchableOpacity>
      </View>

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
    flexDirection: "row",
    justifyContent: "space-between",
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
  nextArea: {
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },
});