import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";
import createAuthStyles from "../../styles/auth.styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ReactLogo from "../../assets/images/react-logo.png";
import { API_URL, AUTH_ROUTES } from "../../constants/api";
import axios from "axios";

const Register = () => {
  const styles = createAuthStyles();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage("Name is required");
      return false;
    }
    if (formData.name.trim().length < 2) {
      setErrorMessage("Name must be at least 2 characters");
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage("Please enter a valid email");
      return false;
    }
    if (!formData.password) {
      setErrorMessage("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return false;
    }
    if (!formData.confirmPassword) {
      setErrorMessage("Please confirm your password");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}${AUTH_ROUTES.REGISTER}`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      Alert.alert(
        "Success!",
        "Account created successfully. Please log in.",
        [{ text: "OK", onPress: router.replace("/(auth)/login") }]
      );
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={30}
    >
      <View style={styles.container}>
        <Image source={ReactLogo} style={styles.logo} />
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Create an account</Text>

        {Boolean(errorMessage) && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{errorMessage}</Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={styles.inputPlaceholder.color}
          value={formData.name}
          onChangeText={(v) => handleInputChange("name", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={styles.inputPlaceholder.color}
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(v) => handleInputChange("email", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor={styles.inputPlaceholder.color}
          value={formData.password}
          onChangeText={(v) => handleInputChange("password", v)}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={true}
          placeholderTextColor={styles.inputPlaceholder.color}
          value={formData.confirmPassword}
          onChangeText={(v) => handleInputChange("confirmPassword", v)}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? "Creating Account..." : "Register"}</Text>
        </TouchableOpacity>
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.buttonText}>Creating Account...</Text>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

export default Register;
