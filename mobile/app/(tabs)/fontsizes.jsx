import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useTheme from "../../hooks/useTheme";
import useLanguage from "../../hooks/useLanguage";
import { useFontSize } from "../../context/fontSizeContext";
import createFontSizesStyles from "../../styles/fontSizes.styles";

const FontSizes = () => {
  const { colors } = useTheme();
  const styles = createFontSizesStyles();
  const { t } = useLanguage();
  const {
    preset,
    presets,
    updatePreset,
    currentPreset,
    isLoading,
    getFontSizeByKey,
  } = useFontSize();

  const presetKeys = useMemo(() => Object.keys(presets), [presets]);
  const getInitialSliderIndex = () => {
    const currentIndex = presetKeys.indexOf(preset);
    if (currentIndex >= 0) {
      return currentIndex;
    }
    const defaultIndex = presetKeys.indexOf("medium");
    return defaultIndex >= 0 ? defaultIndex : 0;
  };

  const [sliderIndex, setSliderIndex] = useState(getInitialSliderIndex);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    if (isSliding) {
      return;
    }
    const currentIndex = presetKeys.indexOf(preset);
    if (currentIndex >= 0) {
      if (currentIndex !== sliderIndex) {
        setSliderIndex(currentIndex);
      }
      return;
    }
    const defaultIndex = presetKeys.indexOf("medium");
    setSliderIndex(defaultIndex >= 0 ? defaultIndex : 0);
  }, [preset, presetKeys, isSliding, sliderIndex]);

  const nextPresetKey = presetKeys[sliderIndex] ?? presetKeys[0];
  const sliderPreset = presets[nextPresetKey] ?? currentPreset;
  const scalePercent = Math.round((sliderPreset?.scale ?? 1) * 100);

  const handleValueChange = (value) => {
    const roundedValue = Math.round(value);
    setSliderIndex(roundedValue);
  };

  const handleSlidingStart = () => {
    setIsSliding(true);
  };

  const handleSlidingComplete = async (value) => {
    const roundedValue = Math.round(value);
    const selectedPresetKey = presetKeys[roundedValue];
    if (selectedPresetKey && selectedPresetKey !== preset) {
      try {
        await updatePreset(selectedPresetKey);
      } finally {
        setIsSliding(false);
      }
      return;
    }
    setIsSliding(false);
  };

  if (isLoading) {
    return (
      <LinearGradient colors={colors.gradients.background} style={styles.container}>
        <View style={styles.loadingState}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={colors.gradients.background} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)/more")}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {t("fontSizes.title", { defaultValue: "Font sizes" })}
        </Text>
        <View style={styles.spacer} />
      </View>

      <Text style={styles.description}>
        {t("fontSizes.description", {
          defaultValue: "Adjust the global text size to your preference.",
        })}
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        

        <View style={styles.sliderCard}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>
              {t("fontSizes.slider.label", { defaultValue: "Text scale" })}
            </Text>
            <Text style={styles.sliderValue}>
              {t("fontSizes.slider.value", {
                defaultValue: "{value}",
                replace: { value: sliderPreset?.name ?? "" },
              })}
            </Text>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={Math.max(presetKeys.length - 1, 0)}
            step={1}
            value={sliderIndex}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
            onValueChange={handleValueChange}
            onSlidingStart={handleSlidingStart}
            onSlidingComplete={handleSlidingComplete}
            style={styles.sliderControl}
          />
          <View style={styles.sliderLabels}>
            {presetKeys.map((key, index) => {
              const labelSelected = sliderIndex === index;
              return (
                <Text
                  key={key}
                  style={[
                    styles.sliderLabelText,
                    labelSelected && styles.sliderLabelActive,
                  ]}
                >
                  {presets[key]?.name ?? key}
                </Text>
              );
            })}
          </View>
          <Text style={styles.helperText}>
            {t("fontSizes.helper", {
              defaultValue: "Drag the slider to instantly preview text sizes.",
            })}
          </Text>
        </View>

      </ScrollView>
    </LinearGradient>
  );
};

export default FontSizes;

