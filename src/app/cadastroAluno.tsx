import { GradientButton } from "@/components/gradientButton";
import { InputText } from "@/components/inputText";
import { backgroundStyles, Gradient } from "@/styles/background";
import { globalStyles } from "@/styles/global";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

export default function CadastroAluno() {
    const { height } = useWindowDimensions();
    const topPadding = Math.max(24, height * 0.06);
    const contentPaddingBottom = Math.max(24, height * 0.05);

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [turma, setTurma] = useState<string>(""); 
    const [outroTurma, setOutroTurma] = useState("");

    const turmaOptions = Array.from({ length: 9 }, (_, i) => ({ key: String(i + 1), value: String(i + 1) }));
    turmaOptions.push({ key: "outros", value: "Outros" });

    function handleSubmit() {
        const turmaFinal = turma === "outros" ? outroTurma : turma;
        console.log({ nome, email, senha, turma: turmaFinal });
        // TODO: enviar dados / navegar
    }

    return (
        <View style={backgroundStyles.container}>
            <Gradient />
            <SafeAreaView style={[styles.inner, { paddingTop: topPadding, paddingBottom: contentPaddingBottom }]}>
                <View style={styles.content}>
                    <Text style={styles.title}>Cadastro Aluno</Text>

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
                        <Text style={globalStyles.whiteText}>Turma</Text>
                        <SelectList
                            setSelected={setTurma}
                            data={turmaOptions}
                            save="key"
                            search={false}
                            boxStyles={styles.dropdownBox}
                            dropdownStyles={styles.dropdown}
                            inputStyles={styles.dropdownInput}
                            dropdownTextStyles={styles.dropdownText}
                            searchStyles={styles.searchStyles}
                            placeholder="Selecione a turma"
                            defaultOption={undefined}
                        />
                    </View>

                    {turma === "outros" && (
                        <View style={styles.field}>
                            <Text style={globalStyles.whiteText}>Especificar turma</Text>
                            <InputText placeholder="Ex: 9A ou Ensino Médio" value={outroTurma} onChangeText={setOutroTurma} />
                        </View>
                    )}
                </View>

                <View style={styles.footer}>
                    <GradientButton title="Cadastrar" onPress={handleSubmit} />
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    inner: {
        flex: 1,
        justifyContent: "space-between",
        width: "100%",
    },
    content: {
        paddingHorizontal: 20,
        width: "100%",
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
        paddingBottom: 8,
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
    field: {
        marginBottom: 14,
    },
});