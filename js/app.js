/* =========================================================
   KOSTRA - Main Application
   Static Vercel Version
========================================================= */

const base = [
    {
        id: 1,
        title: "Kost Keputih Green House",
        location: "Keputih, Sukolilo",
        price: 950000,
        gender: "PUTRA",
        bed: 1,
        bath: 1,
        amenities: ["WiFi", "Security", "Parking", "Laundry"],
        img: "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=900&q=80",
        lat: -7.2826,
        lng: 112.7987,
        owner: "Andi",
        phone: "628123456789"
    },

    {
        id: 2,
        title: "Gebang Residence",
        location: "Gebang, Sukolilo",
        price: 1250000,
        gender: "CAMPUR",
        bed: 1,
        bath: 1,
        amenities: ["WiFi", "Kitchen", "Parking", "Water"],
        img: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=900&q=80",
        lat: -7.2788,
        lng: 112.7898,
        owner: "Sari",
        phone: "628123456780"
    },

    {
        id: 3,
        title: "Kost Putri Sakura ITS",
        location: "Keputih Tegal",
        price: 1450000,
        gender: "PUTRI",
        bed: 1,
        bath: 1,
        amenities: ["WiFi", "Security", "Aircon", "Laundry"],
        img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
        lat: -7.2862,
        lng: 112.7962,
        owner: "Maya",
        phone: "628123456781"
    },

    {
        id: 4,
        title: "Kost Mahasiswa Manyar",
        location: "Manyar, Surabaya",
        price: 800000,
        gender: "PUTRA",
        bed: 1,
        bath: 1,
        amenities: ["WiFi", "Parking"],
        img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
        lat: -7.2741,
        lng: 112.7864,
        owner: "Rizky",
        phone: "628123456782"
    },

    {
        id: 5,
        title: "Pondok Harmoni ITS",
        location: "Mulyos, Sukolilo",
        price: 1800000,
        gender: "CAMPUR",
        bed: 2,
        bath: 1,
        amenities: [
            "WiFi",
            "Security",
            "Kitchen",
            "Aircon",
            "Parking"
        ],
        img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80",
        lat: -7.2891,
        lng: 112.7871,
        owner: "Budi",
        phone: "628123456783"
    },

    {
        id: 6,
        title: "Kost Putri Lotus",
        location: "Gebang Lor",
        price: 1100000,
        gender: "PUTRI",
        bed: 1,
        bath: 1,
        amenities: ["WiFi", "Laundry", "Water"],
        img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
        lat: -7.2759,
        lng: 112.7927,
        owner: "Nina",
        phone: "628123456784"
    }
];

/* =========================================================
   GLOBAL
========================================================= */

let map = null;
let markers = [];
let userMarker = null;
let userPos = null;

/* =========================================================
   UTILITIES
========================================================= */

function rupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);
}

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* =========================================================
   FILTER
========================================================= */

function filtered() {
    const searchElement = document.getElementById("search");
    const maxPriceElement = document.getElementById("maxPrice");
    const genderElement = document.getElementById("gender");
    const amenityElement = document.getElementById("amenity");
    const sortElement = document.getElementById("sort");

    const q = searchElement
        ? searchElement.value.toLowerCase().trim()
        : "";

    const max =
        maxPriceElement && maxPriceElement.value
            ? Number(maxPriceElement.value)
            : Infinity;

    const gender =
        genderElement
            ? genderElement.value
            : "";

    const amenity =
        amenityElement
            ? amenityElement.value
            : "";

    let arr = base.filter((item) => {
        const searchable = (
            item.title +
            " " +
            item.location +
            " " +
            item.amenities.join(" ")
        ).toLowerCase();

        const matchesSearch =
            !q || searchable.includes(q);

        const matchesPrice =
            item.price <= max;

        const matchesGender =
            !gender || item.gender === gender;

        const matchesAmenity =
            !amenity || item.amenities.includes(amenity);

        return (
            matchesSearch &&
            matchesPrice &&
            matchesGender &&
            matchesAmenity
        );
    });

    const sort = sortElement
        ? sortElement.value
        : "new";

    if (sort === "low") {
        arr.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        arr.sort((a, b) => b.price - a.price);
    }

    return arr;
}

/* =========================================================
   RENDER LISTING
========================================================= */

