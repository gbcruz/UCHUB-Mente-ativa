import CardAlternativas from "@/components/cards/cardAlternativas";
import CardEnunciado from "@/components/cards/cardEnunciado";
import CardBloco from "@/components/cards/cardBloco"; // 🔹 NOVO
import { backgroundStyles, Gradient } from "@/styles/background";
import { API_KEY } from "@/utils/apiKey";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_BASE_URL = API_KEY;

/* ---------------------- TIPAGENS ---------------------- */

type Question = {
  id: number;
  enunciado: string;
  alternativas: string[];
  indiceCorreta?: number;
  explicacao?: string;

  // 🔹 campos "antigos" e "novos" convivendo:
  turma?: number;
  turmaId?: number;
  materiaId?: number;

  autorId?: number;
  dificuldade?: string;

  blocosId?: number; // 🔹 NOVO: id do bloco (modelo novo)
  bloco?: string; // 🔹 ainda deixei por compatibilidade com o modelo antigo
};

// blocos vindos da API
type BlockFromAPI = {
  id: number;
  nome: string;
  turmaId?: number;
  materiaId?: number;
};

// estrutura de blocos na UI (conta quantas questões tem em cada bloco)
type BlockInfo = {
  id: number;
  name: string;
  count: number;
  max: number;
};

// perguntas só pra fazer contagem por bloco
type QuestionForCount = {
  id: number;
  blocosId?: number;
};

/* ---------------------- FUNÇÕES DE API ---------------------- */

// Buscar questão por ID
async function getQuestionById(id: number): Promise<Question> {
  const res = await fetch(`${API_BASE_URL}/perguntas/${id}`);
  if (!res.ok) {
    throw new Error(`Questão ${id} não encontrada.`);
  }
  return res.json();
}

// Atualizar questão
async function updateQuestion(q: Question): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/perguntas/${q.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(q),
  });
  if (!res.ok) {
    throw new Error("Erro ao atualizar questão.");
  }
}

// Deletar questão
async function deleteQuestion(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/perguntas/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Erro ao apagar questão.");
  }
}

/* ---------------------- COMPONENTE ---------------------- */

