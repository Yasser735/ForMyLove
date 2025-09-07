document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");
    const userDisplay = document.getElementById("user-display");

    // Username & Password yang benar
    const correctUsername = "vieqirara";
    const correctPassword = "030506020207";

    if (username === correctUsername && password === correctPassword) {
        errorMessage.style.display = "none";
        successMessage.style.display = "block";
        userDisplay.textContent = username;
    } else {
        successMessage.style.display = "none";
        errorMessage.style.display = "block";
    }
});
