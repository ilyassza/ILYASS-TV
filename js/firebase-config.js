// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDnhUOiLRCYA7uprymLveNqJ7odUQkPj-w",
    authDomain: "ilyass-tv-63bdf.firebaseapp.com",
    databaseURL: "https://ilyass-tv-63bdf-default-rtdb.firebaseio.com",
    projectId: "ilyass-tv-63bdf",
    storageBucket: "ilyass-tv-63bdf.firebasestorage.app",
    messagingSenderId: "235998882120",
    appId: "1:235998882120:web:0416fd6692ecbab0f0ab7d",
    measurementId: "G-898VPC2VEM"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);