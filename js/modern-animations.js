// Modern Animations and Interactions for ISEVEN Landing Page

document.addEventListener('DOMContentLoaded', function() {
  
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Add staggered animation for child elements
        const children = entry.target.querySelectorAll('.bg-card, .cx-gpay, .cx-nmbrs');
        children.forEach((child, index) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, index * 100);
        });
      }
    });
  }, observerOptions);

  // Add scroll animation class to elements
  const animateElements = document.querySelectorAll('.bg-card, .cx-gpay, .cx-nmbrs, .about-grid, .gpay');
  animateElements.forEach(el => {
    el.classList.add('scroll-animate');
    observer.observe(el);
  });

  // Modern cursor effect - Melhorado (apenas desktop)
  let cursor = null;
  
  // Só criar cursor em desktop
  if (window.innerWidth > 768 && !('ontouchstart' in window)) {
    cursor = document.createElement('div');
    cursor.className = 'modern-cursor';
    document.body.appendChild(cursor);
  }

  let cursorX = 0;
  let cursorY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  // Smooth cursor movement (só se cursor existe)
  function updateCursor() {
    if (cursor) {
      cursorX += (targetX - cursorX) * 0.3;
      cursorY += (targetY - cursorY) * 0.3;
      
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
    }
    
    requestAnimationFrame(updateCursor);
  }
  
  if (cursor) {
    updateCursor();
  }

  // Add hover effects to interactive elements (só se cursor existe)
  if (cursor) {
    const interactiveElements = document.querySelectorAll('.btn, .bg-card, .cx-gpay, .tab');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
      });
    });
  }

  // Removed parallax effect to prevent layout issues

  // Smooth reveal for statistics numbers
  const numberElements = document.querySelectorAll('.n-font');
  numberElements.forEach(el => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
        }
      });
    });
    observer.observe(el);
  });

  function animateNumber(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/\d/g, '').replace(/\s/g, '');
    
    if (number) {
      let current = 0;
      const increment = number / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
          current = number;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
      }, 20);
    }
  }

  // Removed magnetic effect to prevent button issues

  // Floating animation for cards
  const floatingCards = document.querySelectorAll('.bg-card');
  floatingCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.5}s`;
    card.classList.add('animate-float');
  });

  // Add glow effect to main CTA buttons
  const ctaButtons = document.querySelectorAll('.btn:not(.out):not(.g3)');
  ctaButtons.forEach(btn => {
    btn.classList.add('animate-glow');
  });

  // Tab switching with smooth transitions
  const tabs = document.querySelectorAll('.tab');
  const tabPanes = document.querySelectorAll('.w-tab-pane');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      // Add transition effect
      tabPanes.forEach(pane => {
        pane.style.opacity = '0';
        pane.style.transform = 'translateY(20px)';
      });
      
      setTimeout(() => {
        const activePane = document.querySelector('.w-tab-pane.w--tab-active');
        if (activePane) {
          activePane.style.opacity = '1';
          activePane.style.transform = 'translateY(0)';
        }
      }, 150);
    });
  });

  // Add ripple effect to buttons
  function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Apply ripple effect to buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    if (!button.querySelector('.ripple-container')) {
      const container = document.createElement('div');
      container.className = 'ripple-container';
      button.appendChild(container);
    }
    button.addEventListener('click', createRipple);
  });

  // Add loading animation to page
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = `
    <div class="loader-content">
      <div class="loader-spinner"></div>
      <div class="loader-text">Carregando...</div>
    </div>
  `;
  document.body.appendChild(loader);
  
  // Hide loader after page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.remove();
      }, 300);
    }, 500);
  });

}); 