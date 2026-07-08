// ==========================================
// NeuroSync Global Loading Spinner
// ==========================================

(function () {

    const loader = document.createElement("div");

    loader.id = "loadingOverlay";

    loader.innerHTML = `
        <div class="loader-box">

            <div class="loader-logo">

                <i class="fa-solid fa-brain"></i>

            </div>

            <h2>NeuroSync</h2>

            <div class="spinner"></div>

            <p>Loading...</p>

        </div>
    `;

    document.body.appendChild(loader);

})();

function showLoader() {

    document.getElementById("loadingOverlay").style.display = "flex";

}

function hideLoader() {

    document.getElementById("loadingOverlay").style.display = "none";

}