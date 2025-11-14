import React from "react";
import { Text, StyleSheet, View } from "react-native";

export default function IconDelete() {
  return (
    <View style={styles.icon}>
      <Text style={styles.text}>x</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 28,
    height: 28,
    borderRadius: 20,
    backgroundColor: "#ffffff22",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "red",
    fontSize: 24,
  },
});
