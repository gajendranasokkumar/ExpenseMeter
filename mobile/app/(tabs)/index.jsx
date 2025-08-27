import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import useTheme from "../../hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import createHomeStyles from "../../styles/home.styles";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const { colors } = useTheme();
  const styles = createHomeStyles();

  return (
    <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Home</Text>
          {/* <TouchableOpacity style={styles.addButton}>
            <Ionicons name="person-outline" size={24} color={colors.surface} />
          </TouchableOpacity> */}
        </View>
      </View>
    </LinearGradient>
  );
};

export default Home;
