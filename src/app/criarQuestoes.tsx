import CardEnunciado from "@/components/cards/cardEnunciado";
import { backgroundStyles, Gradient } from "@/styles/background";
import { API_KEY } from "@/utils/apiKey";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import CardAlternativas from "@/components/cards/cardAlternativas";

const API_BASE_URL = API_KEY;


export default function CriarQuestoes({ navigation, route }: any) {
    const [enunciado, setEnunciado] = useState("");
    const [alternativas, setAlternativas] = useState<string[]>(["", "", "", "", ""]);
    const [explicacao, setExplicacao] = useState("");

    // Guarda qual índice é a alternativa correta (0–4). null = nenhuma ainda.
    const [indiceCorreta, setIndiceCorreta] = useState<number | null>(null);

    // Pega a turma/matéria vindas de alguma tela anterior (com fallback)
    const turmaSelecionada = route?.params?.turmaSelecionada ?? 9;
    const materiaSelecionada = route?.params?.materiaSelecionada ?? "Matematica";

    const handleChangeAlt = (index: number, value: string) => {
        const next = [...alternativas];
        next[index] = value;
        setAlternativas(next);
    };

    const handleSalvar = async () => {
        // limpa espaços e ignora alternativas totalmente vazias
        const alternativasLimpa = alternativas
            .map((alt) => alt.trim())
            .filter((alt) => alt !== "");

        if (!enunciado.trim() || alternativasLimpa.length < 2 || indiceCorreta === null) {
            console.warn("Preencha o enunciado, pelo menos duas alternativas e marque a correta.");
            return;
        }

        const novaPergunta = {
            enunciado,
            alternativas: alternativasLimpa,
            indiceCorreta,
            explicacao,
            turma: turmaSelecionada,
            materia: materiaSelecionada,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/perguntas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(novaPergunta),
            });

            if (!response.ok) {
                throw new Error(`Erro ao salvar: ${response.status}`);
            }

            const data = await response.json();
            console.log("Pergunta salva com sucesso:", data);

            // limpar o formulário depois de salvar
            setEnunciado("");
            setAlternativas(["", "", "", "", ""]);
            setExplicacao("");
            setIndiceCorreta(null);
        } catch (error) {
            console.error("Erro ao salvar pergunta:", error);
        }
    };

    return (
        <View style={backgroundStyles.container}>
            <Gradient />

            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.roundIcon}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Ionicons name="chevron-back" size={22} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.saveChip} onPress={handleSalvar}>
                        <Text style={styles.saveChipText}>Salvar</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <Text style={styles.screenTitle}>Criar Questões</Text>


                    {/*<Text style={{ color: "#fff", textAlign: "center", marginVertical: 8 }}>
                        Turma: {turmaSelecionada} ••• Matéria: {materiaSelecionada}
                    </Text>*/}

                    {/* TÍTULO */}
                    <Text style={styles.enunciadoLabel}>Enunciado da questão</Text>

                    {/* Card enunciado */}
                    <View style={styles.enunciadoOuter}>
                        <CardEnunciado
                            value={enunciado}
                            onChangeText={setEnunciado}
                            placeholder="Enunciado da questão..."
                            contentMinHeight={80}
                            containerStyle={styles.enunciadoCard}
                        />
                    </View>

                    {/* Card das alternativas */}
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

                    {/* Card de explicação */}
                    <Text style={styles.enunciadoLabel}>Explicação da questão</Text>

                    <View style={styles.enunciadoOuter}>
                        <CardEnunciado
                            value={explicacao}
                            onChangeText={setExplicacao}
                            placeholder="Explique a resolução..."
                            contentMinHeight={80}
                            containerStyle={styles.enunciadoCard}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    /* LAYOUT GERAL */
    container: { flex: 1 },

    /* HEADER (ícone de voltar e botão salvar) */
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingTop: 8,
        paddingBottom: 4,
    },
    roundIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.15)",
    },
    saveChip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.25)",
    },
    saveChipText: { color: "#fff", fontWeight: "700" },

    content: { paddingHorizontal: 20, paddingBottom: 28 },

    screenTitle: {
        textAlign: "center",
        color: "#FFFFFF",
        fontSize: 26,
        fontWeight: "800",
        marginTop: 12,
        paddingVertical: 12
    },

    enunciadoOuter: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 12,
        marginBottom: 14,
    },
    enunciadoInner: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
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
});