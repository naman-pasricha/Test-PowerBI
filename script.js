// ========== IFRAME LOAD HANDLER ==========
document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('powerbi-iframe');
    const loadingState = document.getElementById('loading-state');

    if (iframe) {
        iframe.addEventListener('load', () => {
            setTimeout(() => {
                iframe.classList.add('loaded');
                if (loadingState) {
                    loadingState.classList.add('hidden');
                }
            }, 500);
        });

        // Fallback: hide loader after 12s even if load event doesn't fire
        setTimeout(() => {
            iframe.classList.add('loaded');
            if (loadingState) {
                loadingState.classList.add('hidden');
            }
        }, 12000);
    }

    // ========== SMOOTH SCROLL FOR CTA ==========
    const ctaButton = document.getElementById('cta-explore');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('dashboard');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // ========== SCROLL ANIMATIONS ==========
    const animateElements = document.querySelectorAll('.tip, .stat-item, .section-header, .dashboard-wrapper, .linkedin-carousel-wrapper');
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in', 'visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    animateElements.forEach((el) => {
        el.classList.add('animate-in');
        observer.observe(el);
    });

    // ========== HIDE SCROLL INDICATOR ON SCROLL ==========
    const scrollIndicator = document.getElementById('scroll-indicator');
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                if (window.scrollY > 100 && scrollIndicator) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.pointerEvents = 'none';
                }
                scrollTimeout = null;
            }, 100);
        }
    }, { passive: true });

    // ========== LINKEDIN CAROUSEL NAVIGATION ==========
    const carousel = document.getElementById('linkedin-carousel');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];
    const cards = carousel ? carousel.querySelectorAll('.linkedin-card') : [];

    function getActiveIndex() {
        if (!carousel || cards.length === 0) return 0;
        const scrollLeft = carousel.scrollLeft;
        const cardWidth = cards[0].offsetWidth + 28; // card width + gap
        return Math.round(scrollLeft / cardWidth);
    }

    function updateDots(index) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function updateArrows(index) {
        if (prevBtn) prevBtn.disabled = index <= 0;
        if (nextBtn) nextBtn.disabled = index >= cards.length - 1;
    }

    function scrollToCard(index) {
        if (!carousel || !cards[index]) return;
        const card = cards[index];
        const scrollLeft = card.offsetLeft - (carousel.offsetWidth - card.offsetWidth) / 2;
        carousel.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        updateDots(index);
        updateArrows(index);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const current = getActiveIndex();
            if (current > 0) scrollToCard(current - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const current = getActiveIndex();
            if (current < cards.length - 1) scrollToCard(current + 1);
        });
    }

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index, 10);
            scrollToCard(index);
        });
    });

    // Sync dots on manual scroll/swipe
    if (carousel) {
        let carouselScrollTimeout;
        carousel.addEventListener('scroll', () => {
            if (carouselScrollTimeout) cancelAnimationFrame(carouselScrollTimeout);
            carouselScrollTimeout = requestAnimationFrame(() => {
                const index = getActiveIndex();
                updateDots(index);
                updateArrows(index);
            });
        }, { passive: true });

        // Initial state
        updateArrows(0);
    }
});