function render() {
    const cards = document.getElementById("cards");

    if (!cards) {
        return;
    }

    const arr = filtered();

    const resultText =
        document.getElementById("resultText");

    if (resultText) {
        resultText.textContent =
            `Menampilkan ${arr.length} kos`;
    }

    if (!arr.length) {
        cards.innerHTML = `
            <div class="empty">
                <h3>Kos tidak ditemukan</h3>
                <p>
                    Coba ubah kata kunci atau filter pencarian.
                </p>
                <button
                    class="btn outline"
                    onclick="resetFilters()"
                >
                    Reset Filter
                </button>
            </div>
        `;

        updateMap([]);
        return;
    }

    cards.innerHTML = arr
        .map((item) => {
            const genderLabel =
                item.gender === "PUTRI"
                    ? "PUTRI"
                    : item.gender === "PUTRA"
                        ? "PUTRA"
                        : "CAMPUR";

            return `
                <article class="card">

                    <img
                        src="${item.img}"
                        alt="${escapeHTML(item.title)}"
                        loading="lazy"
                    >

                    <div class="card-body">

                        <span class="tag">
                            ${genderLabel}
                        </span>

                        <h3>
                            ${escapeHTML(item.title)}
                        </h3>

                        <div class="meta">
                            <span>
                                📍 ${escapeHTML(item.location)}
                            </span>

                            <span>
                                🛏 ${item.bed} kamar
                            </span>

                            <span>
                                📶 WiFi
                            </span>
                        </div>

                        <div class="price">
                            ${rupiah(item.price)}
                            <span>/ bulan</span>
                        </div>

                        <div class="card-actions">

                            <button
                                class="btn outline"
                                onclick="openDetail(${item.id})"
                            >
                                Lihat detail
                            </button>

                            <button
                                class="btn dark"
                                onclick="wa('${item.phone}')"
                            >
                                WhatsApp
                            </button>

                        </div>

                    </div>

                </article>
            `;
        })
        .join("");

    updateMap(arr);
}

/* =========================================================
   DETAIL MODAL
========================================================= */

function openDetail(id) {
    const item = base.find((x) => x.id === id);

    if (!item) {
        return;
    }

    const modalBody =
        document.getElementById("modalBody");

    if (!modalBody) {
        return;
    }

    modalBody.innerHTML = `
        <div class="detail">

            <img
                src="${item.img}"
                alt="${escapeHTML(item.title)}"
            >

            <div>

                <span class="tag">
                    ${item.gender}
                </span>

                <h2>
                    ${escapeHTML(item.title)}
                </h2>

                <p class="muted">
                    📍 ${escapeHTML(item.location)}
                </p>

                <h2>
                    ${rupiah(item.price)}
                    <small class="muted">
                        / bulan
                    </small>
                </h2>

                <div class="meta">
                    🛏 ${item.bed} kamar
                    &nbsp;
                    🚿 ${item.bath} kamar mandi
                </div>

                <div class="amenities">
                    ${item.amenities
                        .map(
                            (a) =>
                                `<span class="amenity">
                                    ✓ ${escapeHTML(a)}
                                </span>`
                        )
                        .join("")}
                </div>

                <p>
                    <b>Pemilik:</b>
                    ${escapeHTML(item.owner)}
                </p>

                <button
                    class="btn dark"
                    onclick="wa('${item.phone}')"
                >
                    Chat pemilik via WhatsApp
                </button>

            </div>

        </div>
    `;

    openModal();
}

/* =========================================================
   MODAL
========================================================= */

function openModal(type) {
    const modal =
        document.getElementById("modal");

    const body =
        document.getElementById("modalBody");

    if (!modal || !body) {
        return;
    }

    if (type === "login") {
        window.location.href = "/login.html";
        return;
    }

    if (type === "register") {
        window.location.href = "/register.html";
        return;
    }

    if (type === "forgot") {
        window.location.href =
            "/forgot-password.html";
        return;
    }

    if (type === "post") {

        const user =
            localStorage.getItem("nemu_user");

        if (!user) {
            window.location.href =
                "/login.html";
            return;
        }

        body.innerHTML = `
            <div class="form">

                <h2>
                    Tambah Listing Kos
                </h2>

                <p class="muted">
                    Masukkan informasi kos kamu.
                </p>

                <input
                    id="postName"
                    placeholder="Nama kos *"
                    required
                >

                <textarea
                    id="postDescription"
                    rows="4"
                    placeholder="Deskripsi kos"
                ></textarea>

                <input
                    id="postPrice"
                    type="number"
                    placeholder="Harga per bulan *"
                >

                <input
                    id="postLocation"
                    placeholder="Lokasi *"
                >

                <select id="postGender">
                    <option value="CAMPUR">
                        Campur
                    </option>
                    <option value="PUTRA">
                        Putra
                    </option>
                    <option value="PUTRI">
                        Putri
                    </option>
                </select>

                <input
                    id="postPhone"
                    placeholder="Nomor WhatsApp"
                >

                <input
                    id="postImage"
                    placeholder="URL foto"
                >

                <button
                    class="btn dark"
                    style="width:100%"
                    onclick="postListing()"
                >
                    Post Listing
                </button>

            </div>
        `;

        modal.classList.remove("hidden");
        return;
    }

    modal.classList.remove("hidden");
}

function closeModal() {
    const modal =
        document.getElementById("modal");

    if (modal) {
        modal.classList.add("hidden");
    }
}

/* =========================================================
   POST LISTING
========================================================= */

