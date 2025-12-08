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
  const { materiaId, materiaNome, usuario: usuarioParam } =
    useLocalSearchParams<{
      materiaId?: string;
      materiaNome?: string;
      usuario?: string;
    }>();

  // tenta reconstruir o usuário (aluno)
  let usuario: any = null;
  try {
    usuario = usuarioParam ? JSON.parse(usuarioParam as string) : null;
  } catch (e) {
    console.warn("Erro ao fazer parse de usuario em TelaAtividades:", e);
  }

  // turma do aluno; se não vier, usa 4 (admin) como fallback p/ não quebrar
  const TURMA_ID = usuario?.turmaId ?? 4;

  const [atividades, setAtividades] = useState<Bloco[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarAtividades = async () => {
      try {
        console.log("TelaAtividades params:", {
          materiaId,
          materiaNome,
          usuarioParam,
          usuario,
          TURMA_ID,
        });

        if (!materiaId) {
          console.warn("Nenhum materiaId recebido em TelaAtividades");
          setAtividades([]);
          setLoading(false);
          return;
        }

        const materiaIdNumber = Number(materiaId);

        // 1) busca TODOS os blocos dessa matéria
        const url = `${API_KEY}/blocos?materiaId=${materiaIdNumber}`;
        console.log("Buscando blocos em:", url);

        const response = await fetch(url);
        const data = await response.json();
        console.log("Resposta /blocos (bruto):", data);

        let lista: Bloco[] = [];

        if (Array.isArray(data)) {
          lista = data as Bloco[];
        } else if (data && Array.isArray(data.blocos)) {
          lista = data.blocos as Bloco[];
        } else {
          console.warn("Formato inesperado da API de blocos:", data);
        }

        // 2) filtra APENAS blocos da turma do aluno
        const filtrados = lista.filter(
          (b) => Number(b.turmaId) === Number(TURMA_ID)
        );
        console.log("Blocos após filtro por turma:", filtrados);

        setAtividades(filtrados);
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
        setAtividades([]);
      } finally {
        setLoading(false);
      }
    };

    carregarAtividades();
  }, [materiaId, usuarioParam]);

  const naoTemAtividades = !loading && atividades.length === 0;

  return (
    <Gradient>
      {/* TOPO – igual estrutura da tela de Matérias */}
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconBack />
        </TouchableOpacity>
      </View>

      {/* TÍTULO – alinhado com o "Matérias" */}
      <Text style={styles.title}>
        {materiaNome ? `Atividades de ${materiaNome}` : "Atividades"}
      </Text>

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
          {atividades.map((bloco) => (
            <View key={bloco.id} style={styles.itemWrapper}>
              <MateriaButton
                nome={bloco.nome}
                onPress={() =>
                  router.push({
                    pathname: "/telaQuestoes",
                    params: {
                      blocoId: String(bloco.id),
                      blocoNome: bloco.nome,
                      usuario: usuarioParam,
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
  // topo alinhado com a tela de Matérias
  topContainer: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  scrollArea: {
    flex: 1,
    width: "100%",
    marginTop: 10,
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
