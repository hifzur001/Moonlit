// Initialize AOS
AOS.init();

// DOM Elements
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const authButtons = document.getElementById("authButtons");
const userProfile = document.getElementById("userProfile");
const userInitials = document.getElementById("userInitials");
const authTitle = document.getElementById("authTitle");
const cubeLoader = document.getElementById("cubeLoader");
const profileForm = document.getElementById("profileForm");
const ordersSection = document.getElementById("ordersSection");
const couponsSection = document.getElementById("couponsSection");
const addressesSection = document.getElementById("addressesSection");
const addressForm = document.getElementById("addressForm");

// Check if user is logged in
function checkAuth() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        showUserProfile(user);
    }
}

// Show user profile
function showUserProfile(user) {
    authButtons.classList.add("d-none");
    userProfile.classList.remove("d-none");
    userInitials.textContent = `${user.firstName[0]}${user.lastName[0]}`;
}

// Toggle between login and signup forms
function toggleForms() {
    loginForm.classList.toggle("d-none");
    signupForm.classList.toggle("d-none");
    authTitle.textContent = loginForm.classList.contains("d-none")
        ? "Sign Up"
        : "Login";
}

// Show loader
function showLoader() {
    cubeLoader.classList.remove("d-none");
}

// Hide loader
function hideLoader() {
    cubeLoader.classList.add("d-none");
}

// Handle login
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showLoader();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
        (u) => u.email === email && u.password === password
    );

    setTimeout(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            showUserProfile(user);
            bootstrap.Offcanvas.getInstance(
                document.getElementById("authOffcanvas")
            ).hide();
            loginForm.reset();
        } else {
            alert("Invalid credentials");
        }
        hideLoader();
    }, 1000); // Simulating a delay for demonstration
});

// Handle signup
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showLoader();
    const user = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("signupEmail").value,
        password: document.getElementById("signupPassword").value
    };

    const users = JSON.parse(localStorage.getItem("users")) || [];

    setTimeout(() => {
        if (users.some((u) => u.email === user.email)) {
            alert("Email already exists");
            hideLoader();
            return;
        }

        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("user", JSON.stringify(user));

        showUserProfile(user);
        bootstrap.Offcanvas.getInstance(
            document.getElementById("authOffcanvas")
        ).hide();
        signupForm.reset();
        hideLoader();
    }, 1000); // Simulating a delay for demonstration
});

// Handle logout
function logout() {
    localStorage.removeItem("user");
    userProfile.classList.add("d-none");
    authButtons.classList.remove("d-none");
    hideAllSections();
}

// Hide all sections
function hideAllSections() {
    ordersSection.classList.add("d-none");
    couponsSection.classList.add("d-none");
    addressesSection.classList.add("d-none");
}

// Show Profile Modal
function showProfileModal() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        document.getElementById("profileFirstName").value = user.firstName;
        document.getElementById("profileLastName").value = user.lastName;
        document.getElementById("profileEmail").value = user.email;
        const profileModal = new bootstrap.Modal(
            document.getElementById("profileModal")
        );
        profileModal.show();
    }
}

// Handle profile form submission
profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = {
        firstName: document.getElementById("profileFirstName").value,
        lastName: document.getElementById("profileLastName").value,
        email: document.getElementById("profileEmail").value
    };

    localStorage.setItem("user", JSON.stringify(user));
    showUserProfile(user);
    const profileModal = bootstrap.Modal.getInstance(
        document.getElementById("profileModal")
    );
    profileModal.hide();
});

// Show Orders Section
function showOrders() {
    const ordersContent = document.getElementById("ordersContent");
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    hideAllSections();
    ordersSection.classList.remove("d-none");

    if (orders.length === 0) {
        ordersContent.innerHTML = "<p>No orders placed yet.</p>";
    } else {
        ordersContent.innerHTML = orders
            .map((order) => `<p>${order}</p>`)
            .join("");
    }
}

