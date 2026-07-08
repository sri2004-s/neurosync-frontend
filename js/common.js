// =====================================================
// NeuroSync Common JavaScript
// Shared Utilities for All Pages
// =====================================================

// =====================================================
// API Configuration
// =====================================================

const BASE_URL = "https://neurosync-backend-2w4c.onrender.com";

// =====================================================
// Create Loading Overlay Automatically
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    if (!document.getElementById("loadingOverlay")) {

        const overlay = document.createElement("div");

        overlay.id = "loadingOverlay";

        overlay.innerHTML = `
            <div class="loader-box">

                <div class="loader-logo">
                    <i class="fa-solid fa-brain"></i>
                </div>

                <h2>NeuroSync</h2>

                <div class="spinner"></div>

                <p>Please wait...</p>

            </div>
        `;

        document.body.appendChild(overlay);

    }

});

// =====================================================
// Loading Functions
// =====================================================

function showLoader() {

    const loader = document.getElementById("loadingOverlay");

    if (loader) {

        loader.style.display = "flex";

    }

}

function hideLoader() {

    const loader = document.getElementById("loadingOverlay");

    if (loader) {

        loader.style.display = "none";

    }

}

// =====================================================
// Toast Notification
// =====================================================

function showToast(message, type = "info") {

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3000);

}

// =====================================================
// Local Storage Helpers
// =====================================================

function saveUser(data) {

    localStorage.setItem("id", data.id);
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    localStorage.setItem("role", data.role);

}

function getToken() {

    return localStorage.getItem("token");

}

function getEmail() {

    return localStorage.getItem("email");

}

function getRole() {

    return localStorage.getItem("role");

}

function getId() {

    return localStorage.getItem("id");

}

// =====================================================
// Logout
// =====================================================

function logout() {

    localStorage.clear();

    showToast("Logged out successfully", "success");

    setTimeout(() => {

        window.location.href = "index.html";

    }, 1000);

}

// =====================================================
// Protect Pages
// =====================================================

function requireLogin() {

    if (!getToken()) {

        window.location.href = "index.html";

    }

}

// =====================================================
// Role Check
// =====================================================

function requireRole(...roles) {

    const role = getRole();

    if (!roles.includes(role)) {

        showToast("Access Denied", "error");

        setTimeout(() => {

            window.location.href = "dashboard.html";

        }, 1000);

    }

}

// =====================================================
// Set Logged User
// =====================================================

function setUserInfo() {

    const emailElement = document.getElementById("userEmail");

    const roleElement = document.getElementById("userRole");

    if (emailElement) {

        emailElement.textContent = getEmail() || "Unknown User";

    }

    if (roleElement) {

        roleElement.textContent = getRole() || "Unknown Role";

    }

}

// =====================================================
// Sidebar Navigation
// =====================================================

function setupSidebar() {

    const logoutButton = document.getElementById("logout");

    if (logoutButton) {

        logoutButton.addEventListener("click", logout);

    }

}

// =====================================================
// Common Initialization
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    setupSidebar();

});
// =====================================================
// Page Access Control
// =====================================================

function checkPageAccess(allowedRoles) {

    const role = getRole();

    if (!allowedRoles.includes(role)) {

        alert("Access Denied");

        window.location.href = "dashboard.html";

    }

}