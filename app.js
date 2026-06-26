document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Sticky Header
  // ==========================================
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  // Run once on load just in case page starts scrolled
  handleScroll();


  // ==========================================
  // 2. Mobile Menu Toggle
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });


  // ==========================================
  // 3. Pricing Toggle Switcher (Bulanan vs Tahunan)
  // ==========================================
  const pricingSwitcher = document.getElementById('pricing-switcher');
  const labelMonthly = document.getElementById('label-monthly');
  const labelYearly = document.getElementById('label-yearly');
  const priceVals = document.querySelectorAll('.price-val');
  const periodText = document.querySelectorAll('.period');

  const updatePricing = () => {
    const isYearly = pricingSwitcher.checked;
    
    if (isYearly) {
      labelMonthly.classList.remove('active');
      labelYearly.classList.add('active');
    } else {
      labelMonthly.classList.add('active');
      labelYearly.classList.remove('active');
    }

    priceVals.forEach((priceEl, idx) => {
      const card = priceEl.closest('.service-card');
      if (!card) return;
      
      const monthlyVal = priceEl.getAttribute('data-monthly');
      const yearlyVal = priceEl.getAttribute('data-yearly');
      const periodEl = card.querySelector('.period');
      
      // Simple animate transition
      priceEl.style.opacity = '0';
      priceEl.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        if (isYearly) {
          priceEl.textContent = yearlyVal.includes('.') ? yearlyVal : yearlyVal + '.000';
          if (periodEl) periodEl.textContent = '/tahun';
        } else {
          priceEl.textContent = monthlyVal.includes('.') ? monthlyVal : monthlyVal + '.000';
          if (periodEl) periodEl.textContent = '/bulan';
        }
        priceEl.style.opacity = '1';
        priceEl.style.transform = 'translateY(0)';
      }, 200);
    });
  };

  pricingSwitcher.addEventListener('change', updatePricing);
  // Initialize states
  updatePricing();


  // ==========================================
  // 4. Tab Navigation for Team / Divisions
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetTab = btn.getAttribute('data-tab');

      // Update button active states
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update pane active states
      tabPanes.forEach(pane => {
        if (pane.id === targetTab) {
          pane.classList.add('active');
          pane.style.display = 'block';
        } else {
          pane.classList.remove('active');
          pane.style.display = 'none';
        }
      });
    });
  });


  // ==========================================
  // 5. Package Order Action Integrator
  // ==========================================
  const orderButtons = document.querySelectorAll('.btn-order');
  const formPlanSelect = document.getElementById('form-plan');

  orderButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const planName = btn.getAttribute('data-plan');
      
      // Map to dropdown value
      if (planName.includes('Starter')) {
        formPlanSelect.value = 'Home Starter (30 Mbps)';
      } else if (planName.includes('Premium')) {
        formPlanSelect.value = 'Home Premium (100 Mbps)';
      } else if (planName.includes('Dedicated')) {
        formPlanSelect.value = 'Business Dedicated (1 Gbps+)';
      }
    });
  });


  // ==========================================
  // 6. Form Submission & Modal Handling
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const newsletterForm = document.getElementById('newsletter-form');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalMsg = document.getElementById('modal-msg');
  const modalTitle = document.getElementById('modal-title');

  const showModal = (title, message) => {
    const titleEl = modalOverlay.querySelector('.modal-title');
    const msgEl = modalOverlay.querySelector('.modal-text');
    
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.innerHTML = message;
    
    modalOverlay.classList.add('active');
  };

  const closeModal = () => {
    modalOverlay.classList.remove('active');
  };

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const phone = document.getElementById('form-phone').value;
    const plan = formPlanSelect.value || 'Umum';
    
    // Simulate API request delay
    const submitBtn = document.getElementById('btn-submit-form');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memproses...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      
      showModal(
        'Pendaftaran Berhasil!',
        `Halo <strong>${name}</strong>, terima kasih telah mendaftar layanan <strong>${plan}</strong> JARTAP.<br><br>Kode tiket registrasi Anda adalah <strong>JRT-${Math.floor(100000 + Math.random() * 900000)}</strong>. Representative kami akan menghubungi Anda melalui email <strong>${email}</strong> atau telepon <strong>${phone}</strong> dalam 1x24 jam untuk verifikasi kelayakan jaringan di alamat Anda.`
      );
      
      contactForm.reset();
    }, 1500);
  });

  // Newsletter Form handler
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    showModal(
      'Langganan Berhasil!',
      `Email Anda <strong>${email}</strong> telah terdaftar di database kami. Anda akan menerima buletin bulanan kami secara berkala.`
    );
    emailInput.value = '';
  });

  // Close modal events
  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });


  // ==========================================
  // 7. Scroll Animation Observer (Fade In)
  // ==========================================
  const animatedElements = document.querySelectorAll('.about-card, .service-card, .division-info-card, .team-card, .info-item, .contact-form-card');
  
  // Set initial hidden state styles via JS to guarantee compatibility if JS is disabled
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => {
    observer.observe(el);
  });

});
