import { StyleSheet, Text, View } from "react-native";

export default function CadastroProfessor() {
    return (
        <View style={styles.container}>
            <Text>Cadastro de Professor</Text>
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