/* ==========================
   BLUEVERSE BLOG PLATFORM
   CORE SYSTEM
========================== */

/* --------------------------
   DATABASE
-------------------------- */

let users =
JSON.parse(localStorage.getItem("blueverse_users")) || [];

let posts =
JSON.parse(localStorage.getItem("blueverse_posts")) || [];

let currentUser =
JSON.parse(localStorage.getItem("blueverse_current_user")) || null;

/* --------------------------
   ELEMENTS
-------------------------- */

const postModal =
document.getElementById("postModal");

const loginModal =
document.getElementById("loginModal");

const registerModal =
document.getElementById("registerModal");

const postsContainer =
document.getElementById("postsContainer");

/* --------------------------
   SAVE FUNCTIONS
-------------------------- */

function saveUsers() {

    localStorage.setItem(
        "blueverse_users",
        JSON.stringify(users)
    );
}

function savePosts() {

    localStorage.setItem(
        "blueverse_posts",
        JSON.stringify(posts)
    );
}

function saveCurrentUser() {

    localStorage.setItem(
        "blueverse_current_user",
        JSON.stringify(currentUser)
    );
}

/* --------------------------
   TOAST
-------------------------- */

function showToast(message) {

    const toast =
    document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}

/* --------------------------
   REGISTER
-------------------------- */

document
.getElementById("registerUser")
.addEventListener("click", () => {

    const username =
    document.getElementById("registerName").value;

    const email =
    document.getElementById("registerEmail").value;

    const password =
    document.getElementById("registerPassword").value;

    if (
        !username ||
        !email ||
        !password
    ) {

        showToast(
            "Fill all fields"
        );

        return;
    }

    const exists =
    users.find(
        user => user.email === email
    );

    if (exists) {

        showToast(
            "Email already registered"
        );

        return;
    }

    users.push({

        id: Date.now(),

        username,
        email,
        password,

        joined:
        new Date()
        .toLocaleDateString()

    });

    saveUsers();

    registerModal.style.display = "none";

    showToast(
        "Registration Successful"
    );
});

/* --------------------------
   LOGIN
-------------------------- */

document
.getElementById("loginUser")
.addEventListener("click", () => {

    const email =
    document.getElementById("loginEmail").value;

    const password =
    document.getElementById("loginPassword").value;

    const user =
    users.find(

        user =>
        user.email === email &&
        user.password === password

    );

    if (!user) {

        showToast(
            "Invalid Credentials"
        );

        return;
    }

    currentUser = user;

    saveCurrentUser();

    loginModal.style.display = "none";

    updateNavbar();

    showToast(
        "Welcome Back " +
        user.username
    );
});

/* --------------------------
   NAVBAR USER
-------------------------- */

function updateNavbar() {

    const loginBtn =
    document.getElementById("loginBtn");

    const registerBtn =
    document.getElementById("registerBtn");

    if (!loginBtn || !registerBtn)
        return;

    if (currentUser) {

        loginBtn.textContent =
        currentUser.username;

        registerBtn.textContent =
        "Logout";

        registerBtn.onclick = () => {

            currentUser = null;

            localStorage.removeItem(
                "blueverse_current_user"
            );

            location.reload();
        };

    } else {

        loginBtn.textContent =
        "Login";

        registerBtn.textContent =
        "Register";
    }
}

/* --------------------------
   OPEN MODALS
-------------------------- */

document
.getElementById("openCreatePost")
.addEventListener("click", () => {

    if (!currentUser) {

        showToast(
            "Login Required"
        );

        return;
    }

    postModal.style.display =
    "flex";
});

document
.getElementById("loginBtn")
.addEventListener("click", () => {

    if (!currentUser) {

        loginModal.style.display =
        "flex";
    }
});

document
.getElementById("registerBtn")
.addEventListener("click", () => {

    if (!currentUser) {

        registerModal.style.display =
        "flex";
    }
});

/* --------------------------
   CLOSE MODALS
-------------------------- */

document
.getElementById("closeModal")
.addEventListener("click", () => {

    postModal.style.display =
    "none";
});

document
.querySelector(".closeLogin")
.addEventListener("click", () => {

    loginModal.style.display =
    "none";
});

document
.querySelector(".closeRegister")
.addEventListener("click", () => {

    registerModal.style.display =
    "none";
});

/* --------------------------
   CREATE POST
-------------------------- */

document
.getElementById("publishPost")
.addEventListener("click", () => {

    const title =
    document.getElementById("postTitle").value;

    const category =
    document.getElementById("postCategory").value;

    const content =
    document.getElementById("postContent").value;

    if (
        !title ||
        !content
    ) {

        showToast(
            "Complete all fields"
        );

        return;
    }

    const post = {

        id: Date.now(),

        title,
        category,
        content,

        author:
        currentUser.username,

        userId:
        currentUser.id,

        date:
        new Date()
        .toLocaleDateString(),

        likes: 0,

        comments: [],

        bookmarks: 0,

        views: 0
    };

    posts.unshift(post);

    savePosts();

    renderPosts();

    updateStats();

    postModal.style.display =
    "none";

    showToast(
        "Blog Published"
    );
});

