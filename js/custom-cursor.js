// ==========================================
// CURSOR PERSONALIZADO PEAKBROKER - NOVA VERSÃO
// ==========================================

class CustomCursor {
  constructor() {
    this.cursor = null;
    this.isDesktop = window.innerWidth > 768;
    this.currentX = 0;
    this.currentY = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.particlePool = [];
    this.activeParticles = [];
    this.lastParticleTime = 0;
    this.currentElement = null;
    this.adaptiveColor = 'var(--green)';
    this.lastColorCheckTime = 0;
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (!this.isDesktop) return;
    
    this.createCursor();
    this.bindEvents();
    
    // Cleanup periódico leve (não afeta performance)
    setInterval(() => {
      this.cleanup();
    }, 3000); // Limpeza a cada 3 segundos
    
    // Limpeza mais profunda para partículas órfãs
    setInterval(() => {
      this.cleanupOrphanedParticles();
    }, 8000); // Limpeza profunda a cada 8 segundos
    
    // Sistema FLUIDO e ADAPTATIVO implementado:
    // ✅ MOVIMENTO INSTANTÂNEO - sem delay nas transições de posição
    // ✅ CONTRASTE AUTOMÁTICO - cursor escuro em fundos claros, verde em fundos escuros
    // ✅ PRIMEIRA SEÇÃO OTIMIZADA - sempre verde na hero/navegação
    // ✅ PARTÍCULAS EXPRESSIVAS - até 20 simultâneas com efeitos especiais
    // ✅ EFEITOS ÚNICOS - click burst, hover sutil, magnetic especial
    // ✅ PERFORMANCE OTIMIZADA - throttling e pooling inteligente
  }

  createCursor() {
    // Criar cursor principal
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    document.body.appendChild(this.cursor);

    // Garantir que inicie sempre com cor verde (visível)
    this.adaptiveColor = 'var(--green)';
    this.initTime = Date.now();
    
    // Ocultar cursor nativo
    document.body.style.cursor = 'none';
    document.documentElement.style.cursor = 'none';
    
    // Não criar camadas que seguem o cursor - removido para experiência mais limpa
  }

