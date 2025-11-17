import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, ViewStyle } from "react-native";
import { styles } from "./styles";

interface MateriaButtonProps {
  nome: string;
  onPress?: () => void;
  customWidth?: string | number;
}

export const MateriaButton: React.FC<MateriaButtonProps> = ({
  nome,
  onPress,
  customWidth,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Hover visível apenas no web
  const hoverStyle =
    Platform.OS === "web" && isHovered
      ? {
          backgroundColor: "#B98AFF",
          transform: [{ scale: 1.03 }],
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
        }
      : {};

  // Eventos de hover — só são aplicados no Web
  const hoverEvents =
    Platform.OS === "web"
      ? {
          onMouseEnter: () => setIsHovered(true),
          onMouseLeave: () => setIsHovered(false),
        }
      : {};

  return (
    <TouchableOpacity
      {...hoverEvents} // aplica hover apenas se for web
      style={[
        styles.button,
        { width: customWidth as ViewStyle["width"] },
        hoverStyle,
      ]}
      onPress={onPress}
      activeOpacity={0.9} // leve escurecimento no clique
    >
      <Text style={styles.text}>{nome}</Text>
    </TouchableOpacity>
  );
};
