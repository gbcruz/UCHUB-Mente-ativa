import CardAlternativas from "@/components/cards/cardAlternativas";
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

interface Turma {
  id: number;
  turma: string;
}

export default function telaProfessor02() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const materiaId = params.materiaId;
  const materiaNome = params.materiaNome || "Matéria";
  const usuario = params.usuario ? JSON.parse(params.usuario as string) : null;

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTurmas();
  }, []);

  async function fetchTurmas() {
    try {
      const response = await fetch(`${API_URL}/turmas`);
      const data = await response.json();

      if (usuario && usuario.turmaIds) {
        const turmasFiltradas = data.filter((t: Turma) => 
          usuario.turmaIds.includes(t.id)
        );
        setTurmas(turmasFiltradas);
      } else {
        setTurmas(data);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar as turmas.");
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
          style={styles.iconCircle}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>

      <TouchableOpacity
          onPress={() => router.push({
            pathname: "/telaProfessor01",
            params: { usuario: params.usuario as string }
          })}
          style={styles.iconCircle}
        >
          <Ionicons name="home" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Título */}
      <Text style={styles.titulo}>Turmas</Text>

      {/* Lista de conteúdos */}
      <ScrollView
        style={styles.lista}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaContent}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
        ) : (
          turmas.map((turma) => (
            <TouchableOpacity
              key={turma.id}
              style={{ width: "100%" }}
              onPress={() => 
                router.push({
                  pathname: "/telaProfessor04",
                  params: {
                    materiaId,
                    materiaNome,
                    turmaId: turma.id,
                    turmaNome: turma.turma,
                    usuario: params.usuario as string
                  }
                })
              }
            >
              <View style={styles.wrapperAlternativa}>
                <CardAlternativas
                  label={turma.turma}
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
});