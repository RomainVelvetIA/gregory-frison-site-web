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
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxLTZ4iCBXivqcNQ5s_YMjlateIW0sXuvKgFy5Y6UQLJX2INhdOrwynP16FlmAwnJ4/exec';

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formMessage = document.getElementById('formMessage');
            const submitButton = this.querySelector('button[type="submit"]');

            // Disable submit button
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi en cours...';

            // Get form data
            const formData = new FormData(this);
            const params = new URLSearchParams();
            for (const [key, value] of formData.entries()) {
                params.append(key, value);
            }
            // Add timestamp
            params.append('timestamp', new Date().toISOString());

            try {
                // Use no-cors mode for Google Apps Script
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: params
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

// ==========================================
// GOOGLE REVIEWS HORIZONTAL SECTION
// ==========================================
async function initReviewsSection() {
    // Configuration
    const config = {
        placeId: "ChIJv5fb4fwv5UcRSvF-F-0vp-c", // Your Google Place ID
        googleUrl: "https://www.google.com/search?q=gestionnaire+de+patrimoine+bourges&sca_esv=b338e4d9bf6df8e5&rlz=1C5CHFA_enFR972FR974&sxsrf=AE3TifPcQ3pEh5aX4q5dTZNzZyp2fd4Zjg:1765461598352&udm=1&lsack=Xs46aZubFYGckdUPp9_c6A4&sa=X&ved=2ahUKEwibwrz72LWRAxUBTqQEHacvF-0QjGp6BAgiEAE&biw=1439&bih=709&dpr=2#vhid=/g/11v5fb4fwv&vssid=rllrl",
        fallbackReviews: [
            {
                name: "Jean Parent",
                initial: "J",
                text: "Nous faisons confiance au cabinet valeurs & Patrimoine depuis 2 ans. Nous sommes très satisfaits de l'accompagnement et des conseils qui nous sont délivrés. Monsieur Frison est une personne compétente et soucieuse de l'intérêt de ses clients.",
                date: "Il y a quelque temps",
                rating: 5
            },
            {
                name: "Dominique Dabin",
                initial: "D",
                text: "Avec Grégory le contact est facile, les explications claires et les choix proposés pertinents. Sa disponibilité fait de lui un contact privilégié pour un bonne gestion de son patrimoine.",
                date: "Il y a quelque temps",
                rating: 5
            },
            {
                name: "Jean-Marc Godard",
                initial: "J",
                text: "Visite du 26 février : Ai reçu ce jour monsieur Frison Grégory pour un changement de contrat. Entretien toujours très agréable doublé de compétences irréprochables. Vous prie de m’excuser pour le retard à vous répondre. Bien cordialement.",
                date: "Il y a quelque temps",
                rating: 5
            },
            {
                name: "Odile Lucas",
                initial: "O",
                text: "Très professionnel, à l'écoute de ses clients, de bon conseil ; vous pouvez contacter Mr Frison en toute confiance en aucun cas vous ne serez déçu",
                date: "Il y a quelque temps",
                rating: 5
            },
            {
                name: "Didier Moreau",
                initial: "D",
                text: "Monsieur Frison est un courtier à l'écoute, disponible et réactif. Je recommande sans hésiter.",
                date: "Il y a quelque temps",
                rating: 5
            },
            {
                name: "Delphine Boureux",
                initial: "D",
                text: "Un conseiller à l'écoute et qui donne des conseils adaptés à nos besoins avec qui on est parfaitement en confiance.",
                date: "Il y a quelque temps",
                rating: 5
            },
            {
                name: "Chantal Pardailhe-galabrun",
                initial: "C",
                text: "Grégory Frison a su nous conseiller de façon très favorable , mon mari et moi , pour placer au mieux un héritage familial. Nous en sommes très satisfaits.",
                date: "Il y a quelque temps",
                rating: 5
            },
            {
                name: "Laurence Gamard",
                initial: "L",
                text: "Très satisfaite des conseils et des contrats souscrits avec le cabinet valeurs et patrimoine. Je recommande.",
                date: "Il y a quelque temps",
                rating: 5
            },
            {
                name: "Samet Ghislaine",
                initial: "S",
                text: "Très bon conseiller ,très avenant et à l'écoute du client Toujours de bonne disponibilité Je le recommande fortement",
                date: "Il y a quelque temps",
                rating: 5
            }
        ]
    };

    let reviews = [];
    let rating = "5.0";
    let reviewCount = "10";

    // Use the defined reviews directly
    reviews = config.fallbackReviews;


    // Helper function to format Google date
    function formatGoogleDate(dateString) {
        if (!dateString) return "Récemment";

        try {
            const reviewDate = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - reviewDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 7) return "Il y a quelques jours";
            if (diffDays < 30) return "Il y a quelques semaines";
            if (diffDays < 60) return "Il y a 1 mois";
            if (diffDays < 90) return "Il y a 2 mois";
            if (diffDays < 180) return `Il y a ${Math.floor(diffDays / 30)} mois`;
            if (diffDays < 365) return "Il y a 6 mois";
            return `Il y a ${Math.floor(diffDays / 365)} an${Math.floor(diffDays / 365) > 1 ? 's' : ''}`;
        } catch {
            return "Récemment";
        }
    }

    // Find the partners section to insert after
    const partnersSection = document.querySelector('.partners-section');
    if (!partnersSection) return;

    // Create the HTML structure
    // We duplicate the reviews 4 times to ensure smooth infinite scrolling for various screen widths
    const allReviews = [...reviews, ...reviews, ...reviews, ...reviews];

    const sectionHtml = `
        <section class="reviews-section-horizontal">
            <div class="container">
                <h2 class="reviews-section-title">CE QUE DISENT NOS CLIENTS</h2>
                
                <div class="reviews-track-container">
                    <div class="reviews-track">
                        ${allReviews.map(review => `
                            <div class="review-card-horizontal">
                                <div class="review-card-header">
                                    <div class="review-avatar-circle">${review.initial}</div>
                                    <div class="review-meta">
                                        <span class="review-author">${review.name}</span>
                                        <span class="review-date-badge">${review.date}</span>
                                    </div>
                                </div>
                                <div class="review-stars-row">${'★'.repeat(review.rating || 5)}</div>
                                <div class="review-text-content">"${review.text}"</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="reviews-cta-container">
                    <a href="${config.googleUrl}" target="_blank" class="btn btn-google">
                        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style="vertical-align: middle;">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                            <path fill="none" d="M0 0h48v48H0z"/>
                        </svg>
                        Voir les ${reviewCount} avis sur Google
                    </a>
                </div>
            </div>
        </section>
    `;

    // Insert AFTER the partners section
    partnersSection.insertAdjacentHTML('afterend', sectionHtml);
}

// Call init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReviewsSection);
} else {
    initReviewsSection();
}


