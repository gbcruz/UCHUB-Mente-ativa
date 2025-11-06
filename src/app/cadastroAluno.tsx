import { StyleSheet, Text, View } from "react-native";

export default function CadastroAluno() {
    return (
        <View style={styles.container}>
            <Text>Cadastro de Aluno</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
});