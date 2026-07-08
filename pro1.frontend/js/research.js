// =====================================================
// NeuroSync Research Module
// Part 1
// =====================================================

const RESEARCH_API = BASE_URL + "/api/research";

let readingList = [];

// =====================================================
// Initialize
// =====================================================
document.addEventListener("DOMContentLoaded", () => {

    requireLogin();

    checkPageAccess([
        "SLEEP_PATIENT",
        "RESEARCH_SCIENTIST",
        "SYSTEM_ADMIN"
    ]);

    setupSidebar();

    if (getRole() === "SLEEP_PATIENT") {

        document.querySelector(".form-card").style.display = "none";

    }

    loadReadings();

    const form = document.getElementById("researchForm");

    if (form) {

        form.addEventListener("submit", saveReading);

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
// Load Bio Readings
// =====================================================

async function loadReadings() {

    try {

        showLoader();

const url = getRole() === "SLEEP_PATIENT"
    ? RESEARCH_API + "/patient/" + getId()
    : RESEARCH_API;

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

            throw new Error("Unable to load readings.");

        }

        readingList = await response.json();

        renderTable();

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Unable to load Bio Readings.", "error");

    }

}

// =====================================================
// Render Table
// =====================================================

function renderTable() {

    const table = document.getElementById("researchTable");

    table.innerHTML = "";

    if (readingList.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="7" style="text-align:center;">

                No Bio Readings Found

            </td>

        </tr>

        `;

        return;

    }

    readingList.forEach(reading => {

        table.innerHTML += `

        <tr>

            <td>${reading.id}</td>

            <td>${reading.session?.id ?? "-"}</td>

            <td>${reading.heartRate}</td>

            <td>${reading.spo2}</td>

            <td>${reading.respirationRate}</td>

            <td>${reading.bodyTemperature}</td>

            <td>${formatDate(reading.recordedAt)}</td>

        </tr>

        `;

    });

}

// =====================================================
// Save Reading
// =====================================================

async function saveReading(event) {

    event.preventDefault();

    const reading = {

        session: {

            id: parseInt(document.getElementById("sessionId").value)

        },

        heartRate: parseFloat(document.getElementById("heartRate").value),

        spo2: parseFloat(document.getElementById("spo2").value),

        respirationRate: parseFloat(document.getElementById("respirationRate").value),

        bodyTemperature: parseFloat(document.getElementById("bodyTemperature").value),

        recordedAt: new Date().toISOString()

    };

    try {

        showLoader();

        const response = await fetch(

            RESEARCH_API,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization": "Bearer " + getToken()

                },

                body: JSON.stringify(reading)

            }

        );

        hideLoader();

        if (!response.ok) {

            throw new Error("Unable to save reading.");

        }

        showToast("Bio Reading Saved Successfully", "success");

        document.getElementById("researchForm").reset();

        loadReadings();

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Failed to save Bio Reading.", "error");

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
// Get Readings By Session
// =====================================================

async function getReadingsBySession(sessionId) {

    try {

        showLoader();

        const response = await fetch(

            RESEARCH_API + "/" + sessionId,

            {

                method: "GET",

                headers: {

                    "Authorization": "Bearer " + getToken()

                }

            }

        );

        hideLoader();

        if (!response.ok) {

            throw new Error("Unable to fetch session readings.");

        }

        const readings = await response.json();

        if (Array.isArray(readings)) {

            readingList = readings;

        } else {

            readingList = [readings];

        }

        renderTable();

        showToast("Session Readings Loaded", "success");

    }

    catch (error) {

        hideLoader();

        console.error(error);

        showToast("Failed to load session readings.", "error");

    }

}

// =====================================================
// Research Statistics
// =====================================================

function researchSummary() {

    if (readingList.length === 0) {

        console.log("No Bio Readings Available");

        return;

    }

    let totalHeart = 0;
    let totalSpo2 = 0;
    let totalRespiration = 0;
    let totalTemperature = 0;

    readingList.forEach(reading => {

        totalHeart += reading.heartRate;
        totalSpo2 += reading.spo2;
        totalRespiration += reading.respirationRate;
        totalTemperature += reading.bodyTemperature;

    });

    console.log("========== Research Summary ==========");

    console.log("Total Readings :", readingList.length);

    console.log(
        "Average Heart Rate :",
        (totalHeart / readingList.length).toFixed(2)
    );

    console.log(
        "Average SpO₂ :",
        (totalSpo2 / readingList.length).toFixed(2)
    );

    console.log(
        "Average Respiration :",
        (totalRespiration / readingList.length).toFixed(2)
    );

    console.log(
        "Average Temperature :",
        (totalTemperature / readingList.length).toFixed(2)
    );

}

// =====================================================
// Search By Heart Rate
// =====================================================

function searchHeartRate(minHeartRate) {

    const filtered = readingList.filter(reading =>

        reading.heartRate >= minHeartRate

    );

    console.table(filtered);

}

// =====================================================
// Search By SpO₂
// =====================================================

function searchSpo2(minSpo2) {

    const filtered = readingList.filter(reading =>

        reading.spo2 >= minSpo2

    );

    console.table(filtered);

}

// =====================================================
// Search By Temperature
// =====================================================

function searchTemperature(minTemperature) {

    const filtered = readingList.filter(reading =>

        reading.bodyTemperature >= minTemperature

    );

    console.table(filtered);

}

// =====================================================
// Refresh Readings
// =====================================================

function refreshResearch() {

    loadReadings();

}

// =====================================================
// Auto Refresh Every Minute
// =====================================================

setInterval(() => {

    refreshResearch();

}, 60000);

// =====================================================
// Module Loaded
// =====================================================

console.log("NeuroSync Research Module Loaded Successfully");