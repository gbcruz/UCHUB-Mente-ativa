import React, { PropsWithChildren, useRef, useState } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextInput, Pressable } from 'react-native';

type CardProps = PropsWithChildren & {
    title?: string;
    style?: ViewStyle;
    // ⬇️ novo: controle externo do conteúdo (opcional)
    value?: string;
    onChangeText?: (v: string) => void;
    placeholder?: string;
    editable?: boolean;          // por padrão true
    autoFocusIfEmpty?: boolean;  // foca automaticamente se vier vazio
};

/** Card branco com sombra suave; opcionalmente renderiza um título.
 *  Agora suporta edição inline (tocar para editar, blur para sair).
 */
export default function CardEnunciado({
    title,
    style,
    children,
    value = '',
    onChangeText,
    placeholder = 'Enunciado da questão...',
    editable = true,
    autoFocusIfEmpty = true,
}: CardProps) {
    const [editing, setEditing] = useState<boolean>(autoFocusIfEmpty && !value);
    const inputRef = useRef<TextInput>(null);

    const enterEdit = () => {
        if (!editable) return;
        setEditing(true);
        setTimeout(() => inputRef.current?.focus(), 10);
    };

    const exitEdit = () => setEditing(false);

    return (
        <View style={[styles.card, style]}>
            {title ? <Text style={styles.title}>{title}</Text> : null}

            {/* Quando não estiver editando, mostra o texto (ou placeholder “apagado”);
          ao tocar, vira TextInput no mesmo lugar */}
            {!editing ? (
                <Pressable onPress={enterEdit} style={styles.displayArea}>
                    <Text style={[styles.displayText, !value && styles.placeholderText]}>
                        {value?.trim() ? value : placeholder}
                    </Text>
                    {children /* segue suportando children, se você quiser inserir algo extra */}
                </Pressable>
            ) : (
                <TextInput
                    ref={inputRef}
                    style={styles.inputArea}
                    multiline
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#6b6177"
                    onBlur={exitEdit}
                    returnKeyType="done"
                    blurOnSubmit
                    onSubmitEditing={exitEdit}
                    textAlignVertical="top"
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        // borderRadius: radius.md + 6,
        // padding: space.lg,
        // marginBottom: space.lg,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 5,
        borderRadius: 12,      // 👉 ajuda a ficar mais “card”
        padding: 16,           // 👉 espaço interno pro texto
    },
    title: {
        color: '#3a2a67',
        fontWeight: '700',
        // marginBottom: space.sm
        marginBottom: 8,
    },
    displayArea: {
        minHeight: 90,
        justifyContent: 'flex-start',
    },
    displayText: {
        color: '#1f1b2e',
        fontSize: 14,
        lineHeight: 20,
    },
    placeholderText: {
        color: '#6b6177',
        opacity: 0.9,
    },
    inputArea: {
        minHeight: 90,
        color: '#1f1b2e',
        fontSize: 14,
        lineHeight: 20,
        textAlignVertical: 'top',
    },
});
