// import CardEnunciado from "@/components/cards/cardEnunciado";
// import { backgroundStyles, Gradient } from "@/styles/background";
// import { API_KEY } from "@/utils/apiKey";
// import { Ionicons } from "@expo/vector-icons";
// import React, { useState } from "react";
// import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// import CardAlternativas from "@/components/cards/cardAlternativas";
// import { useRouter } from "expo-router";

// const API_BASE_URL = API_KEY;
// const router = useRouter();

// export default function CriarQuestoes({ navigation, route }: any) {
//     const [enunciado, setEnunciado] = useState("");
//     const [alternativas, setAlternativas] = useState<string[]>(["", "", "", "", ""]);
//     const [explicacao, setExplicacao] = useState("");

//     // Guarda qual índice é a alternativa correta (0–4). null = nenhuma ainda.
//     const [indiceCorreta, setIndiceCorreta] = useState<number | null>(null);

//     // Pega a turma/matéria vindas de alguma tela anterior (com fallback)
//     const turmaSelecionada = route?.params?.turmaSelecionada ?? 9;
//     const materiaSelecionada = route?.params?.materiaSelecionada ?? "Matematica";

//     const handleChangeAlt = (index: number, value: string) => {
//         const next = [...alternativas];
//         next[index] = value;
//         setAlternativas(next);
//     };

//     const handleSalvar = async () => {
//         // limpa espaços e ignora alternativas totalmente vazias
//         const alternativasLimpa = alternativas
//             .map((alt) => alt.trim())
//             .filter((alt) => alt !== "");

//         if (!enunciado.trim() || alternativasLimpa.length < 2 || indiceCorreta === null) {
//             console.warn("Preencha o enunciado, pelo menos duas alternativas e marque a correta.");
//             return;
//         }

//         const novaPergunta = {
//             enunciado,
//             alternativas: alternativasLimpa,
//             indiceCorreta,
//             explicacao,
//             turma: turmaSelecionada,
//             materia: materiaSelecionada,
//         };

//         try {
//             const response = await fetch(`${API_BASE_URL}/perguntas`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(novaPergunta),
//             });

//             if (!response.ok) {
//                 throw new Error(`Erro ao salvar: ${response.status}`);
//             }

//             const data = await response.json();
//             console.log("Pergunta salva com sucesso:", data);

//             // limpar o formulário depois de salvar
//             setEnunciado("");
//             setAlternativas(["", "", "", "", ""]);
//             setExplicacao("");
//             setIndiceCorreta(null);
//         } catch (error) {
//             console.error("Erro ao salvar pergunta:", error);
//         }
//     };

//     return (
//         <View style={backgroundStyles.container}>
//             <Gradient />

//             <SafeAreaView style={styles.container}>
//                 <View style={styles.header}>
//                     <TouchableOpacity
//                         style={styles.roundIcon}
//                         onPress={() => { router.back(); }}
//                     >
//                         <Ionicons name="chevron-back" size={22} color="#fff" />
//                     </TouchableOpacity>

//                     <TouchableOpacity style={styles.saveChip} onPress={handleSalvar}>
//                         <Text style={styles.saveChipText}>Salvar</Text>
//                     </TouchableOpacity>
//                 </View>

//                 <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
//                     <Text style={styles.screenTitle}>Criar Questões</Text>


//                     {/*<Text style={{ color: "#fff", textAlign: "center", marginVertical: 8 }}>
//                         Turma: {turmaSelecionada} ••• Matéria: {materiaSelecionada}
//                     </Text>*/}

//                     {/* TÍTULO */}
//                     <Text style={styles.enunciadoLabel}>Enunciado da questão</Text>

//                     {/* Card enunciado */}
//                     <View style={styles.enunciadoOuter}>
//                         <CardEnunciado
//                             value={enunciado}
//                             onChangeText={setEnunciado}
//                             placeholder="Enunciado da questão..."
//                             contentMinHeight={80}
//                             containerStyle={styles.enunciadoCard}
//                         />
//                     </View>

//                     {/* Card das alternativas */}
//                     {["A", "B", "C", "D", "E"].map((letter, idx) => (
//                         <CardAlternativas
//                             key={letter}
//                             label={`Alternativa ${letter}`}
//                             value={alternativas[idx]}
//                             onChangeText={(v) => handleChangeAlt(idx, v)}
//                             isCorrect={indiceCorreta === idx}
//                             onPressMarkCorrect={() => setIndiceCorreta(idx)}
//                         />
//                     ))}

