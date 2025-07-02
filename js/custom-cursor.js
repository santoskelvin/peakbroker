// Custom Cursor and Page Animations for ISEVEN
class CustomCursor {
  constructor() {
    this.cursor = null;
    this.layer1 = null;
    this.layer2 = null;
    this.trails = [];
    this.isDesktop = window.innerWidth > 768;
    this.currentX = 0;
    this.currentY = 0;
    this.layer1Position = { x: 0, y: 0 };
    this.layer2Position = { x: 0, y: 0 };
    this.init();
  }

  init() {
    if (!this.isDesktop) return;
    
    this.createCursor();
    this.bindEvents();
    this.startTrailSystem();
  }

  createCursor() {
    // Criar cursor principal
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    document.body.appendChild(this.cursor);

    // Criar camadas líquidas
    this.layer1 = document.createElement('div');
    this.layer1.className = 'cursor-layer-1';
    document.body.appendChild(this.layer1);

    this.layer2 = document.createElement('div');
    this.layer2.className = 'cursor-layer-2';
    document.body.appendChild(this.layer2);

    // Iniciar animação das camadas
    this.startLiquidAnimation();
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => this.updateCursorPosition(e));
    document.addEventListener('mousedown', () => this.addClickState());
    document.addEventListener('mouseup', () => this.removeClickState());
    
    // Primary hover elements
    const primaryHoverElements = '.btn, .hero-primary-btn, .hero-secondary-btn, .cta-button';
    document.querySelectorAll(primaryHoverElements).forEach(el => {
      el.addEventListener('mouseenter', () => this.addMagneticState());
      el.addEventListener('mouseleave', () => this.removeMagneticState());
    });

    // Secondary hover elements
    const secondaryHoverElements = 'a, button, .trading-card, .nav-link, .tab, .bg-card, .feature-card';
    document.querySelectorAll(secondaryHoverElements).forEach(el => {
      el.addEventListener('mouseenter', () => this.addHoverState());
      el.addEventListener('mouseleave', () => this.removeHoverState());
    });

    // Scale up elements
    const scaleElements = '.cx-gpay, .cx-nmbrs, .grid-money img';
    document.querySelectorAll(scaleElements).forEach(el => {
      el.addEventListener('mouseenter', () => this.addScaleState());
      el.addEventListener('mouseleave', () => this.removeScaleState());
    });

    // View mode for images
    const imageElements = '.platform-image, .mkp2, img[src*="MOCKUP"]';
    document.querySelectorAll(imageElements).forEach(el => {
      el.addEventListener('mouseenter', () => this.addViewState());
      el.addEventListener('mouseleave', () => this.removeViewState());
    });

