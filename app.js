// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBjk2umGPl8mrclftBmA2FxAqQVw_x-p4",
  authDomain: "streamkids-hub.firebaseapp.com",
  projectId: "streamkids-hub",
  storageBucket: "streamkids-hub.firebasestorage.app",
  messagingSenderId: "995351131864",
  appId: "1:995351131864:web:2d52f1124807da7ca849ad"
};

// Initialize Firebase safely
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = typeof firebase.auth === 'function' ? firebase.auth() : null;

// Load Posts on index.html
const postsContainer = document.getElementById('posts-container');
if (postsContainer) {
  db.collection('devlogs').orderBy('timestamp', 'desc').get().then(snapshot => {
    if (snapshot.empty) {
      postsContainer.innerHTML = '<p>No updates published yet.</p>';
      return;
    }
    postsContainer.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const card = document.createElement('article');
      card.className = 'post-card';
      card.innerHTML = `
        <div class="post-header">
          <span class="tag">${data.category}</span>
        </div>
        <h2>${data.title}</h2>
        <p>${data.content}</p>
      `;
      postsContainer.appendChild(card);
    });
  }).catch(err => {
    console.error("Error loading posts:", err);
    postsContainer.innerHTML = '<p>Failed to load posts. Check browser console for errors.</p>';
  });
}

// Auth State Monitor for admin.html
const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');

if (loginSection && adminSection && auth) {
  auth.onAuthStateChanged(user => {
    if (user && user.email === "skibidiw63@gmail.com") {
      loginSection.style.display = 'none';
      adminSection.style.display = 'block';
    } else {
      loginSection.style.display = 'block';
      adminSection.style.display = 'none';
    }
  });
}

// Google Sign In
function loginWithGoogle() {
  if (!auth) return;
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(err => alert("Login Error: " + err.message));
}

// Logout
function logout() {
  if (auth) auth.signOut();
}

// Handle Submitting Posts
const postForm = document.getElementById('post-form');
if (postForm) {
  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    db.collection('devlogs').add({
      title: document.getElementById('title').value,
      category: document.getElementById('category').value,
      content: document.getElementById('content').value,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      alert("Devlog published!");
      postForm.reset();
      window.location.href = "index.html";
    }).catch(err => alert("Error publishing: " + err.message));
  });
}
