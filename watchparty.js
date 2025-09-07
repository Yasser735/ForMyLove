document.addEventListener('DOMContentLoaded', function() {
    // Watch party functionality
    const driveLink = document.getElementById('driveLink');
    const roomName = document.getElementById('roomName');
    const createRoomBtn = document.getElementById('createRoomBtn');
    const watchPartyPlayer = document.getElementById('watchPartyPlayer');
    const videoPlayer = document.getElementById('videoPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const syncBtn = document.getElementById('syncBtn');
    const currentTimeSpan = document.getElementById('currentTime');
    const durationSpan = document.getElementById('duration');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatMessages = document.getElementById('chatMessages');
    
    // Create room
    if (createRoomBtn) {
        createRoomBtn.addEventListener('click', function() {
            const link = driveLink.value.trim();
            const name = roomName.value.trim();
            
            if (!link) {
                showNotification('Masukkan link Google Drive');
                return;
            }
            
            if (!name) {
                showNotification('Masukkan nama room');
                return;
            }
            
            // Convert Google Drive link to embeddable format
            const embedLink = convertDriveLinkToEmbed(link);
            
            if (!embedLink) {
                showNotification('Link Google Drive tidak valid');
                return;
            }
            
            // Set video source
            if (videoPlayer) {
                videoPlayer.src = embedLink;
            }
            
            // Show player
            if (watchPartyPlayer) {
                watchPartyPlayer.style.display = 'block';
            }
            
            // Show success message
            showNotification(`Room "${name}" berhasil dibuat!`);
            
            // Initialize video player events
            initializeVideoPlayer();
            
            // Initialize chat
            initializeChat();
        });
    }
    
    // Convert Google Drive link to embeddable format
    function convertDriveLinkToEmbed(link) {
        // Check if it's a Google Drive link
        if (link.includes('drive.google.com')) {
            // Extract file ID from the link
            const match = link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
                const fileId = match[1];
                return `https://drive.google.com/file/d/${fileId}/preview`;
            }
        }
        
        return null;
    }
    
    // Initialize video player
    function initializeVideoPlayer() {
        if (!videoPlayer) return;
        
        // Set up play/pause button
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', function() {
                if (videoPlayer.paused) {
                    videoPlayer.play();
                    this.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    videoPlayer.pause();
                    this.innerHTML = '<i class="fas fa-play"></i>';
                }
            });
        }
        
        // Set up sync button
        if (syncBtn) {
            syncBtn.addEventListener('click', function() {
                // In a real app, this would sync with other users
                showNotification('Sinkronisasi dengan pengguna lain...');
                
                // For demo purposes, just seek to beginning
                videoPlayer.currentTime = 0;
                videoPlayer.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            });
        }
        
        // Update time display
        videoPlayer.addEventListener('timeupdate', function() {
            if (currentTimeSpan) {
                currentTimeSpan.textContent = formatTime(videoPlayer.currentTime);
            }
        });
        
        // Update duration when metadata is loaded
        videoPlayer.addEventListener('loadedmetadata', function() {
            if (durationSpan) {
                durationSpan.textContent = formatTime(videoPlayer.duration);
            }
        });
    }
    
    // Initialize chat
    function initializeChat() {
        if (!chatMessages) return;
        
        // Add welcome message
        addChatMessage('System', 'Selamat datang di watch party!', true);
        
        // Set up send button
        if (sendChatBtn && chatInput) {
            sendChatBtn.addEventListener('click', function() {
                sendMessage();
            });
            
            // Allow Enter key to send message
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }
    
    // Send chat message
    function sendMessage() {
        if (!chatInput) return;
        
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        // Add message to chat
        addChatMessage('vieqirara', message);
        
        // Clear input
        chatInput.value = '';
        
        // In a real app, this would send the message to a server
        // For demo purposes, we'll just simulate a response after a delay
        setTimeout(() => {
            const responses = [
                'Bagus banget!',
                'Saya suka ini!',
                'Lanjutkan!',
                'Wah keren',
                'Mantap!'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addChatMessage('User', randomResponse);
        }, 2000);
    }
    
    // Add chat message
    function addChatMessage(username, message, isSystem = false) {
        if (!chatMessages) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        messageElement.innerHTML = `
            <div class="chat-message-header">
                <div class="chat-username">${username}</div>
                <div class="chat-time">${timeString}</div>
            </div>
            <div class="chat-message-content">${message}</div>
        `;
        
        if (isSystem) {
            messageElement.style.backgroundColor = 'rgba(255, 182, 193, 0.2)';
        }
        
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Format time for display
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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
});
