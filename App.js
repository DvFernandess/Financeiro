import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FinanceiroScreen from './screens/FinanceiroScreen';
import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import AddFinanceiro from './screens/AddFinanceiro';
import EditarFinanceiro from './screens/EditarFinanceiro';
import { auth } from './firebaseConfig'; // Importando a configuração do Firebase
import { TouchableOpacity, Text, StyleSheet } from 'react-native'; // Importando TouchableOpacity
import { Ionicons } from '@expo/vector-icons'; // Importando o ícone Ionicons

const Stack = createStackNavigator();

const App = () => {
  // Função para realizar logout
  const handleLogout = async (navigation) => {
    try {
      await auth.signOut(); // Realizando logout
      // Navegar para a tela de login após o logout
      navigation.replace('Login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen
          name="Financeiro"
          component={FinanceiroScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: 'Financeiro',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#6200ea',
            },
            headerTintColor: '#fff',
            headerRight: () => (
              <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout(navigation)}>
                <Ionicons name="exit-outline" size={24} color="#fff" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="AddFinanceiro"
          component={AddFinanceiro}
          options={{
            headerShown: true,
            headerTitle: 'Adicionar Financeiro',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#6200ea',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen name="EditarFinanceiro" component={EditarFinanceiro} options={{
            headerShown: true,
            headerTitle: 'Editar Financeiro',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#6200ea',
            },
            headerTintColor: '#fff',
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 10,
  },
});

export default App;
