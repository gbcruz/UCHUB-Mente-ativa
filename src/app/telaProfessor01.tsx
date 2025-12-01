import CardAlternativas from "@/components/cards/cardAlternativas";
import { API_KEY } from "@/utils/apiKey";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const API_URL = API_KEY;

interface Materia {
  id: number;
  nome: string;
}

export default function TelaProfessor01() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const usuario = params.usuario ? JSON.parse(params.usuario as string) : null;

  useEffect(() => {
    fetchMaterias();
  }, []);

  async function fetchMaterias() {
    try {
      const response = await fetch(`${API_URL}/materias`);
      const data = await response.json();
      
      if (usuario && usuario.materiaIds) {
        const materiasFiltradas = data.filter((m: Materia) => 
          usuario.materiaIds.includes(m.id)
        );
        setMaterias(materiasFiltradas);
      } else {
        setMaterias(data);
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar as matérias.");
    } finally {
      setIsLoading(false);
    }
  }

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
    <LinearGradient colors={["#111b84", "#3c0e71"]} style={styles.container}>
      {/* Ícones topo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openExitModal}>
          <Text style={styles.exitButton}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Título */}
      <Text style={styles.titulo}>Selecione a Disciplina</Text>

      {/* Lista de conteúdos */}
      <ScrollView
        style={styles.lista}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaContent}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
        ) : (
          materias.map((materia) => (
            <TouchableOpacity
              key={materia.id}
              style={{ width: "100%" }}
              onPress={() => 
                router.push({
                  pathname: "/telaProfessor02",
                  params: {
                    materiaId: materia.id,
                    materiaNome: materia.nome,
                    usuario: params.usuario as string
                  }
                })
              }
            >
              <View style={styles.wrapperAlternativa}>
                <CardAlternativas
                  label={materia.nome}
                  showInput={false}
                  showMarkCorrect={false}
                  containerStyle={styles.cardLista}
                  labelStyle={styles.cardTexto}
                />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

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
    paddingBottom: 20,
  },
  wrapperAlternativa: {
    marginVertical: 8,
  },
  cardLista: {
    paddingVertical: 20,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  cardTexto: {
    fontSize: 21,
    fontWeight: "700",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.20)",
    justifyContent: "center",
    alignItems: "center",
  },
  nextButton: {
    width: 45,
    height: 45,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.20)",
    justifyContent: "center",
    alignItems: "center",
  },
  // ======= ESTILOS DO BOTÃO SAIR E MODAL =======
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
