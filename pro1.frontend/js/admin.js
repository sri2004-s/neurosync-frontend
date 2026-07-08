// =====================================================
// NeuroSync Admin Module
// Part 1
// =====================================================

const ADMIN_API = BASE_URL + "/api/users";

// =====================================================
// Initialize
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    requireLogin();

    checkPageAccess([
        "SYSTEM_ADMIN"
    ]);

    setupSidebar();

    loadAdmin();

});

// =====================================================
// Sidebar
// =====================================================

function setupSidebar() {

    const logout = document.getElementById("logout");

    if (logout) {

        logout.onclick = () => {

            localStorage.clear();

            window.location.href = "index.html";

        };

    }

}

// =====================================================
// Display Admin Information
// =====================================================

function loadAdmin() {

    const email = localStorage.getItem("email");

    const role = localStorage.getItem("role");

    document.getElementById("adminMessage").innerHTML =

        `Welcome <b>${email}</b> (${role})`;

}

// =====================================================
// Check Backend Server
// =====================================================

async function checkServer() {

    try {

        showLoader();

        const response = await fetch(

            ADMIN_API,

            {

                headers: {

                    "Authorization": "Bearer " + getToken()

                }

            }

        );

        hideLoader();

        if (!response.ok) {

            throw new Error();

        }

        document.getElementById("serverStatus").innerText =

            "Online";

    }

    catch (error) {

        hideLoader();

        document.getElementById("serverStatus").innerText =

            "Offline";

        console.error(error);

    }

}
// =====================================================
// Admin Module
// Part 2
// =====================================================

// ==========================================
// Refresh Dashboard
// ==========================================

function refreshAdmin() {

    loadAdmin();

    checkServer();

}

// ==========================================
// System Statistics
// ==========================================

function systemSummary() {

    const role = localStorage.getItem("role");

    const email = localStorage.getItem("email");

    console.log("========== NeuroSync ==========");

    console.log("Logged User :", email);

    console.log("Role :", role);

    console.log("Backend :", document.getElementById("serverStatus").innerText);

    console.log("Frontend Version : 1.0");

}

// ==========================================
// Browser Information
// ==========================================

function browserInfo() {

    console.log("Browser :", navigator.userAgent);

    console.log("Language :", navigator.language);

    console.log("Platform :", navigator.platform);

}

// ==========================================
// Session Information
// ==========================================

function sessionInfo() {

    console.log("Token Exists :", getToken() !== null);

    console.log("Email :", localStorage.getItem("email"));

    console.log("Role :", localStorage.getItem("role"));

}

// ==========================================
// Memory Information
// ==========================================

function storageInfo() {

    console.log("Local Storage Items");

    console.log("----------------------");

    for (let i = 0; i < localStorage.length; i++) {

        const key = localStorage.key(i);

        console.log(key + " : " + localStorage.getItem(key));

    }

}

// ==========================================
// Auto Refresh Every Minute
// ==========================================

setInterval(() => {

    refreshAdmin();

}, 60000);

// ==========================================
// Welcome Message
// ==========================================

showToast(

    "Welcome Administrator",

    "success"

);

// ==========================================
// Module Loaded
// ==========================================

console.log("NeuroSync Admin Module Loaded Successfully");