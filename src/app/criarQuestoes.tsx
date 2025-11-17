import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { backgroundStyles, Gradient } from "@/styles/background";
import GradientButton from "@/components/gradientButton";
import CardEnunciado from "@/components/cards/cardEnunciado";

import CardAlternativas from "@/components/cards/cardAlternativas";

const API_BASE_URL = "https://93e08048-d088-4dbc-bd60-18bab6374393-00-1lc06cy73r5o4.picard.replit.dev"


export default function CriarQuestoes() {
    const [enunciado, setEnunciado] = useState("");
    const [alternativas, setAlternativas] = useState<string[]>(["", "", "", "", ""]);
    const [explicacao, setExplicacao] = useState("");

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

        if (!enunciado.trim() || alternativasLimpa.length < 2) {
            console.warn("Preencha o enunciado e pelo menos duas alternativas.");
            return;
        }

        const novaPergunta = {
            enunciado,
            alternativas: alternativasLimpa,
            indiceCorreta: 0,     // por enquanto, assume que a primeira é a correta
            explicacao,
            turma: 9,             // depois você pode puxar isso da conta do professor
            autorId: 1,
            dificuldade: "facil",
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
                        }}
                    >
                        <Ionicons name="chevron-back" size={22} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.saveChip} onPress={handleSalvar}>
                        <Text style={styles.saveChipText}>Salvar</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <Text style={styles.screenTitle}>Questão 5</Text>

                    {/* Card do enunciado*/}
                    <View style={styles.enunciadoOuter}>
                        <CardEnunciado
                            title="Enunciado da questão..."
                            value={enunciado}
                            onChangeText={setEnunciado}
                        />
                    </View>
                    {/* Card das alternativas */}
                    {["A", "B", "C", "D", "E"].map((letter, idx) => (
                        <CardAlternativas
                            key={letter}
                            label={`Alternativa ${letter}`}
                            value={alternativas[idx]}
                            onChangeText={(v) => handleChangeAlt(idx, v)}
                        />
                    ))}
                    {/* Card de explicação */}
                    <View style={styles.enunciadoOuter}>
                        <CardEnunciado
                            title="Explicação"
                            value={explicacao}
                            onChangeText={setExplicacao}
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
        marginBottom: 16,
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
});
