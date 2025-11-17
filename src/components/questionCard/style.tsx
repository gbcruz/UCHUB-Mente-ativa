import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    minHeight: 240, // 🔼 Aumentado (antes era 140)
    alignSelf: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    color: "#2D0C57",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 26,
  },
});
