import IconBack from "@/components/icons/iconBack";
import IconNext from "@/components/icons/iconNext";
import { QuestionCard } from "@/components/questionCard";
import { API_KEY } from "@/utils/apiKey";
import { ROUTES } from "@/utils/routes";
import { Gradient } from "@/utils/styles/background";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface Questao {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export default function TelaQuestoes() {
  // pega blocoId, blocoNome e (opcionalmente) usuario
  const { blocoId, blocoNome, usuario: usuarioParam } =
    useLocalSearchParams<{
      blocoId?: string;
      blocoNome?: string;
      usuario?: string;
    }>();

  const usuario = usuarioParam ? JSON.parse(usuarioParam as string) : null;
  const TURMA_ID = usuario?.turmaId ?? null;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [questions, setQuestions] = useState<Questao[]>([]);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [postingResults, setPostingResults] = useState(false);

  // animações
  const slideAnim = useRef(new Animated.Value(0)).current;
  const barAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;
  const correctAnim = useRef(new Animated.Value(1)).current;

  // ==============================
  //        BUSCA NA API
  // ==============================
  async function carregarQuestoes() {
    try {
      if (!blocoId) {
        console.warn("Nenhum blocoId recebido em TelaQuestoes");
        setQuestions([]);
        setAnswers([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      // 👉 BUSCA APENAS POR BLOCO, sem turma
      const url = `${API_KEY}/perguntas?blocosId=${Number(blocoId)}`;
      console.log("Buscando perguntas em:", url);

      const response = await fetch(url);
      const json = await response.json();
      console.log("Resposta /perguntas:", json);

      if (!Array.isArray(json)) {
        console.warn("Formato inesperado de /perguntas", json);
        setQuestions([]);
        setAnswers([]);
        return;
      }

      const adaptadas: Questao[] = json.map((p: any) => {
        const options: string[] = p.alternativas || [];
        const correct =
          typeof p.indiceCorreta === "number" && options[p.indiceCorreta]
            ? options[p.indiceCorreta]
            : "";

        return {
          id: p.id,
          question: p.enunciado ?? "",
          options,
          correctAnswer: correct,
          explanation: p.explicacao ?? "",
        };
      });

      setQuestions(adaptadas);
      setAnswers(new Array(adaptadas.length).fill(null));
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error("Erro ao carregar perguntas:", error);
      setQuestions([]);
      setAnswers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarQuestoes();
  }, [blocoId]);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  // ====== SLIDE ======
  function animateSlide(toLeft = true) {
    slideAnim.setValue(toLeft ? SCREEN_WIDTH : -SCREEN_WIDTH);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }

  // ====== SELECT ======
  function handleSelect(option: string) {
    if (answers[currentQuestionIndex]) return;

    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentQuestionIndex] = option;
      return copy;
    });

    if (option === currentQuestion.correctAnswer) {
      Animated.sequence([
        Animated.timing(correctAnim, {
          toValue: 1.15,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(correctAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }

  // ====== NAV ======
  function goToNextQuestion() {
    if (currentQuestionIndex < totalQuestions - 1) {
      animateSlide(true);
      setCurrentQuestionIndex((i) => i + 1);
    }
  }

  function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
      animateSlide(false);
      setCurrentQuestionIndex((i) => i - 1);
    }
  }

  // ====== MODAIS ======
  const openModal = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(true);
    modalAnim.setValue(0);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setter(false));
  };

  // ==============================
  //      RESULTADO FINAL
  // ==============================
  const totalCorrect = answers.reduce((acc, answer, index) => {
    if (!answer) return acc;
    const q = questions[index];
    if (!q) return acc;
    return acc + (answer === q.correctAnswer ? 1 : 0);
  }, 0);

  const accuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const allAnswered = answers.length > 0 && answers.every((a) => a !== null);

  async function submitResults() {
    if (!totalQuestions) return;
    try {
      setPostingResults(true);
      const payload = {
        totalQuestions,
        totalCorrect,
        accuracy,
        blocoId: blocoId ? Number(blocoId) : null,
        turmaId: TURMA_ID ?? null,
        timestamp: new Date().toISOString(),
      };
      await fetch(`${API_KEY}/resultados`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn("Erro ao enviar resultado:", err);
    } finally {
      setPostingResults(false);
    }
  }

  // auto-abrir resultado na última questão
  useEffect(() => {
    if (!totalQuestions) return;
    if (currentQuestionIndex === totalQuestions - 1 && allAnswered) {
      setShowResults(true);
      submitResults();
    }
  }, [answers, currentQuestionIndex, totalQuestions]);

  useEffect(() => {
    if (showResults) {
      modalAnim.setValue(0);
      Animated.timing(modalAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [showResults]);

  // barra de progresso
  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: totalQuestions ? (currentQuestionIndex + 1) / totalQuestions : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex, totalQuestions]);

  // ==============================
  //      ESTADOS ESPECIAIS
  // ==============================
  if (loading) {
    return (
      <Gradient>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </Gradient>
    );
  }

  if (!loading && totalQuestions === 0) {
    return (
      <Gradient>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, textAlign: "center" }}>
            Nenhuma questão encontrada para este bloco.
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 16,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#fff",
            }}
            onPress={() => router.back()}
          >
            <Text style={{ color: "#fff" }}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </Gradient>
    );
  }

  return (
    <Gradient>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => openModal(setShowExitConfirm)}>
          <Text style={styles.exitButton}>Sair</Text>
        </TouchableOpacity>

        <View pointerEvents="none" style={styles.centerTitle}>
          <Text style={styles.activityTitle}>
            {blocoNome ? blocoNome : "Atividade"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.progressWrapper}
          onPress={() => openModal(setShowQuestionSelector)}
        >
          <Text style={styles.questionCount}>
            Q{currentQuestionIndex + 1}/{totalQuestions}
          </Text>
        </TouchableOpacity>
      </View>

      {/* PROGRESSO */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: barAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>

      {/* QUESTÃO + ALTERNATIVAS */}
      <Animated.View
        style={[
          styles.slideContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        {currentQuestion && <QuestionCard question={currentQuestion.question} />}

        <View style={styles.optionsContainer}>
          {currentQuestion?.options?.map((option, index) => {
            let color = "#9C6CFF";
            if (answers[currentQuestionIndex]) {
              color =
                option === currentQuestion.correctAnswer ? "#4CAF50" : "#E53935";
            }

            const scaleValue =
              answers[currentQuestionIndex] &&
              option === currentQuestion.correctAnswer
                ? correctAnim
                : 1;

            return (
              <Animated.View
                key={index}
                style={{
                  width: "100%",
                  alignItems: "center",
                  transform: [{ scale: scaleValue as any }],
                }}
              >
                <TouchableOpacity
                  style={[styles.optionButton, { backgroundColor: color }]}
                  onPress={() => handleSelect(option)}
                  activeOpacity={0.8}
                  disabled={!!answers[currentQuestionIndex]}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </Animated.View>

      {/* NAV BOTTOM */}
      <View style={styles.bottomNav}>
        {currentQuestionIndex > 0 ? (
          <TouchableOpacity onPress={goToPreviousQuestion}>
            <IconBack />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 38 }} />
        )}

        {answers[currentQuestionIndex] && (
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => openModal(setShowExplanation)}
          >
            <Text style={styles.helpText}>?</Text>
          </TouchableOpacity>
        )}

        {currentQuestionIndex < totalQuestions - 1 ? (
          <TouchableOpacity onPress={goToNextQuestion}>
            <IconNext />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.finishButton, !allAnswered && { opacity: 0.5 }]}
            onPress={() => {
              setShowResults(true);
              submitResults();
            }}
            disabled={!allAnswered}
          >
            <Text style={styles.finishText}>Finalizar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* MODAIS */}

      {/* sair */}
      {showExitConfirm && (
        <Modal transparent visible>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalBox,
                { opacity: modalAnim, transform: [{ scale: modalAnim }] },
              ]}
            >
              <Text style={styles.modalTitle}>Deseja realmente sair?</Text>
              <View style={styles.exitButtons}>
                <TouchableOpacity
                  style={[styles.exitBtn, { backgroundColor: "#E53935" }]}
                  onPress={() => closeModal(setShowExitConfirm)}
                >
                  <Text style={styles.closeText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.exitBtn, { backgroundColor: "#4CAF50" }]}
                  onPress={() => {
                    closeModal(setShowExitConfirm);
                    router.navigate(ROUTES.MATERIAS_ALUNO);
                  }}
                >
                  <Text style={styles.closeText}>Sair</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      )}

      {/* explicação */}
      {showExplanation && currentQuestion && (
        <Modal transparent visible>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalBox,
                { opacity: modalAnim, transform: [{ scale: modalAnim }] },
              ]}
            >
              <Text style={styles.modalTitle}>Explicação:</Text>
              <Text style={styles.modalText}>{currentQuestion.explanation}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => closeModal(setShowExplanation)}
              >
                <Text style={styles.closeText}>Fechar</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}

      {/* seletor de questões */}
      {showQuestionSelector && (
        <Modal transparent visible>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalBox,
                { opacity: modalAnim, transform: [{ scale: modalAnim }] },
              ]}
            >
              <Text style={styles.modalTitle}>Ir para questão</Text>
              <View style={styles.selectorGrid}>
                {questions.map((q, i) => (
                  <TouchableOpacity
                    key={q.id}
                    style={[
                      styles.selectorButton,
                      i === currentQuestionIndex && { backgroundColor: "#9C6CFF" },
                    ]}
                    onPress={() => {
                      setCurrentQuestionIndex(i);
                      closeModal(setShowQuestionSelector);
                    }}
                  >
                    <Text style={styles.selectorText}>{i + 1}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => closeModal(setShowQuestionSelector)}
              >
                <Text style={styles.closeText}>Fechar</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      )}

      {/* resultado final */}
      {showResults && (
        <Modal transparent visible>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalBox,
                { opacity: modalAnim, transform: [{ scale: modalAnim }] },
              ]}
            >
              <Text style={styles.modalTitle}>Resultado Final</Text>
              <Text style={styles.modalText}>
                Você acertou {totalCorrect} de {totalQuestions} questões.
              </Text>
              <Text
                style={[styles.modalText, { fontWeight: "bold", marginTop: 8 }]}
              >
                Aproveitamento: {accuracy}%
              </Text>

              {postingResults ? (
                <ActivityIndicator style={{ marginTop: 12 }} />
              ) : (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setShowResults(false);
                    router.navigate(ROUTES.MATERIAS_ALUNO);
                  }}
                >
                  <Text style={styles.closeText}>Fechar</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          </View>
        </Modal>
      )}
    </Gradient>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    position: "relative",
  },
  centerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "none",
  },
  exitButton: {
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  activityTitle: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  questionCount: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  progressWrapper: { flex: 1, alignItems: "flex-end" },
  progressContainer: {
    width: "80%",
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    marginTop: 12,
    alignSelf: "center",
  },
  progressBar: { height: "100%", backgroundColor: "#00FF99", borderRadius: 3 },
  slideContainer: { width: "100%", alignItems: "center", marginTop: 10 },
  optionsContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: "7%",
  },
  optionButton: {
    width: "100%",
    height: 60,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  optionText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  helpButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#ffffff22",
    justifyContent: "center",
    alignItems: "center",
  },
  helpText: { color: "#fff", fontWeight: "bold", fontSize: 22 },
  finishButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
  },
  finishText: { color: "#fff", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "85%",
    padding: 25,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D0C57",
    marginBottom: 15,
    textAlign: "center",
  },
  modalText: {
    fontSize: 15,
    color: "#2D0C57",
    textAlign: "center",
    marginBottom: 6,
  },
  closeButton: {
    backgroundColor: "#9C6CFF",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 14,
  },
  closeText: { color: "#fff", fontWeight: "bold" },
  selectorGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  selectorButton: {
    width: 45,
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#9C6CFF",
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
  },
  selectorText: { color: "#2D0C57", fontWeight: "bold", fontSize: 16 },
  exitButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 10,
  },
  exitBtn: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 20 },
});
