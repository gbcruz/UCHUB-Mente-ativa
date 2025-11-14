import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { backgroundStyles, Gradient } from "@/styles/background";
import GradientButton from "@/components/gradientButton";
import CardEnunciado from "@/components/cards/cardEnunciado";
import CardAlternativas from "@/components/cards/cardAlternativas";
export default function CriarQuestoes() {
    const [enunciado, setEnunciado] = useState("");
    const [alternativas, setAlternativas] = useState<string[]>(["", "", "", "", ""]);

    const handleChangeAlt = (index: number, value: string) => {
        const next = [...alternativas];
        next[index] = value;
        setAlternativas(next);
    };

    const handleSalvar = () => {
        // Integrar com banco de dados
        console.log({ enunciado, alternativas });
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

                    {/* Botão de explicação */}
                    <View style={{ marginTop: 12, marginBottom: 12 }}>
                        <GradientButton title="Explicação" onPress={() => console.log("explicação")} />
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
