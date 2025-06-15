import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Substitua pelos UIDs reais dos administradores
// Para encontrar o UID: Faça login no app, vá ao Firebase Console > Authentication > Users > copie o UID.
// Lista de UIDs que têm acesso de administrador
export const ADMIN_UIDS = ["jvE0tL1XLvTId2v3CqFwfmMt7VE2"];

// Configuração do Firebase - Substitua com suas chaves
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_N-ZhOeo-Ev5HgJ7QOZomIRfsYy4Mh44",
  authDomain: "barbeariadocesarr.firebaseapp.com",
  projectId: "barbeariadocesarr",
  storageBucket: "barbeariadocesarr.appspot.com",
  messagingSenderId: "30598422031",
  appId: "1:30598422031:web:f216a534ac8bbb1c348d7a"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
