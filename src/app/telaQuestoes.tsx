import IconBack from "@/components/icons/iconBack";
import IconNext from "@/components/icons/iconNext";
import { QuestionCard } from "@/components/questionCard";
import { ROUTES } from "@/utils/routes";
import { Gradient } from "@/utils/styles/background";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
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

export default function TelaQuestoes() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);

  // Animações
  const slideAnim = useRef(new Animated.Value(0)).current;
  const barAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(1)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

  const questions = [
    { id: 1, question: "Se 3 cadernos custam R$18, quanto custarão 5?", options: ["25", "28", "30", "35", "40"], correctAnswer: "30", explanation: "Cada caderno custa R$6. 5 × 6 = R$30." },
    { id: 2, question: "Se 2 maçãs custam R$6, quanto custarão 5?", options: ["10", "12", "15", "18", "20"], correctAnswer: "15", explanation: "Cada maçã custa R$3. 5 × 3 = R$15." },
    { id: 3, question: "Qual é o resultado de 12 ÷ 3 × 2?", options: ["6", "8", "4", "10", "12"], correctAnswer: "8", explanation: "12 ÷ 3 = 4, 4 × 2 = 8." },
    { id: 4, question: "Qual é o resultado de 9 + 6 ÷ 3?", options: ["3", "5", "11", "13", "15"], correctAnswer: "11", explanation: "6 ÷ 3 = 2, então 9 + 2 = 11." },
    { id: 5, question: "Se uma pizza tem 8 fatias e você come 3, quanto resta?", options: ["4", "5", "3", "2", "1"], correctAnswer: "5", explanation: "8 - 3 = 5 fatias restantes." },
    { id: 6, question: "Qual é o quadrado de 7?", options: ["14", "21", "42", "49", "56"], correctAnswer: "49", explanation: "7 × 7 = 49." },
    { id: 7, question: "Quanto é 15% de 200?", options: ["10", "20", "25", "30", "40"], correctAnswer: "30", explanation: "15% = 0.15. 0.15 × 200 = 30." },
    { id: 8, question: "Qual é a capital da França?", options: ["Roma", "Paris", "Londres", "Berlim", "Madri"], correctAnswer: "Paris", explanation: "A capital da França é Paris." },
    { id: 9, question: "Qual destes animais é um mamífero?", options: ["Tubarão", "Golfinho", "Peixe", "Sapo", "Pinguim"], correctAnswer: "Golfinho", explanation: "O golfinho é um mamífero aquático." },
    { id: 10, question: "Qual é o planeta mais próximo do Sol?", options: ["Terra", "Vênus", "Marte", "Mercúrio", "Júpiter"], correctAnswer: "Mercúrio", explanation: "Mercúrio é o planeta mais próximo do Sol." },
  ];

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
    if (selectedOption) return;
    setSelectedOption(option);
    Animated.sequence([
      Animated.timing(buttonAnim, { toValue: 0.9, duration: 120, useNativeDriver: true }),
      Animated.timing(buttonAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  }

  // ====== PROGRESS ======
  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: (currentQuestionIndex + 1) / questions.length,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex]);

  // ====== NAVIGATION ======
  function goToNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      animateSlide(true);
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedOption(null);
    }
  }

  function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
      animateSlide(false);
      setCurrentQuestionIndex((i) => i - 1);
      setSelectedOption(null);
    }
  }

  // ====== ANIMATED MODAL OPEN/CLOSE ======
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

  return (
    <Gradient>
      {/* ====== HEADER ====== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => openModal(setShowExitConfirm)}>
          <Text style={styles.exitButton}>Sair</Text>
        </TouchableOpacity>

        <View pointerEvents="none" style={styles.centerTitle}>
          <Text style={styles.activityTitle}>ATV 1</Text>
        </View>

        <TouchableOpacity
          style={styles.progressWrapper}
          onPress={() => openModal(setShowQuestionSelector)}
        >
          <Text style={styles.questionCount}>
            Q{currentQuestionIndex + 1}/{questions.length}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ====== PROGRESS BAR ====== */}
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

      {/* ====== QUESTION CARD ====== */}
      <Animated.View
        style={[styles.slideContainer, { transform: [{ translateX: slideAnim }] }]}
      >
        <QuestionCard question={currentQuestion.question} />
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            let color = "#9C6CFF";
            if (selectedOption) {
              color = option === currentQuestion.correctAnswer ? "#4CAF50" : "#E53935";
            }
            return (
              <Animated.View
                key={index}
                style={{ transform: [{ scale: buttonAnim }], width: "100%", alignItems: "center" }}
              >
                <TouchableOpacity
                  style={[styles.optionButton, { backgroundColor: color }]}
                  onPress={() => handleSelect(option)}
                  activeOpacity={0.8}
                  disabled={!!selectedOption}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </Animated.View>

      {/* ====== NAVIGATION ====== */}
      <View style={styles.bottomNav}>
        {currentQuestionIndex > 0 ? (
          <TouchableOpacity onPress={goToPreviousQuestion}>
            <IconBack />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 38 }} />
        )}

        {selectedOption && (
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => openModal(setShowExplanation)}
          >
            <Text style={styles.helpText}>?</Text>
          </TouchableOpacity>
        )}

        {currentQuestionIndex < questions.length - 1 ? (
          <TouchableOpacity onPress={goToNextQuestion}>
            <IconNext />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 38 }} />
        )}
      </View>

      {/* ====== MODAL: SAIR ====== */}
      {showExitConfirm && (
        <Modal transparent visible>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalBox,
                {
                  opacity: modalAnim,
                  transform: [{ scale: modalAnim }],
                },
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

      {/* ====== MODAL: EXPLICAÇÃO ====== */}
      {showExplanation && (
        <Modal transparent visible>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalBox,
                {
                  opacity: modalAnim,
                  transform: [{ scale: modalAnim }],
                },
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

      {/* ====== MODAL: SELETOR DE QUESTÕES ====== */}
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
                    key={i}
                    style={[
                      styles.selectorButton,
                      i === currentQuestionIndex && { backgroundColor: "#9C6CFF" },
                    ]}
                    onPress={() => {
                      setCurrentQuestionIndex(i);
                      setSelectedOption(null);
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
  optionsContainer: { marginTop: 20, width: "100%", alignItems: "center", paddingHorizontal: "7%" },
  optionButton: { width: "100%", height: 60, borderRadius: 12, alignItems: "center", justifyContent: "center", marginVertical: 8 },
  optionText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  bottomNav: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", alignSelf: "center", marginTop: 20, marginBottom: 20 },
  helpButton: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#ffffff22", justifyContent: "center", alignItems: "center" },
  helpText: { color: "#fff", fontWeight: "bold", fontSize: 22 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center", padding: 20 },
  modalBox: { backgroundColor: "#fff", borderRadius: 16, width: "85%", padding: 25, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#2D0C57", marginBottom: 15, textAlign: "center" },
  modalText: { fontSize: 15, color: "#2D0C57", textAlign: "center", marginBottom: 10 },
  closeButton: { backgroundColor: "#9C6CFF", borderRadius: 10, paddingHorizontal: 20, paddingVertical: 8, marginTop: 10 },
  closeText: { color: "#fff", fontWeight: "bold" },
  selectorGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  selectorButton: { width: 45, height: 45, borderRadius: 10, borderWidth: 1, borderColor: "#9C6CFF", justifyContent: "center", alignItems: "center", margin: 6 },
  selectorText: { color: "#2D0C57", fontWeight: "bold", fontSize: 16 },
  exitButtons: { flexDirection: "row", justifyContent: "space-between", width: "80%", marginTop: 10 },
  exitBtn: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 20 },
});
