
/* =========================
   BLUEVERSE BLOG PLATFORM
   FINAL JAVASCRIPT (FULL)
========================= */

/* -------------------------
   DATA INIT (IMPORTANT)
------------------------- */

let users =
JSON.parse(localStorage.getItem("blueverse_users")) || [];

let posts =
JSON.parse(localStorage.getItem("blueverse_posts"));

if (!posts || posts.length === 0) {

    posts = [
        {
            id: 1,
            title: "Welcome to BlueVerse Blog Platform",
            category: "Technology",
            content: "This is your first sample blog. You can create, like, comment, and bookmark posts easily.",
            author: "Admin",
            userId: 1,
            date: "Today",
            likes: 5,
            bookmarks: 2,
            views: 10,
            comments: [
                { username: "Alex", text: "Nice platform!" }
            ]
        },
        {
            id: 2,
            title: "Modern Web Development Trends",
            category: "Programming",
            content: "Learn HTML, CSS, JavaScript and build modern UI applications with glassmorphism design.",
            author: "Admin",
            userId: 1,
            date: "Today",
            likes: 8,
            bookmarks: 3,
            views: 22,
            comments: []
        },
        {
            id: 3,
            title: "Why JavaScript is Powerful",
            category: "Programming",
            content: "JavaScript runs everywhere — frontend, backend, mobile apps and even AI tools.",
            author: "Admin",
            userId: 1,
            date: "Today",
            likes: 12,
            bookmarks: 6,
            views: 40,
            comments: [
                { username: "Sara", text: "Very informative!" }
            ]
        }
    ];

    localStorage.setItem("blueverse_posts", JSON.stringify(posts));
}

let currentUser =
JSON.parse(localStorage.getItem("blueverse_current_user")) || null;

/* -------------------------
   SAVE HELPERS
------------------------- */

function savePosts(){
    localStorage.setItem("blueverse_posts", JSON.stringify(posts));
}

function saveUsers(){
    localStorage.setItem("blueverse_users", JSON.stringify(users));
}

function saveCurrentUser(){
    localStorage.setItem("blueverse_current_user", JSON.stringify(currentUser));
}

/* -------------------------
   ELEMENTS
------------------------- */

const postsContainer = document.getElementById("postsContainer");

/* -------------------------
   TOAST
------------------------- */

function showToast(msg){

    const toast = document.getElementById("toast");

    toast.textContent = msg;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

/* -------------------------
   REGISTER
------------------------- */

document.getElementById("registerUser").addEventListener("click", () => {

    const username = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    if(!username || !email || !password){
        showToast("Fill all fields");
        return;
    }

    users.push({
        id: Date.now(),
        username,
        email,
        password,
        joined: new Date().toLocaleDateString()
    });

    saveUsers();

    document.getElementById("registerModal").style.display = "none";

    showToast("Account Created");
});

/* -------------------------
   LOGIN
------------------------- */

document.getElementById("loginUser").addEventListener("click", () => {

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const user = users.find(u => u.email === email && u.password === password);

    if(!user){
        showToast("Invalid Login");
        return;
    }

    currentUser = user;
    saveCurrentUser();

    document.getElementById("loginModal").style.display = "none";

    updateProfile();

    showToast("Welcome " + user.username);
});

/* -------------------------
   CREATE POST
------------------------- */

document.getElementById("publishPost").addEventListener("click", () => {

    if(!currentUser){
        showToast("Login required");
        return;
    }

    const title = document.getElementById("postTitle").value;
    const category = document.getElementById("postCategory").value;
    const content = document.getElementById("postContent").value;

    if(!title || !content){
        showToast("Fill all fields");
        return;
    }

    const post = {
        id: Date.now(),
        title,
        category,
        content,
        author: currentUser.username,
        userId: currentUser.id,
        date: new Date().toLocaleDateString(),
        likes: 0,
        bookmarks: 0,
        views: 0,
        comments: []
    };

    posts.unshift(post);

    savePosts();

    renderPosts();
    updateStats();

    document.getElementById("postModal").style.display = "none";

    showToast("Post Published");
});

/* -------------------------
   RENDER POSTS
------------------------- */

function renderPosts(){

    if(!postsContainer) return;

    postsContainer.innerHTML = "";

    posts.forEach(post => {

        postsContainer.innerHTML += `
        <div class="post-card glass">

            <span class="post-category">${post.category}</span>

            <h3>${post.title}</h3>

            <p>${post.content}</p>

            <small>By ${post.author} | ${post.date}</small>

            <br><br>

            <button onclick="likePost(${post.id})">❤️ ${post.likes}</button>
            <button onclick="bookmarkPost(${post.id})">🔖 ${post.bookmarks}</button>
            <button onclick="deletePost(${post.id})">🗑️</button>

            <br><br>

            <input id="c-${post.id}" placeholder="Write comment">
            <button onclick="addComment(${post.id})">Comment</button>

            ${post.comments.map(c => `
                <p>💬 <b>${c.username}</b>: ${c.text}</p>
            `).join("")}

        </div>
        `;
    });
}

/* -------------------------
   LIKE
------------------------- */

function likePost(id){
    const post = posts.find(p => p.id === id);
    post.likes++;
    savePosts();
    renderPosts();
}

/* -------------------------
   BOOKMARK
------------------------- */

function bookmarkPost(id){
    const post = posts.find(p => p.id === id);
    post.bookmarks++;
    savePosts();
    renderPosts();
}

/* -------------------------
   DELETE POST
------------------------- */

function deletePost(id){
    posts = posts.filter(p => p.id !== id);
    savePosts();
    renderPosts();
    updateStats();
}

/* -------------------------
   COMMENTS
------------------------- */

function addComment(id){

    const input = document.getElementById("c-" + id);
    const text = input.value;

    if(!text) return;

    const post = posts.find(p => p.id === id);

    post.comments.push({
        username: currentUser ? currentUser.username : "Guest",
        text
    });

    savePosts();
    renderPosts();
}

/* -------------------------
   DASHBOARD STATS
------------------------- */

function updateStats(){

    document.getElementById("totalPosts").textContent = posts.length;

    document.getElementById("totalLikes").textContent =
        posts.reduce((a,b) => a + b.likes, 0);

    document.getElementById("totalBookmarks").textContent =
        posts.reduce((a,b) => a + b.bookmarks, 0);

    document.getElementById("totalComments").textContent =
        posts.reduce((a,b) => a + b.comments.length, 0);
}

/* -------------------------
   PROFILE
------------------------- */

function updateProfile(){

    if(!currentUser) return;

    document.getElementById("avatar").textContent =
        currentUser.username.charAt(0);

    document.getElementById("profileName").textContent =
        currentUser.username;

    document.getElementById("profileJoined").textContent =
        "Member since " + currentUser.joined;
}

/* -------------------------
   THEME TOGGLE
------------------------- */

const themeBtn = document.getElementById("themeToggle");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
});

/* -------------------------
   INIT
------------------------- */

renderPosts();
updateStats();
updateProfile();
