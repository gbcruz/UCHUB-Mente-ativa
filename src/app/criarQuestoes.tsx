import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { backgroundStyles, Gradient } from "@/styles/background";
import CardEnunciado from "@/components/cards/cardEnunciado";
import CardAlternativas from "@/components/cards/cardAlternativas";
import CardBloco from "@/components/cards/cardBloco";
import { API_KEY } from "@/utils/apiKey";
import { useRouter, useLocalSearchParams } from "expo-router";

const API_BASE_URL = API_KEY;

/* ---------------------- TIPAGENS ---------------------- */

// Payload para criar questão nova – agora alinhado com o JSON do Replit
type NewQuestion = {
  enunciado: string;
  alternativas: string[];
  indiceCorreta: number;
  explicacao?: string;
  blocosId: number;      // 🔹 relação com a tabela blocos
  materiaId?: number;    
  turmaId?: number;      
  autorId?: number;      
};

// Estrutura dos blocos vindos da API
type BlockFromAPI = {
  id: number;
  nome: string;
  materiaId?: number;
  turmaId?: number;
};

// Estrutura para armazenar blocos na UI, com contagem
type BlockInfo = {
  id: number;
  name: string;
  count: number;
  max: number;
};

// Tipagem da questão vinda da API (usada só pra contar por bloco)
type QuestionFromAPI = {
  id: number;
  blocosId?: number;
  bloco?: string;    
};

