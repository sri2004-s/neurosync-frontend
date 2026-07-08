// =====================================================
// NeuroSync Registration System
// =====================================================

const REGISTER_API = BASE_URL + "/api/auth/register";

const registerForm = document.getElementById("registerForm");

// =====================================================
// Initialize
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    if (registerForm) {

        registerForm.addEventListener("submit", registerUser);

    }

});

// =====================================================
// Register User
// =====================================================

async function registerUser(event) {

    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    // =================================================
    // Validation
    // =================================================

    if (!fullName || !email || !password || !role) {

        showToast("Please fill all fields.", "warning");

        return;

    }

    const registerData = {

        fullName,
        email,
        password,
        role

    };

    try {

        showLoader();

        const response = await fetch(REGISTER_API, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(registerData)

        });

        const data = await response.json();

        hideLoader();

        if (!response.ok) {

            showToast(data.message || "Registration Failed!", "error");

            return;

        }

        showToast("🎉 Registration Successful!", "success");

        registerForm.reset();

        // =============================================
        // Redirect to Login
        // =============================================

        setTimeout(() => {

            window.location.href = "index.html";

        }, 1200);

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Cannot connect to Spring Boot Server!", "error");

    }

}