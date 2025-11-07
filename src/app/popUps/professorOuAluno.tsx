import { GradientButton } from '@/components/gradientButton';
import { Gradient } from '@/styles/background';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';


interface Props {
    visible: boolean;
    onClose: () => void;
    onSelectStudent: () => void;
    onSelectTeacher: () => void;
}

export function CreateAccountPopUp({ visible, onClose, onSelectStudent, onSelectTeacher }: Props) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Gradient />
                    <TouchableOpacity 
                        style={styles.closeButton} 
                        onPress={onClose}
                    >
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={styles.content}>
                        <GradientButton 
                            title="Sou Aluno"
                            onPress={onSelectStudent}
                            style={styles.button}
                        />
                        <GradientButton 
                            title="Sou Professor"
                            onPress={onSelectTeacher}
                            style={styles.button}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
        closeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
        padding: 3,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '80%',
        padding: 20,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#000',
        overflow: 'hidden',
    },
    content: {
        gap: 16,
    },
    button: {
        width: '100%',
    }
});