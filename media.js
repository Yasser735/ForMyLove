document.addEventListener('DOMContentLoaded', function() {
    // Media upload functionality
    const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
    const uploadVideoBtn = document.getElementById('uploadVideoBtn');
    const uploadModal = document.getElementById('uploadModal');
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const uploadPreview = document.getElementById('uploadPreview');
    const uploadSubmitBtn = document.getElementById('uploadSubmitBtn');
    const uploadCaption = document.getElementById('uploadCaption');
    const uploadTags = document.getElementById('uploadTags');
    
    // Media tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const mediaTabs = document.querySelectorAll('.media-tab');
    
    // Open upload modal
    if (uploadPhotoBtn) {
        uploadPhotoBtn.addEventListener('click', function() {
            if (uploadModal) {
                uploadModal.classList.add('active');
                fileInput.setAttribute('accept', 'image/*');
            }
        });
    }
    
    if (uploadVideoBtn) {
        uploadVideoBtn.addEventListener('click', function() {
            if (uploadModal) {
                uploadModal.classList.add('active');
                fileInput.setAttribute('accept', 'video/*');
            }
        });
    }
    
    // Click on upload area to open file dialog
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    // Drag and drop functionality
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.backgroundColor = 'rgba(255, 182, 193, 0.2)';
        });
        
        uploadArea.addEventListener('dragleave', function() {
            uploadArea.style.backgroundColor = '';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.backgroundColor = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFiles(files);
            }
        });
    }
    
    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                handleFiles(this.files);
            }
        });
    }
    
    // Handle selected files
    function handleFiles(files) {
        // Clear previous preview
        uploadPreview.innerHTML = '';
        
        // Add each file to preview
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                
                const isVideo = file.type.startsWith('video/');
                
                if (isVideo) {
                    previewItem.innerHTML = `
                        <video src="${e.target.result}" muted></video>
                        <div class="remove-preview">&times;</div>
                    `;
                } else {
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <div class="remove-preview">&times;</div>
                    `;
                }
                
                uploadPreview.appendChild(previewItem);
                
                // Add event listener to remove button
                const removeBtn = previewItem.querySelector('.remove-preview');
                removeBtn.addEventListener('click', function() {
                    previewItem.remove();
                });
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    // Submit upload
    if (uploadSubmitBtn) {
        uploadSubmitBtn.addEventListener('click', function() {
            const previewItems = uploadPreview.querySelectorAll('.preview-item');
            
            if (previewItems.length === 0) {
                alert('Pilih setidaknya satu file untuk diupload');
                return;
            }
            
            const caption = uploadCaption.value.trim();
            const tags = uploadTags.value.trim();
            
            // Get posts from localStorage or initialize empty array
            const posts = JSON.parse(localStorage.getItem('posts')) || [];
            
            // Process each file
            previewItems.forEach((item, index) => {
                const mediaElement = item.querySelector('img, video');
                const mediaUrl = mediaElement.src;
                const isVideo = mediaElement.tagName === 'VIDEO';
                
                // Create new post
                const newPost = {
                    id: Date.now().toString() + index,
                    username: 'vieqirara',
                    type: isVideo ? 'video' : 'image',
                    url: mediaUrl,
                    caption: caption,
                    tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
                    date: new Date().toISOString(),
                    likes: 0,
                    liked: false,
                    comments: [],
                    commentsCount: 0
                };
                
                // Add to posts array
                posts.push(newPost);
            });
            
            // Save posts to localStorage
            localStorage.setItem('posts', JSON.stringify(posts));
            
            // Close modal
            uploadModal.classList.remove('active');
            
            // Reset form
            fileInput.value = '';
            uploadPreview.innerHTML = '';
            uploadCaption.value = '';
            uploadTags.value = '';
            
            // Reload media galleries
            loadPhotos();
            loadVideos();
            
            // Show success message
            showNotification('Media berhasil diupload!');
        });
    }
    
    // Media tabs functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs and buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            mediaTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked button and corresponding tab
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab') + '-tab';
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
    
    // Load photos
    function loadPhotos() {
        const photosGrid = document.getElementById('photosGrid');
        if (!photosGrid) return;
        
        // Get posts from localStorage
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        
        // Filter only image posts
        const imagePosts = posts.filter(post => post.type === 'image');
        
        // Sort by date (newest first)
        imagePosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Clear container
        photosGrid.innerHTML = '';
        
        if (imagePosts.length === 0) {
            photosGrid.innerHTML = '<p class="no-media">Belum ada foto</p>';
            return;
        }
        
        // Add photos to grid
        imagePosts.forEach(post => {
            const mediaItem = document.createElement('div');
            mediaItem.className = 'media-item';
            
            mediaItem.innerHTML = `
                <img src="${post.url}" alt="${post.caption}">
                <div class="media-overlay">
                    <div class="media-caption">${post.caption || 'Tanpa caption'}</div>
                    <div class="media-date">${formatDate(post.date)}</div>
                </div>
            `;
            
            photosGrid.appendChild(mediaItem);
        });
    }
    
    // Load videos
    function loadVideos() {
        const videosGrid = document.getElementById('videosGrid');
        if (!videosGrid) return;
        
        // Get posts from localStorage
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        
        // Filter only video posts
        const videoPosts = posts.filter(post => post.type === 'video');
        
        // Sort by date (newest first)
        videoPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Clear container
        videosGrid.innerHTML = '';
        
        if (videoPosts.length === 0) {
            videosGrid.innerHTML = '<p class="no-media">Belum ada video</p>';
            return;
        }
        
        // Add videos to grid
        videoPosts.forEach(post => {
            const mediaItem = document.createElement('div');
            mediaItem.className = 'media-item';
            
            mediaItem.innerHTML = `
                <video src="${post.url}" muted></video>
                <div class="media-overlay">
                    <div class="media-caption">${post.caption || 'Tanpa caption'}</div>
                    <div class="media-date">${formatDate(post.date)}</div>
                </div>
            `;
            
            videosGrid.appendChild(mediaItem);
        });
    }
    
    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
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
    
    // Initialize media galleries
    loadPhotos();
    loadVideos();
});
