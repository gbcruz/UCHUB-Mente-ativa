import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GradientButton from "@/components/gradientButton";
import IconBack from "@/components/icons/iconBack";
import IconHome from "@/components/icons/iconHome";
import IconNext from "@/components/icons/iconNext";

export default function telaProfessor02({ navigation, route }: any) {
  
  // Recebe a matéria da tela anterior
  const materia = route?.params?.materia || "Matéria";

  // Lista de anos disponíveis
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
      <ScrollView style={styles.lista}>
        {anos.map((item, index) => (
          <GradientButton
            key={index}
            title={item}
            width={"100%"}
            height={48}
            fontSize={16}
            gradientColor={["#8E5BF7", "#B98BFF"]}
            style={styles.botao}
            onPress={() =>
              navigation.navigate("telaProfessor03", {
                materia,
                ano: item,
              })
            }
          />
        ))}
      </ScrollView>

      {/* Botão próximo automático → 1º ano */}
      <View style={styles.nextArea}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("telaProfessor03", {
              materia,
              ano: anos[0],
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
    paddingTop: 35,
  },
  header: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  titulo: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 24,
    marginBottom: 25,
  },
  lista: {
    width: "85%",
  },
  botao: {
    marginBottom: 12,
  },
  nextArea: {
    marginTop: 20,
  },
});
