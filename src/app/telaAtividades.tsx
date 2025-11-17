import IconBack from "@/components/icons/iconBack";
import { MateriaButton } from "@/components/materiaButton2";
import { Gradient } from "@/utils/styles/background";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";

export default function TelaAtividades() {
  const { width } = useWindowDimensions();

  // Define a largura adaptativa dos botões conforme o tamanho da tela
  const buttonWidth =
    width < 500 ? "85%" : width < 900 ? "70%" : "50%";

  return (
    <Gradient>
      {/* TOPO */}
      <View style={styles.topIcons}>
        <TouchableOpacity onPress={() => router.navigate("./telaMaterias")}>
          <IconBack />
        </TouchableOpacity>
      </View>

      {/* TÍTULO */}
      <Text style={styles.title}>Atividades</Text>

      {/* LISTA DE ATIVIDADES */}
      <View style={styles.container}>
        <MateriaButton
          nome="Atividade 1"
          onPress={() => router.navigate("./telaQuestoes")}
          customWidth={buttonWidth}
        />
        <MateriaButton nome="Atividade 2" customWidth={buttonWidth} />
        <MateriaButton nome="Atividade 3" customWidth={buttonWidth} />
        <MateriaButton nome="Atividade 4" customWidth={buttonWidth} />
        <MateriaButton nome="Atividade 5" customWidth={buttonWidth} />
        <MateriaButton nome="Atividade 6" customWidth={buttonWidth} />
      </View>
    </Gradient>
  );
}

const styles = StyleSheet.create({
  topIcons: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 25,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 10,
    paddingBottom: 30,
  },
});
