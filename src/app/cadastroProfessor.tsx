import { GradientButton } from "@/components/gradientButton";
import { InputText } from "@/components/inputText";
import { backgroundStyles, Gradient } from "@/styles/background";
import { globalStyles } from "@/styles/global";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

export default function CadastroProfessor() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const turmaOptions = Array.from({ length: 9 }, (_, i) => ({ key: String(i + 1), value: String(i + 1) }));
    turmaOptions.push({ key: "outros", value: "Outros" });
    const [selectedTurmas, setSelectedTurmas] = useState<string[] | string>(""); 

    const [outroTurma, setOutroTurma] = useState("");

    const [materiasList, setMateriasList] = useState<{ key: string; value: string }[]>([]);
    const [materiaInput, setMateriaInput] = useState("");
    const [selectedMaterias, setSelectedMaterias] = useState<string[] | string>("");

    function addMateria() {
        const v = materiaInput.trim();
        if (!v) return;
        const key = v;
        if (!materiasList.find(m => m.key === key)) {
            setMateriasList(prev => [{ key, value: v }, ...prev]);
        }
        setMateriaInput("");
    }

    function handleSubmit() {
        const turmasFinal = Array.isArray(selectedTurmas)
            ? selectedTurmas.includes("outros") ? [...selectedTurmas.filter(t => t !== "outros"), outroTurma] : selectedTurmas
            : selectedTurmas === "outros" ? [outroTurma] : [selectedTurmas];

        const materiasFinal = Array.isArray(selectedMaterias) ? selectedMaterias : selectedMaterias ? [selectedMaterias] : [];
        console.log({ nome, email, senha, turmas: turmasFinal, materias: materiasFinal });
        // TODO: enviar dados / navegar
    }

    return (
        <View style={backgroundStyles.container}>
            <Gradient />
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Cadastro Professor</Text>

                    <View style={styles.field}>
                        <Text style={globalStyles.whiteText}>Nome</Text>
                        <InputText placeholder="Nome completo" value={nome} onChangeText={setNome} />
                    </View>

                    <View style={styles.field}>
                        <Text style={globalStyles.whiteText}>Email</Text>
                        <InputText placeholder="seu@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
                    </View>

                    <View style={styles.field}>
                        <Text style={globalStyles.whiteText}>Senha</Text>
                        <InputText placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
                    </View>

                    <View style={styles.field}>
                        <Text style={globalStyles.whiteText}>Turmas (selecione todas que leciona)</Text>
                        <SelectList
                            setSelected={setSelectedTurmas as any}
                            data={turmaOptions}
                            save="key"
                            multiple={true}
                            search={false}
                            boxStyles={styles.dropdownBox}
                            dropdownStyles={styles.dropdown}
                            inputStyles={styles.dropdownInput}
                            dropdownTextStyles={styles.dropdownText}
                            searchStyles={styles.searchStyles}
                            placeholder="Selecione turmas"
                        />
                    </View>

                    {Array.isArray(selectedTurmas) && selectedTurmas.includes("outros") && (
                        <View style={styles.field}>
                            <Text style={globalStyles.whiteText}>Especificar turma(s)</Text>
                            <InputText placeholder="Ex: 1,2,3,4 ..." value={outroTurma} onChangeText={setOutroTurma} />
                        </View>
                    )}

                    <View style={styles.field}>
                        <Text style={globalStyles.whiteText}>Matérias</Text>
                        <Text style={styles.smallNote}>Adicione as matérias se já não existirem.</Text>

                        <SelectList
                            setSelected={setSelectedMaterias as any}
                            data={materiasList.length ? materiasList : [{ key: "nenhuma", value: "Nenhuma matéria (adicione abaixo)" }]}
                            save="key"
                            multiple={true}
                            search={false}
                            boxStyles={styles.dropdownBox}
                            dropdownStyles={styles.dropdown}
                            inputStyles={styles.dropdownInput}
                            dropdownTextStyles={styles.dropdownText}
                            searchStyles={styles.searchStyles}
                            placeholder="Selecione matérias"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={globalStyles.whiteText}>Adicionar matéria</Text>
                        <InputText placeholder="Ex: Matemática" value={materiaInput} onChangeText={setMateriaInput} />
                        <View style={styles.addButton}>
                            <GradientButton title="Adicionar" onPress={addMateria} />
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <GradientButton title="Cadastrar" onPress={handleSubmit} />
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingTop: 24,
        paddingBottom: 24,
        width: "100%",
    },
    content: {
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        color: "white",
        fontWeight: "800",
        marginBottom: 18,
        textAlign: "center",
    },
    footer: {
        paddingHorizontal: 20,
    },
    dropdownBox: {
        backgroundColor: "rgba(255,255,255,0.06)",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderColor: "rgba(255,255,255,0.12)",
        borderWidth: 1,
        marginBottom: 8,
    },
    dropdown: {
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 8,
    },
    dropdownInput: {
        color: "#ffffff",
        padding: 0,
        margin: 0,
    },
    dropdownText: {
        color: "#ffffff",
    },
    searchStyles: {
        color: "#ffffff",
        backgroundColor: "rgba(255,255,255,0.04)",
    },
    smallNote: {
        color: "#ddd",
        marginBottom: 8,
        fontSize: 12,
    },
    addButton: {
        marginTop: 8,
        marginBottom: 8,
        alignItems: "flex-start",
    },
    field: {
        marginBottom: 14,
    },
});