import React from "react";
import { View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import useTheme from "../../hooks/useTheme";

const Statistics = () => {
  const { colors } = useTheme();

  const styles = {
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    header: {
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
    },
  };

  return (
    <LinearGradient
      colors={colors.gradients.background}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Statistics</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{ color: colors.text }}>Statistics content goes here</Text>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default Statistics;
