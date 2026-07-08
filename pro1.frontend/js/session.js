// =====================================================
// NeuroSync Sleep Session Management
// =====================================================

const SESSION_API = BASE_URL + "/api/sessions";

let sessionList = [];

// =====================================================
// Initialize
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    requireLogin();

    checkPageAccess([
        "SLEEP_PATIENT",
        "NEURO_COACH",
        "SYSTEM_ADMIN"
    ]);

    setupSidebar();

    loadSessions();

    const form = document.getElementById("sessionForm");

    if (form) {

        form.addEventListener("submit", createSession);

    }

});

// =====================================================
// Sidebar Navigation
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
// Load Sessions
// =====================================================

async function loadSessions() {

    try {

        showLoader();

        const response = await fetch(SESSION_API, {

            method: "GET",

            headers: {

                "Authorization": "Bearer " + getToken()

            }

        });

        hideLoader();

        if (!response.ok) {

            throw new Error("Unable to load sessions");

        }

        sessionList = await response.json();

        renderTable();

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Failed to load sessions", "error");

    }

}

// =====================================================
// Render Session Table
// =====================================================

function renderTable() {

    const table = document.getElementById("sessionTable");

    table.innerHTML = "";

    if (sessionList.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="6" style="text-align:center">

                No Sessions Found

            </td>

        </tr>

        `;

        return;

    }

    sessionList.forEach(session => {

        table.innerHTML += `

        <tr>

            <td>${session.id}</td>

            <td>${session.patient?.fullName ?? "-"}</td>

            <td>${session.status}</td>

            <td>${formatDate(session.startTime)}</td>

            <td>${formatDate(session.endTime)}</td>

            <td>

                <button onclick="editSession(${session.id})">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button onclick="deleteSession(${session.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

// =====================================================
// Create Session
// =====================================================

async function createSession(event) {

    event.preventDefault();

    const session = {

        startTime: document.getElementById("startTime").value,

        endTime: document.getElementById("endTime").value,

        status: document.getElementById("status").value,

        patient: {

            id: parseInt(document.getElementById("patientId").value)

        }

    };

    try {

        showLoader();

        const response = await fetch(SESSION_API, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "Authorization": "Bearer " + getToken()

            },

            body: JSON.stringify(session)

        });

        hideLoader();

        if (!response.ok) {

            throw new Error("Unable to create session");

        }

        showToast("Sleep Session Created Successfully", "success");

        document.getElementById("sessionForm").reset();

        loadSessions();

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Failed to create session", "error");

    }

}

// =====================================================
// Format Date
// =====================================================

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleString();

}

// =====================================================
// Edit Session
// =====================================================

async function editSession(id) {

    const session = sessionList.find(s => s.id === id);

    if (!session) {

        showToast("Session not found", "error");

        return;

    }

    const startTime = prompt(
        "Enter Start Time (YYYY-MM-DDTHH:MM)",
        session.startTime?.substring(0, 16)
    );

    if (startTime === null) return;

    const endTime = prompt(
        "Enter End Time (YYYY-MM-DDTHH:MM)",
        session.endTime?.substring(0, 16)
    );

    if (endTime === null) return;

    const status = prompt(
        "Enter Status",
        session.status
    );

    if (status === null) return;

    const updatedSession = {

        id: session.id,

        startTime: startTime,

        endTime: endTime,

        status: status,

        patient: {

            id: session.patient.id

        }

    };

    try {

        showLoader();

        const response = await fetch(

            SESSION_API + "/" + id,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization": "Bearer " + getToken()

                },

                body: JSON.stringify(updatedSession)

            }

        );

        hideLoader();

        if (!response.ok) {

            throw new Error();

        }

        showToast("Session Updated Successfully", "success");

        loadSessions();

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Failed to update session", "error");

    }

}

// =====================================================
// Delete Session
// =====================================================

async function deleteSession(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this session?"
    );

    if (!confirmDelete) {

        return;

    }

    try {

        showLoader();

        const response = await fetch(

            SESSION_API + "/" + id,

            {

                method: "DELETE",

                headers: {

                    "Authorization": "Bearer " + getToken()

                }

            }

        );

        hideLoader();

        if (!response.ok) {

            throw new Error();

        }

        showToast("Session Deleted Successfully", "success");

        loadSessions();

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Failed to delete session", "error");

    }

}

// =====================================================
// Refresh Every 60 Seconds
// =====================================================

setInterval(() => {

    loadSessions();

}, 60000);

// =====================================================
// Page Loaded
// =====================================================

console.log("NeuroSync Session Module Loaded Successfully");