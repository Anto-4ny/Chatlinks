import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

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
      messageElement.className = message.uid === auth.currentUser.uid ? 'message sent' : 'message received';
      messageElement.innerHTML = `<p>${message.message}</p>`;
      messagesContainer.appendChild(messageElement);
    });
  });
}

function openSearch() {
  document.getElementById('searchOverlay').style.display = 'flex';
}

function closeSearch() {
  document.getElementById('searchOverlay').style.display = 'none';
}

document.getElementById('searchInput').addEventListener('input', async () => {
  const searchValue = document.getElementById('searchInput').value.toLowerCase();
  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = '';

  const usersQuery = query(collection(db, 'users'), where('email', '>=', searchValue), where('email', '<=', searchValue + '\uf8ff'));
  const querySnapshot = await getDocs(usersQuery);

  querySnapshot.forEach((doc) => {
    const user = doc.data();
    if (user.uid !== auth.currentUser.uid) {
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      resultItem.textContent = user.email;
      resultItem.onclick = () => openChatWindow(user);
      searchResults.appendChild(resultItem);
    }
  });
});

function openChatWindow(user) {
  document.getElementById('chatWindow').style.display = 'flex';
  document.getElementById('searchOverlay').style.display = 'none';
  document.getElementById('userName').textContent = user.email;
  document.getElementById('profilePic').src = user.profilePic || 'default-profile-pic.png'; // Adjust as needed

  loadChatMessages(user.uid);
}

function loadChatMessages(userId) {
  const chatMessagesContainer = document.getElementById('chatMessages');
  const chatQuery = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));

  onSnapshot(chatQuery, (snapshot) => {
    chatMessagesContainer.innerHTML = '';
    snapshot.forEach(doc => {
      const message = doc.data();
      if ((message.uid === auth.currentUser.uid && message.recipientId === userId) ||
          (message.uid === userId && message.recipientId === auth.currentUser.uid)) {
        const messageElement = document.createElement('div');
        messageElement.className = message.uid === auth.currentUser.uid ? 'message sent' : 'message received';
        messageElement.innerHTML = `<p>${message.message}</p>`;
        chatMessagesContainer.appendChild(messageElement);
      }
    });
  });
}

function sendChatMessage() {
  const message = document.getElementById('chatMessageInput').value;
  const user = auth.currentUser;
  const recipientId = document.getElementById('userName').dataset.userId;

  if (user && message.trim() !== '' && recipientId) {
    addDoc(collection(db, 'messages'), {
      uid: user.uid,
      recipientId: recipientId,
      message: message,
      timestamp: serverTimestamp()
    }).then(() => {
      document.getElementById('chatMessageInput').value = '';
    }).catch(error => {
      console.error('Error sending message:', error);
    });
  }
}

function closeChat() {
  document.getElementById('chatWindow').style.display = 'none';
}

function logout() {
  signOut(auth).then(() => {
    window.location.href = 'index.html';
  }).catch((error) => {
    console.error('Error logging out:', error);
  });
}