    // Text input states
    const textElements = 'input, textarea, [contenteditable]';
    document.querySelectorAll(textElements).forEach(el => {
      el.addEventListener('mouseenter', () => this.addTextState());
      el.addEventListener('mouseleave', () => this.removeTextState());
    });
  }

  updateCursorPosition(e) {
    if (!this.cursor || !this.layer1 || !this.layer2) return;
    
    // Atualizar posição atual
    this.currentX = e.clientX;
    this.currentY = e.clientY;
    
    // Posicionamento do cursor principal
    this.cursor.style.left = this.currentX + 'px';
    this.cursor.style.top = this.currentY + 'px';
    
    // Create trail effect com pequeno delay para suavidade
    requestAnimationFrame(() => {
      this.createTrail(this.currentX, this.currentY);
    });
  }

  createTrail(x, y) {
    if (this.trails.length > 8) {
      const oldTrail = this.trails.shift();
      if (oldTrail && oldTrail.parentNode) {
        oldTrail.parentNode.removeChild(oldTrail);
      }
    }

    // Create main trail
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    document.body.appendChild(trail);
    this.trails.push(trail);

    // Create particle effect occasionally
    if (Math.random() > 0.7) {
      this.createParticle(x, y);
    }

    setTimeout(() => {
      if (trail && trail.parentNode) {
        trail.parentNode.removeChild(trail);
        const index = this.trails.indexOf(trail);
        if (index > -1) this.trails.splice(index, 1);
      }
    }, 1200);
  }

  createParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    
    // Random particle position offset
    const offsetX = (Math.random() - 0.5) * 40;
    const offsetY = (Math.random() - 0.5) * 40;
    
    particle.style.left = x + offsetX + 'px';
    particle.style.top = y + offsetY + 'px';
    particle.style.setProperty('--x', (Math.random() - 0.5) * 60 + 'px');
    particle.style.setProperty('--y', (Math.random() - 0.5) * 60 + 'px');
    
    document.body.appendChild(particle);

    setTimeout(() => {
      if (particle && particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 1500);
  }

  addHoverState() {
    if (this.cursor) {
      this.cursor.classList.remove('magnetic', 'scale-up', 'view');
      this.cursor.classList.add('hover');
    }
    if (this.layer1 && this.layer2) {
      this.layer1.classList.add('faster');
      this.layer2.classList.add('faster');
    }
  }

  removeHoverState() {
    if (this.cursor) this.cursor.classList.remove('hover');
    if (this.layer1 && this.layer2) {
      this.layer1.classList.remove('faster');
      this.layer2.classList.remove('faster');
    }
  }

  addMagneticState() {
    if (this.cursor) {
      this.cursor.classList.remove('hover', 'scale-up', 'view');
      this.cursor.classList.add('magnetic');
    }
    if (this.layer1 && this.layer2) {
      this.layer1.classList.add('faster');
      this.layer2.classList.add('faster');
    }
  }

  removeMagneticState() {
    if (this.cursor) this.cursor.classList.remove('magnetic');
    if (this.layer1 && this.layer2) {
      this.layer1.classList.remove('faster');
      this.layer2.classList.remove('faster');
    }
  }

  addScaleState() {
    if (this.cursor) {
      this.cursor.classList.remove('hover', 'magnetic', 'view');
      this.cursor.classList.add('scale-up');
    }
  }

  removeScaleState() {
    if (this.cursor) this.cursor.classList.remove('scale-up');
  }

  addViewState() {
    if (this.cursor) {
      this.cursor.classList.remove('hover', 'magnetic', 'scale-up');
      this.cursor.classList.add('view');
    }
  }

  removeViewState() {
    if (this.cursor) this.cursor.classList.remove('view');
  }

  addClickState() {
    if (this.cursor) {
      this.cursor.classList.add('click');
      // Create burst effect on click
      this.createClickBurst();
    }
    if (this.orbitBall) {
      this.orbitBall.classList.add('slower');
      this.orbitSpeed = 0.04; // Mais lento no click
    }
  }

  removeClickState() {
    if (this.cursor) this.cursor.classList.remove('click');
    if (this.orbitBall) {
      this.orbitBall.classList.remove('slower');
      this.orbitSpeed = 0.08; // Velocidade normal
    }
  }

  addTextState() {
    if (this.cursor) {
      this.cursor.classList.remove('hover', 'magnetic', 'scale-up', 'view');
      this.cursor.classList.add('text');
    }
    if (this.orbitBall) {
      this.orbitBall.classList.add('hidden');
    }
  }

  removeTextState() {
    if (this.cursor) this.cursor.classList.remove('text');
    if (this.orbitBall) {
      this.orbitBall.classList.remove('hidden');
    }
  }

  createClickBurst() {
    const rect = this.cursor.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const angle = (360 / 6) * i;
        const distance = 30;
        const x = centerX + Math.cos(angle * Math.PI / 180) * distance;
        const y = centerY + Math.sin(angle * Math.PI / 180) * distance;
        
        this.createParticle(x, y);
      }, i * 50);
    }
  }

  startTrailSystem() {
    // Subtle trail animation system is handled in createTrail method
  }

  startLiquidAnimation() {
    const updateLayers = () => {
      if (!this.layer1 || !this.layer2) return;
      
      // Animação suave para camada 1 (delay médio)
      this.layer1Position.x += (this.currentX - this.layer1Position.x) * 0.15;
      this.layer1Position.y += (this.currentY - this.layer1Position.y) * 0.15;
      
      // Animação suave para camada 2 (delay maior)
      this.layer2Position.x += (this.currentX - this.layer2Position.x) * 0.08;
      this.layer2Position.y += (this.currentY - this.layer2Position.y) * 0.08;
      
      // Aplicar posições
      this.layer1.style.left = this.layer1Position.x + 'px';
      this.layer1.style.top = this.layer1Position.y + 'px';
      
      this.layer2.style.left = this.layer2Position.x + 'px';
      this.layer2.style.top = this.layer2Position.y + 'px';
      
      requestAnimationFrame(updateLayers);
    };
    
    updateLayers();
  }
}

