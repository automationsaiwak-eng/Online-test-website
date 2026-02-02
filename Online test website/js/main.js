// Main JavaScript File

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Online MCQs Platform Loaded');
    
    // Initialize Tooltips/Popovers if needed (Bootstrap)
    // const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    // const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
});

// Helper Function: Format Time
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Helper Function: Get Current User
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Helper Function: Logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Check Authentication State (for protected pages)
function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'auth.html';
        return null;
    }
    return user;
}
