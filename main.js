document.addEventListener('DOMContentLoaded', function() {
    // Cek status login
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const username = localStorage.getItem('username');
        
        if (isLoggedIn !== 'true' || username !== 'vieqirara') {
            // Jika tidak login atau username tidak sesuai, redirect ke halaman login
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
    
    // Jalankan pengecekan login
    if (!checkLoginStatus()) {
        return;
    }
    
    // Navigasi antar halaman
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hapus class active dari semua link dan halaman
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            // Tambahkan class active ke link yang diklik
            this.classList.add('active');
            
            // Tampilkan halaman yang sesuai
            const pageId = this.getAttribute('data-page') + '-page';
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
            }
        });
    });
    
    // Tombol logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Apakah Anda yakin ingin logout?')) {
                // Hapus status login dari localStorage
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username');
                
                // Redirect ke halaman login
                window.location.href = 'index.html';
            }
        });
    }
    
    // Tombol di home page
    const uploadMediaBtn = document.getElementById('uploadMediaBtn');
    const spotifyBtn = document.getElementById('spotifyBtn');
    const notesBtn = document.getElementById('notesBtn');
    const albumBtn = document.getElementById('albumBtn');
    const watchPartyBtn = document.getElementById('watchPartyBtn');
    const commentsBtn = document.getElementById('commentsBtn');
    
    if (uploadMediaBtn) {
        uploadMediaBtn.addEventListener('click', function() {
            // Navigasi ke halaman media
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            document.querySelector('[data-page="media"]').classList.add('active');
            document.getElementById('media-page').classList.add('active');
        });
    }
    
    if (spotifyBtn) {
        spotifyBtn.addEventListener('click', function() {
            // Navigasi ke halaman music
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            document.querySelector('[data-page="music"]').classList.add('active');
            document.getElementById('music-page').classList.add('active');
        });
    }
    
    if (notesBtn) {
        notesBtn.addEventListener('click', function() {
            // Navigasi ke halaman notes
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            document.querySelector('[data-page="notes"]').classList.add('active');
            document.getElementById('notes-page').classList.add('active');
        });
    }
    
    if (albumBtn) {
        albumBtn.addEventListener('click', function() {
            // Navigasi ke halaman album
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            document.querySelector('[data-page="album"]').classList.add('active');
            document.getElementById('album-page').classList.add('active');
        });
    }
    
    if (watchPartyBtn) {
        watchPartyBtn.addEventListener('click', function() {
            // Navigasi ke halaman watch party
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            document.querySelector('[data-page="watch"]').classList.add('active');
            document.getElementById('watch-page').classList.add('active');
        });
    }
    
    if (commentsBtn) {
        commentsBtn.addEventListener('click', function() {
            // Tampilkan modal komentar
            const commentModal = document.getElementById('commentModal');
            if (commentModal) {
                commentModal.classList.add('active');
                loadComments();
            }
        });
    }
    
    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Close modal when clicking on close button
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Close modal when clicking outside of modal content
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Load recent posts
    function loadRecentPosts() {
        const postsContainer = document.getElementById('recentPosts');
        if (!postsContainer) return;
        
        // Get posts from localStorage
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        
        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Get only the 6 most recent posts
        const recentPosts = posts.slice(0, 6);
        
        // Clear container
        postsContainer.innerHTML = '';
        
        if (recentPosts.length === 0) {
            postsContainer.innerHTML = '<p class="no-posts">Belum ada postingan</p>';
            return;
        }
        
        // Add posts to container
        recentPosts.forEach(post => {
            const postCard = document.createElement('div');
            postCard.className = 'post-card';
            
            const isVideo = post.type === 'video';
            
            postCard.innerHTML = `
                ${isVideo ? 
                    `<video class="post-image" src="${post.url}" muted></video>` : 
                    `<img class="post-image" src="${post.url}" alt="${post.caption}">`
                }
                <div class="post-content">
                    <div class="post-header">
                        <div class="post-user">
                            <div class="post-avatar">👤</div>
                            <div class="post-username">${post.username}</div>
                        </div>
                        <div class="post-date">${formatDate(post.date)}</div>
                    </div>
                    <div class="post-caption">${post.caption}</div>
                    <div class="post-actions">
                        <button class="post-action like-btn ${post.liked ? 'liked' : ''}" data-id="${post.id}">
                            <i class="fas fa-heart"></i>
                            <span>${post.likes}</span>
                        </button>
                        <button class="post-action comment-btn" data-id="${post.id}">
                            <i class="fas fa-comment"></i>
                            <span>${post.comments.length}</span>
                        </button>
                    </div>
                </div>
            `;
            
            postsContainer.appendChild(postCard);
        });
        
        // Add event listeners to like buttons
        const likeButtons = postsContainer.querySelectorAll('.like-btn');
        likeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const postId = this.getAttribute('data-id');
                toggleLike(postId);
            });
        });
        
        // Add event listeners to comment buttons
        const commentButtons = postsContainer.querySelectorAll('.comment-btn');
        commentButtons.forEach(button => {
            button.addEventListener('click', function() {
                const postId = this.getAttribute('data-id');
                openCommentModal(postId);
            });
        });
    }
    
    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    }
    
    // Toggle like on a post
    function toggleLike(postId) {
        // Get posts from localStorage
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        
        // Find the post with the given ID
        const postIndex = posts.findIndex(post => post.id === postId);
        
        if (postIndex !== -1) {
            // Toggle like status
            posts[postIndex].liked = !posts[postIndex].liked;
            
            // Update like count
            if (posts[postIndex].liked) {
                posts[postIndex].likes++;
            } else {
                posts[postIndex].likes--;
            }
            
            // Save updated posts to localStorage
            localStorage.setItem('posts', JSON.stringify(posts));
            
            // Reload recent posts
            loadRecentPosts();
        }
    }
    
    // Open comment modal for a specific post
    function openCommentModal(postId) {
        const commentModal = document.getElementById('commentModal');
        if (commentModal) {
            commentModal.classList.add('active');
            loadComments(postId);
        }
    }
    
    // Load comments for a post
    function loadComments(postId = null) {
        const commentsList = document.getElementById('commentsList');
        if (!commentsList) return;
        
        // Get posts from localStorage
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        
        // If postId is provided, get comments for that post
        let comments = [];
        if (postId) {
            const post = posts.find(p => p.id === postId);
            if (post) {
                comments = post.comments;
            }
        } else {
            // Otherwise, get all comments from all posts
            posts.forEach(post => {
                comments = comments.concat(post.comments);
            });
        }
        
        // Sort comments by date (newest first)
        comments.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Clear container
        commentsList.innerHTML = '';
        
        if (comments.length === 0) {
            commentsList.innerHTML = '<p class="no-comments">Belum ada komentar</p>';
            return;
        }
        
        // Add comments to container
        comments.forEach(comment => {
            const commentItem = document.createElement('div');
            commentItem.className = 'comment-item';
            
            commentItem.innerHTML = `
                <div class="comment-header">
                    <div class="comment-user">
                        <div class="comment-avatar">👤</div>
                        <div class="comment-username">${comment.username}</div>
                    </div>
                    <div class="comment-date">${formatDate(comment.date)}</div>
                </div>
                <div class="comment-content">${comment.text}</div>
            `;
            
            commentsList.appendChild(commentItem);
        });
        
        // Set up comment form
        const commentForm = document.querySelector('.comment-form');
        if (commentForm) {
            commentForm.onsubmit = function(e) {
                e.preventDefault();
                
                const commentText = document.getElementById('commentText').value.trim();
                if (!commentText) return;
                
                // Create new comment
                const newComment = {
                    id: Date.now().toString(),
                    username: 'vieqirara',
                    text: commentText,
                    date: new Date().toISOString()
                };
                
                // If postId is provided, add comment to that post
                if (postId) {
                    const postIndex = posts.findIndex(p => p.id === postId);
                    if (postIndex !== -1) {
                        posts[postIndex].comments.push(newComment);
                        
                        // Update comment count
                        posts[postIndex].commentsCount = posts[postIndex].comments.length;
                        
                        // Save updated posts to localStorage
                        localStorage.setItem('posts', JSON.stringify(posts));
                        
                        // Reload comments
                        loadComments(postId);
                        
                        // Clear form
                        document.getElementById('commentText').value = '';
                        
                        // Reload recent posts to update comment count
                        loadRecentPosts();
                    }
                }
            };
        }
    }
    
    // Initialize the page
    loadRecentPosts();
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add liquid animation to cards on hover
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
});
