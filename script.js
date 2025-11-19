function toggleSubcategories(category) {
    const subcategories = category.querySelector('ul');

    if (subcategories.style.display === "block") {
        subcategories.style.display = "none";
        subcategories.style.opacity = 0;
    } else {
        subcategories.style.display = "block";
        setTimeout(() => subcategories.style.opacity = 1, 50);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchProducts");
    const productItems = document.querySelectorAll(".product-item");

    if (searchInput) {
        searchInput.addEventListener("keyup", () => {
            const searchValue = searchInput.value.toLowerCase();

            productItems.forEach(item => {
                const name = item.textContent.toLowerCase();
                item.style.display = name.includes(searchValue) ? "block" : "none";
            });
        });
    }
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("gallery-img")) {
        openLightbox(e.target.src);
    }
});

function openLightbox(imageSrc) {
    const lightbox = document.createElement("div");
    lightbox.classList.add("lightbox");

    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${imageSrc}">
        </div>
    `;

    lightbox.addEventListener("click", () => {
        lightbox.remove();
    });

    document.body.appendChild(lightbox);
}
function openModal(id) {
    document.getElementById(id).style.display = "block";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

/* ------------------------------
    5. TABS COMPONENT
------------------------------ */
function openTab(tabName) {
    const tabs = document.querySelectorAll(".tab-content");
    tabs.forEach(t => t.style.display = "none");

    document.getElementById(tabName).style.display = "block";
}

/* ------------------------------
    6. SMOOTH FADE-IN ANIMATIONS
------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
    const fadeElements = document.querySelectorAll(".fade-in");

    fadeElements.forEach((el) => {
        el.style.opacity = 0;
        el.style.transform = "translateY(15px)";
    });

    setTimeout(() => {
        fadeElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.transition = "0.7s ease";
                el.style.opacity = 1;
                el.style.transform = "translateY(0)";
            }, index * 120);
        });
    }, 200);
});
/* ------------------------------
    7. GOOGLE MAP INTEGRATION
------------------------------ */
function initMap() {
    const boutiqueLocation = { lat: -33.95168827763981, lng: 25.460103809721335 }; 

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: boutiqueLocation,
    });

    new google.maps.Marker({
        position: boutiqueLocation,
        map: map,
        title: "Essence Boutique",
    });
}