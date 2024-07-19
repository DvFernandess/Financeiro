import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text';
import { collection, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'; // Importando os métodos necessários para atualizar o Firestore
import { db, auth } from '../firebaseConfig'; // Importando o objeto de autenticação e o Firestore

const AddFinanceiro = ({ navigation }) => {
  const [novoPagamento, setNovoPagamento] = useState({
    id: null,
    titulo: "",
    data: getCurrentDate(),
    valor: "",
    status: "Aguardando Pagamento",
  });

  const handleSalvarPagamento = async () => {
    try {
      const userId = auth.currentUser.uid; // Obtendo o ID do usuário atual
      const userDocRef = doc(db, "users", userId); // Referência ao documento do usuário atual
  
      // Recuperando o último ID e incrementando-o para obter o próximo ID
      const userDocSnap = await getDoc(userDocRef);
      const ultimoId = userDocSnap.data().ultimoId || 0;
      const proximoId = ultimoId + 1;
  
      // Adicionando o novo pagamento com o ID atualizado ao array financeiro do usuário
      await updateDoc(userDocRef, { 
        financeiro: arrayUnion({ ...novoPagamento, id: proximoId }), 
        ultimoId: proximoId // Atualizando o último ID no documento do usuário
      }); 
  
      Alert.alert("Sucesso", "Pagamento salvo com sucesso!", [
        { text: "OK", onPress: () => {
          setNovoPagamento({
            id: null,
            titulo: "",
            data: getCurrentDate(),
            valor: "",
            status: "Aguardando Pagamento",
          });
        }}
      ]);
    } catch (error) {
      console.error("Erro ao adicionar pagamento:", error);
    }
  };
  

  function getCurrentDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Pagamento</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="create-outline" size={24} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={novoPagamento.titulo}
          onChangeText={text => setNovoPagamento(prevState => ({ ...prevState, titulo: text }))} 
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="cash-outline" size={24} color="#aaa" style={styles.icon} />
        <TextInputMask
          style={styles.input}
          placeholder="Valor"
          type={'money'}
          options={{
            precision: 2,
            separator: ',',
            delimiter: '.',
            unit: 'R$',
            suffixUnit: ''
          }}
          value={novoPagamento.valor}
          onChangeText={text => setNovoPagamento(prevState => ({ ...prevState, valor: text }))} 
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="calendar-outline" size={24} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.inputDate}
          placeholder="Data"
          value={novoPagamento.data}
          onChangeText={text => setNovoPagamento(prevState => ({ ...prevState, data: text }))} 
        />
      </View>
      <Picker
        selectedValue={novoPagamento.status}
        style={styles.picker}
        onValueChange={(itemValue) => setNovoPagamento(prevState => ({ ...prevState, status: itemValue }))}>
        <Picker.Item label="Aguardando Pagamento" value="Aguardando Pagamento" />
        <Picker.Item label="Atrasado" value="Atrasado" />
        <Picker.Item label="Pago" value="Pago" />
      </Picker>
      <TouchableOpacity style={styles.salvarButton} onPress={handleSalvarPagamento}>
        <Text style={styles.salvarButtonText}>Salvar</Text>
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
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 40,
    backgroundColor: '#fff',
  },
  inputDate: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 40,
    backgroundColor: '#fff',
  },
  icon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  picker: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  salvarButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  salvarButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddFinanceiro;
