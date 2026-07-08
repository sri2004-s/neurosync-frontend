// =====================================================
// NeuroSync Dashboard
// =====================================================

// =====================================================
// Initialize Dashboard
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    requireLogin();

    setUserInfo();

    setupNavigation();

    setupRoleAccess();

    loadSessions();

});

// =====================================================
// Sidebar Navigation
// =====================================================

function setupNavigation() {

    const dashboard = document.getElementById("dashboardMenu");
    const session = document.getElementById("sessionMenu");
    const analytics = document.getElementById("analyticsMenu");
    const coaching = document.getElementById("coachingMenu");
    const research = document.getElementById("researchMenu");
    const admin = document.getElementById("adminMenu");

    if (dashboard)
        dashboard.onclick = () => window.location.href = "dashboard.html";

    if (session)
        session.onclick = () => window.location.href = "session.html";

    if (analytics)
        analytics.onclick = () => window.location.href = "analytics.html";

    if (coaching)
        coaching.onclick = () => window.location.href = "coaching.html";

    if (research)
        research.onclick = () => window.location.href = "research.html";

    if (admin)
        admin.onclick = () => window.location.href = "admin.html";

}

// =====================================================
// Role Based Sidebar
// =====================================================

function setupRoleAccess() {

    const role = getRole();

    const session = document.getElementById("sessionMenu");
    const analytics = document.getElementById("analyticsMenu");
    const coaching = document.getElementById("coachingMenu");
    const research = document.getElementById("researchMenu");
    const admin = document.getElementById("adminMenu");

    // Hide everything first

    session.style.display = "none";
    analytics.style.display = "none";
    coaching.style.display = "none";
    research.style.display = "none";
    admin.style.display = "none";

    switch (role) {

        case "SLEEP_PATIENT":

            session.style.display = "block";
            analytics.style.display = "block";

            break;

        case "NEURO_COACH":

            session.style.display = "block";
            analytics.style.display = "block";
            coaching.style.display = "block";

            break;

        case "RESEARCH_SCIENTIST":

            analytics.style.display = "block";
            research.style.display = "block";

            break;

        case "SYSTEM_ADMIN":

            session.style.display = "block";
            analytics.style.display = "block";
            coaching.style.display = "block";
            research.style.display = "block";
            admin.style.display = "block";

            break;

    }

}

// =====================================================
// Load Sleep Sessions
// =====================================================

async function loadSessions() {

    try {

        showLoader();

        const response = await fetch(

            BASE_URL + "/api/sessions",

            {

                headers: {

                    "Authorization": "Bearer " + getToken()

                }

            }

        );

        hideLoader();

        if (!response.ok) {

            throw new Error("Unable to fetch sessions.");

        }

        const sessions = await response.json();

        document.getElementById("totalSessions").innerText = sessions.length;

        populateTable(sessions);

        calculateAverageScore(sessions);

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Failed to load sessions.", "error");

    }

}

// =====================================================
// Populate Recent Activity
// =====================================================

function populateTable(sessions) {

    const table = document.getElementById("sessionTable");

    table.innerHTML = "";

    if (sessions.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    No Sleep Sessions Found
                </td>
            </tr>
        `;

        return;

    }

    sessions.forEach(session => {

        table.innerHTML += `

        <tr>

            <td>${session.id}</td>

            <td>${session.patient?.fullName ?? "-"}</td>

            <td>${session.status}</td>

            <td>${session.startTime}</td>

        </tr>

        `;

    });

}

// =====================================================
// Average Neuro Score
// =====================================================

function calculateAverageScore(sessions) {

    let total = 0;

    let count = 0;

    sessions.forEach(session => {

        if (session.neuroScore != null) {

            total += session.neuroScore;

            count++;

        }

    });

    document.getElementById("neuroScore").innerText =

        count === 0 ? 0 : (total / count).toFixed(1);

}