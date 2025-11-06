import { StyleSheet } from "react-native";

export const gradientColors = ['#0B0A4C', '#0053BC'] as const;
export const gradientStart = { x: 0.5, y: 0 }; 
export const gradientEnd = { x: 0.5, y: 1 }; 

export const styles = StyleSheet.create({
    container: {
        borderRadius: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 8,
        overflow: 'hidden', 
    },
    innerGradient: {
        width: '100%',
        minHeight: 56,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    title: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "800",
    },
})