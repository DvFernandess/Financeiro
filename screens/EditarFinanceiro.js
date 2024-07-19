import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { Picker } from '@react-native-picker/picker';

const EditarFinanceiro = ({ route }) => {
    const { pagamento } = route.params;
    const [editPagamento, setEditPagamento] = useState(pagamento);
  
    const handleSalvarEdicao = async () => {
        try {
          const userId = auth.currentUser.uid;
          const userDocRef = doc(db, "users", userId);
          const userDocSnapshot = await getDoc(userDocRef);
      
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            if (userData && userData.financeiro) {
              const updatedFinanceiro = editFinanceiro(userData.financeiro, editPagamento);
              await updateDoc(userDocRef, { financeiro: updatedFinanceiro });
              Alert.alert("Sucesso", "Pagamento editado com sucesso!");
            } else {
              throw new Error("Dados financeiros não encontrados para o usuário.");
            }
          } else {
            throw new Error("Documento do usuário não encontrado.");
          }
        } catch (error) {
          console.error("Erro ao editar pagamento:", error);
          Alert.alert("Erro", "Ocorreu um erro ao editar o pagamento. Por favor, tente novamente mais tarde.");
        }
      };
      
      
  
      const editFinanceiro = (financeiro, editedPayment) => {
        return financeiro.map((payment) => {
          if (payment.id === editedPayment.id) {
            return editedPayment; // Substituir o pagamento editado
          }
          return payment;
        });
      };
      
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Editar Pagamento</Text>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={editPagamento.titulo}
          onChangeText={text => setEditPagamento(prevState => ({ ...prevState, titulo: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Data (DD/MM/AAAA)"
          value={editPagamento.data}
          onChangeText={text => setEditPagamento(prevState => ({ ...prevState, data: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Valor"
          value={editPagamento.valor}
          onChangeText={text => setEditPagamento(prevState => ({ ...prevState, valor: text }))}
        />
        <Picker
          selectedValue={editPagamento.status}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) =>
            setEditPagamento(prevState => ({ ...prevState, status: itemValue }))
          }>
          <Picker.Item label="Aguardando Pagamento" value="Aguardando Pagamento" />
          <Picker.Item label="Atrasado" value="Atrasado" />
          <Picker.Item label="Pago" value="Pago" />
        </Picker>
        <TouchableOpacity style={styles.salvarButton} onPress={handleSalvarEdicao}>
          <Text style={styles.salvarButtonText}>Salvar Edição</Text>
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
    input: {
      width: '100%',
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 20,
    },
    salvarButton: {
      backgroundColor: '#6200ea',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    salvarButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
  
  export default EditarFinanceiro;
