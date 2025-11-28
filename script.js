// ==========================================
// VALEURS & PATRIMOINE - JAVASCRIPT
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close menu when clicking on a link (except dropdown parent)
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // If it's a dropdown toggle, handle it specially
                if (link.querySelector('.dropdown-arrow')) {
                    e.preventDefault();
                    const navItem = link.closest('.nav-item');
                    navItem.classList.toggle('open');
                } else {
                    menuToggle.classList.remove('active');
                    nav.classList.remove('active');
                }
            });
        });

        // Close menu when clicking a dropdown link
        const dropdownLinks = document.querySelectorAll('.dropdown-link');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // Header hide/show on scroll
    let lastScroll = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('hidden');
            return;
        }

        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down
            header.classList.add('hidden');
        } else {
            // Scrolling up
            header.classList.remove('hidden');
        }

        lastScroll = currentScroll;
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fade in elements    // Scroll Animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .method-step').forEach(card => {
        observer.observe(card);
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Service cards click handling (for better UX)
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.click();
            }
        });
    });

    // Google Sheets Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzLlnwoXkUJW4QUOBxMvVUHch7nbf-hWx-5fQkA_BIilFh1sTDm-_f3g-rcyNCClW1y/exec';

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formMessage = document.getElementById('formMessage');
            const submitButton = this.querySelector('button[type="submit"]');

            // Disable submit button
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi en cours...';

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Add timestamp
            data.timestamp = new Date().toISOString();

            try {
                // Use no-cors mode for Google Apps Script
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                // Show success message
                if (formMessage) {
                    formMessage.className = 'form-message success';
                    formMessage.textContent = 'Merci ! Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.';
                    formMessage.style.display = 'block';
                }

                // Reset form
                this.reset();

            } catch (error) {
                console.error('Error:', error);
                // Show error message
                if (formMessage) {
                    formMessage.className = 'form-message error';
                    formMessage.textContent = 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement par téléphone.';
                    formMessage.style.display = 'block';
                }
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = 'Envoyer le message';

                // Scroll to message
                if (formMessage) {
                    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });
    }
});
