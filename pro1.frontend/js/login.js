// =====================================================
// NeuroSync Login System
// =====================================================

const LOGIN_API = BASE_URL + "/api/auth/login";

const loginForm = document.getElementById("loginForm");

// =====================================================
// Initialize
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    if (loginForm) {

        loginForm.addEventListener("submit", loginUser);

    }

});

// =====================================================
// Login User
// =====================================================

async function loginUser(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // ===============================
    // Validation
    // ===============================

    if (!email || !password) {

        showToast("Please enter Email and Password.", "warning");

        return;

    }

    const loginData = {

        email,
        password

    };

    try {

        showLoader();

        const response = await fetch(LOGIN_API, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(loginData)

        });

        const data = await response.json();

        hideLoader();

        if (!response.ok) {

            showToast(data.message || "Invalid Email or Password", "error");

            return;

        }

        // ===============================
        // Save Logged User
        // ===============================

        saveUser(data);

        showToast("Login Successful!", "success");

        // ===============================
        // Redirect According To Role
        // ===============================

        setTimeout(() => {

            switch (data.role) {

                case "SYSTEM_ADMIN":

                    window.location.href = "admin.html";

                    break;

                case "NEURO_COACH":

                    window.location.href = "coaching.html";

                    break;

                case "RESEARCH_SCIENTIST":

                    window.location.href = "research.html";

                    break;

                case "SLEEP_PATIENT":

                    window.location.href = "dashboard.html";

                    break;

                default:

                    window.location.href = "dashboard.html";

            }

        }, 1000);

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Cannot connect to Spring Boot Server.", "error");

    }

}