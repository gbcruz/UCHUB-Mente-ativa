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

export default function telaProfessor03Edit({ navigation, route }: any) {

    const materia = route?.params?.materia || "Matéria";
    const ano = route?.params?.ano || "Ano";

    const conteudos = ["Fração", "Porcentagem", "Geometria", "Álgebra"];

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
            <Text style={styles.titulo}>{materia}</Text>

            {/* Lista de conteúdos */}
            <ScrollView
                style={styles.lista}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listaContent}
            >
                {conteudos.map((conteudo, index) => (
                    <View key={index} style={styles.conteudoContainer}>
                        {/* Ícone DELETE - canto superior esquerdo */}
                        <TouchableOpacity
                            style={styles.iconDeletePosition}
                            onPress={() => console.log("Excluir conteúdo:", conteudo)}
                        >
                            <IconDelete />
                        </TouchableOpacity>

                        {/* Ícone EDIT - canto superior direito */}
                        <TouchableOpacity
                            style={styles.iconEditPosition}
                            onPress={() =>
                                navigation.navigate("telaProfessor04Edit", {
                                    materia,
                                    ano,
                                    conteudo,
                                    editar: true,
                                })
                            }
                        >
                            <IconEdit />
                        </TouchableOpacity>

                        {/* Botão principal */}
                        <MateriaButton
                            nome={conteudo}
                            onPress={() =>
                                navigation.navigate("telaProfessor04", {
                                    materia,
                                    ano,
                                    conteudo,
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
                        navigation.navigate("telaProfessor04", {
                            materia,
                            ano,
                            conteudo: conteudos[0],
                        })
                    }
                >
                    <IconNext />
                </TouchableOpacity>
            </View>

            {/* Botão Adicionar */}
            <View style={styles.footer}>
                <GradientButton
                    title="Adicionar"
                    width={"100%"}
                    height={50}
                    fontSize={14}
                    gradientColor={["#0656E8", "#00A8FF"]}
                    onPress={() =>
                        navigation.navigate("telaProfessor04", {
                            materia,
                            ano,
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
        marginTop: height * 0.02,
        marginBottom: height * 0.02,
    },
    conteudoContainer: {
  width: "100%",
  position: "relative", // permite que os ícones sejam posicionados absolutos dentro
  marginBottom: 16,
  alignItems: "center",
},

iconDeletePosition: {
  position: "absolute",
  top: -1,
  left: 10,
  zIndex: 2, // fica acima do botão
},

iconEditPosition: {
  position: "absolute",
  top: -1,
  right: 10,
  zIndex: 2,
},
});