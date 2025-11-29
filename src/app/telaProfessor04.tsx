import CardAlternativas from "@/components/cards/cardAlternativas";
import GradientButton from "@/components/gradientButton";
import { API_KEY } from "@/utils/apiKey";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const API_URL = API_KEY;

interface Pergunta {
  id: number;
  enunciado: string;
  materiaId: number;
  turmaId: number;
}

export default function telaProfessor04() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const materiaId = params.materiaId;
  const turmaId = params.turmaId;
  const materiaNome = params.materiaNome || "Matéria";
  const turmaNome = params.turmaNome || "Turma";

  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (materiaId && turmaId) {
      fetchPerguntas();
    }
  }, [materiaId, turmaId]);

  async function fetchPerguntas() {
    try {
      // Filtrando diretamente na URL se o JSON Server suportar, ou filtrando no front
      const response = await fetch(`${API_URL}/perguntas?materiaId=${materiaId}&turmaId=${turmaId}`);
      const data = await response.json();
      setPerguntas(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar as perguntas.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <LinearGradient colors={["#111b84", "#3c0e71"]} style={styles.container}>
      {/* Ícones topo */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconCircle}        // ⬅ círculo no voltar
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/telaProfessor01")}
          style={styles.iconCircle}        // ⬅ círculo na casinha
        >
          <Ionicons name="home" size={20} color="#fff" />
          {/* home = casinha preenchida */}
        </TouchableOpacity>
      </View>

      {/* Título */}
      <Text style={styles.titulo}>Atividades</Text>

      {/* Lista de questões */}
      <ScrollView
        style={styles.lista}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaContent}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
        ) : (
          perguntas.map((pergunta, index) => (
            <TouchableOpacity
              key={pergunta.id}
              style={{ width: "100%" }}
              onPress={() => {}}
            >
              <View style={styles.wrapperAlternativa}>
                <CardAlternativas
                  label={`${index + 1}. ${pergunta.enunciado}`}
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
      <View style={styles.footer}>
        <View style={{ width: "100%" }}>
          <GradientButton
            title="Criar"
            width={"100%"}    // ⬅ botãa ocupa toda a largura
            height={60}       // ⬅ ajuste para parecido com os cards
            fontSize={18}
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
  nextArea: {
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
  },

  footer: {
    width: "100%",
    marginTop: height * 0.02,
    marginBottom: height * 0.02,
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

  // círculo dos ícones do topo
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.20)",
    justifyContent: "center",
    alignItems: "center",
  },

  // círculo do botão próximo
  nextButton: {
    width: 45,
    height: 45,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.20)",
    justifyContent: "center",
    alignItems: "center",
  },
});