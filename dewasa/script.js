document.addEventListener('DOMContentLoaded', function() {

    // --- Element Selectors ---
    const body = document.body;
    const mainContent = document.getElementById('main-content');
    const detailPages = document.querySelectorAll('.course-detail-page');
    const viewDetailsButtons = document.querySelectorAll('.view-details-button');
    const backButtons = document.querySelectorAll('.back-button');
    const logoLink = document.getElementById('backToHome');
    const footerBackLinks = document.querySelectorAll('.back-to-main');
    const moduleItems = document.querySelectorAll('.module-item');
    const enrollButtons = document.querySelectorAll('.enroll-button'); // Ambil tombol "Daftar Kursus Ini"

    // Menu Toggle untuk Mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const mainHeader = document.getElementById('mainHeader');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars'); icon.classList.add('fa-times');
                if (mainHeader) mainHeader.classList.add('menu-open');
            } else {
                icon.classList.remove('fa-times'); icon.classList.add('fa-bars');
                if (mainHeader) mainHeader.classList.remove('menu-open');
            }
        });
        document.querySelectorAll('.nav-links a:not([data-target])').forEach(link => {
             link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                    if (mainHeader) mainHeader.classList.remove('menu-open');
                }
            });
        });
    }

    // Efek Header Saat Scroll
    if (mainHeader) {
        window.addEventListener('scroll', function() {
             const isMobileMenuOpen = navLinks && navLinks.classList.contains('active');
             if (!isMobileMenuOpen) {
                if (window.scrollY > 50) { mainHeader.classList.add('scrolled'); }
                else { mainHeader.classList.remove('scrolled'); }
            }
        });
    }

    // --- Fungsi untuk Menampilkan/Menyembunyikan Halaman ---
    function showDetailPage(targetId) {
        if (!mainContent || !body) return;
        detailPages.forEach(page => page.style.display = 'none');
        const targetPage = document.querySelector(targetId);

        if (targetPage) {
            mainContent.style.display = 'none';
            targetPage.style.display = 'block';
            body.classList.add('showing-detail');

            const videoPlayer = targetPage.querySelector('iframe[id^="course-video-player-"]');
            const videoTitleElement = targetPage.querySelector('h3[id^="video-section-title-"]');
            const defaultVideoSrc = targetPage.dataset.defaultVideo;

            if (videoPlayer && defaultVideoSrc) {
                videoPlayer.src = defaultVideoSrc;
            }
            if (videoTitleElement) {
                videoTitleElement.textContent = "Video Pengantar";
            }
            // Tutup semua modul saat pindah halaman detail
            targetPage.querySelectorAll('.module-item.active').forEach(activeModule => {
                activeModule.classList.remove('active');
            });

            window.scrollTo({ top: 0, behavior: 'auto' });
        } else {
            console.error("Target detail page not found:", targetId);
            showMainContentAndScroll('#kursus'); // Default kembali ke kursus jika target tidak ada
        }
    }

    function showMainContentAndScroll(sectionId) {
        if (!mainContent || !body) return;
        detailPages.forEach(page => {
            page.style.display = 'none';
            page.querySelectorAll('.module-item.active').forEach(activeModule => {
                activeModule.classList.remove('active');
            });
        });
        mainContent.style.display = 'block';
        body.classList.remove('showing-detail');

        if (sectionId) {
            setTimeout(() => { // Beri jeda agar mainContent benar-benar tampil
                const targetSection = document.querySelector(sectionId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 50); // Jeda singkat
        }
    }


    // --- Event Listeners Navigasi Halaman ---
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetId = event.currentTarget.dataset.target;
            // const introVideoSrc = event.currentTarget.dataset.introVideo; // Bisa dihapus jika defaultVideo dari section detail saja
            if (targetId) { showDetailPage(targetId); }
        });
    });

    // Modifikasi Tombol "Kembali ke Daftar Kursus"
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            showMainContentAndScroll('#kursus'); // Scroll ke bagian kursus
        });
    });

    // Modifikasi Tombol "Daftar Kursus Ini"
    enrollButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Mencegah default anchor jump jika ini <a>
            showMainContentAndScroll('#harga'); // Scroll ke bagian harga
        });
    });


    if (logoLink) {
        logoLink.addEventListener('click', (event) => {
            event.preventDefault();
            showMainContentAndScroll('#hero'); // Kembali ke hero saat logo diklik
        });
    }
    footerBackLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const targetSectionId = link.getAttribute('href');
            if (body.classList.contains('showing-detail')) {
                 event.preventDefault();
                 showMainContentAndScroll(targetSectionId);
            } else {
                // Jika sudah di main content, biarkan default scroll behavior
                const targetSection = document.querySelector(targetSectionId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
         });
    });

    // --- Event Listener untuk Modul Interaktif ---
    moduleItems.forEach(item => {
        const header = item.querySelector('.module-header');
        if (header) {
            header.addEventListener('click', () => {
                const parentDetailPage = item.closest('.course-detail-page');
                const videoPlayer = parentDetailPage ? parentDetailPage.querySelector('iframe[id^="course-video-player-"]') : null;
                const videoTitleElement = parentDetailPage ? parentDetailPage.querySelector('h3[id^="video-section-title-"]') : null;

                if (item.classList.contains('module-item-locked')) {
                    alert('Maaf, konten modul ini hanya tersedia untuk anggota GoodSkill.');
                    return;
                }

                const parentList = item.closest('.detail-module-list');
                if (!parentList) return;

                const isCurrentlyActive = item.classList.contains('active');

                parentList.querySelectorAll('.module-item.active').forEach(activeItem => {
                    if (activeItem !== item) {
                        activeItem.classList.remove('active');
                    }
                });

                item.classList.toggle('active');

                if (item.classList.contains('active')) {
                    const videoSrc = item.dataset.videoSrc;
                    const moduleTitleText = header.querySelector('span').textContent;
                    if (videoPlayer && videoSrc) {
                        videoPlayer.src = videoSrc;
                    }
                    if (videoTitleElement) {
                        videoTitleElement.textContent = `Video: ${moduleTitleText}`;
                    }
                } else { // Jika modul ditutup (karena diklik lagi saat aktif)
                    const defaultVideoSrc = parentDetailPage ? parentDetailPage.dataset.defaultVideo : null;
                    if (videoPlayer && defaultVideoSrc) {
                        videoPlayer.src = defaultVideoSrc;
                    }
                    if (videoTitleElement) {
                        videoTitleElement.textContent = "Video Pengantar";
                    }
                }
            });
        }
    });


    // --- Kode Lainnya (Testimoni, FAQ, Form, Copyright Year) ---
    const slides = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    let slideInterval;
    function showSlide(index) { if (!slides || slides.length === 0) return; slides.forEach((slide, i) => { slide.classList.remove('active'); if (i === index) { slide.classList.add('active'); } }); }
    function nextSlide() { if (!slides || slides.length === 0) return; currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0; showSlide(currentSlide); }
    function prevSlide() { if (!slides || slides.length === 0) return; currentSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1; showSlide(currentSlide); }
    function startSlideShow() { stopSlideShow(); if (slides && slides.length > 1) { slideInterval = setInterval(nextSlide, 7000); } }
    function stopSlideShow() { clearInterval(slideInterval); }
    if (slides.length > 0) { showSlide(currentSlide); startSlideShow(); if (prevBtn) { prevBtn.addEventListener('click', () => { prevSlide(); startSlideShow(); }); } if (nextBtn) { nextBtn.addEventListener('click', () => { nextSlide(); startSlideShow(); }); } const sliderElement = document.querySelector('.testimonial-slider'); if (sliderElement) { sliderElement.addEventListener('mouseenter', stopSlideShow); sliderElement.addEventListener('mouseleave', startSlideShow); } }

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => { const questionButton = item.querySelector('.faq-question'); if (questionButton) { questionButton.addEventListener('click', () => { const currentlyActiveItem = document.querySelector('.faq-item.active'); if (currentlyActiveItem && currentlyActiveItem !== item) { currentlyActiveItem.classList.remove('active'); } item.classList.toggle('active'); }); } });

    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) { currentYearSpan.textContent = new Date().getFullYear(); }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) { contactForm.addEventListener('submit', function(e) { e.preventDefault(); const name = document.getElementById('name').value.trim(); const email = document.getElementById('email').value.trim(); const message = document.getElementById('message').value.trim(); if (name === '' || email === '' || message === '') { alert('Mohon lengkapi semua kolom formulir.'); return; } const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (!emailPattern.test(email)) { alert('Mohon masukkan alamat email yang valid.'); return; } alert('Pesan Anda telah terkirim (simulasi). Terima kasih!'); contactForm.reset(); }); }

    const subscribeForms = document.querySelectorAll('.subscribe-form');
    subscribeForms.forEach(form => { form.addEventListener('submit', function(e) { e.preventDefault(); const emailInput = form.querySelector('input[type="email"]'); const email = emailInput.value.trim(); if (email === '') { alert('Mohon masukkan alamat email Anda.'); return; } const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (!emailPattern.test(email)) { alert('Mohon masukkan alamat email yang valid untuk berlangganan.'); return; } alert('Terima kasih telah berlangganan newsletter kami (simulasi)!'); form.reset(); }); });
});