import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEj4ktySbzLa8imFNDgchhpddAjwCEHRA",
  authDomain: "chatlinks-bcc1b.firebaseapp.com",
  projectId: "chatlinks-bcc1b",
  storageBucket: "chatlinks-bcc1b.appspot.com",
  messagingSenderId: "424383172981",
  appId: "1:424383172981:web:eaf35d0e99fd605f72433c",
  measurementId: "G-Y2QYK39WYG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth state listener
onAuthStateChanged(auth, user => {
  if (user) {
    loadMessages();
  } else {
    window.location.href = "index.html";
  }
});

function sendMessage() {
  const message = document.getElementById('messageInput').value;
  const user = auth.currentUser;

  if (user && message.trim() !== '') {
    addDoc(collection(db, 'messages'), {
      uid: user.uid,
      message: message,
      timestamp: serverTimestamp()
    }).then(() => {
      document.getElementById('messageInput').value = '';
    }).catch(error => {
      console.error('Error sending message:', error);
    });
  }
}

function loadMessages() {
  const messagesContainer = document.getElementById('messages');
  const messagesQuery = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));

  onSnapshot(messagesQuery, (snapshot) => {
    messagesContainer.innerHTML = '';
    snapshot.forEach(doc => {
      const message = doc.data();
      const messageElement = document.createElement('div');
      messageElement.textContent = message.message;
      messagesContainer.appendChild(messageElement);
    });
  });
}

window.logout = function() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  }).catch(error => {
    console.error('Error signing out:', error);
  });
}

window.sendMessage = sendMessage;
