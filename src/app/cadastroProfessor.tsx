import { GradientButton } from "@/components/gradientButton";
import { InputText } from "@/components/inputText";
import { backgroundStyles, Gradient } from "@/styles/background";
import { globalStyles } from "@/styles/global";
import React, { useEffect, useState } from "react"; // Adicionado useEffect
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { MultipleSelectList } from "react-native-dropdown-select-list";

const API_BASE_URL = "https://93e08048-d088-4dbc-bd60-18bab6374393-00-1lc06cy73r5o4.picard.replit.dev";

export default function CadastroProfessor() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const turmaOptions = Array.from({ length: 9 }, (_, i) => ({ key: String(i + 1), value: String(i + 1) }));
    turmaOptions.push({ key: "outros", value: "Outros" });
    const [selectedTurmas, setSelectedTurmas] = useState<string[]>([]); 
    const [outroTurma, setOutroTurma] = useState("");

    const [materiasList, setMateriasList] = useState<{ key: string; value: string }[]>([]);
    const [materiaInput, setMateriaInput] = useState("");
    const [selectedMaterias, setSelectedMaterias] = useState<string[]>([]);

    useEffect(() => {
        fetchMaterias();
    }, []);

    async function fetchMaterias() {
        try {
            const response = await fetch(`${API_BASE_URL}/materias`);
            if (!response.ok) throw new Error("Falha ao buscar matérias");
            
            const data = await response.json();
            const formatted = data.map((item: { id: number; nome: string }) => ({
                key: String(item.id), 
                value: item.nome
            }));
            setMateriasList(formatted);
        } catch (error) {
            console.error("Erro ao carregar matérias:", error);
        }
    }
    async function addMateria() {
        const nomeMateria = materiaInput.trim();
        if (!nomeMateria) return;

        const existe = materiasList.find(m => m.value.toLowerCase() === nomeMateria.toLowerCase());
        if (existe) {
            Alert.alert("Atenção", "Esta matéria já está na lista.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/materias`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome: nomeMateria }), 
            });

            if (!response.ok) throw new Error("Erro ao salvar matéria");

            const novaMateriaServer = await response.json();
            
            setMateriasList(prev => [
                ...prev, 
                { key: String(novaMateriaServer.id), value: novaMateriaServer.nome }
            ]);
            
            setMateriaInput(""); 
            Alert.alert("Sucesso", "Matéria adicionada com sucesso!");

        } catch (error) {
            console.error("Erro ao adicionar matéria:", error);
            Alert.alert("Erro", "Não foi possível adicionar a matéria.");
        }
    }

    async function handleSubmit() {
        let turmasFinal = [...selectedTurmas];

        if (turmasFinal.includes("outros")) {
            turmasFinal = turmasFinal.filter(t => t !== "outros");
            if (outroTurma.trim()) {
                turmasFinal.push(outroTurma.trim());
            }
        }

        const materiasFinal = selectedMaterias;
        const emailLimpo = email.trim();
        if (!nome.trim() || !emailLimpo || !senha.trim() || !turmasFinal.length) {
            Alert.alert("Erro", "Preencha nome, email, senha e ao menos uma turma.");
            return;
        }

        try {
            const [resProfessores, resAlunos] = await Promise.all([
                fetch(`${API_BASE_URL}/professores?email=${emailLimpo}`),
                fetch(`${API_BASE_URL}/alunos?email=${emailLimpo}`)
            ]);

            const existeProfessor = await resProfessores.json();
            const existeAluno = await resAlunos.json();

            if (existeProfessor.length > 0 || existeAluno.length > 0) {
                Alert.alert("Erro", "Este email já está cadastrado (como Professor ou Aluno).");
                return; 
            }
            const novoProfessor = {
                nome: nome.trim(),
                email: emailLimpo,
                senha: senha, 
                turmas: turmasFinal,
                materias: materiasFinal, 
            };

            const response = await fetch(`${API_BASE_URL}/professores`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoProfessor),
            });

            if (!response.ok) {
                throw new Error(`Erro ao cadastrar professor: ${response.status}`);
            }

            const data = await response.json();
            console.log("Professor cadastrado:", data);
            Alert.alert("Sucesso", "Professor cadastrado com sucesso!");

            setNome("");
            setEmail("");
            setSenha("");
            setSelectedTurmas([]);
            setOutroTurma("");
            setSelectedMaterias([]);

        } catch (error) {
            console.error("Erro no cadastro de professor:", error);
            Alert.alert("Erro", "Falha ao cadastrar professor ou verificar email.");
        }
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
                        <Text style={globalStyles.whiteText}>Turmas</Text>
                        <MultipleSelectList
                            setSelected={(val: any) => setSelectedTurmas(val)}
                            data={turmaOptions}
                            save="key"
                            label="Turmas"
                            search={false}
                            boxStyles={styles.dropdownBox}
                            dropdownStyles={styles.dropdown}
                            inputStyles={styles.dropdownInput}
                            dropdownTextStyles={styles.dropdownText}
                            placeholder="Selecione turmas"
                            badgeTextStyles={{ color: 'white' } as any}
                            badgeStyles={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                            checkBoxStyles={{ borderColor: 'white' }}
                        />
                    </View>

                    {selectedTurmas.includes("outros") && (
                        <View style={styles.field}>
                            <Text style={globalStyles.whiteText}>Especificar turma(s)</Text>
                            <InputText placeholder="Ex: 1,2,3,4 ..." value={outroTurma} onChangeText={setOutroTurma} />
                        </View>
                    )}

                    <View style={styles.field}>
                        <Text style={globalStyles.whiteText}>Matérias</Text>
                        <Text style={styles.smallNote}>Selecione as matérias disponíveis ou cadastre novas.</Text>

                        <MultipleSelectList
                            setSelected={(val: any) => setSelectedMaterias(val)}
                            data={materiasList}
                            save="value" 
                            label="Matérias"
                            search={false}
                            boxStyles={styles.dropdownBox}
                            dropdownStyles={styles.dropdown}
                            inputStyles={styles.dropdownInput}
                            dropdownTextStyles={styles.dropdownText}
                            placeholder={materiasList.length ? "Selecione matérias" : "Carregando matérias..."}
                            badgeTextStyles={{ color: 'white' } as any}
                            badgeStyles={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                            checkBoxStyles={{ borderColor: 'white' }} 
                            notFoundText="Nenhuma matéria encontrada"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={globalStyles.whiteText}>Nova Matéria</Text>
                        <InputText placeholder="Ex: Geografia" value={materiaInput} onChangeText={setMateriaInput} />
                        <View style={styles.addButton}>
                            <GradientButton title="Salvar Nova Matéria" onPress={addMateria} />
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <GradientButton title="Cadastrar Professor" onPress={handleSubmit} />
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
        backgroundColor: "rgba(0,0,0,0.8)",
        borderRadius: 8,
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
    },
    dropdownInput: {
        color: "#ffffff",
        padding: 0,
        margin: 0,
    },
    dropdownText: {
        color: "#ffffff",
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