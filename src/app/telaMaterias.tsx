import { MateriaButton } from "@/components/materiaButton";
import { Gradient } from "@/utils/styles/background";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TelaMaterias() {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ======= Animação de entrada do pop-up =======
  const openExitModal = () => {
    setShowExitConfirm(true);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  // ======= Animação de saída do pop-up =======
  const closeExitModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setShowExitConfirm(false));
  };

  return (
    <Gradient>
      {/*  TOPO  */}
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={openExitModal}>
          <Text style={styles.exitButton}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* TÍTULO */}
      <Text style={styles.title}>Matérias</Text>

      {/* BOTÕES DE MATÉRIAS */}
      <View style={styles.container}>
        <MateriaButton
          nome="Matemática"
          onPress={() => router.navigate("/telaAtividades")}
        />
        <MateriaButton nome="Português" />
        <MateriaButton nome="História" />
        <MateriaButton nome="Geografia" />
        <MateriaButton nome="Filosofia" />
        <MateriaButton nome="Computação" />
        <MateriaButton nome="Artes" />
      </View>

      {/* ======= POP-UP CONFIRMAR SAÍDA ======= */}
      <Modal transparent visible={showExitConfirm} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.exitModalContent,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.exitTitle}>Deseja realmente sair?</Text>

            <View style={styles.exitButtons}>
              <TouchableOpacity
                style={[styles.exitBtn, { backgroundColor: "#E53935" }]}
                onPress={closeExitModal}
              >
                <Text style={styles.exitText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.exitBtn, { backgroundColor: "#4CAF50" }]}
                onPress={() => {
                  closeExitModal();
                  router.navigate("/");
                }}
              >
                <Text style={styles.exitText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </Gradient>
  );
}

const styles = StyleSheet.create({
  // ======= ESTRUTURA PRINCIPAL =======
  topContainer: {
    width: "100%",
    alignItems: "flex-start", // 👈 mudou aqui (antes era flex-end)
    paddingHorizontal: 25,
    marginTop: 40,
    marginBottom: 20,
  },
  exitButton: {
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    fontWeight: "bold",
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
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 10,
    paddingBottom: 30,
  },

  // ======= POP-UP CONFIRMAÇÃO =======
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  exitModalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "85%",
    padding: 25,
    alignItems: "center",
  },
  exitTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D0C57",
    marginBottom: 20,
    textAlign: "center",
  },
  exitButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 10,
  },
  exitBtn: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  exitText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
