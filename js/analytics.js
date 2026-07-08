// =====================================================
// NeuroSync Analytics Module
// Part 1
// =====================================================

const ANALYTICS_API = BASE_URL + "/api/analytics";

let analyticsList = [];

// =====================================================
// Initialize
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    requireLogin();

    checkPageAccess([
        "SLEEP_PATIENT",
        "NEURO_COACH",
        "RESEARCH_SCIENTIST",
        "SYSTEM_ADMIN"
    ]);

    setupSidebar();

    loadAnalytics();

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
// Load Analytics
// =====================================================

async function loadAnalytics() {

    try {

        showLoader();

const url = getRole() === "SLEEP_PATIENT"
        ? ANALYTICS_API + "/patient/" + getId()
        : ANALYTICS_API;

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

            throw new Error("Unable to fetch analytics.");

        }

        analyticsList = await response.json();

        updateCards();

        renderTable();

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Unable to load analytics.", "error");

    }

}

// =====================================================
// Dashboard Cards
// =====================================================

function updateCards() {

    document.getElementById("totalScores").innerText = analyticsList.length;

    if (analyticsList.length === 0) {

        document.getElementById("averageScore").innerText = "0";

        document.getElementById("anomalyCount").innerText = "0";

        return;

    }

    let totalScore = 0;

    let anomalyCount = 0;

    analyticsList.forEach(score => {

        totalScore += score.score;

        if (score.anomalyDetected) {

            anomalyCount++;

        }

    });

    const average = totalScore / analyticsList.length;

    document.getElementById("averageScore").innerText =
        average.toFixed(2);

    document.getElementById("anomalyCount").innerText =
        anomalyCount;

}

// =====================================================
// Analytics Table
// =====================================================

function renderTable() {

    const table = document.getElementById("analyticsTable");

    table.innerHTML = "";

    if (analyticsList.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="6" style="text-align:center;">

                No Analytics Found

            </td>

        </tr>

        `;

        return;

    }

    analyticsList.forEach(record => {

        table.innerHTML += `

        <tr>

            <td>${record.id}</td>

            <td>${record.session?.id ?? "-"}</td>

            <td>${record.score}</td>

            <td>${record.sleepQuality}</td>

            <td>

                ${record.anomalyDetected ? "Yes" : "No"}

            </td>

            <td>

                ${formatDate(record.generatedAt)}

            </td>

        </tr>

        `;

    });

}
// =====================================================
// Date Formatting
// =====================================================

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleString();

}

// =====================================================
// Create Neuro Score
// =====================================================

async function createScore(scoreData) {

    try {

        showLoader();

        const response = await fetch(

            ANALYTICS_API,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization": "Bearer " + getToken()

                },

                body: JSON.stringify(scoreData)

            }

        );

        hideLoader();

        if (!response.ok) {

            throw new Error("Unable to save Neuro Score.");

        }

        showToast("Neuro Score Saved Successfully", "success");

        loadAnalytics();

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Failed to save Neuro Score.", "error");

    }

}

// =====================================================
// Get Analytics By Session
// =====================================================

async function getScoreBySession(sessionId) {

    try {

        showLoader();

        const response = await fetch(

            ANALYTICS_API + "/" + sessionId,

            {

                headers: {

                    "Authorization": "Bearer " + getToken()

                }

            }

        );

        hideLoader();

        if (!response.ok) {

            throw new Error("Score not found.");

        }

        return await response.json();

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Unable to fetch score.", "warning");

        return null;

    }

}

// =====================================================
// Refresh Analytics
// =====================================================

function refreshAnalytics() {

    loadAnalytics();

}

// =====================================================
// Auto Refresh Every Minute
// =====================================================

setInterval(() => {

    refreshAnalytics();

}, 60000);

// =====================================================
// Export Statistics
// =====================================================

function statistics() {

    if (analyticsList.length === 0) {

        console.log("No Analytics Available");

        return;

    }

    let highest = analyticsList[0].score;
    let lowest = analyticsList[0].score;

    analyticsList.forEach(item => {

        if (item.score > highest) {

            highest = item.score;

        }

        if (item.score < lowest) {

            lowest = item.score;

        }

    });

    console.log("Highest Score :", highest);
    console.log("Lowest Score :", lowest);

}

// =====================================================
// Search by Sleep Quality
// =====================================================

function searchQuality(quality) {

    quality = quality.toLowerCase();

    const filtered = analyticsList.filter(item =>

        item.sleepQuality.toLowerCase().includes(quality)

    );

    console.table(filtered);

}

// =====================================================
// Search by Score
// =====================================================

function searchScore(minScore) {

    const filtered = analyticsList.filter(item =>

        item.score >= minScore

    );

    console.table(filtered);

}

// =====================================================
// Analytics Summary
// =====================================================

function analyticsSummary() {

    console.log("Total Scores :", analyticsList.length);

    console.log(
        "Average Score :",
        document.getElementById("averageScore").innerText
    );

    console.log(
        "Anomalies :",
        document.getElementById("anomalyCount").innerText
    );

}

// =====================================================
// Module Loaded
// =====================================================

console.log("NeuroSync Analytics Module Loaded Successfully");