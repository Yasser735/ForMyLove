document.addEventListener('DOMContentLoaded', function() {
    // Album functionality
    const newAlbumBtn = document.getElementById('newAlbumBtn');
    const albumModal = document.getElementById('albumModal');
    const albumName = document.getElementById('albumName');
    const albumDescription = document.getElementById('albumDescription');
    const albumCover = document.getElementById('albumCover');
    const createAlbumBtn = document.getElementById('createAlbumBtn');
    const albumsContainer = document.getElementById('albumsContainer');
    
    // Open new album modal
    if (newAlbumBtn) {
        newAlbumBtn.addEventListener('click', function() {
            if (albumModal) {
                albumModal.classList.add('active');
                
                // Reset form
                albumName.value = '';
                albumDescription.value = '';
                albumCover.value = '';
            }
        });
    }
    
    // Album cover upload
    if (albumCover) {
        albumCover.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const preview = document.querySelector('.album-cover-upload');
                    if (preview) {
                        preview.style.backgroundImage = `url(${e.target.result})`;
                        preview.style.backgroundSize = 'cover';
                        preview.style.backgroundPosition = 'center';
                        preview.innerHTML = '';
                    }
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Create album
    if (createAlbumBtn) {
        createAlbumBtn.addEventListener('click', function() {
            const name = albumName.value.trim();
            const description = albumDescription.value.trim();
            
            if (!name) {
                showNotification('Nama album tidak boleh kosong');
                return;
            }
            
            // Get albums from localStorage or initialize empty array
            const albums = JSON.parse(localStorage.getItem('albums')) || [];
            
            // Create new album
            const newAlbum = {
                id: Date.now().toString(),
                name: name,
                description: description,
                cover: null, // Will be set if a cover image is uploaded
                photos: [],
                created: new Date().toISOString()
            };
            
            // Check if cover image is uploaded
            if (albumCover.files.length > 0) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    newAlbum.cover = e.target.result;
                    
                    // Add to albums array
                    albums.push(newAlbum);
                    
                    // Save albums to localStorage
                    localStorage.setItem('albums', JSON.stringify(albums));
                    
                    // Close modal
                    albumModal.classList.remove('active');
                    
                    // Reload albums
                    loadAlbums();
                    
                    // Show success message
                    showNotification('Album berhasil dibuat!');
                };
                
                reader.readAsDataURL(albumCover.files[0]);
            } else {
                // Add to albums array without cover
                albums.push(newAlbum);
                
                // Save albums to localStorage
                localStorage.setItem('albums', JSON.stringify(albums));
                
                // Close modal
                albumModal.classList.remove('active');
                
                // Reload albums
                loadAlbums();
                
                // Show success message
                showNotification('Album berhasil dibuat!');
            }
        });
    }
    
    // Load albums
    function loadAlbums() {
        if (!albumsContainer) return;
        
        // Get albums from localStorage
        const albums = JSON.parse(localStorage.getItem('albums')) || [];
        
        // Sort by date (newest first)
        albums.sort((a, b) => new Date(b.created) - new Date(a.created));
        
        // Clear container
        albumsContainer.innerHTML = '';
        
        if (albums.length === 0) {
            albumsContainer.innerHTML = '<p class="no-albums">Belum ada album</p>';
            return;
        }
        
        // Add albums to container
        albums.forEach(album => {
            const albumCard = document.createElement('div');
            albumCard.className = 'album-card';
            
            albumCard.innerHTML = `
                <div class="album-cover">
                    ${album.cover ? 
                        `<img src="${album.cover}" alt="${album.name}">` : 
                        `<div class="album-cover-placeholder">📷</div>`
                    }
                </div>
                <div class="album-info">
                    <div class="album-name">${album.name}</div>
                    <div class="album-description">${album.description || 'Tanpa deskripsi'}</div>
                    <div class="album-stats">
                        <span>${album.photos.length} Foto</span>
                        <span>${formatDate(album.created)}</span>
                    </div>
                </div>
                <div class="album-actions">
                    <button class="glass-btn view-album-btn" data-id="${album.id}">
                        <i class="fas fa-eye"></i> Lihat
                    </button>
                    <button class="glass-btn edit-album-btn" data-id="${album.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="glass-btn delete-album-btn" data-id="${album.id}">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            `;
            
            albumsContainer.appendChild(albumCard);
            
            // Add event listeners to action buttons
            const viewBtn = albumCard.querySelector('.view-album-btn');
            const editBtn = albumCard.querySelector('.edit-album-btn');
            const deleteBtn = albumCard.querySelector('.delete-album-btn');
            
            viewBtn.addEventListener('click', function() {
                const albumId = this.getAttribute('data-id');
                viewAlbum(albumId);
            });
            
            editBtn.addEventListener('click', function() {
                const albumId = this.getAttribute('data-id');
                editAlbum(albumId);
            });
            
            deleteBtn.addEventListener('click', function() {
                const albumId = this.getAttribute('data-id');
                deleteAlbum(albumId);
            });
        });
    }
    
    // View album
    function viewAlbum(albumId) {
        // Get albums from localStorage
        const albums = JSON.parse(localStorage.getItem('albums')) || [];
        
        // Find the album with the given ID
        const album = albums.find(a => a.id === albumId);
        
        if (album) {
            // Create album view modal
            const albumViewModal = document.createElement('div');
            albumViewModal.className = 'modal active';
            albumViewModal.innerHTML = `
                <div class="modal-content glass-card">
                    <div class="modal-header">
                        <h3>${album.name}</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="album-info">
                            <p>${album.description || 'Tanpa deskripsi'}</p>
                            <p>Dibuat: ${formatDate(album.created)}</p>
                        </div>
                        <div class="album-photos">
                            <h4>Foto (${album.photos.length})</h4>
                            <div class="album-photos-grid">
                                ${album.photos.length > 0 ? 
                                    album.photos.map(photo => `
                                        <div class="album-photo">
                                            <img src="${photo.url}" alt="${photo.caption || 'Foto'}">
                                            <div class="photo-caption">${photo.caption || ''}</div>
                                        </div>
                                    `).join('') : 
                                    '<p class="no-photos">Belum ada foto di album ini</p>'
                                }
                            </div>
                        </div>
                        <div class="album-actions">
                            <button class="glass-btn add-photo-btn" data-id="${album.id}">
                                <i class="fas fa-plus"></i> Tambah Foto
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(albumViewModal);
            
            // Add event listener to close button
            const closeBtn = albumViewModal.querySelector('.close-modal');
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(albumViewModal);
            });
            
            // Add event listener to add photo button
            const addPhotoBtn = albumViewModal.querySelector('.add-photo-btn');
            addPhotoBtn.addEventListener('click', function() {
                const albumId = this.getAttribute('data-id');
                addPhotoToAlbum(albumId, albumViewModal);
            });
            
            // Close modal when clicking outside
            albumViewModal.addEventListener('click', function(e) {
                if (e.target === albumViewModal) {
                    document.body.removeChild(albumViewModal);
                }
            });
        }
    }
    
    // Add photo to album
    function addPhotoToAlbum(albumId, modal) {
        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Get albums from localStorage
                    const albums = JSON.parse(localStorage.getItem('albums')) || [];
                    
                    // Find the album with the given ID
                    const albumIndex = albums.findIndex(a => a.id === albumId);
                    
                    if (albumIndex !== -1) {
                        // Create new photo object
                        const newPhoto = {
                            id: Date.now().toString(),
                            url: e.target.result,
                            caption: '',
                            added: new Date().toISOString()
                        };
                        
                        // Add photo to album
                        albums[albumIndex].photos.push(newPhoto);
                        
                        // Save albums to localStorage
                        localStorage.setItem('albums', JSON.stringify(albums));
                        
                        // Close modal
                        document.body.removeChild(modal);
                        
                        // Reload albums
                        loadAlbums();
                        
                        // Show success message
                        showNotification('Foto berhasil ditambahkan ke album!');
                    }
                };
                
                reader.readAsDataURL(file);
            }
        });
        
        // Trigger file input click
        fileInput.click();
    }
    
    // Edit album
    function editAlbum(albumId) {
        // Get albums from localStorage
        const albums = JSON.parse(localStorage.getItem('albums')) || [];
        
        // Find the album with the given ID
        const album = albums.find(a => a.id === albumId);
        
        if (album) {
            // Open modal with album data
            if (albumModal) {
                albumModal.classList.add('active');
                
                // Fill form with album data
                albumName.value = album.name;
                albumDescription.value = album.description;
                
                // Change create button to update button
                createAlbumBtn.textContent = 'Update Album';
                createAlbumBtn.setAttribute('data-id', albumId);
            }
        }
    }
    
    // Delete album
    function deleteAlbum(albumId) {
        if (confirm('Apakah Anda yakin ingin menghapus album ini?')) {
            // Get albums from localStorage
            const albums = JSON.parse(localStorage.getItem('albums')) || [];
            
            // Filter out the album with the given ID
            const updatedAlbums = albums.filter(album => album.id !== albumId);
            
            // Save updated albums to localStorage
            localStorage.setItem('albums', JSON.stringify(updatedAlbums));
            
            // Reload albums
            loadAlbums();
            
            // Show success message
            showNotification('Album berhasil dihapus!');
        }
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
        
        .album-photos-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        .album-photo {
            position: relative;
            border-radius: 10px;
            overflow: hidden;
            aspect-ratio: 1/1;
        }
        
        .album-photo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .photo-caption {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
            color: white;
            padding: 10px;
            font-size: 12px;
        }
        
        .no-photos {
            grid-column: 1 / -1;
            text-align: center;
            padding: 20px;
            color: var(--light-text);
        }
        
        .album-cover-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: var(--light-text);
            background-color: rgba(255, 255, 255, 0.3);
        }
    `;
    document.head.appendChild(style);
    
    // Initialize albums
    loadAlbums();
});