export default function TelaProfessor05() {
  const router = useRouter();
  const { questionId } = useLocalSearchParams();

  // Questão selecionada
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );

  // CAMPOS DE EDIÇÃO
  const [enunciado, setEnunciado] = useState("");
  const [alternativas, setAlternativas] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
  ]);
  const [explicacao, setExplicacao] = useState("");
  const [indiceCorreta, setIndiceCorreta] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // 🔹 blocos da UI
  const [blocos, setBlocos] = useState<BlockInfo[]>([]);
  const [blocoSelecionadoId, setBlocoSelecionadoId] = useState<number | null>(
    null
  );

  // Estado inicial (para detectar alterações)
  const [initial, setInitial] = useState<{
    enunciado: string;
    alternativas: string[];
    indiceCorreta: number | null;
    explicacao: string;
    blocosId: number | null; // 🔹 agora também rastreia o bloco inicial
  } | null>(null);

  // Detecta se houve qualquer alteração
  const dirty = useMemo(() => {
    if (!initial) return false;

    if (initial.enunciado !== enunciado) return true;

    for (let i = 0; i < 5; i++) {
      if (initial.alternativas[i] !== alternativas[i]) return true;
    }

    if (initial.indiceCorreta !== indiceCorreta) return true;

    if (initial.explicacao !== explicacao) return true;

    // 🔹 se o bloco mudou, também considera "sujo"
    if (initial.blocosId !== blocoSelecionadoId) return true;

    return false;
  }, [
    initial,
    enunciado,
    alternativas,
    indiceCorreta,
    explicacao,
    blocoSelecionadoId, // 🔹 dependência adicionada
  ]);

  // Atualizar alternativa específica
  const updateAlt = (i: number, v: string) => {
    setAlternativas((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  };

  /* ---------------------- CARREGAR QUESTÃO ---------------------- */

  useEffect(() => {
    if (questionId) {
      const id = Number(questionId);
      getQuestionById(id)
        .then((q) => handleSelectQuestion(q))
        .catch((e) => Alert.alert("Erro", e.message));
    }
  }, [questionId]);

  const handleSelectQuestion = (q: Question) => {
    setSelectedQuestion(q);

    const enun = q.enunciado ?? "";

    // garante 5 alternativas
    const alt = [...(q.alternativas ?? [])];
    while (alt.length < 5) alt.push("");
    if (alt.length > 5) alt.splice(5);

    const idxCorreta =
      typeof q.indiceCorreta === "number" ? q.indiceCorreta : 0;

    const exp = q.explicacao ?? "";

    // 🔹 tenta achar o blocoId; se não existir, deixa null
    const blocosId =
      typeof q.blocosId === "number" ? q.blocosId : null;

    setEnunciado(enun);
    setAlternativas(alt);
    setIndiceCorreta(idxCorreta);
    setExplicacao(exp);
    setBlocoSelecionadoId(blocosId); // 🔹 seta o bloco atual

    setInitial({
      enunciado: enun,
      alternativas: [...alt],
      indiceCorreta: idxCorreta,
      explicacao: exp,
      blocosId, // 🔹 salva estado inicial do bloco
    });
  };

  /* ---------------------- CARREGAR BLOCOS / CONTAGEM ---------------------- */

  // sempre que a questão for carregada, buscamos os blocos daquela turma/matéria
  useEffect(() => {
    if (!selectedQuestion) return;

    const carregarBlocos = async () => {
      try {
        // 🔹 aceita tanto turmaId novo quanto turma "antigo"
        const turmaId =
          typeof selectedQuestion.turmaId === "number"
            ? selectedQuestion.turmaId
            : selectedQuestion.turma;

        const materiaId =
          typeof selectedQuestion.materiaId === "number"
            ? selectedQuestion.materiaId
            : undefined;

        const paramsQuery: string[] = [];
        if (turmaId != null) paramsQuery.push(`turmaId=${turmaId}`);
        if (materiaId != null) paramsQuery.push(`materiaId=${materiaId}`);
        const queryString =
          paramsQuery.length > 0 ? `?${paramsQuery.join("&")}` : "";

        // 1) buscar blocos
        const resBlocos = await fetch(`${API_BASE_URL}/blocos${queryString}`);
        if (!resBlocos.ok) {
          console.log("Erro ao carregar blocos");
          return;
        }
        const blocosApi: BlockFromAPI[] = await resBlocos.json();

        // 2) buscar perguntas para contar quantas existem por bloco
        const resPerguntas = await fetch(
          `${API_BASE_URL}/perguntas${queryString}`
        );
        let perguntasApi: QuestionForCount[] = [];
        if (resPerguntas.ok) {
          perguntasApi = await resPerguntas.json();
        }

        const counts: Record<number, number> = {};

        perguntasApi.forEach((q) => {
          if (q.blocosId != null) {
            counts[q.blocosId] = (counts[q.blocosId] || 0) + 1;
          }
        });

        const mapped: BlockInfo[] = blocosApi.map((b) => ({
          id: b.id,
          name: b.nome,
          count: counts[b.id] || 0,
          max: 10, // mesmo limite da tela de criar
        }));

        setBlocos(mapped);
      } catch (err) {
        console.log("Erro ao carregar blocos:", err);
      }
    };

    carregarBlocos();
  }, [selectedQuestion]);

  /* ---------------------- SALVAR ---------------------- */

  const handleSalvar = async () => {
    if (!selectedQuestion) {
      Alert.alert("Aviso", "Selecione uma questão primeiro.");
      return;
    }

    const alternativasTrim = alternativas.map((a) => a.trim());

    if (!enunciado.trim()) {
      Alert.alert("Atenção", "Preencha o enunciado.");
      return;
    }
    if (alternativasTrim.filter((a) => a !== "").length < 2) {
      Alert.alert("Atenção", "Preencha pelo menos duas alternativas.");
      return;
    }
    if (indiceCorreta == null) {
      Alert.alert("Atenção", "Selecione a alternativa correta.");
      return;
    }

    // 🔹 agora o bloco também é obrigatório
    if (blocoSelecionadoId == null) {
      Alert.alert("Atenção", "Selecione o bloco da questão.");
      return;
    }

    setSaving(true);
    try {
      const payload: Question = {
        ...selectedQuestion,
        enunciado: enunciado.trim(),
        alternativas: alternativasTrim,
        indiceCorreta: indiceCorreta,
        explicacao: explicacao.trim(),
        blocosId: blocoSelecionadoId, // 🔹 salva o id do bloco
      };

      await updateQuestion(payload);

      setInitial({
        enunciado: payload.enunciado,
        alternativas: [...alternativasTrim],
        indiceCorreta: payload.indiceCorreta ?? 0,
        explicacao: payload.explicacao ?? "",
        blocosId: payload.blocosId ?? null, // 🔹 atualiza estado inicial
      });

      setSelectedQuestion(payload);

      Alert.alert("Sucesso", "Questão atualizada!");
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Falha ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  /* ----------------------- DELETAR ---------------------- */
  const handleDelete = () => {
    console.log("Cliquei na lixeira. selectedQuestion =", selectedQuestion);

    if (!selectedQuestion) {
      Alert.alert("Aviso", "Nenhuma questão selecionada.");
      return;
    }

    if (Platform.OS === "web") {
      const ok = window.confirm(
        "Tem certeza que deseja apagar esta questão permanentemente?"
      );
      if (ok) {
        executeDelete();
      }
      return;
    }

    Alert.alert(
      "Excluir questão",
      "Tem certeza que deseja apagar esta questão permanentemente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: executeDelete,
        },
      ]
    );
  };

  const executeDelete = async () => {
    if (!selectedQuestion) return;

    try {
      await deleteQuestion(selectedQuestion.id);

      setSelectedQuestion(null);
      setEnunciado("");
      setAlternativas(["", "", "", "", ""]);
      setIndiceCorreta(null);
      setExplicacao("");
      setInitial(null);
      setBlocoSelecionadoId(null); // 🔹 limpa bloco também

      Alert.alert("Sucesso", "Questão apagada com sucesso.");
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Falha ao apagar a questão.");
    }
  };

  /* ---------------------- RENDER ---------------------- */

  return (
    <View style={backgroundStyles.container}>
      <Gradient />
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* BOTÃO VOLTAR */}
          <TouchableOpacity
            style={styles.roundIcon}
            disabled={saving}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>

          {/* BLOCO DA DIREITA (delete + salvar) */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              style={styles.deleteChip}
              disabled={!selectedQuestion || saving}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color="#ff4444" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveChip,
                !dirty || saving ? { opacity: 0.5 } : null,
              ]}
              disabled={!dirty || saving}
              onPress={handleSalvar}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveChipText}>Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.screenTitle}>Editar Questões</Text>

          {/* 🔹 CARD BLOCO IGUAL NA TELA DE CRIAR */}
          <CardBloco
            label="Bloco da questão"
            placeholder="Selecione o bloco"
            value={
              blocoSelecionadoId != null ? String(blocoSelecionadoId) : null
            }
            options={blocos.map((b) => ({
              value: String(b.id),
              label: `${b.name}   ${b.count}/${b.max} questões`,
            }))}
            onSelect={(novoValor) => {
              const id = Number(novoValor);
              setBlocoSelecionadoId(Number.isNaN(id) ? null : id);
            }}
            containerStyle={{ marginBottom: 12 }}
          />

          {/* ENUNCIADO */}
          <Text style={styles.enunciadoLabel}>Enunciado da questão</Text>

          <View style={styles.enunciadoOuter}>
            <CardEnunciado
              value={enunciado}
              onChangeText={setEnunciado}
              placeholder="Enunciado da questão..."
              contentMinHeight={80}
              containerStyle={styles.enunciadoCard}
            />
          </View>

          {/* ALTERNATIVAS */}
          {["A", "B", "C", "D", "E"].map((letter, idx) => (
            <CardAlternativas
              key={letter}
              label={`Alternativa ${letter}`}
              value={alternativas[idx]}
              onChangeText={(v) => updateAlt(idx, v)}
              isCorrect={indiceCorreta === idx}
              onPressMarkCorrect={() => setIndiceCorreta(idx)}
            />
          ))}

          {/* EXPLICAÇÃO */}
          <Text style={styles.enunciadoLabel}>Explicação da questão</Text>

          <View style={styles.enunciadoOuter}>
            <CardEnunciado
              value={explicacao}
              onChangeText={setExplicacao}
              placeholder="Resolução da questão..."
              contentMinHeight={80}
              containerStyle={styles.enunciadoCard}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ---------------------- ESTILOS ---------------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: "center",
  },

  roundIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  saveChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  saveChipText: {
    color: "#fff",
    fontWeight: "700",
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },

  screenTitle: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 16,
    lineHeight: 30,
  },

  enunciadoOuter: {
    marginBottom: 14,
  },
  enunciadoLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    marginLeft: 4,
  },

  enunciadoCard: {
    padding: 10,
    borderRadius: 12,
  },

  deleteChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginRight: 10,
  },
});