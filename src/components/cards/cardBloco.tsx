import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CardBlocoOption = {
    value: string; // ex: "Bloco 1" -> vai para o state / API
    label: string; // ex: "Bloco 1   8/10 questões" -> aparece na UI
};

type Props = {
    label?: string;
    placeholder?: string;
    value?: string | null;
    options: CardBlocoOption[];        // ⬅️ antes era string[]
    onSelect: (value: string) => void;
    containerStyle?: ViewStyle;
    allowCreateNew?: boolean;
    onPressCreateNew?: () => void;
};

export default function CardBloco({
    label = "Bloco",
    placeholder = "Selecione o bloco",
    value,
    options,
    onSelect,
    containerStyle,
    allowCreateNew = false,
    onPressCreateNew,
}: Props) {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => setOpen((prev) => !prev);

    const handleSelect = (optionValue: string) => {
        onSelect(optionValue);  // ⬅️ devolve só o value pro pai
        setOpen(false);
    };

    const handleCreateNewPress = () => {
        setOpen(false);
        onPressCreateNew && onPressCreateNew();
    };

    // ⬇️ acha a opção selecionada pra mostrar o label
    const selectedOption = options.find((opt) => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity style={styles.header} onPress={toggleOpen}>
                <Text
                    style={[
                        styles.valueText,
                        !selectedOption ? styles.placeholderText : undefined,
                    ]}
                >
                    {displayText}
                </Text>

                <Ionicons
                    name="chevron-down"
                    size={18}
                    color="#FFFFFF"
                    style={{
                        transform: [{ rotate: open ? "180deg" : "0deg" }],
                    }}
                />
            </TouchableOpacity>

            {open && (
                <View style={styles.optionsWrapper}>
                    {options.map((opt) => (
                        <TouchableOpacity
                            key={opt.value}
                            style={styles.option}
                            onPress={() => handleSelect(opt.value)} // ⬅️ usa o value
                        >
                            <Text style={styles.optionText}>{opt.label}</Text>
                        </TouchableOpacity>
                    ))}

                    {allowCreateNew && (
                        <TouchableOpacity
                            style={styles.newOption}
                            onPress={handleCreateNewPress}
                        >
                            <Ionicons name="add" size={16} color="#FFFFFF" />
                            <Text style={styles.newOptionText}>Criar novo bloco</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 4,
        marginLeft: 4,
    },
    header: {
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: "rgba(255,255,255,0.12)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    valueText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "500",
    },
    placeholderText: {
        color: "rgba(255,255,255,0.6)",
    },
    optionsWrapper: {
        marginTop: 6,
        borderRadius: 14,
        backgroundColor: "rgba(0,0,0,0.18)",
        overflow: "hidden",
    },
    option: {
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    optionText: {
        color: "#FFFFFF",
        fontSize: 14,
    },

    // ⬇️ NOVO: estilo da linha "Criar novo bloco"
    newOption: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.1)",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    newOptionText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "500",
    },
});