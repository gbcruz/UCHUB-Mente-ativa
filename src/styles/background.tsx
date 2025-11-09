import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";

export const backgroundStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        padding: 14,
        position: "relative",
    },
});

export function Gradient() {
    return (
        <LinearGradient
            colors={["#0C0B5A", "#5017A3"]}
            style={[StyleSheet.absoluteFillObject, { zIndex: -1 }]}
            pointerEvents="none"
        />
    );
}
