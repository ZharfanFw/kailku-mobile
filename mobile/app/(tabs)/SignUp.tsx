import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
// [1] Import useRouter dari Expo Router
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  // [2] Inisialisasi router
  const router = useRouter();

  const handleSignUp = () => {
    // [3] Perintah Navigasi
    // Ini akan mencari file bernama "HomePage.tsx" di dalam folder "app"
    router.replace('/HomePage');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Bagian Gambar Avatar */}
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/man-wearing-vr-headset-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--virtual-reality-metaverse-pack-avatars-icons-6296963.png' }}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>

          {/* Bagian Form Input */}
          <View style={styles.formContainer}>
            <View style={styles.row}>
              <View style={styles.halfInputContainer}>
                <TextInput style={styles.input} placeholder="Nama Depan" placeholderTextColor="#999" />
              </View>
              <View style={styles.halfInputContainer}>
                <TextInput style={styles.input} placeholder="Nama Belakang" placeholderTextColor="#999" />
              </View>
            </View>

            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#999" secureTextEntry />
            <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#999" secureTextEntry />

            {/* [4] Panggil fungsi handleSignUp di sini */}
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20, paddingTop: 40 },
  avatarContainer: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#DCEAF7' },
  formContainer: { width: '100%' },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 15 },
  halfInputContainer: { width: '48%' },
  input: { backgroundColor: '#F0F0F0', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 25, fontSize: 14, color: '#333', width: '100%', marginBottom: 15 },
  button: { backgroundColor: '#103568', paddingVertical: 16, borderRadius: 25, alignItems: 'center', marginTop: 20, shadowColor: "#103568", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 6 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
