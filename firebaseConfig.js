// firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCSsy_AKMVeZRFxyuDZ7Qy4uRsgCgoXzOY",
  authDomain: "testeodonto-3ea6b.firebaseapp.com",
  projectId: "testeodonto-3ea6b",
  storageBucket: "testeodonto-3ea6b.appspot.com",
  messagingSenderId: "221310619267",
  appId: "1:221310619267:web:784863013741b648fc55b6",
  measurementId: "G-9TLQJG8R1E"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);

export { app, auth, db };