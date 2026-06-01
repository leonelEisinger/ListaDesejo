$(document).ready(function () {

    let allGifts = [];

    function renderGifts(gifts) {

        $("#giftContainer").empty();

        gifts.forEach((gift, index) => {

            const statusBadge = gift.reserved
                ? `<span class="badge badge-reserved">Comprado</span>`
                : `<span class="badge badge-available">Interesse</span>`;

            const carouselId = `carousel-${index}`;

            const imagesHtml = `
                <div id="${carouselId}" class="carousel carousel-dark slide">

                    <div class="carousel-inner">

                        ${gift.images.map((img, imgIndex) => `
                            <div class="carousel-item ${imgIndex === 0 ? "active" : ""}">
                                <img src="${img}"
                                     class="gift-image d-block w-100"
                                     alt="${gift.name}">
                            </div>
                        `).join("")}

                    </div>

                    ${gift.images.length > 1 ? `
                        <button class="carousel-control-prev"
                                type="button"
                                data-bs-target="#${carouselId}"
                                data-bs-slide="prev">

                            <span class="carousel-control-prev-icon"></span>

                        </button>

                        <button class="carousel-control-next"
                                type="button"
                                data-bs-target="#${carouselId}"
                                data-bs-slide="next">

                            <span class="carousel-control-next-icon"></span>

                        </button>
                    ` : ""}

                </div>
            `;

            const linksHtml = gift.links.map(link => `
                <a href="${link.url}"
                   target="_blank"
                   class="btn btn-outline-primary mt-2">

                   ${link.label}

                   <svg xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-box-arrow-up-right"
                        viewBox="0 0 16 16">

                        <path fill-rule="evenodd"
                              d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>

                        <path fill-rule="evenodd"
                              d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>

                    </svg>

                </a>
            `).join("");

            const card = `
                <div class="col-md-4 mb-4">

                    <div class="card shadow-sm h-100">

                        ${imagesHtml}

                        <div class="card-body d-flex flex-column">

                            <div class="d-flex justify-content-between align-items-center mb-2">

                                <span class="badge bg-primary">
                                    ${gift.category}
                                </span>

                                ${statusBadge}

                            </div>

                            <h5 class="card-title">
                                ${gift.name}
                            </h5>

                            <p class="card-description text-muted">
                                ${gift.description || "Sem descrição disponível."}
                            </p>

                            <p class="mb-1">
                                Média de preço (Fora de Promoção):
                            </p>

                            <p class="price-tag">
                                ${gift.price}
                            </p>

                            <div class="d-flex flex-column align-items-center justify-content-center mt-auto">
                                ${linksHtml}
                            </div>

                        </div>

                    </div>

                </div>
            `;

            $("#giftContainer").append(card);
        });
    }

    function populateCategories(gifts) {

        $("#categoryFilter").empty();

        $("#categoryFilter").append(`
            <option value="all">
                Todas as categorias
            </option>
        `);

        const categories = [...new Set(gifts.map(g => g.category))];

        categories.forEach(category => {

            $("#categoryFilter").append(`
                <option value="${category}">
                    ${category}
                </option>
            `);
        });
    }

    function filterGifts() {

        const search = $("#searchInput").val().toLowerCase();

        const category = $("#categoryFilter").val();

        const filtered = allGifts.filter(gift => {

            const matchesSearch =
                gift.name.toLowerCase().includes(search);

            const matchesCategory =
                category === "all" ||
                gift.category === category;

            return matchesSearch && matchesCategory;
        });

        renderGifts(filtered);
    }

    async function loadGifts() {

        try {

            const response = await fetch("../ListaDesejo/data/gifts.json");

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            allGifts = await response.json();

            populateCategories(allGifts);

            renderGifts(allGifts);

        } catch (error) {

            console.error("Erro ao carregar gifts.json:", error);

            $("#giftContainer").html(`
                <div class="col-12">
                    <div class="alert alert-danger">
                        Erro ao carregar a lista de presentes.
                    </div>
                </div>
            `);
        }
    }

    $("#searchInput").on("input", filterGifts);

    $("#categoryFilter").on("change", filterGifts);

    loadGifts();

});
