import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Google login
const googleLoginButton = document.getElementById('google-login');
googleLoginButton.addEventListener('click', (e) => {
  e.preventDefault();
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // Handle success
      console.log(result.user);
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
    });
});

// Email/Password login
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginForm['email'].value;
  const password = loginForm['password'].value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Handle success
      console.log(userCredential.user);
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
    });
});
           
const textarea = document 
    .querySelector('#post-desc'); 
const postBtn = document 
    .querySelector('.post-btn'); 
const postAudienceBtn = document 
    .querySelector('.post-audience'); 
const backBtn = document. 
    querySelector('.arrow-left-icon'); 
const createPostSection = document. 
    querySelector('.create-post'); 
const postAudienceSection = document. 
    querySelector('.post-audience-section'); 
const emojiBtn = document. 
    querySelector('.emoji'); 
const emojiPicker = document. 
    querySelector('emoji-picker'); 
const audienceOptions = document. 
    querySelectorAll(".audience-option"); 
const radioBtns = document. 
    querySelectorAll(".audience-option-radio"); 
  
document.body.style.overflowX = 'none'; 
  
textarea.addEventListener("input", () => { 
    if (textarea.value != '') 
        postBtn.disabled = false; 
    else
        postBtn.disabled = true; 
}) 
emojiBtn.addEventListener("click", () => { 
    if (emojiPicker.style.display == 'none') 
        emojiPicker.style.display = 'block'; 
    else
        emojiPicker.style.display = 'none'; 
}) 
emojiPicker.addEventListener('emoji-click', e => { 
    textarea.value += e.detail.unicode; 
}) 
postAudienceBtn.addEventListener('click', () => { 
    document.querySelector('.wrapper') 
        .classList.add('wrapper-active'); 
    postAudienceSection.style.display = 'block'; 
    createPostSection.style.display = 'none'; 
}) 
audienceOptions.forEach(option => { 
    option.addEventListener('click', e => { 
        if (!option.classList.contains('active')) { 
            option.classList.add('active'); 
            e.currentTarget.children[1] 
                .children[0].children[0].checked = true; 
        } 
        for (let i = 0; i < audienceOptions.length; i++) { 
            if (e.currentTarget != audienceOptions[i]) { 
                audienceOptions[i].classList 
                    .remove('active'); 
                radioBtns[i].checked = false; 
            } 
        } 
    }) 
}) 
backBtn.addEventListener('click', () => { 
    document.querySelector('.wrapper') 
        .classList.remove('wrapper-active'); 
    postAudienceSection.style.display = 'none'; 
    createPostSection.style.display = 'block'; 
})
