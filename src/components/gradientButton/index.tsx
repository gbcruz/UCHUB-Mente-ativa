import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { gradientColors, gradientEnd, gradientStart, styles } from "./styles";
//Importei TouchableOpacityProps para meu botao ter TODAS a funcionalidades de um TouchableOpacity normal

//Declarando a tipagem das props que o componente Button vai receber
type Props = TouchableOpacityProps & { 
    title: string;
    width?: number | string;
    height?: number;
    fontSize?: number;
    gradientColor?: [string, string];
}

//Componente Button, que sempre recebe a props title
//...rest é a forma de pegar todas as outras props que o TouchableOpacityProps tem
//eu nao faço a mesma coisa com o title, pq eu quero que o meu botao sempre tenha title e porque nao quero usar nenhuma outra propriedade de Text
export function GradientButton({title, style, ...rest} : Props) {
    return (
        //TouchableOpacity é um componente que pode ser pressionado, pra dar um efeito de clique, activeOpacity é o regulador de opacidade ao clicar
        //Styles é a estilização importada do arquivo styles.ts criado especificamente para este botao.
        <TouchableOpacity activeOpacity={0.85} style={[styles.container, style]} {...rest}>
            <LinearGradient
                colors={gradientColors}
                start={gradientStart}
                end={gradientEnd}
                style={styles.innerGradient}
            >
                <Text style={styles.title}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
    
}
// Export default 
export default GradientButton;