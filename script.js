document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Mencegah reload halaman
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-message');
    
    // Validasi login
    if(username === "vieqirara" && password === "030506020207") {
        // Login berhasil
        errorMsg.style.display = 'none';
        
        // Tampilkan pesan sukses
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = 'Login berhasil! Selamat datang, vieqirara!';
        successDiv.style.cssText = `
            background: #06d6a0;
            color: white;
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
            font-weight: 600;
        `;
        
        document.querySelector('.login-box').appendChild(successDiv);
        
        // Redirect setelah 2 detik
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 2000);
        
    } else {
        // Login gagal
        errorMsg.style.display = 'block';
        
        // Reset form
        document.getElementById('loginForm').reset();
        
        // Sembunyikan pesan error setelah 3 detik
        setTimeout(() => {
            errorMsg.style.display = 'none';
        }, 3000);
    }
});
