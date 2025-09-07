document.addEventListener('DOMContentLoaded', function() {
    // Notes functionality
    const newNoteBtn = document.getElementById('newNoteBtn');
    const noteModal = document.getElementById('noteModal');
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');
    const noteDate = document.getElementById('noteDate');
    const saveNoteBtn = document.getElementById('saveNoteBtn');
    const notesContainer = document.getElementById('notesContainer');
    
    // Color options
    const colorOptions = document.querySelectorAll('.color-option');
    let selectedColor = '#FFB6C1';
    
    // Open new note modal
    if (newNoteBtn) {
        newNoteBtn.addEventListener('click', function() {
            if (noteModal) {
                noteModal.classList.add('active');
                
                // Reset form
                noteTitle.value = '';
                noteContent.value = '';
                noteDate.value = new Date().toISOString().split('T')[0];
                
                // Reset color selection
                colorOptions.forEach(option => {
                    option.classList.remove('selected');
                });
                colorOptions[0].classList.add('selected');
                selectedColor = colorOptions[0].getAttribute('data-color');
            }
        });
    }
    
    // Color selection
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update selected color
            selectedColor = this.getAttribute('data-color');
        });
    });
    
    // Save note
    if (saveNoteBtn) {
        saveNoteBtn.addEventListener('click', function() {
            const title = noteTitle.value.trim();
            const content = noteContent.value.trim();
            const date = noteDate.value;
            
            if (!title || !content) {
                showNotification('Judul dan isi note tidak boleh kosong');
                return;
            }
            
            // Get notes from localStorage or initialize empty array
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            
            // Create new note
            const newNote = {
                id: Date.now().toString(),
                title: title,
                content: content,
                date: date,
                color: selectedColor,
                created: new Date().toISOString()
            };
            
            // Add to notes array
            notes.push(newNote);
            
            // Save notes to localStorage
            localStorage.setItem('notes', JSON.stringify(notes));
            
            // Close modal
            noteModal.classList.remove('active');
            
            // Reload notes
            loadNotes();
            
            // Show success message
            showNotification('Note berhasil disimpan!');
        });
    }
    
    // Load notes
    function loadNotes() {
        if (!notesContainer) return;
        
        // Get notes from localStorage
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        
        // Sort by date (newest first)
        notes.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Clear container
        notesContainer.innerHTML = '';
        
        if (notes.length === 0) {
            notesContainer.innerHTML = '<p class="no-notes">Belum ada notes</p>';
            return;
        }
        
        // Add notes to container
        notes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.className = 'note-card';
            noteCard.style.backgroundColor = note.color + '40'; // Add transparency
            
            noteCard.innerHTML = `
                <div class="note-header">
                    <div class="note-title">${note.title}</div>
                    <div class="note-date">${formatDate(note.date)}</div>
                </div>
                <div class="note-content">${note.content}</div>
                <div class="note-actions">
                    <button class="note-action edit-btn" data-id="${note.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="note-action delete-btn" data-id="${note.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            notesContainer.appendChild(noteCard);
            
            // Add event listeners to action buttons
            const editBtn = noteCard.querySelector('.edit-btn');
            const deleteBtn = noteCard.querySelector('.delete-btn');
            
            editBtn.addEventListener('click', function() {
                const noteId = this.getAttribute('data-id');
                editNote(noteId);
            });
            
            deleteBtn.addEventListener('click', function() {
                const noteId = this.getAttribute('data-id');
                deleteNote(noteId);
            });
        });
    }
    
    // Edit note
    function editNote(noteId) {
        // Get notes from localStorage
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        
        // Find the note with the given ID
        const note = notes.find(n => n.id === noteId);
        
        if (note) {
            // Open modal with note data
            if (noteModal) {
                noteModal.classList.add('active');
                
                // Fill form with note data
                noteTitle.value = note.title;
                noteContent.value = note.content;
                noteDate.value = note.date;
                
                // Set color selection
                colorOptions.forEach(option => {
                    option.classList.remove('selected');
                    if (option.getAttribute('data-color') === note.color) {
                        option.classList.add('selected');
                        selectedColor = note.color;
                    }
                });
                
                // Change save button to update button
                saveNoteBtn.textContent = 'Update Note';
                saveNoteBtn.setAttribute('data-id', noteId);
            }
        }
    }
    
    // Delete note
    function deleteNote(noteId) {
        if (confirm('Apakah Anda yakin ingin menghapus note ini?')) {
            // Get notes from localStorage
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            
            // Filter out the note with the given ID
            const updatedNotes = notes.filter(note => note.id !== noteId);
            
            // Save updated notes to localStorage
            localStorage.setItem('notes', JSON.stringify(updatedNotes));
            
            // Reload notes
            loadNotes();
            
            // Show success message
            showNotification('Note berhasil dihapus!');
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
    `;
    document.head.appendChild(style);
    
    // Initialize notes
    loadNotes();
});
