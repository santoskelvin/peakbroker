// Modern Animations for ISEVEN Site
// Animações modernas para melhorar a experiência do usuário

// ==========================================
// SCROLL ANIMATIONS - Animações de Scroll
// ==========================================
  
// Intersection Observer para animações ao fazer scroll
  const observerOptions = {
  root: null,
  rootMargin: '0px 0px -100px 0px',
  threshold: 0.1
  };

// Função para animar elementos ao entrar na viewport
function handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      
      // Para cards com delay progressivo
      if (entry.target.classList.contains('feature-card')) {
        const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
        entry.target.style.animationDelay = `${delay}ms`;
      }
      
      observer.unobserve(entry.target);
    }
  });
}

const scrollObserver = new IntersectionObserver(handleIntersection, observerOptions);

// ==========================================
// PARTICLE SYSTEM - Sistema de Partículas
// ==========================================

class ModernParticles {
  constructor(container) {
    this.container = container;
    this.particles = [];
    this.init();
  }

  init() {
    // Criar canvas para partículas
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.opacity = '0.6';
    this.canvas.style.zIndex = '1';
    
    this.container.appendChild(this.canvas);
    
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  createParticles() {
    const numParticles = Math.min(50, Math.floor(this.canvas.width / 20));
    
    for (let i = 0; i < numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        color: `rgba(213, 250, 33, ${Math.random() * 0.3 + 0.1})`
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x <= 0 || particle.x >= this.canvas.width) particle.vx *= -1;
      if (particle.y <= 0 || particle.y >= this.canvas.height) particle.vy *= -1;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ==========================================
// SMOOTH INTERACTIONS - Interações Suaves
// ==========================================

class SmoothInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.setupHoverEffects();
    this.setupRippleEffect();
    this.setupParallax();
  }

  setupHoverEffects() {
    // Hover effect para cards
    document.querySelectorAll('.feature-card, .cta-card').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        card.style.transform = 'translateY(-12px) scale(1.02)';
        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      });

      card.addEventListener('mouseleave', (e) => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  setupRippleEffect() {
    // Ripple effect para botões
    document.querySelectorAll('.cta-button, .hero-cta').forEach(button => {
      button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0);
          animation: ripple-effect 0.6s ease-out;
          left: ${x}px;
          top: ${y}px;
          width: ${size}px;
          height: ${size}px;
          pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  setupParallax() {
    // Parallax suave para elementos de fundo
    const parallaxElements = document.querySelectorAll('.modern-section::before');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      parallaxElements.forEach(element => {
        element.style.transform = `translateY(${rate}px)`;
      });
    });
  }
}

// ==========================================
// ENHANCED LOADING - Carregamento Melhorado
// ==========================================

class EnhancedLoading {
  constructor() {
    this.init();
  }

  init() {
    // Preload de imagens importantes
    this.preloadImages();
    
    // Fade in progressivo
    this.setupProgressiveFadeIn();
  }

  preloadImages() {
    const imageUrls = [
      'images/i1.png',
      'images/i2.png', 
      'images/i3.png',
      'images/i4.png',
      'images/MOCKUP1-1.png'
    ];

    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

  setupProgressiveFadeIn() {
    const elements = document.querySelectorAll('.modern-section .section-header, .features-grid, .feature-card');
    
    elements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 150);
    });
  }
}

// ==========================================
// PERFORMANCE OPTIMIZATION - Otimização
// ==========================================

class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.optimizeAnimations();
  }

  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  optimizeAnimations() {
    // Pausar animações quando não visíveis
    const animatedElements = document.querySelectorAll('[class*="animate"]');
    
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        } else {
          entry.target.style.animationPlayState = 'paused';
        }
      });
    });

    animatedElements.forEach(el => animationObserver.observe(el));
  }
}

// ==========================================
// PAYMENT SECTION ANIMATIONS - Seção de Métodos de Pagamento
// ==========================================

