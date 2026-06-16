var typingClass = document.getElementById("typing-anim");
var message = ["Hello World!", "Greetings...", "Good ", "Hola ¿Qué tal?", "Xin Chào", "こんにちは世界"]; // Added Japanese phrase
var messageIndex = 0;
var charIndex = 0;
var isDeleting = false;

// Find what time of the day
function findHour() {
    let currentHour = (new Date()).getHours();
    
    // Morning 5 am to 12 pm (noon)
    if (currentHour >= 5 && currentHour < 12) message[2] = "Good Morning🌅 ";
    // Afternoon 12 pm to 5 pm.
    else if (currentHour >= 12 && currentHour < 17) message[2] = "Good Afternoon☀️ ";
    // Evening 5 pm to 9 pm.
    else if (currentHour >= 17 && currentHour < 9) message[2] = "Good Evening🌄 ";
    // Night 9 pm to 4 am.
    else message[2] = "Good Night 🛏️ ";
}

function typeEffect() {
    // Check the time right before typing the "Good..." greeting
    if (messageIndex === 2 && charIndex === 0 && !isDeleting) {
        findHour();
    }

    // Using [...string] splits emojis and Japanese chars correctly into single array items
    const currentMessage = message[messageIndex];
    const currentChars = [...currentMessage]; 

    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    // Update the text inside the HTML element
    typingClass.innerHTML = currentChars.slice(0, charIndex).join("");

    // Determine typing speeds (Deleting is usually faster)
    let typeSpeed = isDeleting ? 50 : 120; 

    if (!isDeleting && charIndex === currentChars.length) {
        // Finished typing: pause before starting to delete
        typeSpeed = 2500;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Finished deleting: move to the next phrase in the array
        isDeleting = false;
        messageIndex = (messageIndex + 1) % message.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

// Start the typing animation
typeEffect();

// --- Sticky Header Logic ---
var header = document.getElementById("Header");
var sticky = header.offsetTop;

window.onscroll = function() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        header.classList.remove("backgroundHeader");
    }
    else {
        header.classList.add("backgroundHeader");
        header.classList.remove("sticky");
    }
};

// --- Carousel Logic (Fully Dynamic & Multi-Project Support) ---
// --- Carousel Logic (Manual Navigation Only) ---
const carousels = document.querySelectorAll('.Project_Carousel');

carousels.forEach((carousel) => {
    const track = carousel.querySelector('.Carousel_Track');
    // Selects EVERYTHING inside the track (imgs, iframes, model-viewers)
    const slides = carousel.querySelectorAll('.Carousel_Track > *'); 
    const dotsContainer = carousel.querySelector('.Carousel_Dots'); 
    const prevBtn = carousel.querySelector('.Prev_Btn');
    const nextBtn = carousel.querySelector('.Next_Btn');

    // Skip if this project tile has no visual content
    if (slides.length === 0) return;

    // 1. DYNAMICALLY GENERATE DOTS
    dotsContainer.innerHTML = ''; 
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active'); 
        dotsContainer.appendChild(dot);
    });

    const dots = carousel.querySelectorAll('.dot');
    let currentIndex = 0;

    // Function to slide the track
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add('active');
        }
    }

    // Make Dots Clickable
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index; 
            updateCarousel();
        });
    });

    // Make Prev/Next Arrows Clickable
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });
    }
    
    // Note: Auto-slide and swipe logic are intentionally omitted 
    // to prevent interference with <model-viewer> touch-panning.
});

// --- Image Modal / Lightbox Logic ---
const modal = document.getElementById("Image_Modal");
const modalImg = document.getElementById("Modal_Img");
const closeBtn = document.querySelector(".close_modal");

// 1. Get all images inside ANY carousel on the page
const allCarouselImages = document.querySelectorAll('.Carousel_Track img');

// 2. Add click event to each of those images
allCarouselImages.forEach(img => {
    img.addEventListener('click', function() {
        modalImg.src = this.src;     // Grab the image source
        modal.classList.add("show"); // Reveal the modal popup
    });
});

// 3. Close modal when clicking the 'X' button
closeBtn.addEventListener('click', function() {
    modal.classList.remove("show");
});

// 4. Close modal when clicking anywhere in the dark background space
modal.addEventListener('click', function(e) {
    // Check if they clicked the background, not the image itself
    if (e.target !== modalImg) {
        modal.classList.remove("show");
    }
});

/* ============================================================
   5. TEXT MODAL (ENGINEERING REPORTS)
============================================================ */

const textModal = document.getElementById("Text_Modal");
const closeTextBtn = document.querySelector(".close_text_modal");
const openModalBtns = document.querySelectorAll(".Open_Text_Modal_Btn");

// Open the modal when a "Read Engineering Report" button is clicked
openModalBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // We use data-target in case you want to add multiple different reports later!
        const targetId = btn.getAttribute("data-target");
        
        // Hide all reports first, then show the one requested
        document.querySelectorAll(".modal_text_body").forEach(body => {
            body.style.display = "none";
        });
        document.getElementById(targetId).style.display = "block";
        
        textModal.classList.add("show");
    });
});

// Close via the ✕ button
closeTextBtn.addEventListener("click", () => {
    textModal.classList.remove("show");
});

// Close when clicking the dark backdrop outside the text box
textModal.addEventListener("click", (e) => {
    if (e.target === textModal) {
        textModal.classList.remove("show");
    }
});