function postListing() {
    const name =
        document.getElementById("postName")?.value.trim();

    const price =
        Number(
            document.getElementById("postPrice")?.value
        );

    const location =
        document
            .getElementById("postLocation")
            ?.value.trim();

    const gender =
        document.getElementById("postGender")?.value;

    const phone =
        document.getElementById("postPhone")?.value.trim();

    const image =
        document.getElementById("postImage")?.value.trim();

    if (!name || !price || !location) {
        toast(
            "Nama, harga, dan lokasi wajib diisi."
        );
        return;
    }

    const listing = {
        id: Date.now(),
        title: name,
        location,
        price,
        gender: gender || "CAMPUR",
        bed: 1,
        bath: 1,
        amenities: ["WiFi"],
        img:
            image ||
            "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=900&q=80",
        lat: -7.2826,
        lng: 112.7987,
        owner: "User KOSTRA",
        phone: phone || "628123456789"
    };

    const userListings =
        JSON.parse(
            localStorage.getItem("nemu_listings") ||
            "[]"
        );

    userListings.push(listing);

    localStorage.setItem(
        "nemu_listings",
        JSON.stringify(userListings)
    );

    base.push(listing);

    toast("Listing berhasil diposting ✓");

    closeModal();

    render();
}

/* =========================================================
   WHATSAPP
========================================================= */

function wa(phone) {
    const cleanPhone =
        String(phone)
            .replace(/\D/g, "");

    window.open(
        `https://wa.me/${cleanPhone}`,
        "_blank"
    );
}

/* =========================================================
   TOAST
========================================================= */

function toast(message) {
    const element =
        document.getElementById("toast");

    if (!element) {
        return;
    }

    element.textContent = message;
    element.style.display = "block";

    clearTimeout(window.nemuToastTimer);

    window.nemuToastTimer =
        setTimeout(() => {
            element.style.display = "none";
        }, 2600);
}

/* =========================================================
   RESET FILTER
========================================================= */

function resetFilters() {

    const ids = [
        "search",
        "maxPrice",
        "gender",
        "amenity"
    ];

    ids.forEach((id) => {
        const element =
            document.getElementById(id);

        if (element) {
            element.value = "";
        }
    });

    render();
}

/* =========================================================
   MAP
========================================================= */

function initMap() {

    const mapElement =
        document.getElementById("map");

    if (!mapElement) {
        return;
    }

    if (typeof L === "undefined") {
        console.error(
            "Leaflet belum berhasil dimuat."
        );
        return;
    }

    map = L.map("map").setView(
        [-7.2826, 112.7987],
        14
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "© OpenStreetMap contributors"
        }
    ).addTo(map);
}

/* =========================================================
   UPDATE MAP
========================================================= */

function updateMap(arr) {

    if (!map) {
        return;
    }

    markers.forEach((marker) => {
        marker.remove();
    });

    markers = arr.map((item) => {

        return L.marker([
            item.lat,
            item.lng
        ])
            .addTo(map)
            .bindPopup(`
                <b>
                    ${escapeHTML(item.title)}
                </b>
                <br>
                ${rupiah(item.price)}
                /bulan
                <br>
                ${escapeHTML(item.location)}
            `);
    });
}

/* =========================================================
   GPS
========================================================= */

function locate() {

    if (!navigator.geolocation) {
        toast(
            "Browser tidak mendukung GPS."
        );
        return;
    }

    toast(
        "Meminta izin lokasi..."
    );

    navigator.geolocation.getCurrentPosition(
        (position) => {

            userPos = [
                position.coords.latitude,
                position.coords.longitude
            ];

            if (userMarker) {
                userMarker.remove();
            }

            userMarker =
                L.circleMarker(
                    userPos,
                    {
                        radius: 9
                    }
                )
                    .addTo(map)
                    .bindPopup(
                        "📍 Posisi kamu"
                    )
                    .openPopup();

            map.setView(
                userPos,
                15
            );

            toast(
                "Lokasi ditemukan ✓"
            );
        },

        () => {

            toast(
                "Lokasi tidak diizinkan. Coba aktifkan GPS browser."
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

/* =========================================================
   LOAD LOCAL LISTINGS
========================================================= */

function loadLocalListings() {

    const saved =
        JSON.parse(
            localStorage.getItem(
                "nemu_listings"
            ) || "[]"
        );

    saved.forEach((item) => {

        if (
            !base.some(
                (existing) =>
                    existing.id === item.id
            )
        ) {
            base.push(item);
        }
    });
}

/* =========================================================
   USER AREA
========================================================= */

function updateUserArea() {

    const area =
        document.getElementById(
            "userArea"
        );

    if (!area) {
        return;
    }

    const stored =
        localStorage.getItem(
            "nemu_user"
        );

    if (!stored) {

        area.innerHTML = `
            Guest ·
            <button
                class="btn ghost"
                onclick="openModal('login')"
                style="padding:4px"
            >
                Login
            </button>
        `;

        return;
    }

    try {

        const user =
            JSON.parse(stored);

        area.innerHTML = `
            Hi,
            ${escapeHTML(
                user.username ||
                "User"
            )}
            👋 ·

            <button
                class="btn ghost"
                style="padding:4px"
                onclick="logout()"
            >
                Logout
            </button>
        `;

    } catch {

        localStorage.removeItem(
            "nemu_user"
        );

        updateUserArea();
    }
}

/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    localStorage.removeItem(
        "nemu_user"
    );

    toast(
        "Berhasil logout."
    );

    updateUserArea();
}

/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadLocalListings();

        initMap();

        updateUserArea();

        render();
    }
);
