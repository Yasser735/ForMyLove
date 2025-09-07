document.addEventListener('DOMContentLoaded', function() {
    // Comments functionality
    const commentsList = document.getElementById('commentsList');
    const commentText = document.getElementById('commentText');
    const postCommentBtn = document.getElementById('postCommentBtn');
    
    // Load comments
    function loadComments() {
        if (!commentsList) return;
        
        // Get posts from localStorage
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        
        // Get all comments from all posts
        let comments = [];
        posts.forEach(post => {
            comments = comments.concat(post.comments);
        });
        
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
    }
    
    // Post comment
    if (postCommentBtn && commentText) {
        postCommentBtn.addEventListener('click', function() {
            const text = commentText.value.trim();
            
            if (!text) {
                showNotification('Komentar tidak boleh kosong');
                return;
            }
            
            // Create new comment
            const newComment = {
                id: Date.now().toString(),
                username: 'vieqirara',
                text: text,
                date: new Date().toISOString()
            };
            
            // Get posts from localStorage
            const posts = JSON.parse(localStorage.getItem('posts')) || [];
            
            // Add comment to the first post (for demo purposes)
            if (posts.length > 0) {
                posts[0].comments.push(newComment);
                posts[0].commentsCount = posts[0].comments.length;
                
                // Save updated posts to localStorage
                localStorage.setItem('posts', JSON.stringify(posts));
                
                // Clear comment input
                commentText.value = '';
                
                // Reload comments
                loadComments();
                
                // Show success message
                showNotification('Komentar berhasil diposting!');
            } else {
                // If there are no posts, create a new one with the comment
                const newPost = {
                    id: Date.now().toString(),
                    username: 'vieqirara',
                    type: 'text',
                    url: '',
                    caption: 'Posting untuk komentar',
                    tags: [],
                    date: new Date().toISOString(),
                    likes: 0,
                    liked: false,
                    comments: [newComment],
                    commentsCount: 1
                };
                
                posts.push(newPost);
                
                // Save posts to localStorage
                localStorage.setItem('posts', JSON.stringify(posts));
                
                // Clear comment input
                commentText.value = '';
                
                // Reload comments
                loadComments();
                
                // Show success message
                showNotification('Komentar berhasil diposting!');
            }
        });
        
        // Allow Enter key to post comment
        commentText.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                postCommentBtn.click();
            }
        });
    }
    
    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('id-ID', options);
    }
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 15px 25px;
            border-radius: 30px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 3000;
            animation: slideUp 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add CSS for notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideDown {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(100px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize comments
    loadComments();
});
