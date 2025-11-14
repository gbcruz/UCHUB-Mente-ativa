// app/editar-questoes.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { backgroundStyles, Gradient } from "@/styles/background";
import CardEnunciado from "@/components/cards/cardEnunciado";
import CardAlternativas from "@/components/cards/cardAlternativas";
// import { useLocalSearchParams, useRouter } from "expo-router";

type Question = {
  id: string;
  enunciado: string;
  alternativas: [string, string, string, string, string];
};

// ---------- MOCK INICIAL (se não houver nada salvo) ----------
const MOCK: Question = {
  id: "q-123",
  enunciado: "Enunciado inicial...",
  alternativas: ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D", "Alternativa E"],
};

const storageKey = (id: string) => `qa:${id}`;

// util local: carregar/salvar no AsyncStorage
async function loadQuestion(id: string): Promise<Question> {
  const json = await AsyncStorage.getItem(storageKey(id));
  if (json) return JSON.parse(json);
  await AsyncStorage.setItem(storageKey(id), JSON.stringify(MOCK));
  return MOCK;
}
async function saveQuestion(q: Question): Promise<void> {
  await AsyncStorage.setItem(storageKey(q.id), JSON.stringify(q));
}

export default function TelaProfessor05() {
  // const { questionId } = useLocalSearchParams<{ questionId: string }>();
  // const router = useRouter();
  const questionId = "q-123"; // substitua pelo param de rota quando tiver

  const [enunciado, setEnunciado] = useState("");
  const [alternativas, setAlternativas] = useState<string[]>(["", "", "", "", ""]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initial, setInitial] = useState<{ enunciado: string; alternativas: string[] } | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const q = await loadQuestion(questionId);
        if (!alive) return;
        setEnunciado(q.enunciado ?? "");
        setAlternativas([...q.alternativas]);
        setInitial({ enunciado: q.enunciado ?? "", alternativas: [...q.alternativas] });
      } finally {
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [questionId]);

  const dirty = useMemo(() => {
    if (!initial) return false;
    if (initial.enunciado !== enunciado) return true;
    for (let i = 0; i < 5; i++) if (initial.alternativas[i] !== alternativas[i]) return true;
    return false;
  }, [initial, enunciado, alternativas]);

  const updateAlt = (i: number, v: string) => {
    setAlternativas(prev => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  };

  const handleSalvar = async () => {
    setSaving(true);
    try {
      const payload: Question = {
        id: questionId,
        enunciado,
        alternativas: [alternativas[0], alternativas[1], alternativas[2], alternativas[3], alternativas[4]] as any,
      };
      await saveQuestion(payload);
      setInitial({ enunciado, alternativas: [...alternativas] });
      Alert.alert("Sucesso", "Questão atualizada localmente.");
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Falha ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[backgroundStyles.container, { alignItems: "center", justifyContent: "center" }]}>
        <Gradient />
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={backgroundStyles.container}>
      <Gradient />
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.roundIcon}
            onPress={() => {/* router?.back?.() */}}
            disabled={saving}
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveChip, !dirty || saving ? { opacity: 0.5 } : null]}
            onPress={handleSalvar}
            disabled={!dirty || saving}
          >
            <Text style={styles.saveChipText}>{saving ? "Salvando..." : "Salvar"}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.screenTitle}>Questão 5</Text>

          {/* Enunciado editável inline (seu componente) */}
          <View style={styles.enunciadoOuter}>
            <CardEnunciado
              title="Enunciado da questão..."
              value={enunciado}
              onChangeText={setEnunciado}
            />
          </View>

          {/* A–E editáveis inline (seu componente) */}
          {["A", "B", "C", "D", "E"].map((letter, idx) => (
            <CardAlternativas
              key={letter}
              label={`Alternativa ${letter}`}
              value={alternativas[idx]}
              onChangeText={(v) => updateAlt(idx, v)}
            />
          ))}

          {/* Se quiser o botão "Explicação" depois, só inserir aqui */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 18, paddingTop: 8, paddingBottom: 4,
  },
  roundIcon: {
    width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  saveChip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  saveChipText: { color: "#fff", fontWeight: "700" },
  content: { paddingHorizontal: 20, paddingBottom: 28 },
  screenTitle: {
    textAlign: "center", color: "#FFFFFF", fontSize: 26, fontWeight: "800",
    marginTop: 12, marginBottom: 16,
  },
  enunciadoOuter: {
    backgroundColor: "#fff", borderRadius: 16, padding: 12, marginBottom: 14,
  },
});
