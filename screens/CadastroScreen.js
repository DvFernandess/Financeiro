import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore'; // Importando o método setDoc
import { auth, db } from '../firebaseConfig';

const CadastroScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleCadastro = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Usuário cadastrado:', user.uid);

      // Usando o UID do usuário como ID do documento
      const userDocRef = doc(db, 'users', user.uid);

      // Salvando os dados do usuário no Firestore
      await setDoc(userDocRef, {
        uid: user.uid,
        nome: nome,
        email: email,
      });

      console.log('Informações salvas no Firestore:', { uid: user.uid, nome, email });

      navigation.replace('Financeiro');
    } catch (error) {
      setError(error.message);
      console.log('Erro ao cadastrar:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Cadastrar" onPress={handleCadastro} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Já possui uma conta? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  loginText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default CadastroScreen;