//                     {/* Card de explicação */}
//                     <Text style={styles.enunciadoLabel}>Explicação da questão</Text>

//                     <View style={styles.enunciadoOuter}>
//                         <CardEnunciado
//                             value={explicacao}
//                             onChangeText={setExplicacao}
//                             placeholder="Explique a resolução..."
//                             contentMinHeight={80}
//                             containerStyle={styles.enunciadoCard}
//                         />
//                     </View>
//                 </ScrollView>
//             </SafeAreaView>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     /* LAYOUT GERAL */
//     container: { flex: 1 },

//     /* HEADER (ícone de voltar e botão salvar) */
//     header: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//         paddingHorizontal: 18,
//         paddingTop: 8,
//         paddingBottom: 4,
//     },
//     roundIcon: {
//         width: 36,
//         height: 36,
//         borderRadius: 18,
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "rgba(255,255,255,0.15)",
//     },
//     saveChip: {
//         paddingHorizontal: 14,
//         paddingVertical: 6,
//         borderRadius: 16,
//         backgroundColor: "rgba(255,255,255,0.25)",
//     },
//     saveChipText: { color: "#fff", fontWeight: "700" },

//     content: { paddingHorizontal: 20, paddingBottom: 28 },

//     screenTitle: {
//         textAlign: "center",
//         color: "#FFFFFF",
//         fontSize: 26,
//         fontWeight: "800",
//         marginTop: 12,
//         paddingVertical: 12
//     },

//     enunciadoOuter: {
//         backgroundColor: "#fff",
//         borderRadius: 16,
//         padding: 12,
//         marginBottom: 14,
//     },
//     enunciadoInner: {
//         backgroundColor: "#fff",
//         borderRadius: 12,
//         padding: 16,
//     },
//     enunciadoLabel: {
//         color: "#FFFFFF",
//         fontSize: 13,
//         fontWeight: "600",
//         marginBottom: 4,
//         marginLeft: 4,
//     },

//     enunciadoCard: {
//         padding: 10,
//         borderRadius: 12,
//     },
// });


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
import { useRouter } from "expo-router";

const API_BASE_URL = API_KEY;

// Payload para criar questão nova
type NewQuestion = {
    enunciado: string;
    alternativas: string[];
    indiceCorreta: number;
    explicacao?: string;
    bloco?: string;
};

// Estrutura para controlar informações de cada bloco
type BlockInfo = {
    name: string; // "Bloco 1"
    count: number; // qtd de questões já criadas nesse bloco
    max: number; // limite de questões (ex: 10)
};

// Tipagem básica da questão vinda da API (para contar blocos)
type QuestionFromAPI = {
    id: number;
    bloco?: string;
};