  bindEvents() {
    // Sistema simplificado e responsivo
    document.addEventListener('mousemove', (e) => this.updateCursorPosition(e));
    document.addEventListener('mousedown', () => this.addClickState());
    document.addEventListener('mouseup', () => this.removeClickState());
    
    // Elementos principais
    const primaryHoverElements = '.btn, .hero-primary-btn, .hero-secondary-btn, .cta-button';
    document.querySelectorAll(primaryHoverElements).forEach(el => {
      el.addEventListener('mouseenter', () => this.addMagneticState());
      el.addEventListener('mouseleave', () => this.removeMagneticState());
    });

    // Elementos secundários
    const allInteractiveElements = 'a, button, .trading-card, .nav-link, .tab, .bg-card, .feature-card, .cx-gpay, .cx-nmbrs, .grid-money img, .platform-image, .mkp2, img[src*="MOCKUP"]';
    document.querySelectorAll(allInteractiveElements).forEach(el => {
      el.addEventListener('mouseenter', () => this.addHoverState());
      el.addEventListener('mouseleave', () => this.removeHoverState());
    });

    // Elementos de texto
    const textElements = 'input, textarea, [contenteditable]';
    document.querySelectorAll(textElements).forEach(el => {
      el.addEventListener('mouseenter', () => this.addTextState());
      el.addEventListener('mouseleave', () => this.removeTextState());
    });
    
    // Limpeza completa quando a página perde foco ou usuário sai
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.forceCleanup();
      }
    });
    
    // Limpeza ao sair da janela
    window.addEventListener('beforeunload', () => {
      this.forceCleanup();
    });
  }

  updateCursorPosition(e) {
    if (!this.cursor) return;
    
    // Atualizar posição atual instantaneamente
    this.lastX = this.currentX;
    this.lastY = this.currentY;
    this.currentX = e.clientX;
    this.currentY = e.clientY;
    
    // Posicionamento do cursor principal - INSTANTÂNEO
    this.cursor.style.left = this.currentX + 'px';
    this.cursor.style.top = this.currentY + 'px';
    
    // Detectar cor de fundo e ajustar cursor (throttled mais conservador)
    const now = Date.now();
    if (now - this.lastColorCheckTime > 300) {
      this.adaptCursorColor();
      this.lastColorCheckTime = now;
    }
    
    // Criar partículas leves durante movimento
    this.createLightParticles();
  }

  // Sistema de Partículas Melhorado
  createLightParticles() {
    const now = Date.now();
    const deltaX = this.currentX - this.lastX;
    const deltaY = this.currentY - this.lastY;
    const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Mais partículas durante movimento rápido
    if (speed > 3 && now - this.lastParticleTime > 60 && this.activeParticles.length < 12) {
      // Usar requestAnimationFrame para melhor performance
      requestAnimationFrame(() => {
        this.createParticle();
      });
      this.lastParticleTime = now;
    }
  }

  createParticle(type = 'normal') {
    let particle = this.getPooledParticle();
    
    if (!particle) {
      particle = document.createElement('div');
      particle.className = 'cursor-particle';
      document.body.appendChild(particle);
    }
    
    // Aplicar cor adaptativa
    particle.style.background = this.getParticleColor();
    
    // Posicionar partícula com offset mínimo
    const randomOffset = Math.random() * 8 - 4;
    const offsetX = randomOffset;
    const offsetY = randomOffset * 0.7;
    
    particle.style.left = (this.currentX + offsetX) + 'px';
    particle.style.top = (this.currentY + offsetY) + 'px';
    
    // Direção aleatória otimizada
    const angle = Math.random() * Math.PI * 2;
    const distance = type === 'burst' ? 30 + Math.random() * 25 : 20 + Math.random() * 15;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    
    particle.style.setProperty('--dx', dx + 'px');
    particle.style.setProperty('--dy', dy + 'px');
    
    // Aplicar animação baseada no tipo
    const animationName = type === 'burst' ? 'particleBurst' : 'particleFade';
    const animationDuration = type === 'burst' ? '1.2s' : '1s';
    
    particle.style.animation = 'none';
    particle.offsetHeight; // Força reflow
    particle.style.animation = `${animationName} ${animationDuration} ease-out forwards`;
    
    this.activeParticles.push(particle);
    
    // Cleanup automático
    setTimeout(() => {
      this.recycleParticle(particle);
    }, type === 'burst' ? 1200 : 1000);
  }

  // Sistema de Detecção de Cor de Fundo Melhorado
  adaptCursorColor() {
    // Aguardar 1 segundo antes de ativar detecção para garantir início verde
    if (!this.isInitialized) {
      if (Date.now() - this.initTime > 1000) {
        this.isInitialized = true;
      } else {
        return; // Manter verde no início
      }
    }
    
    const element = document.elementFromPoint(this.currentX, this.currentY);
    if (element && element !== this.currentElement) {
      this.currentElement = element;
      
      // Verificar se está na primeira seção (hero) - sempre usar verde
      if (this.isHeroSection(element)) {
        this.adaptiveColor = 'var(--green)';
        this.cursor.classList.remove('dark-mode');
        return;
      }
      
      // Obter cor de fundo do elemento
      const bgColor = this.getBackgroundColor(element);
      const brightness = this.getBrightness(bgColor);
      
      // Ajustar cor do cursor baseado no brilho do fundo usando classes CSS
      // Aumentei o threshold para ser mais conservador
      if (brightness > 200) {
        // Fundo muito claro - usar modo escuro
        this.adaptiveColor = '#1a1b1f';
        this.cursor.classList.add('dark-mode');
      } else {
        // Fundo escuro/médio - usar cor PEAKBROKER
        this.adaptiveColor = 'var(--green)';
        this.cursor.classList.remove('dark-mode');
      }
    }
  }

  isHeroSection(element) {
    // Verificar se o elemento está na seção hero/primeira seção
    let currentElement = element;
    
    while (currentElement && currentElement !== document.body) {
      const classList = currentElement.classList;
      
      // Verificar classes típicas da primeira seção e navegação
      if (classList.contains('hero') || 
          classList.contains('hero-ultra-modern') || 
          classList.contains('hero-modern') || 
          classList.contains('header') ||
          classList.contains('st') ||
          classList.contains('nav') ||
          classList.contains('navbar') ||
          classList.contains('cont50') ||
          currentElement.tagName === 'HEADER' ||
          currentElement.tagName === 'NAV') {
        return true;
      }
      
      currentElement = currentElement.parentElement;
    }
    
    // Se estiver nos primeiros 120vh da página, consideramos hero (mais conservador)
    return this.currentY < (window.innerHeight * 1.2);
  }

  getBackgroundColor(element) {
    let bgColor = 'rgba(26, 27, 31, 1)'; // Padrão escuro
    let currentElement = element;
    
    // Percorrer hierarquia até encontrar cor de fundo
    while (currentElement && currentElement !== document.body) {
      const computedStyle = window.getComputedStyle(currentElement);
      const backgroundColor = computedStyle.backgroundColor;
      
      if (backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
        bgColor = backgroundColor;
        break;
      }
      currentElement = currentElement.parentElement;
    }
    
    return bgColor;
  }

  getBrightness(color) {
    // Extrair valores RGB
    const match = color.match(/\d+/g);
    if (!match) return 128; // valor padrão
    
    const r = parseInt(match[0]);
    const g = parseInt(match[1]);
    const b = parseInt(match[2]);
    
    // Calcular brilho usando fórmula padrão
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  getParticleColor() {
    if (this.adaptiveColor === 'var(--green)') {
      return 'radial-gradient(circle, #d5fa21 0%, rgba(213, 250, 33, 0.6) 100%)';
    } else {
      return 'radial-gradient(circle, #1a1b1f 0%, rgba(26, 27, 31, 0.6) 100%)';
    }
  }

  getPooledParticle() {
    return this.particlePool.pop() || null;
  }

  recycleParticle(particle) {
    // Remover da lista de partículas ativas
    const index = this.activeParticles.indexOf(particle);
    if (index > -1) {
      this.activeParticles.splice(index, 1);
    }
    
    if (!particle || !particle.parentNode) {
      return; // Partícula já foi removida
    }
    
    // FORÇAR limpeza visual completa da partícula IMEDIATAMENTE
    particle.style.animation = 'none';
    particle.style.opacity = '0';
    particle.style.transform = 'scale(0)';
    particle.style.visibility = 'hidden';
    particle.style.display = 'none'; // Garantir que não seja exibida
    particle.style.pointerEvents = 'none';
    
    // Pool limitado para evitar acúmulo
    if (this.particlePool.length < 8) {
      // Resetar estilos para reutilização com mais segurança
      setTimeout(() => {
        if (particle && particle.parentNode) {
          // Resetar completamente todos os estilos
          particle.style.cssText = '';
          particle.className = 'cursor-particle';
          particle.style.opacity = '1';
          particle.style.visibility = 'visible';
          particle.style.display = 'block';
          particle.style.transform = 'scale(1)';
          particle.style.pointerEvents = 'auto';
          
          // Só adicionar ao pool se ainda estiver no DOM
          if (particle.parentNode) {
            this.particlePool.push(particle);
          }
        }
      }, 100); // Aumentei o tempo para garantir limpeza
    } else {
      // Remover completamente se pool está cheio
      this.forceRemoveParticle(particle);
    }
  }

  // Função para forçar remoção de partículas
  forceRemoveParticle(particle) {
    if (!particle) return;
    
    // Remover da lista de partículas ativas
    const index = this.activeParticles.indexOf(particle);
    if (index > -1) {
      this.activeParticles.splice(index, 1);
    }
    
    // Remover do pool se estiver lá
    const poolIndex = this.particlePool.indexOf(particle);
    if (poolIndex > -1) {
      this.particlePool.splice(poolIndex, 1);
    }
    
    // Forçar remoção visual
    particle.style.animation = 'none';
    particle.style.opacity = '0';
    particle.style.transform = 'scale(0)';
    particle.style.visibility = 'hidden';
    particle.style.display = 'none';
    particle.style.pointerEvents = 'none';
    
    // Remover do DOM com segurança
    try {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    } catch (error) {
      // Ignorar erros de remoção
      console.warn('Erro ao remover partícula:', error);
    }
  }

  addHoverState() {
    if (this.cursor) {
      this.cursor.classList.remove('magnetic', 'text');
      this.cursor.classList.add('hover');
      // Criar efeito sutil no hover
      this.createHoverEffect();
    }
  }

  removeHoverState() {
    if (this.cursor) this.cursor.classList.remove('hover');
  }

  addMagneticState() {
    if (this.cursor) {
      this.cursor.classList.remove('hover', 'text');
      this.cursor.classList.add('magnetic');
      // Criar efeito especial para botões principais
      this.createMagneticEffect();
    }
  }

  removeMagneticState() {
    if (this.cursor) this.cursor.classList.remove('magnetic');
  }

  addClickState() {
    if (this.cursor) {
      this.cursor.classList.add('click');
      // Criar efeito de explosão ao clicar
      this.createClickBurst();
    }
  }

  removeClickState() {
    if (this.cursor) this.cursor.classList.remove('click');
  }

  addTextState() {
    if (this.cursor) {
      this.cursor.classList.remove('hover', 'magnetic');
      this.cursor.classList.add('text');
      // Efeito sutil para modo texto
      this.createTextEffect();
    }
  }

  createTextEffect() {
    // Criar uma partícula ocasionalmente no modo texto
    if (this.activeParticles.length < 8 && Math.random() > 0.95) {
      this.createParticle('normal');
    }
  }

  removeTextState() {
    if (this.cursor) this.cursor.classList.remove('text');
  }

  // Efeitos Especiais Expressivos
  createClickBurst() {
    // Criar explosão de partículas no click
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        this.createParticle('burst');
      }, i * 20);
    }
  }

  createHoverEffect() {
    // Criar algumas partículas no hover
    if (this.activeParticles.length < 15) {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          this.createParticle('normal');
        }, i * 30);
      }
    }
  }

  createMagneticEffect() {
    // Criar efeito especial para botões principais
    if (this.activeParticles.length < 18) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          this.createParticle('burst');
        }, i * 25);
      }
    }
  }

  // Sistema de Cleanup Otimizado - Suporte a mais partículas
  cleanup() {
    // Limpar partículas ativas se exceder limite (máximo 20)
    if (this.activeParticles.length > 20) {
      const excess = this.activeParticles.splice(15);
      excess.forEach(particle => {
        this.forceRemoveParticle(particle);
      });
    }
    
    // Limpar pool se muito grande (máximo 12 no pool)
    if (this.particlePool.length > 12) {
      const excess = this.particlePool.splice(10);
      excess.forEach(particle => {
        this.forceRemoveParticle(particle);
      });
    }
    
    // Verificar e limpar partículas órfãs (que não estão nas listas mas ainda no DOM)
    this.cleanupOrphanedParticles();
  }

  // Função para limpar partículas órfãs que podem ter ficado presas
  cleanupOrphanedParticles() {
    const allParticles = document.querySelectorAll('.cursor-particle');
    const validParticles = new Set([...this.activeParticles, ...this.particlePool]);
    
    allParticles.forEach(particle => {
      if (!validParticles.has(particle)) {
        // Partícula órfã encontrada, remover
        this.forceRemoveParticle(particle);
      }
    });
  }

  // Função de limpeza completa - pode ser chamada periodicamente
  forceCleanup() {
    // Limpar todas as partículas ativas
    this.activeParticles.forEach(particle => {
      this.forceRemoveParticle(particle);
    });
    this.activeParticles = [];
    
    // Limpar pool
    this.particlePool.forEach(particle => {
      this.forceRemoveParticle(particle);
    });
    this.particlePool = [];
    
         // Limpar qualquer partícula restante no DOM
     const allParticles = document.querySelectorAll('.cursor-particle');
     allParticles.forEach(particle => {
       this.forceRemoveParticle(particle);
     });
   }

   // Função de debug para monitorar partículas
   debugParticles() {
     const allParticles = document.querySelectorAll('.cursor-particle');
     console.log('🔍 Debug Partículas:', {
       ativas: this.activeParticles.length,
       pool: this.particlePool.length,
       domTotal: allParticles.length,
       órfãs: allParticles.length - (this.activeParticles.length + this.particlePool.length)
     });
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
        <div class="loader-text">PEAKBROKER</div>
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

// ==========================================
// CURSOR PEAKBROKER - VERSÃO LIMPA E ELEGANTE:
// ==========================================
// 1. Design circular limpo e responsivo
// 2. REMOVIDAS: Camadas orbitais que causavam "lag visual"
// 3. Partículas sutis apenas em movimento rápido
// 4. Transições instantâneas e fluidas
// 5. Estados visuais simplificados (hover, click, text, magnetic)
// 6. Otimização de performance com limpeza automática
// 7. Experiência harmônica sem elementos "seguindo" o cursor
// 8. Sistema de cores mantido (verde PEAKBROKER #d5fa21)
// 9. Animações mínimas e elegantes
// 10. Cursor responsivo que reage instantaneamente
// ========================================== 