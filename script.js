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
    const animateElements = document.querySelectorAll('.tip, .stat-item, .section-header, .dashboard-wrapper');
    
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
});
