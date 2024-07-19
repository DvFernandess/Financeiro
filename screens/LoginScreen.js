import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Importa o método correto do Firebase Authentication
import { auth } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Importa Ionicons

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password); // Utiliza o método correto de autenticação
      const user = userCredential.user;
  
      console.log('Usuário logado:', user.uid);
  
      navigation.replace('Financeiro'); // Navega para a tela Financeiro após o login
    } catch (error) {
      console.log(error.code)
      if (error.code === 'auth/invalid-credential') {
        setError('E-mail ou senha inválido');
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça login</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={[styles.input, { borderColor: '#000', borderWidth: 1 }]} // Adiciona borda preta ao redor do campo
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={[styles.input, { borderColor: '#000', borderWidth: 1 }]} // Adiciona borda preta ao redor do campo
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // Se showPassword for verdadeiro, exibe a senha
        />
        <TouchableOpacity
          style={styles.eyeIconContainer} // Container para ajustar o alinhamento vertical do ícone
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#666" style={styles.eyeIcon} />
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.signupText}>Não tem uma conta? <Text style={styles.signupLink}>Cadastre-se!</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
  },
  eyeIcon: {
    marginRight: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupText: {
    textAlign: 'center',
  },
  signupLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
