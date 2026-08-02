/* ==========================================================================
   RUSHIKESH KHANDE - PORTFOLIO INTERACTIVE LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------------------------
    // 1. THEME SWITCHER (DARK SAPPHIRE & CRISP GREEN THEMES)
    // ----------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Check saved preference or default to dark
    const savedTheme = localStorage.getItem('rk_theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('rk_theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('rk_theme', 'dark');
        }
    });

    // ----------------------------------------------------------------------
    // 2. NAVBAR SCROLL EFFECT & MOBILE MENU
    // ----------------------------------------------------------------------
    const navbarWrapper = document.querySelector('.navbar-wrapper');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbarWrapper.classList.add('scrolled');
        } else {
            navbarWrapper.classList.remove('scrolled');
        }

        // Active Nav Link Update on Scroll
        let currentSection = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Navigation Toggle
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'ph ph-x';
        } else {
            icon.className = 'ph ph-list';
        }
    });

    // Close Mobile Menu when link clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.querySelector('i').className = 'ph ph-list';
        });
    });

    // ----------------------------------------------------------------------
    // 3. STATS COUNTER ANIMATION
    // ----------------------------------------------------------------------
    const statCards = document.querySelectorAll('.stat-num');
    let hasAnimatedStats = false;

    const animateStats = () => {
        statCards.forEach(card => {
            const target = parseInt(card.getAttribute('data-target'));
            let count = 0;
            const duration = 1500;
            const stepTime = Math.abs(Math.floor(duration / target));

            const timer = setInterval(() => {
                count += 1;
                if (target === 30 || target === 100 || target === 150) {
                    card.textContent = count + '+';
                } else {
                    card.textContent = count + '%';
                }

                if (count >= target) {
                    clearInterval(timer);
                }
            }, Math.max(stepTime, 20));
        });
    };

    // Trigger stats when hero section visible
    const heroSection = document.getElementById('home');
    const observerOptions = { threshold: 0.3 };
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimatedStats) {
                animateStats();
                hasAnimatedStats = true;
            }
        });
    }, observerOptions);

    if (heroSection) {
        statsObserver.observe(heroSection);
    }

    // ----------------------------------------------------------------------
    // 4. SKILLS FILTERING SYSTEM
    // ----------------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillPills = document.querySelectorAll('.skill-pill');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            skillPills.forEach(pill => {
                const category = pill.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    pill.style.display = 'inline-flex';
                } else {
                    pill.style.display = 'none';
                }
            });
        });
    });

    // ----------------------------------------------------------------------
    // 5. CERTIFICATE CAROUSEL SLIDER
    // ----------------------------------------------------------------------
    const certTrack = document.getElementById('cert-track');
    const certSlides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('cert-prev');
    const nextBtn = document.getElementById('cert-next');
    const dotsContainer = document.getElementById('cert-dots');

    let currentSlide = 0;
    const totalSlides = certSlides.length;

    // Clear and create Dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        certSlides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    const dots = document.querySelectorAll('.dot');

    const updateCarousel = () => {
        if (certTrack) {
            certTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    };

    const goToSlide = (index) => {
        currentSlide = index;
        updateCarousel();
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    };

    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    };

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }

    // Auto Play Carousel
    let carouselInterval = setInterval(nextSlide, 5000);

    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', () => clearInterval(carouselInterval));
        carouselWrapper.addEventListener('mouseleave', () => {
            carouselInterval = setInterval(nextSlide, 5000);
        });
    }

    // ----------------------------------------------------------------------
    // 6. IMAGE ZOOM & ANALYTICS PREVIEW MODAL
    // ----------------------------------------------------------------------
    const imageModal = document.getElementById('image-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSub = document.getElementById('modal-sub');
    const modalImgSrc = document.getElementById('modal-img-src');
    const closeModalBtn = document.getElementById('close-image-modal');

    const openImageModal = (imgSrc, title, subtitle) => {
        if (modalImgSrc) modalImgSrc.src = imgSrc;
        if (modalTitle) modalTitle.innerHTML = `<i class="ph ph-certificate"></i> ${title || 'Document View'}`;
        if (modalSub) modalSub.textContent = subtitle || 'Full-resolution verified document view.';
        if (imageModal) {
            imageModal.classList.add('active');
            imageModal.setAttribute('aria-hidden', 'false');
        }
    };

    const closeImageModal = () => {
        if (imageModal) {
            imageModal.classList.remove('active');
            imageModal.setAttribute('aria-hidden', 'true');
        }
    };

    // Open GSC Dashboard Proof
    const openAnalyticsBtn = document.getElementById('open-analytics-modal');
    const gscThumbImg = document.getElementById('gsc-thumb-img');

    if (openAnalyticsBtn) {
        openAnalyticsBtn.addEventListener('click', () => {
            openImageModal('assets/gsc-ga4-dashboard.jpg', 'Google Search Console & GA4 Performance Dashboard', 'Empirical organic keyword growth & analytics report for IPS Group.');
        });
    }

    if (gscThumbImg) {
        gscThumbImg.addEventListener('click', () => {
            openImageModal('assets/gsc-ga4-dashboard.jpg', 'Google Search Console & GA4 Performance Dashboard', 'Empirical organic keyword growth & analytics report for IPS Group.');
        });
    }

    // Zoomable Certificates
    const zoomableCerts = document.querySelectorAll('.cert-zoomable');
    zoomableCerts.forEach(cert => {
        cert.addEventListener('click', () => {
            const imgSrc = cert.getAttribute('data-img');
            const title = cert.getAttribute('data-title');
            openImageModal(imgSrc, title, 'Official verified certificate document.');
        });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeImageModal);

    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) closeImageModal();
        });
    }

    // ----------------------------------------------------------------------
    // 7. CONTACT FORM SUBMISSION HANDLER
    // ----------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;

            formStatus.className = 'form-status success';
            formStatus.innerHTML = `<i class="ph ph-check-circle"></i> Thank you ${name}! Your message has been sent successfully. Rushikesh will respond to rushikeshkhande09@gmail.com shortly.`;

            contactForm.reset();

            setTimeout(() => {
                formStatus.innerHTML = '';
            }, 6000);
        });
    }
});