// Animação específica para seção de pagamentos
function initPaymentSectionAnimations() {
  const paymentSection = document.querySelector('.pg');
  const paymentCards = document.querySelectorAll('.pg .cx-gpay');
  const paymentMethods = document.querySelectorAll('.grid-money img');
  
  if (!paymentSection) return;

  // Animação de entrada dos cards de pagamento
  paymentCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 200 + (index * 150));
  });

  // Efeito parallax suave no background da seção
  function handlePaymentParallax() {
    const scrolled = window.pageYOffset;
    const section = paymentSection;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;
    
    if (scrolled + windowHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
      const progress = (scrolled + windowHeight - sectionTop) / (sectionHeight + windowHeight);
      const translateY = progress * 20;
      
      section.style.setProperty('--parallax-y', `${translateY}px`);
    }
  }

  // Animação de hover melhorada para métodos de pagamento
  paymentMethods.forEach(method => {
    method.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.08) rotate(2deg)';
      this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
      this.style.filter = 'grayscale(0%) brightness(1.3) contrast(1.1)';
    });

    method.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
      this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
      this.style.filter = 'grayscale(20%) brightness(1.1)';
    });
  });

  // Efeito de brilho no badge da seção
  const paymentBadge = paymentSection.querySelector('.tag');
  if (paymentBadge) {
    setInterval(() => {
      paymentBadge.style.boxShadow = '0 0 20px rgba(213, 250, 33, 0.4)';
      setTimeout(() => {
        paymentBadge.style.boxShadow = '0 8px 20px rgba(213, 250, 33, 0.2)';
      }, 1000);
    }, 3000);
  }

  // Event listener para parallax
  window.addEventListener('scroll', handlePaymentParallax, { passive: true });
  handlePaymentParallax(); // Executa uma vez no carregamento
}

// ==========================================
// INITIALIZATION - Inicialização
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Aguardar um pouco para garantir que o CSS foi carregado
  setTimeout(() => {
    // Inicializar observador de scroll
    document.querySelectorAll('.scroll-animate, .feature-card, .cta-card, .section-header').forEach(el => {
      scrollObserver.observe(el);
    });

    // Inicializar partículas na seção moderna
    const modernSection = document.querySelector('.modern-section');
    if (modernSection) {
      new ModernParticles(modernSection);
    }

    // Inicializar interações
    new SmoothInteractions();
    
    // Inicializar carregamento otimizado
    new EnhancedLoading();
    
    // Inicializar otimizações de performance
    new PerformanceOptimizer();

    // Inicializar animações da seção de pagamentos
    setTimeout(initPaymentSectionAnimations, 500);

    console.log('🚀 ISEVEN Modern Animations carregadas com sucesso!');
  }, 100);
});

// ==========================================
// CSS ANIMATIONS VIA JAVASCRIPT
// ==========================================

// Adicionar keyframes dinamicamente se necessário
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-effect {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }

  .scroll-animate {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .scroll-animate.in-view {
    opacity: 1;
    transform: translateY(0);
  }

  /* Prevenção de layout shift */
  .feature-card img {
    aspect-ratio: 1 / 1;
    object-fit: contain;
  }
`;

document.head.appendChild(style);

// ===============================================
// SISTEMA DINÂMICO DE NOTIFICAÇÕES DE LUCRO
// ===============================================

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function generateRandomProfit() {
  // Gera valores entre R$ 100 e R$ 100.000
  const min = 100;
  const max = 100000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateNotificationValues() {
  const rows = document.querySelectorAll('.notification-row');
  
  rows.forEach(row => {
    const cards = row.querySelectorAll('.notification-card');
    const halfLength = cards.length / 2;
    
    // Atualiza apenas a primeira metade e copia para a segunda
    for (let i = 0; i < halfLength; i++) {
      const newValue = generateRandomProfit();
      const formattedValue = `Valor: ${formatCurrency(newValue)}`;
      
      // Atualiza o original
      cards[i].querySelector('.notification-value').textContent = formattedValue;
      
      // Atualiza a cópia (segunda metade)
      if (cards[i + halfLength]) {
        cards[i + halfLength].querySelector('.notification-value').textContent = formattedValue;
      }
    }
  });
}

// Inicializar sistema de notificações quando a página carregar
window.addEventListener('load', function() {
  // Atualiza os valores inicialmente se a seção existir
  if (document.querySelector('.profit-notifications')) {
    setTimeout(() => {
      updateNotificationValues();
      
      // Atualiza os valores a cada 12 segundos para criar dinamismo
      setInterval(updateNotificationValues, 12000);
    }, 500);
  }
  
  // Adiciona efeito de entrada gradual para as notificações
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const notificationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observa todas as notificações para animação de entrada
  document.querySelectorAll('.notification-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    notificationObserver.observe(card);
  });
}); 