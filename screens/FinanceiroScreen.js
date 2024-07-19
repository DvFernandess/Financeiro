import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Certifique-se de instalar a biblioteca de ícones
import { collection, doc, getDoc, onSnapshot, updateDoc, arrayRemove, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig'; // Importando o objeto de autenticação e o Firestore

const FinanceiroScreen = ({ navigation }) => {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        if (userData && userData.financeiro) {
          // Adicionando um ID para cada item se não tiver uma propriedade "id" específica
          const pagamentosComId = userData.financeiro.map((pagamento, index) => ({
            ...pagamento,
            id: pagamento.id || index.toString(), // Se não houver um ID específico, use o índice como ID
          }));
          const sortedPagamentos = pagamentosComId.sort((a, b) => {
            const dateA = new Date(a.data.split('/').reverse().join('/'));
            const dateB = new Date(b.data.split('/').reverse().join('/'));
            return dateA - dateB;
          });
          setPagamentos(sortedPagamentos);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (item) => {
    // Navegar para a tela de edição com os detalhes do pagamento
    navigation.navigate('EditarFinanceiro', { pagamento: item });
  };


  const handleDelete = async (itemId) => {
    console.log("itemId em handleDelete:", itemId);
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza de que deseja excluir este pagamento?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => deleteItem(itemId) }
      ],
      { cancelable: false }
    );
  };

  const deleteItem = async (itemId) => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid); // Referência ao documento do usuário atual
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // Verificando se o documento do usuário existe

        // Obter os dados do documento do usuário
        const userData = userDocSnap.data();

        if (userData && userData.financeiro) {
          // Se houver dados financeiros, criar uma cópia do array financeiro sem o item a ser excluído
          const updatedFinanceiro = userData.financeiro.filter(pagamento => pagamento.id !== itemId);

          // Atualizar o documento do usuário com o novo array financeiro
          await updateDoc(userDocRef, { financeiro: updatedFinanceiro });

          console.log("Pagamento excluído com sucesso!");

          // Atualizar a lista de pagamentos após a exclusão do documento
          setPagamentos(updatedFinanceiro);
        } else {
          console.log("Dados financeiros não encontrados para o usuário.");
        }
      } else {
        console.log("Documento do usuário não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao excluir pagamento:", error?.message || error);
    }
  };

  const renderPagamento = ({ item, index }) => {
    console.log(`Item ${index + 1}:`, item); // Adicionado para verificar cada item
    console.log(`ID do item ${index + 1}:`, item.id);
    let statusColor = '#555';
    let icon = 'checkmark-circle';

    switch (item.status) {
      case 'Aguardando Pagamento':
        statusColor = 'orange';
        icon = 'hourglass-outline';
        break;
      case 'Atrasado':
        statusColor = 'red';
        icon = 'alert-circle-outline';
        break;
      default:
        statusColor = 'green';
        icon = 'checkmark-circle';
        break;
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.titulo}</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => handleEdit(item)}>
              <Ionicons name="pencil" size={24} color="#6200ea" style={styles.editIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash" size={24} color="red" style={styles.deleteIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color="#555" />
          <Text style={styles.date}>Data: {item.data}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="cash" size={20} color="#555" />
          <Text style={styles.value}>Valor: {item.valor}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name={icon} size={20} color={statusColor} />
          <Text style={[styles.status, { color: statusColor }]}>Status: {item.status}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ea" />
        </View>
      ) : pagamentos.length === 0 ? (
        <View style={styles.centeredContainer}>
          <Text style={styles.centeredText}>Sem financeiro para este usuário</Text>
        </View>
      ) : (
        <>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={24} color="#555" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar por título..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          <FlatList
            data={pagamentos.filter(item => item.titulo && item.titulo.toLowerCase().includes(searchTerm.toLowerCase()))}
            renderItem={renderPagamento}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </>
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddFinanceiro')}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '90%',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  editIcon: {
    marginRight: 5,
  },
  deleteIcon: {
    marginLeft: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    marginLeft: 5,
    color: '#555',
  },
  value: {
    fontSize: 16,
    marginLeft: 5,
    color: '#555',
  },
  status: {
    fontSize: 16,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  index: {
    position: 'absolute',
    top: 5,
    right: 5,
    fontWeight: 'bold',
    color: '#888',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6200ea',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredText: {
    fontSize: 20,
    color: 'red',
  },
});

export default FinanceiroScreen;
