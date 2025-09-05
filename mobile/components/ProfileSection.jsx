import { View, Text, Image, TouchableOpacity, TextInput, Alert, Platform, ActivityIndicator } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import createSettingsStyles from "../styles/settings.styles";
import useTheme from "../hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../context/userContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";
import api from "../utils/api";
import { USER_ROUTES } from "../constants/endPoints";
import { useFocusEffect } from "@react-navigation/native";

const ProfileSection = () => {
  const styles = createSettingsStyles();
  const { user, getUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [editedName, setEditedName] = useState(user?.name);
  const [editedEmail, setEditedEmail] = useState(user?.email);
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    setAvatar(user?.avatar || "");
    setEditedName(user?.name);
    setEditedEmail(user?.email);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      setIsEditing(false);
    }, [])
  );

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await api.put(`${USER_ROUTES.UPDATE_USER_BY_ID.replace(":id", user._id)}`, {
        name: editedName,
        email: editedEmail,
        avatar: avatar,
      });
      Alert.alert("Success", "User details updated successfully");
      getUser();
    } catch (error) {
      Alert.alert("Error", "There was a problem updating your user details");
    } finally {
      setLoading(false);
    }
    setIsEditing((prev) => !prev);
  }

  const pickImage = async () => {
    try {
      // request permission if needed
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          Alert.alert("Permission Denied", "We need camera roll permissions to upload an image");
          return;
        }
      }

      // launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.1, 
        base64: true,
      });

      if (!result.canceled) {
        // setImage(result.assets[0].uri);

        // if base64 is provided, use it

        if (result.assets[0].base64) {
            setAvatar(result.assets[0].base64);
        } else {
          // otherwise, convert to base64
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          setAvatar(base64);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "There was a problem selecting your image");
    }
  };

  const handleDelete = async () => {
    setAvatar("");
  }


  return (
    <LinearGradient colors={colors.gradients.surface} style={styles.section}>
      <View style={styles.profileSectionHeader}>
        <Text style={styles.sectionTitle}>Profile</Text>
        { isEditing ? 
        (<TouchableOpacity style={[styles.profileSectionEditButton, { backgroundColor: colors.success }]} onPress={handleSubmit} disabled={loading}>
          {loading 
            ? <ActivityIndicator size="small" color={colors.text} />
            :
            <Ionicons name="checkmark" size={20} color={colors.text} />}
        </TouchableOpacity>) 
        :
        (
          <TouchableOpacity style={[styles.profileSectionEditButton, { backgroundColor: colors.primary }]} onPress={toggleEditing} disabled={loading}>
            <Ionicons name="pencil" size={20} color={colors.text} />
          </TouchableOpacity>
        )
        }
      </View>
      <View style={styles.profileSection}>
        <Image source={{ uri: `data:image/png;base64,${avatar}` }} style={styles.profileSectionAvatar} />
        {isEditing && (
        <>
            <TouchableOpacity style={styles.avatarEditButtonContainer} onPress={pickImage} disabled={loading}>
                <Ionicons name="add" size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarDeleteButtonContainer} onPress={handleDelete} disabled={loading}>
                <Ionicons name="trash" size={20} color={colors.text} />
            </TouchableOpacity>
        </>
        )}
        <TextInput style={[styles.profileSectionName, isEditing && styles.profileSectionNameEditable]} value={editedName} onChangeText={setEditedName} editable={isEditing} />
        <TextInput style={[styles.profileSectionEmail, isEditing && styles.profileSectionNameEditable]} value={editedEmail} onChangeText={setEditedEmail} editable={isEditing} />
      </View>
    </LinearGradient>
  );
};

export default ProfileSection;