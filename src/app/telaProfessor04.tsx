import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GradientButton from "@/components/gradientButton";
import IconBack from "@/components/icons/iconBack";
import IconHome from "@/components/icons/iconHome";
import IconNext from "@/components/icons/iconNext";

export default function telaProfessor04({ navigation, route }: any) {
  
  const materia = route?.params?.materia || "Matéria";
  const ano = route?.params?.ano || "Ano";
  const conteudo = route?.params?.conteudo || "Conteúdo";

  // Questões desse conteúdo
  const questoes = [
    "Dois terços de 90 é?",
    "Simplifique 12/18",
    "Dois terços de 90 é?",
    "Dois terços de 90 é?",
    "Dois terços de 90 é?",
  ];

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
      <Text style={styles.titulo}>{conteudo}</Text>

      {/* Lista de questões */}
      <ScrollView style={styles.lista}>
        {questoes.map((item, index) => (
          <GradientButton
            key={index}
            title={`${index + 1}. ${item}`}
            width={"100%"}
            height={48}
            fontSize={15}
            gradientColor={["#8E5BF7", "#B98BFF"]}
            style={styles.botao}
            onPress={() =>
              navigation.navigate("telaProfessor05", {
                materia,
                ano,
                conteudo,
                questao: index + 1
              })
            }
          />
        ))}
      </ScrollView>

      {/* Botão próximo */}
      <View style={styles.nextArea}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("telaProfessor05", {
              materia,
              ano,
              conteudo,
              questao: 1,
            })
          }
        >
          <IconNext />
        </TouchableOpacity>
      </View>

      {/* Botões Criar e Editar */}
      <View style={styles.footer}>
        <GradientButton
          title="Criar Atv"
          width={"45%"}
          height={45}
          fontSize={15}
          gradientColor={["#0656E8", "#00A8FF"]}
          onPress={() =>
            navigation.navigate("telaProfessor05", {
              materia,
              ano,
              conteudo,
              novaQuestao: true,
            })
          }
        />

        <GradientButton
          title="Editar"
          width={"45%"}
          height={45}
          fontSize={15}
          gradientColor={["#0656E8", "#00A8FF"]}
          onPress={() =>
            navigation.navigate("telaProfessor05", {
              materia,
              ano,
              conteudo,
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
    marginTop: 18,
  },
  footer: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
