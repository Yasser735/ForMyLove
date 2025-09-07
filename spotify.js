document.addEventListener('DOMContentLoaded', function() {
    // Spotify player functionality
    const spotifySearch = document.getElementById('spotifySearch');
    const spotifySearchBtn = document.getElementById('spotifySearchBtn');
    const spotifyPlayer = document.getElementById('spotifyPlayer');
    const playlistContainer = document.getElementById('playlistContainer');
    
    // Default playlists
    const defaultPlaylists = [
        {
            id: '1',
            name: 'Chill Vibes',
            description: 'Relaxing tunes',
            cover: '🎵',
            uri: 'spotify:playlist:37i9dQZF1DX4sWSpwq3LiO'
        },
        {
            id: '2',
            name: 'Workout Hits',
            description: 'Energy boosters',
            cover: '💪',
            uri: 'spotify:playlist:37i9dQZF1DX70RX9KlXZmX'
        },
        {
            id: '3',
            name: 'Focus Flow',
            description: 'Concentration music',
            cover: '🧠',
            uri: 'spotify:playlist:37i9dQZF1DX4sWSpwq3LiO'
        },
        {
            id: '4',
            name: 'Romantic Mix',
            description: 'Love songs',
            cover: '❤️',
            uri: 'spotify:playlist:37i9dQZF1DXcBWIGoYBM5M'
        }
    ];
    
    // Load playlists
    function loadPlaylists() {
        if (!playlistContainer) return;
        
        // Clear container
        playlistContainer.innerHTML = '';
        
        // Add playlists to container
        defaultPlaylists.forEach(playlist => {
            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';
            playlistItem.setAttribute('data-uri', playlist.uri);
            
            playlistItem.innerHTML = `
                <div class="playlist-cover">${playlist.cover}</div>
                <div class="playlist-info">
                    <h4>${playlist.name}</h4>
                    <p>${playlist.description}</p>
                </div>
            `;
            
            playlistContainer.appendChild(playlistItem);
            
            // Add click event to playlist item
            playlistItem.addEventListener('click', function() {
                const uri = this.getAttribute('data-uri');
                loadSpotifyPlayer(uri);
            });
        });
    }
    
    // Load Spotify player
    function loadSpotifyPlayer(uri) {
        if (!spotifyPlayer) return;
        
        // Create iframe for Spotify player
        const iframe = document.createElement('iframe');
        iframe.src = `https://open.spotify.com/embed/playlist/${uri.split(':')[2]}?utm_source=generator&theme=0`;
        iframe.width = '100%';
        iframe.height = '380';
        iframe.frameBorder = '0';
        iframe.allowFullscreen = '';
        iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
        
        // Clear previous player and add new one
        spotifyPlayer.innerHTML = '';
        spotifyPlayer.appendChild(iframe);
    }
    
    // Search functionality
    if (spotifySearchBtn && spotifySearch) {
        spotifySearchBtn.addEventListener('click', function() {
            const query = spotifySearch.value.trim();
            
            if (!query) {
                showNotification('Masukkan kata kunci pencarian atau link Spotify');
                return;
            }
            
            // Check if it's a Spotify URI or URL
            if (query.includes('spotify:') || query.includes('open.spotify.com')) {
                // Extract URI from URL if needed
                let uri = query;
                
                if (query.includes('open.spotify.com')) {
                    const urlParts = query.split('/');
                    const type = urlParts[urlParts.length - 2];
                    const id = urlParts[urlParts.length - 1].split('?')[0];
                    uri = `spotify:${type}:${id}`;
                }
                
                // Load player with URI
                loadSpotifyPlayer(uri);
            } else {
                // Search for tracks (in a real app, this would use Spotify Web API)
                showNotification(`Mencari: ${query}`);
                
                // For demo purposes, we'll just load a default playlist
                loadSpotifyPlayer('spotify:playlist:37i9dQZF1DX4sWSpwq3LiO');
            }
        });
        
        // Allow Enter key to trigger search
        spotifySearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                spotifySearchBtn.click();
            }
        });
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
    
    // Initialize playlists
    loadPlaylists();
    
    // Load default playlist
    loadSpotifyPlayer('spotify:playlist:37i9dQZF1DX4sWSpwq3LiO');
});
