

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD825MB56AIaR4NO8r_cJ8Dt-wWQBhWfX0",
    authDomain: "travel-destination-e42b7.firebaseapp.com",
    projectId: "travel-destination-e42b7",
    storageBucket: "travel-destination-e42b7.appspot.com",
    messagingSenderId: "824556874299",
    appId: "1:824556874299:web:d2cf454689ccb107780a1e",
    measurementId: "G-NPPH2S45JW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { app, auth };
;
