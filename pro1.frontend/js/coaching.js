// =====================================================
// NeuroSync Coaching Module
// Part 1
// =====================================================

const COACHING_API = BASE_URL + "/api/coaching";

let planList = [];

// =====================================================
// Initialize
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    requireLogin();

    checkPageAccess([
        "NEURO_COACH",
        "SYSTEM_ADMIN"
    ]);

    setupSidebar();

    loadPlans();

    const form = document.getElementById("planForm");

    if (form) {

        form.addEventListener("submit", createPlan);

    }

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
// Load All Plans
// =====================================================

async function loadPlans() {

    try {

        showLoader();

        const response = await fetch(

            COACHING_API,

            {

                method: "GET",

                headers: {

                    "Authorization": "Bearer " + getToken()

                }

            }

        );

        hideLoader();

        if (!response.ok) {

            throw new Error("Unable to load plans.");

        }

        planList = await response.json();

        renderTable();

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Unable to load intervention plans.", "error");

    }

}

// =====================================================
// Render Table
// =====================================================

function renderTable() {

    const table = document.getElementById("planTable");

    table.innerHTML = "";

    if (planList.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="6" style="text-align:center;">

                No Intervention Plans Found

            </td>

        </tr>

        `;

        return;

    }

    planList.forEach(plan => {

        table.innerHTML += `

        <tr>

            <td>${plan.id}</td>

            <td>${plan.patient?.fullName ?? "-"}</td>

            <td>${plan.coach?.fullName ?? "-"}</td>

            <td>${plan.status}</td>

            <td>${plan.description}</td>

            <td>${formatDate(plan.createdAt)}</td>

        </tr>

        `;

    });

}

// =====================================================
// Create Intervention Plan
// =====================================================

async function createPlan(event) {

    event.preventDefault();

    const plan = {

        patient: {

            id: parseInt(document.getElementById("patientId").value)

        },

        coach: {

            id: parseInt(document.getElementById("coachId").value)

        },

        status: document.getElementById("status").value,

        description: document.getElementById("description").value,

        createdAt: new Date().toISOString()

    };

    try {

        showLoader();

const url = getRole() === "SLEEP_PATIENT"
        ? COACHING_API + "/patient/" + getId()
        : COACHING_API;

const response = await fetch(

    url,

    {

        method: "GET",

        headers: {

            "Authorization": "Bearer " + getToken()

        }

    }

);
        hideLoader();

        if (!response.ok) {

            throw new Error("Unable to create intervention plan.");

        }

        showToast("Intervention Plan Created Successfully", "success");

        document.getElementById("planForm").reset();

        loadPlans();

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Failed to create intervention plan.", "error");

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
// Filter Plans By Patient
// =====================================================

async function getPlansByPatient(patientId) {

    try {

        showLoader();

        const response = await fetch(

            COACHING_API + "/patient/" + patientId,

            {

                method: "GET",

                headers: {

                    "Authorization": "Bearer " + getToken()

                }

            }

        );

        hideLoader();

        if (!response.ok) {

            throw new Error("Unable to fetch patient plans.");

        }

        const plans = await response.json();

        planList = plans;

        renderTable();

        showToast("Patient Plans Loaded", "success");

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Failed to load patient plans.", "error");

    }

}

// =====================================================
// Filter Plans By Status
// =====================================================

async function getPlansByStatus(status) {

    try {

        showLoader();

        const response = await fetch(

            COACHING_API + "/status/" + status,

            {

                method: "GET",

                headers: {

                    "Authorization": "Bearer " + getToken()

                }

            }

        );

        hideLoader();

        if (!response.ok) {

            throw new Error("Unable to fetch plans.");

        }

        const plans = await response.json();

        planList = plans;

        renderTable();

        showToast("Plans Filtered Successfully", "success");

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Unable to filter plans.", "error");

    }

}

// =====================================================
// Refresh Plans
// =====================================================

function refreshPlans() {

    loadPlans();

}

// =====================================================
// Coaching Statistics
// =====================================================

function coachingSummary() {

    let pending = 0;
    let accepted = 0;
    let rejected = 0;

    planList.forEach(plan => {

        switch (plan.status) {

            case "PENDING":

                pending++;

                break;

            case "ACCEPTED":

                accepted++;

                break;

            case "REJECTED":

                rejected++;

                break;

        }

    });

    console.log("========== Coaching Summary ==========");

    console.log("Total Plans :", planList.length);

    console.log("Pending :", pending);

    console.log("Accepted :", accepted);

    console.log("Rejected :", rejected);

}

// =====================================================
// Search Description
// =====================================================

function searchDescription(keyword) {

    keyword = keyword.toLowerCase();

    const filtered = planList.filter(plan =>

        plan.description.toLowerCase().includes(keyword)

    );

    console.table(filtered);

}

// =====================================================
// Auto Refresh Every Minute
// =====================================================

setInterval(() => {

    refreshPlans();

}, 60000);

// =====================================================
// Module Loaded
// =====================================================

console.log("NeuroSync Coaching Module Loaded Successfully");