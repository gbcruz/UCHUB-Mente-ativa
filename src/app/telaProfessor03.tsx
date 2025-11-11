import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GradientButton from "@/components/gradientButton";
import IconBack from "@/components/icons/iconBack";
import IconHome from "@/components/icons/iconHome";
import IconNext from "@/components/icons/iconNext";

export default function telaProfessor03({ navigation, route }: any) {
  
  const materia = route?.params?.materia || "Matéria";
  const ano = route?.params?.ano || "Ano";

  // Conteúdos da matéria
  const conteudos = ["Fração", "Porcentagem", "Geometria", "Álgebra"];

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
      <Text style={styles.titulo}>{ano}</Text>

      {/* Lista de conteúdos */}
      <ScrollView style={styles.lista}>
        {conteudos.map((item, index) => (
          <GradientButton
            key={index}
            title={item}
            width={"100%"}
            height={48}
            fontSize={16}
            gradientColor={["#8E5BF7", "#B98BFF"]}
            style={styles.botao}
            onPress={() =>
              navigation.navigate("telaProfessor04", {
                materia,
                ano,
                conteudo: item,
              })
            }
          />
        ))}
      </ScrollView>

      {/* Botão próximo */}
      <View style={styles.nextArea}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("telaProfessor04", {
              materia,
              ano,
              conteudo: conteudos[0],
            })
          }
        >
          <IconNext />
        </TouchableOpacity>
      </View>

      {/* Botão Editar */}
      <View style={styles.footer}>
        <GradientButton
          title="Editar"
          width={"85%"}
          height={48}
          fontSize={17}
          gradientColor={["#0656E8", "#00A8FF"]}
          onPress={() =>
            navigation.navigate("telaProfessor04", {
              materia,
              ano,
              editar: true,
            })
          }
        />
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
    marginBottom: 15,
  },
  titulo: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 24,
    textAlign: "center",
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
  footer: {
    width: "85%",
    marginTop: 18,
  },
});
