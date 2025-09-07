document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    // Enkripsi sederhana (hanya untuk demo, tidak aman untuk produksi)
    function encryptData(data) {
        // Menggunakan Base64 encoding sederhana
        return btoa(data);
    }
    
    function decryptData(encryptedData) {
        // Menggunakan Base64 decoding sederhana
        return atob(encryptedData);
    }
    
    // Validasi login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Username dan password yang dienkripsi
        const encryptedUsername = encryptData('vieqirara');
        const encryptedPassword = encryptData('030506020207');
        
        // Enkripsi input user
        const encryptedInputUsername = encryptData(username);
        const encryptedInputPassword = encryptData(password);
        
        // Validasi
        if (encryptedInputUsername === encryptedUsername && encryptedInputPassword === encryptedPassword) {
            // Login berhasil
            errorMessage.classList.remove('show');
            
            // Simpan status login di localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            
            // Redirect ke dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        } else {
            // Login gagal
            errorMessage.classList.add('show');
            
            // Reset form
            loginForm.reset();
            
            // Sembunyikan pesan error setelah 3 detik
            setTimeout(() => {
                errorMessage.classList.remove('show');
            }, 3000);
        }
    });
    
    // Cek apakah user sudah login
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (isLoggedIn === 'true') {
            // Jika sudah login, redirect ke dashboard
            window.location.href = 'dashboard.html';
        }
    }
    
    // Panggil fungsi checkLoginStatus
    checkLoginStatus();
});
