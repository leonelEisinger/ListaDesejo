// Stores all category data dynamically: { music: {...}, games: {...}, ... }
let libraryData = {}; 

// Setup your 5 categories and their corresponding files
const categories = {
    "music": "../data/music.json",
    "games": "../data/games.json",
    "movies": "../data/movies.json",
    "books": "../data/books.json",
    "others": "../data/others.json"
};

// 1. FETCH ALL DATA AT ONCE ON LOAD
$(document).ready(function () {
    const requests = [];
    const keys = Object.keys(categories);

    // Create a network request for each JSON file
    keys.forEach(category => {
        requests.push($.getJSON(categories[category]));
    });

    // $.when waits for ALL JSON files to finish downloading
    $.when(...requests)
        .done(function (...responses) {
            // If you have multiple requests, jQuery wraps responses in arrays
            keys.forEach((category, index) => {
                // responses[index][0] contains the actual JSON data payload
                libraryData[category] = responses[index][0];
                
                // Render this specific category into its own container
                renderCategory(category);
            });
        })
        .fail(function (jqxhr, textStatus, error) {
            console.error("Error loading one or more JSON files:", error);
            alert("Critical Error: Failed to load library data containers.");
        });
});

// 2. RENDER A SPECIFIC CATEGORY TO ITS TARGET CONTAINER
function renderCategory(category) {
    // Dynamic selector looks for #music-container, #games-container, etc.
    const container = $(`#${category}-container`);
    if (container.length === 0) {
        console.warn(`Container row '#${category}-container' not found in HTML.`);
        return;
    }
    
    container.empty();
    const data = libraryData[category];
    if (!data) return;

    Object.keys(data)
        .sort((a, b) => a.localeCompare(b))
        .forEach(item => {
            container.append(`
                <div class="col-md-3 mb-3">
                    <div class="list-group-item music-item text-center border"
                         data-category="${category}" 
                         data-item="${item}">
                        <button class="btn btn-light w-100">
                            ${item}
                        </button>
                    </div>
                </div>
            `);
        });
}

// 3. MODAL CLICK HANDLER (Identifies which category & item was clicked)
$(document).on("click", ".music-item", function () {
    const category = $(this).data("category"); // Know which container it came from
    const item = $(this).data("item");

    $("#modalArtistName").text(item);

    // Dig into the specific category data structure
    const items = libraryData[category]?.[item] || [];
    $("#songList").empty();

    items.forEach(i => {
        $("#songList").append(`<li class="list-group-item">${i}</li>`);
    });

    new bootstrap.Modal(document.getElementById("generalModal")).show();
});