export default function CriarQuestoes() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    autorId?: string;
    turmaId?: string;
    materiaId?: string;
  }>();

  const autorIdNumber =
    typeof params.autorId === "string" ? Number(params.autorId) : null;
  const turmaIdNumber =
    typeof params.turmaId === "string" ? Number(params.turmaId) : null;
  const materiaIdNumber =
    typeof params.materiaId === "string" ? Number(params.materiaId) : null;

  const [enunciado, setEnunciado] = useState("");
  const [alternativas, setAlternativas] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
  ]);
  const [explicacao, setExplicacao] = useState("");

  const [blocos, setBlocos] = useState<BlockInfo[]>([]);

  const [blocoSelecionadoId, setBlocoSelecionadoId] = useState<number | null>(
    null
  );
  const [indiceCorreta, setIndiceCorreta] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [criandoBloco, setCriandoBloco] = useState(false);
  const [novoNomeBloco, setNovoNomeBloco] = useState("");

  /* ---------------------- CARREGAR BLOCOS + CONTAGEM ---------------------- */

  useEffect(() => {
    const carregarBlocos = async () => {
      try {
        // monta query string: ?turmaId=4&materiaId=1
        const paramsQuery: string[] = [];
        if (turmaIdNumber != null) paramsQuery.push(`turmaId=${turmaIdNumber}`);
        if (materiaIdNumber != null)
          paramsQuery.push(`materiaId=${materiaIdNumber}`);
        const queryString =
          paramsQuery.length > 0 ? `?${paramsQuery.join("&")}` : "";

        // 1) Buscar blocos cadastrados
        const resBlocos = await fetch(`${API_BASE_URL}/blocos${queryString}`);
        if (!resBlocos.ok) {
          console.log("Erro ao carregar blocos");
          return;
        }
        const blocosApi: BlockFromAPI[] = await resBlocos.json();

        // 2) Buscar perguntas para contar quantas existem por bloco
        const resPerguntas = await fetch(
          `${API_BASE_URL}/perguntas${queryString}`
        );
        let perguntasApi: QuestionFromAPI[] = [];
        if (resPerguntas.ok) {
          perguntasApi = await resPerguntas.json();
        }

        const counts: Record<number, number> = {};

        perguntasApi.forEach((q) => {
          if (q.blocosId != null) {
            counts[q.blocosId] = (counts[q.blocosId] || 0) + 1;
          }
        });

        // 🔹 3) Montar estrutura BlockInfo
        const mapped: BlockInfo[] = blocosApi.map((b) => ({
          id: b.id,
          name: b.nome,
          count: counts[b.id] || 0,
          max: 10, // limite de 10 questões por bloco
        }));

        setBlocos(mapped);
      } catch (err) {
        console.log("Erro ao carregar blocos:", err);
      }
    };

    carregarBlocos();
  }, [turmaIdNumber, materiaIdNumber]);

  /* ---------------------- HANDLERS DE UI ---------------------- */

  const handleChangeAlt = (index: number, value: string) => {
    const next = [...alternativas];
    next[index] = value;
    setAlternativas(next);
  };

  const handlePressCriarNovoBloco = () => {
    setCriandoBloco(true);
  };

  // 🔹 Agora criamos o bloco DE FATO no Replit (POST /blocos)
  const handleConfirmarNovoBloco = async () => {
    const nome = novoNomeBloco.trim();

    if (!nome) {
      Alert.alert("Atenção", "Digite um nome para o bloco.");
      return;
    }

    // evita duplicado na UI (mesmo nome)
    if (blocos.some((b) => b.name === nome)) {
      Alert.alert("Atenção", "Esse bloco já existe.");
      return;
    }

    try {
      // monta payload compatível com a tabela "blocos"
      const novoBlocoPayload: Omit<BlockFromAPI, "id"> = {
        nome,
        ...(turmaIdNumber != null ? { turmaId: turmaIdNumber } : {}),
        ...(materiaIdNumber != null ? { materiaId: materiaIdNumber } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/blocos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoBlocoPayload),
      });

      if (!res.ok) {
        throw new Error("Erro ao salvar o bloco.");
      }

      const blocoCriado: BlockFromAPI = await res.json();

      // adiciona na lista de blocos com count = 0
      setBlocos((prev) => [
        ...prev,
        {
          id: blocoCriado.id,
          name: blocoCriado.nome,
          count: 0,
          max: 10,
        },
      ]);

      // seleciona automaticamente o novo bloco
      setBlocoSelecionadoId(blocoCriado.id);
      setNovoNomeBloco("");
      setCriandoBloco(false);
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err?.message ?? "Não foi possível criar o novo bloco."
      );
    }
  };

  const handleCancelarNovoBloco = () => {
    setNovoNomeBloco("");
    setCriandoBloco(false);
  };

  /* ---------------------- SALVAR QUESTÃO (POST) ---------------------- */

  const handleSalvar = async () => {
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

    if (blocoSelecionadoId == null) {
      Alert.alert("Atenção", "Selecione o bloco da questão.");
      return;
    }

    const infoBloco = blocos.find((b) => b.id === blocoSelecionadoId);
    if (infoBloco && infoBloco.count >= infoBloco.max) {
      Alert.alert(
        "Limite atingido",
        `O ${infoBloco.name} já possui ${infoBloco.max} questões.`
      );
      return;
    }

    // monta payload no formato do JSON-server
    const payload: NewQuestion = {
      enunciado: enunciado.trim(),
      alternativas: alternativasTrim,
      indiceCorreta,
      explicacao: explicacao.trim() || undefined,
      blocosId: blocoSelecionadoId,
      ...(materiaIdNumber != null ? { materiaId: materiaIdNumber } : {}),
      ...(turmaIdNumber != null ? { turmaId: turmaIdNumber } : {}),
      ...(autorIdNumber != null ? { autorId: autorIdNumber } : {}),
    };

    try {
      setSaving(true);

      const res = await fetch(`${API_BASE_URL}/perguntas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Erro ao salvar a questão.");
      }

      // incrementa contagem local do bloco
      setBlocos((prev) =>
        prev.map((b) =>
          b.id === blocoSelecionadoId ? { ...b, count: b.count + 1 } : b
        )
      );

      Alert.alert("Sucesso", "Questão criada com sucesso!");

      // reseta formulário
      setEnunciado("");
      setAlternativas(["", "", "", "", ""]);
      setExplicacao("");
      setIndiceCorreta(null);
      setBlocoSelecionadoId(null);
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Falha ao salvar a questão.");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------------- RENDER ---------------------- */

  return (
    <View style={backgroundStyles.container}>
      <Gradient />
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.roundIcon}
            disabled={saving}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Criar Questões</Text>

          <TouchableOpacity
            style={[styles.saveChip, saving ? { opacity: 0.5 } : null]}
            disabled={saving}
            onPress={handleSalvar}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveChipText}>Salvar</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* CARD BLOCO */}
          <CardBloco
            label="Selecione o bloco"
            placeholder="Selecione o bloco"
            value={
              blocoSelecionadoId != null ? String(blocoSelecionadoId) : null
            }
            options={blocos.map((b) => ({
              value: String(b.id), // 🔹 CardBloco trabalha com string
              label: `${b.name}   ${b.count}/${b.max} questões`,
            }))}
            onSelect={(novoValor) => {
              const id = Number(novoValor);
              setBlocoSelecionadoId(Number.isNaN(id) ? null : id);
            }}
            allowCreateNew
            onPressCreateNew={handlePressCriarNovoBloco}
            containerStyle={{ marginBottom: 12 }}
          />

          {criandoBloco && (
            <View style={styles.newBlockBox}>
              <Text style={styles.newBlockLabel}>Nome do novo bloco</Text>
              <TextInput
                style={styles.newBlockInput}
                placeholder="Ex: Atividade 2"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={novoNomeBloco}
                onChangeText={setNovoNomeBloco}
              />
              <View style={styles.newBlockButtons}>
                <TouchableOpacity
                  style={[styles.newBlockButton, styles.newBlockCancel]}
                  onPress={handleCancelarNovoBloco}
                >
                  <Text style={styles.newBlockButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.newBlockButton, styles.newBlockConfirm]}
                  onPress={handleConfirmarNovoBloco}
                >
                  <Text style={styles.newBlockButtonText}>Salvar bloco</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

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
              onChangeText={(v) => handleChangeAlt(idx, v)}
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
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 4,
    justifyContent: "space-between",
  },
  roundIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
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
  newBlockBox: {
    marginBottom: 16,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  newBlockLabel: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  newBlockInput: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  newBlockButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  newBlockButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  newBlockCancel: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  newBlockConfirm: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  newBlockButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
});
