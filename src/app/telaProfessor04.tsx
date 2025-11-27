// import GradientButton from "@/components/gradientButton";
// import IconBack from "@/components/icons/iconBack";
// import IconHome from "@/components/icons/iconHome";
// import IconNext from "@/components/icons/iconNext";
// import { MateriaButton } from "@/components/materiaButton";
// import { LinearGradient } from "expo-linear-gradient";
// import React from "react";
// import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// const { width, height } = Dimensions.get("window");

// export default function telaProfessor04({ navigation, route }: any) {

//   const materia = route?.params?.materia || "Matéria";
//   const ano = route?.params?.ano || "Ano";
//   const conteudo = route?.params?.conteudo || "Conteúdo";

//   const questoes = [
//     "Dois terços de 90 é?",
//     "Simplifique 12/18",
//     "Dois terços de 90 é?",
//     "Dois terços de 90 é?",
//     "Dois terços de 90 é?",
//   ];

//   return (
//     <LinearGradient colors={["#111b84", "#3c0e71"]} style={styles.container}>

//       {/* Ícones topo */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <IconBack />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => navigation.navigate("telaProfessor01")}>
//           <IconHome />
//         </TouchableOpacity>
//       </View>

//       {/* Título */}
//       <Text style={styles.titulo}>{conteudo}</Text>

//       {/* Lista de questões */}
//       <ScrollView 
//         style={styles.lista} 
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.listaContent}
//       >
//         {questoes.map((item, index) => (
//           <MateriaButton
//             key={index}
//             nome={`${index + 1}. ${item}`}
//             onPress={() =>
//               navigation.navigate("telaProfessor05", {
//                 materia,
//                 ano,
//                 conteudo,
//                 questao: index + 1
//               })
//             }
//           />
//         ))}
//       </ScrollView>

//       {/* Botão próximo */}
//       <View style={styles.nextArea}>
//         <TouchableOpacity
//           onPress={() =>
//             navigation.navigate("telaProfessor05", {
//               materia,
//               ano,
//               conteudo,
//               questao: 1,
//             })
//           }
//         >
//           <IconNext />
//         </TouchableOpacity>
//       </View>

//       {/* Botões Criar e Editar */}
//  <View style={styles.footer}>
//         <GradientButton
//           title="Criar Atv"
//           width={"48%"}
//           height={50}
//           fontSize={14}
//           gradientColor={["#0656E8", "#00A8FF"]}
//           onPress={() =>
//             navigation.navigate("telaProfessor05", {
//               materia,
//               ano,
//               conteudo,
//               novaQuestao: true,
//             })
//           }
//         />

//         <GradientButton
//           title="Editar"
//           width={"48%"}
//           height={50}
//           fontSize={14}
//           gradientColor={["#0656E8", "#00A8FF"]}
//           onPress={() =>
//             navigation.navigate("telaProfessor05", {
//               materia,
//               ano,
//               conteudo,
//               editar: true,
//             })
//           }
//         />
//       </View>

//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     paddingTop: height * 0.04,
//     paddingHorizontal: width * 0.08,
//   },
//   header: {
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: height * 0.02,
//   },
//   titulo: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: width * 0.06,
//     textAlign: "center",
//     marginBottom: height * 0.03,
//   },
//   lista: {
//     width: "100%",
//     flex: 1,
//   },
//   listaContent: {
//     flexGrow: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   nextArea: {
//     marginTop: height * 0.02,
//     marginBottom: height * 0.02,
//   },
//   footer: {
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: height * 0.02,
//     marginBottom: height * 0.02,
//     gap: width * 0.03,
//   },
// });

import GradientButton from "@/components/gradientButton";
import { Ionicons } from "@expo/vector-icons";
import CardAlternativas from "@/components/cards/cardAlternativas";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function telaProfessor04({ navigation, route }: any) {
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconCircle}        // ⬅ círculo no voltar
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("telaProfessor01")}
          style={styles.iconCircle}        // ⬅ círculo na casinha
        >
          <Ionicons name="home" size={20} color="#fff" />
          {/* home = casinha preenchida */}
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
          <TouchableOpacity
            key={index}
            style={{ width: "100%" }}
            onPress={() =>
              navigation.navigate("telaProfessor05", {
                materia,
                ano,
                conteudo,
                questao: index + 1,
              })
            }
          >
            <View style={styles.wrapperAlternativa}>
              <CardAlternativas
                label={`${index + 1}. ${item}`}
                showInput={false}
                showMarkCorrect={false}
                containerStyle={styles.cardLista}
                labelStyle={styles.cardTexto}
              />
            </View>
          </TouchableOpacity>
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
          style={styles.nextButton}       // círculo já existia aqui
        >
          <Ionicons name="chevron-forward" size={22} color="#fff" />
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
    paddingBottom: 20,
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

  wrapperAlternativa: {
    marginVertical: 8,
  },

  cardLista: {
    paddingVertical: 20,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  cardTexto: {
    fontSize: 21,
    fontWeight: "700",
  },

  // círculo dos ícones do topo
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.20)",
    justifyContent: "center",
    alignItems: "center",
  },

  // círculo do botão próximo
  nextButton: {
    width: 45,
    height: 45,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.20)",
    justifyContent: "center",
    alignItems: "center",
  },
});