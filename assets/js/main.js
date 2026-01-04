/**
* Portfolio Template - Professional Edition
* Enhanced with YouTube video integration and smooth animations
*/
(function() {
  "use strict";

  /**
   * Helper Functions
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener);
  };

  /**
   * Smooth Scroll Helper
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    });
  };

  /**
   * Navbar Active State on Scroll
   */
  let navbarlinks = select('#navbar .scrollto', true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  };
  
  window.addEventListener('load', navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Back to Top Button
   */
  let backtotop = select('.back-to-top');
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active');
      } else {
        backtotop.classList.remove('active');
      }
    };
    window.addEventListener('load', toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile Navigation Toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });

  /**
   * Scroll with Offset on Navigation Links
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault();
      let body = select('body');
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active');
        let navbarToggle = select('.mobile-nav-toggle');
        navbarToggle.classList.toggle('bi-list');
        navbarToggle.classList.toggle('bi-x');
      }
      scrollto(this.hash);
    }
  }, true);

  /**
   * Scroll with Offset on Page Load with Hash
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Hero Typing Effect
   */
  const typed = select('.typed');
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Skills Animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  }

  /**
   * Portfolio Isotope and Filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows',
        fitRows: {
          gutter: 32
        }
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        const filterValue = this.getAttribute('data-filter');
        
        portfolioIsotope.arrange({
          filter: filterValue
        });
        
        portfolioIsotope.on('arrangeComplete', function() {
          if (typeof AOS !== 'undefined') {
            AOS.refresh();
          }
        });
      }, true);
    }
  });

  /**
   * Portfolio Lightbox
   */
  if (typeof GLightbox !== 'undefined') {
    const portfolioLightbox = GLightbox({
      selector: '.portfolio-lightbox'
    });
  }

  /**
   * Portfolio Details Slider
   */
  if (typeof Swiper !== 'undefined') {
    new Swiper('.portfolio-details-slider', {
      speed: 400,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    });

    /**
     * Testimonials Slider
     */
    new Swiper('.testimonials-slider', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      }
    });
  }

  /**
   * Animation on Scroll
   */
  window.addEventListener('load', () => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  });

  /**
   * Pure Counter Initialization
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  /**
   * YouTube Video Handler - Click to Load Video
   */
  const initYouTubeVideos = () => {
    const videoThumbnails = select('.video-thumbnail', true);
    
    videoThumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
        const videoId = this.getAttribute('data-video-id');
        const videoWrap = this.closest('.videos-wrap');
        const videoEmbed = videoWrap.querySelector('.video-embed');
        
        if (videoId && videoEmbed) {
          // Create iframe
          const iframe = document.createElement('iframe');
          iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
          iframe.setAttribute('frameborder', '0');
          iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
          iframe.setAttribute('allowfullscreen', '');
          
          // Replace thumbnail with video
          videoEmbed.innerHTML = '';
          videoEmbed.appendChild(iframe);
          videoEmbed.classList.add('active');
          this.style.display = 'none';
        }
      });
    });
  };

  // Initialize YouTube videos when page loads
  window.addEventListener('load', initYouTubeVideos);

  /**
   * Dynamic Content Renderer for Portfolio & Videos
   */
  const PortfolioManager = {
    /**
     * Render portfolio items from data
     * @param {Array} items - Array of portfolio items
     * @param {String} containerId - ID of container element
     */
    renderPortfolioItems: function(items, containerId = 'portfolio-container') {
      const container = select(`#${containerId}`);
      if (!container) return;

      container.innerHTML = items.map((item, index) => `
        <div class="portfolio-item ${item.category}" data-aos="fade-up" data-aos-delay="${(index % 5) * 100 + 100}">
          <div class="portfolio-wrap">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <h5>${item.title}</h5>
            <div class="portfolio-links">
              <a href="${item.link}" title="${item.title}">
                <i class="bx bx-link"></i>
              </a>
            </div>
          </div>
        </div>
      `).join('');

      // Reinitialize Isotope after rendering
      if (typeof Isotope !== 'undefined') {
        setTimeout(() => {
          const portfolioIsotope = new Isotope(container, {
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows',
            fitRows: {
              gutter: 28
            }
          });
        }, 100);
      }

      // Reinitialize AOS
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    },

    /**
     * Extract YouTube video ID from URL
     * @param {String} url - YouTube URL
     * @returns {String} Video ID
     */
    getYouTubeID: function(url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    },

    /**
     * Render YouTube videos with thumbnails
     * @param {Array} videos - Array of video objects with youtubeId or url
     * @param {String} containerId - ID of container element
     */
    renderVideos: function(videos, containerId = 'videos-container') {
      const container = select(`#${containerId}`);
      if (!container) return;

      container.innerHTML = videos.map((video, index) => {
        const videoId = video.youtubeId || this.getYouTubeID(video.url);
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        
        return `
          <div class="videos-item ${video.category || 'all'}" data-aos="fade-up" data-aos-delay="${(index % 5) * 100 + 100}">
            <div class="videos-wrap">
              <div class="video-thumbnail" data-video-id="${videoId}">
                <img src="${thumbnailUrl}" alt="${video.title}" loading="lazy">
                <div class="play-button">
                  <i class="bx bx-play"></i>
                </div>
              </div>
              <div class="video-embed"></div>
              <div class="video-info">
                <h5>${video.title}</h5>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Reinitialize video click handlers
      initYouTubeVideos();

      // Reinitialize AOS
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    }
  };

  /**
   * Lazy Loading for Images
   */
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  /**
   * Smooth Scroll Behavior Enhancement
   */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target && !this.classList.contains('scrollto')) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  /**
   * Portfolio Card Hover Sound Effect (Optional)
   * Uncomment if you want subtle interaction feedback
   */
  /*
  const portfolioCards = select('.portfolio-wrap', true);
  portfolioCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      // Add haptic feedback or sound here if desired
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    });
  });
  */

  /**
   * Example: Load portfolio data from JSON
   * Create a file at /data/portfolio-data.json with this structure:
   * {
   *   "games": [
   *     {
   *       "title": "Game Name",
   *       "image": "/img/games/game1.jpg",
   *       "category": "unity",
   *       "link": "game-details.html"
   *     }
   *   ],
   *   "videos": [
   *     {
   *       "title": "Video Title",
   *       "youtubeId": "dQw4w9WgXcQ",
   *       "category": "tutorial"
   *     }
   *   ]
   * }
   */
  
  // Uncomment this when you have a portfolio-data.json file
  /*
  fetch('/data/portfolio-data.json')
    .then(response => response.json())
    .then(data => {
      if (data.games) {
        PortfolioManager.renderPortfolioItems(data.games);
      }
      if (data.videos) {
        PortfolioManager.renderVideos(data.videos);
      }
    })
    .catch(error => console.error('Error loading portfolio data:', error));
  */

  // Export for external use
  window.PortfolioManager = PortfolioManager;

})();