// Show Coupons Section
function showCoupons() {
    const couponsContent = document.getElementById("couponsContent");
    const coupons = JSON.parse(localStorage.getItem("coupons")) || [];
    hideAllSections();
    couponsSection.classList.remove("d-none");

    if (coupons.length === 0) {
        couponsContent.innerHTML = "<p>No coupons available.</p>";
    } else {
        couponsContent.innerHTML = coupons
            .map((coupon) => `<p>${coupon}</p>`)
            .join("");
    }
}

// Show Addresses Section
function showAddresses() {
    const addressesContent = document.getElementById("addressesContent");
    const addresses = JSON.parse(localStorage.getItem("addresses")) || [];
    hideAllSections();
    addressesSection.classList.remove("d-none");

    if (addresses.length === 0) {
        addressesContent.innerHTML = "<p>No addresses added yet.</p>";
    } else {
        addressesContent.innerHTML = addresses
            .map(
                (address) => `
<div class="mb-2">
    <p>${address.street}, ${address.city}, ${address.state}, ${address.zip}</p>
</div>
`
            )
            .join("");
    }
}

// Handle address form submission
addressForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const address = {
        street: document.getElementById("street").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        zip: document.getElementById("zip").value
    };

    const addresses = JSON.parse(localStorage.getItem("addresses")) || [];
    addresses.push(address);
    localStorage.setItem("addresses", JSON.stringify(addresses));

    showAddresses();
    const addressModal = bootstrap.Modal.getInstance(
        document.getElementById("addressModal")
    );
    addressModal.hide();
    addressForm.reset();
});

// Hide loader on page load
window.addEventListener("load", hideLoader);

// Check auth status on page load
checkAuth();

// Create bubbles function
function createBubbles() {
    const section = document.querySelector(".hero-section");
    for (let i = 0; i < 25; i++) {
        const bubble = document.createElement("div");
        bubble.className = "bubble";

        // Random size between 20px and 150px
        const size = Math.random() * 130 + 20;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        // Random position
        bubble.style.left = `${Math.random() * 100}%`;

        // Random delay and duration
        const duration = Math.random() * 4 + 6; // 6-10 seconds
        bubble.style.animationDuration = `${duration}s`;
        bubble.style.animationDelay = `${Math.random() * 5}s`;

        section.appendChild(bubble);
    }
}

// Initialize Swiper with coverflow effect
const swiper = new Swiper(".swiper-container", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    loopedSlides: 12,
    slidesPerView: 4,
    speed: 1000,
    spaceBetween: 10,
    coverflowEffect: {
        rotate: 20,
        stretch: 0,
        depth: 300,
        modifier: 1,
        slideShadows: true
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
    },
    autoplay: {
        delay: 4500,
        disableOnInteraction: false
    },
    breakpoints: {
        // when window width is <= 480px
        480: {
            slidesPerView: 1,
            spaceBetween: 10
        },
        // when window width is <= 768px
        768: {
            slidesPerView: 2,
            spaceBetween: 10
        },
        // when window width is <= 1024px
        1024: {
            slidesPerView: 3,
            spaceBetween: 10
        }
    },
    on: {
        init: function () {
            // Create bubbles when Swiper initializes
            createBubbles();
        },
        slideChange: function () {
            const activeSlide = this.slides[this.activeIndex];
            const title = activeSlide.dataset.title;
            const subtitle = activeSlide.dataset.subtitle;

            const titleElement = document.querySelector(".hero-title");
            const subtitleElement = document.querySelector(".hero-subtitle");

            // Fade out
            titleElement.style.opacity = "0";
            subtitleElement.style.opacity = "0";

            setTimeout(() => {
                // Update the title and subtitle
                titleElement.textContent = title;
                subtitleElement.textContent = subtitle;

                // Fade in
                titleElement.style.opacity = "1";
                subtitleElement.style.opacity = "1";
            }, 500);
        }
    }
});

// Add navigation buttons to the container
const swiperContainer = document.querySelector(".swiper-container");
const nextButton = document.createElement("div");
const prevButton = document.createElement("div");
nextButton.className = "swiper-button-next";
prevButton.className = "swiper-button-prev";
swiperContainer.appendChild(nextButton);
swiperContainer.appendChild(prevButton);

// Remove the window.onload event listener since Swiper will handle bubble creation
