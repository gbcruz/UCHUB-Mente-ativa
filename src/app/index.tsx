import CreateAccountPopUp from "@/app/popUps/professorOuAluno";
import { GradientButton } from "@/components/gradientButton";
import { InputText } from "@/components/inputText";
import { backgroundStyles, Gradient } from "@/styles/background";
import { globalStyles } from "@/styles/global";
import { ROUTES } from "@/utils/routes";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, useWindowDimensions, View } from "react-native";

const API_URL = "https://93e08048-d088-4dbc-bd60-18bab6374393-00-1lc06cy73r5o4.picard.replit.dev"; 

export default function Index() {
    const { width, height } = useWindowDimensions();

    const titleFontSize = Math.max(28, Math.min(64, width * 0.12));
    const topPadding = Math.max(24, height * 0.06); 
    const contentPaddingBottom = Math.max(24, height * 0.05);

    const [isPopUpVisible, setIsPopUpVisible] = useState(false);

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function handleStudentSelection() {
        setIsPopUpVisible(false);
        router.navigate(ROUTES.CADASTRO_ALUNO);
    }

    function handleTeacherSelection() {
        setIsPopUpVisible(false);
        router.navigate(ROUTES.CADASTRO_PROFESSOR);
    }

    async function handleLogin() {
        if (!email.trim() || !senha.trim()) {
            Alert.alert("Atenção", "Por favor, preencha email e senha.");
            return;
        }

        setIsLoading(true);

        try {
            const responseAluno = await fetch(`${API_URL}/alunos?email=${email}&senha=${senha}`);
            const alunosEncontrados = await responseAluno.json();

            if (alunosEncontrados.length > 0) {
                router.replace(ROUTES.MATERIAS_ALUNO || "/telaMaterias"); 
                return;
            }

            const responseProf = await fetch(`${API_URL}/professores?email=${email}&senha=${senha}`);
            const profsEncontrados = await responseProf.json();

            if (profsEncontrados.length > 0) {
                router.replace(ROUTES.TELA_PROFESSOR01 || "/telaProfessor01");
                return;
            }

            Alert.alert("Erro de acesso", "Email ou senha incorretos.");

        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível conectar ao servidor. Verifique sua internet ou se o Replit está rodando.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <View style={backgroundStyles.container}>
            <Gradient/>
            <View style={[styles.page, { paddingTop: topPadding, paddingBottom: contentPaddingBottom }]}>
                <View style={styles.top}>
                    <Text style={[styles.title, { fontSize: titleFontSize }]}>
                        MENTE <Text style={styles.lightBlue}>ATIVA</Text>
                    </Text>
                </View>

                <View style={styles.bottom}>
                    <Text style={globalStyles.whiteText}>Login:</Text>
                    <View style={styles.inputWrap}>
                        <InputText 
                            placeholder="Digite seu login" 
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <Text style={globalStyles.whiteText}>Senha:</Text>
                    <View style={styles.inputWrap}>
                        <InputText 
                            placeholder="Digite sua senha" 
                            placeholderTextColor="#999" 
                            secureTextEntry
                            value={senha}
                            onChangeText={setSenha}
                        />
                    </View>

                    <View style={styles.buttonWrap}>
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#29c4e1" />
                        ) : (
                            <GradientButton title="Entrar" onPress={handleLogin}/>
                        )}
                    </View>

                    <Text 
                        style={styles.createAccount}
                        onPress={() => setIsPopUpVisible(true)}
                    >
                        Criar Conta
                    </Text>

                    <CreateAccountPopUp 
                        visible={isPopUpVisible}
                        onClose={() => setIsPopUpVisible(false)}
                        onSelectStudent={handleStudentSelection}
                        onSelectTeacher={handleTeacherSelection}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'space-between',
        width: '100%',
    },
    top: {
        alignItems: 'center',
    },
    title : {
        fontWeight: '800',
        color: 'white',
        textAlign: 'center',
        letterSpacing: 1,
    },
    lightBlue: {
        color: '#29c4e1',
    },
    bottom: {
        alignItems: 'center',
        width: '100%',
        gap: 14,
    },
    inputWrap: {
        width: '86%',
    },
    buttonWrap: {
        width: '86%',
        marginTop: 10, // Pequeno espaçamento extra
    },
    createAccount: {
        color: '#ffffff',
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 6,
    }
})