// Page Load Animations
class PageAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupLoader();
    this.setupScrollAnimations();
    this.addPageEnterAnimations();
  }

  setupLoader() {
    // Create enhanced loader if it doesn't exist
    if (!document.querySelector('.page-loader')) {
      this.createLoader();
    }
    
    window.addEventListener('load', () => {
      this.hideLoader();
    });
  }

  createLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-spinner"></div>
        <div class="loader-text">ISEVEN</div>
        <div class="loader-progress">
          <div class="loader-progress-bar"></div>
        </div>
      </div>
    `;
    document.body.appendChild(loader);
  }

  hideLoader() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('loaded');
        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 800);
      }, 500);
    }
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all sections for scroll animations
    document.querySelectorAll('section, .about, .st, .pg, .active').forEach(section => {
      section.classList.add('section-animate');
      observer.observe(section);
    });

    // Add stagger children class to grid containers
    document.querySelectorAll('.gpay, .nmbrs, .trading-cards-grid').forEach(container => {
      container.classList.add('stagger-children');
    });
  }

  addPageEnterAnimations() {
    // Add page enter animations to key elements
    const elementsToAnimate = [
      '.h1',
      '.h2', 
      '.paragraph',
      '.btn',
      '.nav',
      '.header'
    ];

    elementsToAnimate.forEach((selector, index) => {
      document.querySelectorAll(selector).forEach(el => {
        el.classList.add('page-enter', `delay-${Math.min(index + 1, 4)}`);
      });
    });
  }
}

// Smooth Scroll Enhancement
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.documentElement.classList.add('smooth-scroll');
    
    // Enhanced smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// Hero Enhancements
class HeroEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollIndicator();
    this.setupPlatformInteractions();
    this.setupFloatingElements();
    this.setupCounterAnimation();
  }

  setupScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        const nextSection = document.querySelector('.ticker-container');
        if (nextSection) {
          nextSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    }
  }

  setupPlatformInteractions() {
    const platformImage = document.querySelector('.platform-image');
    if (platformImage) {
      // Add parallax effect on mouse move
      document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPos = (clientX / innerWidth - 0.5) * 10;
        const yPos = (clientY / innerHeight - 0.5) * 10;
        
        platformImage.style.transform = `translateY(-10px) scale(1.02) rotateY(${xPos}deg) rotateX(${-yPos}deg)`;
      });

      // Reset on mouse leave
      document.addEventListener('mouseleave', () => {
        platformImage.style.transform = 'translateY(-10px) scale(1.02)';
      });
    }
  }

  setupFloatingElements() {
    // Add random floating animation variations
    const floatingCoins = document.querySelectorAll('.floating-coin');
    floatingCoins.forEach((coin, index) => {
      const randomDelay = Math.random() * 2;
      const randomDuration = 8 + Math.random() * 4;
      
      coin.style.animationDelay = `${randomDelay}s`;
      coin.style.animationDuration = `${randomDuration}s`;
    });
  }

  setupTypewriterEffect() {
    const titleElement = document.querySelector('.hero-mega-title');
    if (!titleElement) return;

    const fullText = titleElement.innerHTML;
    titleElement.innerHTML = '';
    titleElement.style.opacity = '1';

    let currentIndex = 0;
    const typeSpeed = 50;

    function typeWriter() {
      if (currentIndex < fullText.length) {
        titleElement.innerHTML = fullText.slice(0, currentIndex + 1);
        currentIndex++;
        setTimeout(typeWriter, typeSpeed);
      }
    }

    // Start typing after initial animation delay
    setTimeout(typeWriter, 800);
  }

  setupCounterAnimation() {
    const trustText = document.querySelector('.trust-text strong');
    if (!trustText) return;

    const targetNumber = 312295;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentNumber = Math.floor(targetNumber * easeOutQuart);
      
      trustText.textContent = currentNumber.toLocaleString('pt-BR');
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    // Start counter animation after a delay
    setTimeout(() => {
      requestAnimationFrame(updateCounter);
    }, 1500);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CustomCursor();
  new PageAnimations();
  new SmoothScroll();
  new HeroEnhancements();
  
  // Add some extra polish
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// Handle resize events
window.addEventListener('resize', () => {
  const isDesktop = window.innerWidth > 768;
  if (!isDesktop) {
    // Remove cursor on mobile
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) cursor.style.display = 'none';
    
    // Reset cursor for mobile
    document.querySelectorAll('*').forEach(el => {
      el.style.cursor = 'auto';
    });
  }
}); 