import CreateAccountPopUp from "@/app/popUps/professorOuAluno";
import { GradientButton } from "@/components/gradientButton";
import { InputText } from "@/components/inputText";
import { backgroundStyles, Gradient } from "@/styles/background";
import { globalStyles } from "@/styles/global";
import { ROUTES } from "@/utils/routes";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";


export default function Index() {
    // Função do react native para pegar as dimensões da tela, faço calculos
    // pra deixar o layout responsivo
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
                        <InputText placeholder="Digite seu login" placeholderTextColor="#999"/>
                    </View>

                    <Text style={globalStyles.whiteText}>Senha:</Text>
                    <View style={styles.inputWrap}>
                        <InputText placeholder="Digite sua senha" placeholderTextColor="#999" secureTextEntry/>
                    </View>

                    <View style={styles.buttonWrap}>
                        <GradientButton title="Entrar"/>
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
    },
    createAccount: {
        color: '#ffffff',
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 6,
    }
})