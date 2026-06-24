
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDj8nqi2yaYahSssX24DJTBMSLCUI4yTPQ",
  authDomain: "sm-glamour.firebaseapp.com",
  projectId: "sm-glamour",
  storageBucket: "sm-glamour.firebasestorage.app",
  messagingSenderId: "290060459618",
  appId: "1:290060459618:web:cc5b494666b94192983b3b",
  measurementId: "G-W3WSZ5BJ52"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
 const analytics = getAnalytics(app);
 export const db = getFirestore(app);


// 1) Una referencia a la aplicacion/plataforma de firebase (es la constante "app")
// 2) Una referencia a la base de datos de firebase (Se hace con la funcion getFirestore de firebase)
// 3) Una referencia a la coleccion (existente o no) de firebase
// 4) Hago la consulta addDoc