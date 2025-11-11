import GradientButton from "@/components/gradientButton";
import IconBack from "@/components/icons/iconBack";
import IconHome from "@/components/icons/iconHome";
import IconNext from "@/components/icons/iconNext";
import IconDelete from "@/components/icons/iconDelete";
import IconEdit from "@/components/icons/iconEdit";
import { MateriaButton } from "@/components/materiaButton";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const { width, height } = Dimensions.get("window");

export default function telaProfessor04Edit({ navigation, route }: any) {

    const materia = route?.params?.materia || "Matéria";
    const ano = route?.params?.ano || "Ano";
    const conteudo = route?.params?.conteudo || "Conteúdo";

    const questoes = [
        "Dois terços de 90 é?",
        "Simplifique 12/18",
        "Dois terços de 90 é?",
        "Dois terços de 90 é?",
        "Dois terços de 90 é?",
    ];

    return (
        <LinearGradient colors={["#111b84", "#3c0e71"]} style={styles.container}>

            {/* Ícones topo */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <IconBack />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("telaProfessor01")}>
                    <IconHome />
                </TouchableOpacity>
            </View>

            {/* Título */}
            <Text style={styles.titulo}>{conteudo}</Text>

         
            {/* Lista de questões */}
            <ScrollView
                style={styles.lista}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listaContent}
            >
                {questoes.map((item, index) => (
                    <View key={index} style={styles.questaoContainer}>
                        {/* Ícone DELETE - canto superior esquerdo */}
                        <TouchableOpacity
                            style={styles.iconDeletePosition}
                            onPress={() => console.log("Excluir questão", index + 1)}
                        >
                            <IconDelete />
                        </TouchableOpacity>

                        {/* Ícone EDIT - canto superior direito */}
                        <TouchableOpacity
                            style={styles.iconEditPosition}
                            onPress={() =>
                                navigation.navigate("telaProfessor05", {
                                    materia,
                                    ano,
                                    conteudo,
                                    questao: index + 1,
                                    editar: true,
                                })
                            }
                        >
                            <IconEdit />
                        </TouchableOpacity>

                        <MateriaButton
                            nome={`${index + 1}. ${item}`}
                            onPress={() =>
                                navigation.navigate("telaProfessor05", {
                                    materia,
                                    ano,
                                    conteudo,
                                    questao: index + 1,
                                })
                            }
                        />
                    </View>
                ))}
            </ScrollView>
            {/* Botão próximo */}
            <View style={styles.nextArea}>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("telaProfessor05", {
                            materia,
                            ano,
                            conteudo,
                            questao: 1,
                        })
                    }
                >
                    <IconNext />
                </TouchableOpacity>
            </View>

            {/* Botões Criar e Editar */}
            <View style={styles.footer}>
                <GradientButton
                    title="Criar Atv"
                    width={"48%"}
                    height={50}
                    fontSize={14}
                    gradientColor={["#0656E8", "#00A8FF"]}
                    onPress={() =>
                        navigation.navigate("telaProfessor05", {
                            materia,
                            ano,
                            conteudo,
                            novaQuestao: true,
                        })
                    }
                />

                <GradientButton
                    title="Editar"
                    width={"48%"}
                    height={50}
                    fontSize={14}
                    gradientColor={["#0656E8", "#00A8FF"]}
                    onPress={() =>
                        navigation.navigate("telaProfessor05", {
                            materia,
                            ano,
                            conteudo,
                            editar: true,
                        })
                    }
                />
            </View>

        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: height * 0.04,
        paddingHorizontal: width * 0.08,
    },
    header: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: height * 0.02,
    },
    titulo: {
        color: "#fff",
        fontWeight: "700",
        fontSize: width * 0.06,
        textAlign: "center",
        marginBottom: height * 0.03,
    },
    lista: {
        width: "100%",
        flex: 1,
    },
    listaContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    nextArea: {
        marginTop: height * 0.02,
        marginBottom: height * 0.02,
    },
    footer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: height * 0.02,
        marginBottom: height * 0.02,
        gap: width * 0.03,
    },
    questaoItem: {
        width: "100%",
        flexDirection: "row", // ícone e botão na horizontal
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    iconDeleteArea: {
        marginLeft: 10,
    },
    questaoContainer: {
        width: "100%",
        position: "relative", // permite que o ícone absoluto se posicione dentro desse container
        marginBottom: 16,
        alignItems: "center", // centraliza o botão
    },

    iconDeletePosition: {
        position: "absolute",
        top: -1,     // distância do topo
        left: 10,    // distância da esquerda
        zIndex: 2,  // garante que o ícone fique acima do botão
    },
    iconEditPosition: {
        position: "absolute",
        top: -1,    // mesma altura do delete
        right: 10,  // fica do lado direito
        zIndex: 2,  // garante que fica acima do botão
    },
});