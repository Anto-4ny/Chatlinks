import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  connectFirestoreEmulator
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEj4ktySbzLa8imFNDgchhpddAjwCEHRA",
  authDomain: "chatlinks-bcc1b.firebaseapp.com",
  projectId: "chatlinks-bcc1b",
  storageBucket: "chatlinks-bcc1b.appspot.com",
  messagingSenderId: "424383172981",
  appId: "1:424383172981:web:eaf35d0e99fd605f72433c",
  measurementId: "G-Y2QYK39WYG"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
connectAuthEmulator(auth, "http://localhost:9099");

const db = getFirestore(app);
connectFirestoreEmulator(db, "localhost", 8080);

// Google login and signup
const googleLoginButton = document.getElementById('google-login');
const googleSignupButton = document.getElementById('google-signup');
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

[googleLoginButton, googleSignupButton].forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        window.location.href = "index.html"; // Redirect to a protected page
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

// Apple login and signup
const appleLoginButton = document.getElementById('apple-login');
const appleSignupButton = document.getElementById('apple-signup');
const appleProvider = new OAuthProvider('apple.com');

appleProvider.setCustomParameters({
  prompt: 'select_account'
});

[appleLoginButton, appleSignupButton].forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    signInWithPopup(auth, appleProvider)
      .then((result) => {
        window.location.href = "index.html"; // Redirect to a protected page
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Signed in user:', userCredential.user);
    // Redirect or update UI as needed
  } catch (error) {
    console.error('Error signing in:', error);
  }
});

// Example for Firestore interaction
const addUserToFirestore = async (user) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      uid: user.uid,
      email: user.email
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

// Call addUserToFirestore function after user is successfully signed in or signed up


// Password reset form
const forgotPasswordLink = document.getElementById('forgot-password');
const passwordResetForm = document.getElementById('password-reset-form');
const resetEmailInput = document.getElementById('reset-email');
const setNewPasswordForm = document.getElementById('set-new-password-form');
const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');

forgotPasswordLink.addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('.login_form').style.display = 'none';
  document.querySelector('.signup_form').style.display = 'none';
  document.querySelector('.password-reset-form').style.display = 'block';
});

passwordResetForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = resetEmailInput.value;

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert('Password reset email sent. Please check your inbox.');
      document.querySelector('.password-reset-form').style.display = 'none';
      document.querySelector('.login_form').style.display = 'block';
    })
    .catch((error) => {
      console.error(error);
    });
});

// Set new password form
setNewPasswordForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const oobCode = urlParams.get('oobCode');

  confirmPasswordReset(auth, oobCode, newPassword)
    .then(() => {
      alert('Password reset successful. You can now log in with your new password.');
      document.querySelector('.set-new-password-form').style.display = 'none';
      document.querySelector('.login_form').style.display = 'block';
    })
    .catch((error) => {
      console.error(error);
    });
});

// Toggle between login and signup forms
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const backToLoginLink = document.getElementById('back-to-login');
const loginFormContainer = document.querySelector('.login_form');
const signupFormContainer = document.querySelector('.signup_form');
const passwordResetFormContainer = document.querySelector('.password-reset-form');
const setNewPasswordFormContainer = document.querySelector('.set-new-password-form');

showSignupLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginFormContainer.style.display = 'none';
  signupFormContainer.style.display = 'block';
});

showLoginLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginFormContainer.style.display = 'block';
  signupFormContainer.style.display = 'none';
});

backToLoginLink.addEventListener('click', (e) => {
  e.preventDefault();
  passwordResetFormContainer.style.display = 'none';
  setNewPasswordFormContainer.style.display = 'none';
  loginFormContainer.style.display = 'block';
});

// Post functionality
const textarea = document.querySelector('#post-desc');
const postBtn = document.querySelector('.post-btn');
const postAudienceBtn = document.querySelector('.post-audience');
const backBtn = document.querySelector('.arrow-left-icon');
const createPostSection = document.querySelector('.create-post');
const postAudienceSection = document.querySelector('.post-audience-section');
const emojiBtn = document.querySelector('.emoji');
const emojiPicker = document.querySelector('emoji-picker');
const audienceOptions = document.querySelectorAll(".audience-option");
const radioBtns = document.querySelectorAll(".audience-option-radio");

document.body.style.overflowX = 'none';

textarea.addEventListener("input", () => {
  if (textarea.value != '')
    postBtn.disabled = false;
  else
    postBtn.disabled = true;
});

emojiBtn.addEventListener("click", () => {
  emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
});

emojiPicker.addEventListener('emoji-click', e => {
  textarea.value += e.detail.unicode;
});

postAudienceBtn.addEventListener('click', () => {
  document.querySelector('.wrapper').classList.add('wrapper-active');
  postAudienceSection.style.display = 'block';
  createPostSection.style.display = 'none';
});

audienceOptions.forEach(option => {
  option.addEventListener('click', e => {
    if (!option.classList.contains('active')) {
      option.classList.add('active');
      e.currentTarget.children[1].children[0].children[0].checked = true;
    }
    audienceOptions.forEach((otherOption, i) => {
      if (e.currentTarget !== otherOption) {
        otherOption.classList.remove('active');
        radioBtns[i].checked = false;
      }
    });
  });
});

backBtn.addEventListener('click', () => {
  document.querySelector('.wrapper').classList.remove('wrapper-active');
  postAudienceSection.style.display = 'none';
  createPostSection.style.display = 'block';
});
              