export default function CriarQuestoes() {
    const router = useRouter();

    const [enunciado, setEnunciado] = useState("");
    const [alternativas, setAlternativas] = useState<string[]>([
        "",
        "",
        "",
        "",
        "",
    ]);
    const [explicacao, setExplicacao] = useState("");

    // Lista dinâmica de blocos com contagem de questões
    const [blocos, setBlocos] = useState<BlockInfo[]>([
        { name: "Bloco 1", count: 0, max: 10 },
        { name: "Bloco 2", count: 0, max: 10 },
        { name: "Bloco 3", count: 0, max: 10 },
        { name: "Bloco 4", count: 0, max: 10 },
        { name: "Bloco 5", count: 0, max: 10 },
    ]);

    const [blocoSelecionado, setBlocoSelecionado] = useState<string | null>(null);
    const [indiceCorreta, setIndiceCorreta] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    // Estado da UI de criação de novo bloco
    const [criandoBloco, setCriandoBloco] = useState(false);
    const [novoNomeBloco, setNovoNomeBloco] = useState("");

    /* ---------------------- CARREGAR CONTAGEM DE QUESTÕES POR BLOCO ---------------------- */
    useEffect(() => {
        const carregarContagemBlocos = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/perguntas`);
                if (!res.ok) return;

                const data: QuestionFromAPI[] = await res.json();

                // Mapa: { "Bloco 1": 8, "Bloco 2": 0, ... }
                const counts: Record<string, number> = {};
                data.forEach((q) => {
                    if (!q.bloco) return;
                    counts[q.bloco] = (counts[q.bloco] || 0) + 1;
                });

                setBlocos((prev) => {
                    const existingNames = prev.map((b) => b.name);

                    const next: BlockInfo[] = prev.map((b) => ({
                        ...b,
                        count: counts[b.name] || 0,
                    }));

                    // Se aparecer bloco novo no banco, adiciona na lista
                    Object.entries(counts).forEach(([name, count]) => {
                        if (!existingNames.includes(name)) {
                            next.push({ name, count, max: 10 });
                        }
                    });

                    return next;
                });
            } catch (err) {
                console.log("Erro ao carregar contagem de blocos:", err);
            }
        };

        carregarContagemBlocos();
    }, []);

    /* ---------------------- HANDLERS DE UI ---------------------- */

    const handleChangeAlt = (index: number, value: string) => {
        const next = [...alternativas];
        next[index] = value;
        setAlternativas(next);
    };

    // Quando o usuário toca em "Criar novo bloco" no dropdown
    const handlePressCriarNovoBloco = () => {
        setCriandoBloco(true);
    };

    // Confirmar criação do novo bloco
    const handleConfirmarNovoBloco = () => {
        const nome = novoNomeBloco.trim();

        if (!nome) {
            Alert.alert("Atenção", "Digite um nome para o bloco.");
            return;
        }

        if (blocos.some((b) => b.name === nome)) {
            Alert.alert("Atenção", "Esse bloco já existe.");
            return;
        }

        // Adiciona novo bloco com contagem 0
        setBlocos((prev) => [...prev, { name: nome, count: 0, max: 10 }]);

        // Já seleciona esse bloco para a questão
        setBlocoSelecionado(nome);

        setNovoNomeBloco("");
        setCriandoBloco(false);
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

        if (!blocoSelecionado) {
            Alert.alert("Atenção", "Selecione o bloco da questão.");
            return;
        }

        // Verifica se o bloco já atingiu o limite
        const infoBloco = blocos.find((b) => b.name === blocoSelecionado);
        if (infoBloco && infoBloco.count >= infoBloco.max) {
            Alert.alert(
                "Limite atingido",
                `O ${infoBloco.name} já possui ${infoBloco.max} questões.`
            );
            return;
        }

        const payload: NewQuestion = {
            enunciado: enunciado.trim(),
            alternativas: alternativasTrim,
            indiceCorreta,
            explicacao: explicacao.trim() || undefined,
            bloco: blocoSelecionado || undefined,
        };

        try {
            setSaving(true);

            const blocoAtual = blocoSelecionado; // guarda antes de limpar

            const res = await fetch(`${API_BASE_URL}/perguntas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Erro ao salvar a questão.");
            }

            // Atualiza contagem do bloco localmente (+1 questão)
            if (blocoAtual) {
                setBlocos((prev) =>
                    prev.map((b) =>
                        b.name === blocoAtual ? { ...b, count: b.count + 1 } : b
                    )
                );
            }

            Alert.alert("Sucesso", "Questão criada com sucesso!");

            // Limpa campos
            setEnunciado("");
            setAlternativas(["", "", "", "", ""]);
            setExplicacao("");
            setIndiceCorreta(null);
            setBlocoSelecionado(null);
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
                    {/* CARD BLOCO COM CONTAGEM N/10 */}
                    <CardBloco
                        label="Selecione o bloco"
                        placeholder="Selecione o bloco"
                        value={blocoSelecionado}
                        options={blocos.map((b) => ({
                            value: b.name,
                            label: `${b.name}   ${b.count}/${b.max} questões`,
                        }))}
                        onSelect={(novoBloco) => setBlocoSelecionado(novoBloco)}
                        allowCreateNew
                        onPressCreateNew={handlePressCriarNovoBloco}
                        containerStyle={{ marginBottom: 12 }}
                    />

                    {/* UI para criar novo bloco */}
                    {criandoBloco && (
                        <View style={styles.newBlockBox}>
                            <Text style={styles.newBlockLabel}>Nome do novo bloco</Text>
                            <TextInput
                                style={styles.newBlockInput}
                                placeholder="Ex: Bloco 6"
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

    // Área de criação de novo bloco
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
