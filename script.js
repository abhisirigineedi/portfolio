// Navigation menu toggle for mobile devices
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.innerHTML = navLinks.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when a link is clicked
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Add shadow to navbar on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        navbar.style.background = 'rgba(13, 17, 23, 0.95)';
    } else {
        navbar.style.boxShadow = 'none';
        navbar.style.background = 'rgba(13, 17, 23, 0.8)';
    }
});

// Intersection Observer for fade-in animations
const fadeElements = document.querySelectorAll('.fade-in');

const appearOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        }
    });
}, appearOptions);

fadeElements.forEach(element => {
    appearOnScroll.observe(element);
});

// Handle Contact Form Submission
const contactForm = document.getElementById('contactForm');
const statusDiv = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Disable button during "submission"
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
            .then(async (response) => {
                let res = await response.json();
                if (response.status == 200) {
                    statusDiv.textContent = "Thank you! Your message has been sent successfully.";
                    statusDiv.className = "form-status success";
                    contactForm.reset();
                } else {
                    console.log(response);
                    statusDiv.textContent = res.message || "Something went wrong! Please try again later.";
                    statusDiv.className = "form-status error";
                }
            })
            .catch(error => {
                console.log(error);
                statusDiv.textContent = "Something went wrong! Please try again later.";
                statusDiv.className = "form-status error";
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                statusDiv.style.display = 'block';

                // Hide message after 5 seconds
                setTimeout(() => {
                    statusDiv.style.display = 'none';
                    statusDiv.className = "form-status";
                }, 5000);
            });
    });
}