/* --------------------------
   DELETE POST
-------------------------- */

function deletePost(id) {

    const post =
    posts.find(
        p => p.id === id
    );

    if (
        currentUser &&
        post.userId === currentUser.id
    ) {

        posts =
        posts.filter(
            p => p.id !== id
        );

        savePosts();

        renderPosts();

        updateStats();

        showToast(
            "Post Deleted"
        );
    }
}

/* --------------------------
   EDIT POST
-------------------------- */

function editPost(id) {

    const post =
    posts.find(
        p => p.id === id
    );

    const newTitle =
    prompt(
        "Edit Title",
        post.title
    );

    const newContent =
    prompt(
        "Edit Content",
        post.content
    );

    if (
        newTitle &&
        newContent
    ) {

        post.title =
        newTitle;

        post.content =
        newContent;

        savePosts();

        renderPosts();

        showToast(
            "Post Updated"
        );
    }
}

/* --------------------------
   LIKE
-------------------------- */

function likePost(id) {

    const post =
    posts.find(
        p => p.id === id
    );

    post.likes++;

    savePosts();

    renderPosts();

    updateStats();
}

/* --------------------------
   BOOKMARK
-------------------------- */

function bookmarkPost(id) {

    const post =
    posts.find(
        p => p.id === id
    );

    post.bookmarks++;

    savePosts();

    renderPosts();

    updateStats();

    showToast(
        "Bookmarked"
    );
}

/* --------------------------
   COMMENTS
-------------------------- */

function addComment(id) {

    if (!currentUser) {

        showToast(
            "Login Required"
        );

        return;
    }

    const input =
    document.getElementById(
        "comment-" + id
    );

    const text =
    input.value.trim();

    if (!text)
        return;

    const post =
    posts.find(
        p => p.id === id
    );

    post.comments.push({

        username:
        currentUser.username,

        text
    });

    savePosts();

    renderPosts();

    updateStats();
}

/* --------------------------
   POSTS RENDER
-------------------------- */

function renderPosts() {

    if (!postsContainer)
        return;

    postsContainer.innerHTML = "";

    const empty =
    document.getElementById(
        "emptyState"
    );

    if (posts.length === 0) {

        empty.style.display =
        "block";

        return;
    }

    empty.style.display =
    "none";

    posts.forEach(post => {

        postsContainer.innerHTML += `

        <div class="post-card glass">

            <span class="post-category">
                ${post.category}
            </span>

            <h3 class="post-title">
                ${post.title}
            </h3>

            <p class="post-content">
                ${post.content}
            </p>

            <small>
                By ${post.author}
                • ${post.date}
            </small>

            <br><br>

            <div class="post-actions">

                <button
                class="action-btn"
                onclick="likePost(${post.id})">

                ❤️ ${post.likes}

                </button>

                <button
                class="action-btn"
                onclick="bookmarkPost(${post.id})">

                🔖 ${post.bookmarks}

                </button>

                ${
                currentUser &&
                post.userId === currentUser.id

                ?

                `
                <button
                class="action-btn"
                onclick="editPost(${post.id})">
                ✏️
                </button>

                <button
                class="action-btn"
                onclick="deletePost(${post.id})">
                🗑️
                </button>
                `

                : ""
                }

            </div>

            <br>

            <input
            id="comment-${post.id}"
            placeholder="Write comment..."
            >

            <br><br>

            <button
            class="primary-btn"
            onclick="addComment(${post.id})">

            Comment

            </button>

            <br><br>

            ${post.comments.map(comment => `

                <div
                style="
                margin-bottom:10px;
                padding:10px;
                border-radius:12px;
                background:rgba(255,255,255,.05);
                ">

                <b>
                ${comment.username}
                </b>

                <br>

                ${comment.text}

                </div>

            `).join("")}

        </div>

        `;
    });
}

/* --------------------------
   DASHBOARD STATS
-------------------------- */

function updateStats() {

    const totalPosts =
    posts.length;

    const totalLikes =
    posts.reduce(
        (sum, post) =>
        sum + post.likes,
        0
    );

    const totalBookmarks =
    posts.reduce(
        (sum, post) =>
        sum + post.bookmarks,
        0
    );

    const totalComments =
    posts.reduce(
        (sum, post) =>
        sum + post.comments.length,
        0
    );

    document.getElementById(
        "totalPosts"
    ).textContent =
    totalPosts;

    document.getElementById(
        "totalLikes"
    ).textContent =
    totalLikes;

    document.getElementById(
        "totalBookmarks"
    ).textContent =
    totalBookmarks;

    document.getElementById(
        "totalComments"
    ).textContent =
    totalComments;
}

/* --------------------------
   INIT
-------------------------- */

updateNavbar();

renderPosts();

updateStats();
