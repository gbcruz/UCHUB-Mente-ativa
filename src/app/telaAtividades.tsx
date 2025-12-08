import IconBack from "@/components/icons/iconBack";
import { MateriaButton } from "@/components/materiaButton";
import { API_KEY } from "@/utils/apiKey";
import { Gradient } from "@/utils/styles/background";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Bloco = {
  id: number;
  nome: string;
  materiaId: number | string;
  turmaId: number | string;
};

export default function TelaAtividades() {
  const { materiaId, materiaNome } = useLocalSearchParams<{
    materiaId?: string;
    materiaNome?: string;
  }>();

  const [atividades, setAtividades] = useState<Bloco[]>([]);
  const [loading, setLoading] = useState(true);

  // turma fixa (depois você pega do aluno logado)
  const TURMA_ID = 4;

  useEffect(() => {
    const carregarAtividades = async () => {
      try {
        if (!materiaId) {
          console.warn("Nenhum materiaId recebido em TelaAtividades");
          setAtividades([]);
          return;
        }

        const materiaIdNumber = Number(materiaId);

        // 🔥 JÁ FILTRA NA API PELO json-server
        // Vai bater em algo tipo:  /blocos?materiaId=1&turmaId=4
        const url = `${API_KEY}/blocos?materiaId=${materiaIdNumber}&turmaId=${TURMA_ID}`;
        console.log("Buscando blocos em:", url);

        const response = await fetch(url);
        const data = await response.json();
        console.log("Resposta /blocos filtrados na API:", data);

        let lista: Bloco[] = [];

        if (Array.isArray(data)) {
          lista = data as Bloco[];
        } else if (data && Array.isArray(data.blocos)) {
          lista = data.blocos as Bloco[];
        } else {
          console.warn("Formato inesperado da API de blocos:", data);
        }

        setAtividades(lista);
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
        setAtividades([]);
      } finally {
        setLoading(false);
      }
    };

    carregarAtividades();
  }, [materiaId]);

  const naoTemAtividades = !loading && atividades.length === 0;

  return (
    <Gradient>
      {/* TOPO */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconBack />
        </TouchableOpacity>

        <Text style={styles.title}>
          {materiaNome ? `Atividades de ${materiaNome}` : "Atividades"}
        </Text>

        <View style={{ width: 38 }} />
      </View>

      {/* CONTEÚDO */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : naoTemAtividades ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Nenhuma atividade encontrada</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {atividades.slice(0, 8).map((bloco) => (
            <View key={bloco.id} style={styles.itemWrapper}>
              <MateriaButton
                nome={bloco.nome}
                onPress={() =>
                  router.push({
                    pathname: "/telaQuestoes",
                    params: {
                      blocoId: String(bloco.id),
                      blocoNome: bloco.nome,
                    },
                  })
                }
              />
            </View>
          ))}
        </ScrollView>
      )}
    </Gradient>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  scrollArea: {
    flex: 1,
    width: "100%",
    marginTop: 20,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 40,
    gap: 8,
  },
  itemWrapper: {
    width: "100%",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
  },
});
