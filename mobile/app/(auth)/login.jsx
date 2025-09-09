import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import createAuthStyles from "../../styles/auth.styles";
import ReactLogo from "../../assets/images/logo.png";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Link, router } from "expo-router";
import { API_URL, AUTH_ROUTES } from "../../constants/endPoints";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../../context/userContext";

const Login = () => {
  const styles = createAuthStyles();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();
  const handleLogin = async () => {
    setErrorMessage("");

    if (!formData.email || !formData.password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}${AUTH_ROUTES.LOGIN}`, {
        email: formData.email,
        password: formData.password,
      });
      await AsyncStorage.setItem("token", response.data.jwtToken);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.data));
      setUser(response.data.data);
      router.replace("/(tabs)");
    } catch (error) {
      console.log(error.response.data);
      setErrorMessage(
        error?.response?.data?.message || "Login failed. Please try again."
      );
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
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>
        {Boolean(errorMessage) && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{errorMessage}</Text>
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={styles.inputPlaceholder.color}
          value={formData.email}
          onChangeText={(v) => setFormData({ ...formData, email: v })}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor={styles.inputPlaceholder.color}
          value={formData.password}
          onChangeText={(v) => setFormData({ ...formData, password: v })}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Don&apos;t have an account?</Text>

          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Register</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.buttonText}>Logging in...</Text>
          </View>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;
