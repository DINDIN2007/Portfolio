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
const carousels = document.querySelectorAll('.Project_Carousel');

carousels.forEach((carousel) => {
    const track = carousel.querySelector('.Carousel_Track');
    const images = carousel.querySelectorAll('.Carousel_Track img, .Carousel_Track iframe');
    const dotsContainer = carousel.querySelector('.Carousel_Dots'); 

    // Skip if this project tile has no images
    if (images.length === 0) return;

    // 1. DYNAMICALLY GENERATE DOTS
    dotsContainer.innerHTML = ''; // Clear out any hardcoded dots
    images.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active'); // Make the first dot active
        dotsContainer.appendChild(dot);
    });

    // 2. NOW GRAB THE NEWLY CREATED DOTS
    const dots = carousel.querySelectorAll('.dot');
    let currentIndex = 0;
    let autoSlideInterval;

    // Function to slide the track to the correct image
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update the active dot
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add('active');
        }
    }

    // Function to go to the next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    }

    // Auto cycle every 3000ms (3 seconds)
    function startAutoSlide() {
        stopAutoSlide(); // Prevent double-speed bugs
        autoSlideInterval = setInterval(nextSlide, 30000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Make Navigation Dots Clickable
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide(); 
            currentIndex = index; 
            updateCarousel();
            startAutoSlide(); 
        });
    });

    // Start automation
    startAutoSlide();

    // --- Swipe Logic (Touch Events) ---
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoSlide(); 
    });

    track.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', () => {
        if (startX > endX + 50) {
            nextSlide();
        } else if (startX < endX - 50) {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateCarousel();
        }
        startAutoSlide(); 
    });
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