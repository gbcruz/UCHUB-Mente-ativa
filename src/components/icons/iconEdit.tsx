import React from "react";
import { Text, StyleSheet, View } from "react-native";

export default function IconEdit() {
  return (
    <View style={styles.icon}>
      <Text style={styles.text}>✏️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: "#ffffff22",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
  }})