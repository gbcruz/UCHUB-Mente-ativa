import CardAlternativas from "@/components/cards/cardAlternativas";
import CardEnunciado from "@/components/cards/cardEnunciado";
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

type Question = {
  id: number;
  enunciado: string;
  alternativas: string[];
  indiceCorreta?: number;
  explicacao?: string;
  turma?: number;
  autorId?: number;
  dificuldade?: string;
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

  // Estado inicial (para detectar lixo de memória)
  const [initial, setInitial] = useState<{
    enunciado: string;
    alternativas: string[];
    indiceCorreta: number | null;
    explicacao: string;
  } | null>(null);

  // Detecta se houve qualquer alteração
  const dirty = useMemo(() => {
    if (!initial) return false;

    if (initial.enunciado !== enunciado) return true;

    for (let i = 0; i < 5; i++) {
      if (initial.alternativas[i] !== alternativas[i]) return true;
    }

    if (initial.indiceCorreta !== indiceCorreta) return true;

    // verificar se a explicação foi atualizada
    if (initial.explicacao !== explicacao) return true;

    return false;
  }, [initial, enunciado, alternativas, indiceCorreta, explicacao]);

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

    //pega explicação vinda da API (ou string vazia)
    const exp = q.explicacao ?? "";

    setEnunciado(enun);
    setAlternativas(alt);
    setIndiceCorreta(idxCorreta);
    setExplicacao(exp);

    setInitial({
      enunciado: enun,
      alternativas: [...alt],
      indiceCorreta: idxCorreta,
      explicacao: exp,
    });
  };
  /*Considerar o incremento de POP-UP aqui também */

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

    setSaving(true);
    try {
      const payload: Question = {
        ...selectedQuestion,
        enunciado: enunciado.trim(),
        alternativas: alternativasTrim,
        indiceCorreta: indiceCorreta,
        explicacao: explicacao.trim(), // mandar a explicação para a API
      };

      await updateQuestion(payload);

      setInitial({
        enunciado: payload.enunciado,
        alternativas: [...alternativasTrim],
        indiceCorreta: payload.indiceCorreta ?? 0,
        explicacao: payload.explicacao ?? "", // atualiza estado inicial
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

    //  Comportamento especial para WEB (Expo Web / navegador). Colocar isso em formato de Pop-Up
    if (Platform.OS === "web") {
      const ok = window.confirm(
        "Tem certeza que deseja apagar esta questão permanentemente?"
      );
      if (ok) {
        executeDelete();
      }
      return;
    }

    //Mobile (Android / iOS) usa Alert nativo com botões. Colocar pop-ups depois no lugar
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

      // Limpa a tela toda
      setSelectedQuestion(null);
      setEnunciado("");
      setAlternativas(["", "", "", "", ""]);
      setIndiceCorreta(null);
      setExplicacao("");
      setInitial(null);

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
          <TouchableOpacity style={styles.roundIcon} disabled={saving} onPress={() => router.back()}>
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

          {/* ENUNCIADO */}
          <Text style={styles.enunciadoLabel}>
            {selectedQuestion
              ? `Enunciado da questão`
              : "Enunciado da questão"}
          </Text>

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

          {/*EXPLICAÇÃO */}
          <Text style={styles.enunciadoLabel}>
            {selectedQuestion
              ? `Explicação da questão`
              : "Explicação da questão"}
          </Text>

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