import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    backgroundColor: "#9C6CFF",
    width: "85%", // padrão
    maxWidth: 500,
    height: 70,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    alignSelf: "center",

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },

    // Animação de transição suave (apenas web usa)
    transitionProperty: "all",
    transitionDuration: "0.25s",
    transitionTimingFunction: "ease-in-out",
  },

  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});
