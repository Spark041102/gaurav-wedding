/**
 * Main Interactive Application Logic
 * Gaurav & Dnyaneshwari | Royal Indian Wedding Invitation
 * Saturday, 20 February 2027 | Shree Lawns, Amarapur, Shevgaon
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Ensure weddingData configuration is loaded
  const data = window.weddingData || (typeof weddingData !== 'undefined' ? weddingData : null);
  if (!data) {
    console.error('Wedding data not found. Ensure js/wedding-data.js is loaded.');
    return;
  }

  /* ==========================================================================
     1. Element Selectors
     ========================================================================== */
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const envelopeFlap = document.getElementById('envelope-flap');
  const sealButton = document.getElementById('seal-button');
  const sealPromptPill = document.getElementById('seal-prompt-pill');
  const weddingAudio = document.getElementById('wedding-audio');
  const musicToggle = document.getElementById('music-toggle');
  const scrollPromptBtn = document.getElementById('scroll-prompt-btn');
  const cardContainer = document.getElementById('card-container');
  const eventsList = document.getElementById('events-list');
  const petalsCanvas = document.getElementById('petals-canvas');

  // Scratch card elements
  const scratchContainer = document.getElementById('scratch-container');
  const scratchCanvas = document.getElementById('scratch-canvas');
  const scratchFallbackBtn = document.getElementById('scratch-fallback-btn');

  // Countdown elements
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const countdownMsgEl = document.getElementById('countdown-message');

  // Polaroid Gallery elements
  const polaroidCarousel = document.getElementById('polaroid-carousel');
  const polaroidTrack = document.getElementById('polaroid-track');
  const galleryDots = document.getElementById('gallery-dots');

  let isEnvelopeOpened = false;

  /* ==========================================================================
     2. Tap-to-Open Envelope Handler (3D Flap Unfolding)
     ========================================================================== */
  function openEnvelope() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    // Trigger 3D perspective flap flip
    if (envelopeFlap) {
      envelopeFlap.classList.add('flap-open');
    }

    // Play background soundtrack
    if (weddingAudio) {
      const playPromise = weddingAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            updateMusicToggleUI(true);
          })
          .catch((err) => {
            console.log('Audio autoplay prevented by browser; user can tap music equalizer to play:', err);
            updateMusicToggleUI(false);
          });
      }
    }

    // Fade out seal prompt pill
    if (sealPromptPill) {
      sealPromptPill.style.opacity = '0';
      sealPromptPill.style.pointerEvents = 'none';
    }

    // Mark envelope opened on body and overlay
    document.body.classList.add('envelope-opened');

    setTimeout(() => {
      if (envelopeOverlay) {
        envelopeOverlay.classList.add('opened');
      }
      if (cardContainer) {
        cardContainer.classList.add('is-revealed', 'revealed', 'is-visible');
      }
      if (musicToggle) {
        musicToggle.classList.add('is-visible', 'visible');
      }
      if (scrollPromptBtn) {
        scrollPromptBtn.classList.add('is-visible');
      }
    }, 450);

    // Disable envelope overlay interaction after opening transition completes
    setTimeout(() => {
      if (envelopeOverlay) {
        envelopeOverlay.style.pointerEvents = 'none';
        envelopeOverlay.setAttribute('aria-hidden', 'true');
      }
      // Initialize scratch card once visible in viewport
      initScratchCard();
      triggerScrollObserverRefresh();
    }, 1100);
  }

  if (sealButton) {
    sealButton.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
    sealButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  if (envelopeOverlay) {
    envelopeOverlay.addEventListener('click', () => {
      if (!isEnvelopeOpened) {
        openEnvelope();
      }
    });
  }

  /* ==========================================================================
     3. Floating Sound Equalizer Pill (#music-toggle)
     ========================================================================== */
  function updateMusicToggleUI(isPlaying) {
    if (!musicToggle) return;

    if (isPlaying) {
      musicToggle.classList.add('is-playing');
      musicToggle.classList.remove('is-paused', 'is-muted');
      musicToggle.setAttribute('aria-label', 'Mute background wedding soundtrack');
      musicToggle.setAttribute('title', 'Mute Music');
    } else {
      musicToggle.classList.remove('is-playing');
      musicToggle.classList.add('is-paused', 'is-muted');
      musicToggle.setAttribute('aria-label', 'Play background wedding soundtrack');
      musicToggle.setAttribute('title', 'Play Music');
    }
  }

  updateMusicToggleUI(false);

  if (weddingAudio) {
    weddingAudio.addEventListener('play', () => updateMusicToggleUI(true));
    weddingAudio.addEventListener('pause', () => updateMusicToggleUI(false));
    weddingAudio.addEventListener('ended', () => updateMusicToggleUI(false));
    weddingAudio.addEventListener('error', (err) => {
      console.warn('Wedding audio encountered an issue:', err);
      updateMusicToggleUI(false);
    });
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!weddingAudio) return;

      if (weddingAudio.paused) {
        weddingAudio.play().catch(err => console.warn('Play error:', err));
      } else {
        weddingAudio.pause();
      }
    });
  }

  /* ==========================================================================
     4. Scroll-to-See-More Pill & Scroll Listener
     ========================================================================== */
  if (scrollPromptBtn) {
    scrollPromptBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('family-section') || document.getElementById('scratch-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY > 180) {
        scrollPromptBtn.classList.add('hide-on-scroll');
      } else if (isEnvelopeOpened) {
        scrollPromptBtn.classList.remove('hide-on-scroll');
      }
    }, { passive: true });
  }

  /* ==========================================================================
     5. Interactive Scratch-to-Reveal Date Card
     ========================================================================== */
  let scratchInitialized = false;

  function initScratchCard() {
    if (scratchInitialized || !scratchCanvas || !scratchContainer) return;
    scratchInitialized = true;

    const ctx = scratchCanvas.getContext('2d');
    if (!ctx) return;

    let isDrawing = false;
    let isRevealed = false;
    let width = 0;
    let height = 0;

    function resizeScratchCanvas() {
      if (isRevealed) return;
      const w = Math.round(scratchContainer.clientWidth);
      const h = Math.round(scratchContainer.clientHeight);
      if (!w || !h) return;

      width = w;
      height = h;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      scratchCanvas.width = Math.round(w * dpr);
      scratchCanvas.height = Math.round(h * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFoil();
    }

    function drawFoil() {
      // Luxury gold foil gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#E5C266');
      grad.addColorStop(0.25, '#FFF2BF');
      grad.addColorStop(0.5, '#D4AF37');
      grad.addColorStop(0.75, '#C5A059');
      grad.addColorStop(1, '#9E782A');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Fine golden dust specks
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      for (let i = 0; i < 45; i++) {
        const sx = ((i * 137.5) % width);
        const sy = ((i * 73.3) % height);
        ctx.beginPath();
        ctx.arc(sx, sy, (i % 3) * 0.6 + 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Elegant inner dashed gold line
      ctx.strokeStyle = 'rgba(110, 75, 20, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(8, 8, width - 16, height - 16);
      ctx.setLineDash([]);

      // Prompt Text on foil
      ctx.fillStyle = '#422B10';
      ctx.font = '600 12px "Cinzel Decorative", Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✦ SCRATCH TO REVEAL ✦', width / 2, height / 2);
    }

    function scratchAt(x, y) {
      if (isRevealed) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      checkScratchProgress();
    }

    function checkScratchProgress() {
      if (isRevealed) return;

      const sampleStep = 18;
      const imgData = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
      const pixels = imgData.data;
      let totalSamples = 0;
      let clearedSamples = 0;

      for (let i = 3; i < pixels.length; i += 4 * sampleStep) {
        totalSamples++;
        if (pixels[i] < 128) {
          clearedSamples++;
        }
      }

      if (totalSamples > 0 && (clearedSamples / totalSamples) > 0.40) {
        revealDateCard();
      }
    }

    function revealDateCard() {
      if (isRevealed) return;
      isRevealed = true;

      scratchCanvas.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      scratchCanvas.style.opacity = '0';
      scratchCanvas.style.pointerEvents = 'none';

      if (scratchFallbackBtn) {
        scratchFallbackBtn.style.opacity = '0.5';
        scratchFallbackBtn.style.pointerEvents = 'none';
        scratchFallbackBtn.textContent = 'Date Revealed! ✨';
      }

      const cardWrapper = scratchContainer.closest('.scratch-card-wrapper');
      if (cardWrapper) {
        cardWrapper.classList.add('is-revealed');
      }
    }

    if (scratchFallbackBtn) {
      scratchFallbackBtn.addEventListener('click', (e) => {
        e.preventDefault();
        revealDateCard();
      });
    }

    function getCoords(e) {
      const rect = scratchCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    scratchCanvas.addEventListener('pointerdown', (e) => {
      isDrawing = true;
      const coords = getCoords(e);
      scratchAt(coords.x, coords.y);
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDrawing) return;
      const coords = getCoords(e);
      scratchAt(coords.x, coords.y);
    });

    window.addEventListener('pointerup', () => { isDrawing = false; });
    window.addEventListener('pointercancel', () => { isDrawing = false; });

    scratchCanvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const coords = getCoords(e);
      scratchAt(coords.x, coords.y);
    }, { passive: false });

    resizeScratchCanvas();

    if (window.ResizeObserver) {
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0 && !isRevealed) {
            resizeScratchCanvas();
          }
        }
      });
      ro.observe(scratchContainer);
    }

    if (window.IntersectionObserver) {
      const so = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !isRevealed && width === 0) {
            resizeScratchCanvas();
          }
        });
      }, { threshold: 0.1 });
      so.observe(scratchContainer);
    }

    window.addEventListener('resize', () => {
      if (!isRevealed) resizeScratchCanvas();
    });
  }

  /* ==========================================================================
     6. Live Countdown Timer
     ========================================================================== */
  function initCountdownTimer() {
    const weddingDateMs = new Date(data.weddingDate).getTime();

    function updateCountdown() {
      const now = Date.now();
      const diff = weddingDateMs - now;

      if (diff <= 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';

        if (countdownMsgEl) {
          countdownMsgEl.textContent = 'The auspicious celebrations are underway!';
          countdownMsgEl.classList.add('celebration-active');
        }
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  initCountdownTimer();

  /* ==========================================================================
     7. Calendar Helpers (Google Calendar & .ics Download)
     ========================================================================== */
  function formatICSTime(isoString) {
    const d = new Date(isoString);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  function generateGoogleCalendarUrl(event) {
    const startUTC = formatICSTime(event.startISO);
    const endUTC = formatICSTime(event.endISO);
    const title = encodeURIComponent(`Gaurav & Dnyaneshwari's Wedding — ${event.title}`);
    const details = encodeURIComponent(
      `Ceremony: ${event.title}\n` +
      `Date & Time: ${event.date} at ${event.time}\n` +
      `Venue: ${event.venue}\n` +
      `Address: ${event.address || event.location}\n` +
      `Dress Code: ${event.dressCode}\n\n` +
      `With immense love and joy, we look forward to celebrating with you!\n` +
      `— Gaurav & Dnyaneshwari`
    );
    const location = encodeURIComponent(`${event.venue}, ${event.address || event.location}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUTC}/${endUTC}&details=${details}&location=${location}`;
  }

  function downloadICSFile(event) {
    const startUTC = formatICSTime(event.startISO);
    const endUTC = formatICSTime(event.endISO);
    const nowUTC = formatICSTime(new Date().toISOString());
    const uid = `${event.id || 'ceremony'}-${Date.now()}@gaurav-dnyaneshwari.com`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Gaurav and Dnyaneshwari Wedding Invitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${nowUTC}`,
      `DTSTART:${startUTC}`,
      `DTEND:${endUTC}`,
      `SUMMARY:Gaurav & Dnyaneshwari's Wedding: ${event.title}`,
      `DESCRIPTION:${event.title} at ${event.venue}. Dress Code: ${event.dressCode}. We look forward to your gracious presence.`,
      `LOCATION:${event.venue}, ${event.address || event.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `Gaurav-Dnyaneshwari-${event.id || 'event'}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 2500);
  }

  function handleSaveDate(event) {
    downloadICSFile(event);
    const gcalUrl = generateGoogleCalendarUrl(event);
    window.open(gcalUrl, '_blank', 'noopener,noreferrer');
  }

  window.handleSaveDate = handleSaveDate;
  window.downloadICSFile = downloadICSFile;
  window.generateGoogleCalendarUrl = generateGoogleCalendarUrl;

  /* ==========================================================================
     8. 4 Ceremonies Dynamic Rendering & Calendar Binding
     ========================================================================== */
  function renderEventsTimeline() {
    if (!eventsList || !Array.isArray(data.events)) return;

    eventsList.innerHTML = '';

    data.events.forEach((event, index) => {
      const card = document.createElement('article');
      card.className = 'event-card reveal-on-scroll fade-up';
      card.setAttribute('data-event-index', index);
      if (event.id === 'marriage') {
        card.classList.add('highlight-event-card');
      }

      card.innerHTML = `
        <div class="event-date-banner">${event.dayDate || event.date}</div>
        <h3 class="event-script-title">${event.title}</h3>
        <p class="event-time-banner">${event.time}</p>
        <div class="event-venue-block">
          <p class="venue-name">${event.venue}</p>
          ${event.address ? `<p class="venue-address">${event.address}</p>` : ''}
        </div>
        <p class="event-dress-code">Dress: ${event.dressCode}</p>
        <div class="event-action-pills">
          <a href="${event.mapUrl}" target="_blank" rel="noopener noreferrer" class="pill-btn pill-btn-dark" aria-label="Directions to ${event.venue}">
            <span class="btn-emoji" aria-hidden="true">📍</span> Directions
          </a>
          <button type="button" class="pill-btn pill-btn-outline btn-calendar" data-event-idx="${index}" aria-label="Save ${event.title} date">
            <span class="btn-emoji" aria-hidden="true">📅</span> Save date
          </button>
        </div>
      `;

      eventsList.appendChild(card);
    });

    // Attach click events to Save Date buttons
    const saveDateBtns = eventsList.querySelectorAll('.btn-calendar');
    saveDateBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-event-idx'), 10);
        const event = data.events[idx];
        if (event) {
          handleSaveDate(event);
        }
      });
    });
  }

  renderEventsTimeline();

  /* ==========================================================================
     8b. RSVP & Family Contacts Dynamic Renderer
     ========================================================================== */
  function renderRSVPContacts() {
    const contactsGrid = document.querySelector('.rsvp-contacts-grid');
    const rsvpReplyBy = document.querySelector('.rsvp-reply-by');
    if (rsvpReplyBy && data.rsvpDeadline) {
      rsvpReplyBy.textContent = data.rsvpDeadline;
    }
    const contacts = data.contact || data.contacts;
    if (!contactsGrid || !contacts || !contacts.length) return;

    contactsGrid.innerHTML = contacts.map(c => {
      const cleanPhone = (c.phone || '').replace(/\s+/g, '');
      const displayName = c.name || '';
      const displayRole = c.role || 'Family';
      return `
        <div class="contact-card">
          <span class="contact-title">${displayRole}</span>
          <strong class="contact-name">${displayName}</strong>
          <a href="tel:${cleanPhone}" class="btn-tel-pill" aria-label="Call ${displayName} at ${c.phone}">
            <span class="tel-icon" aria-hidden="true">📞</span> ${c.phone}
          </a>
        </div>
      `;
    }).join('');
  }

  renderRSVPContacts();

  /* ==========================================================================
     9. Polaroid Couple Photo Gallery ("BIG DAY") with Dot Navigation
     ========================================================================== */
  function initPolaroidGallery() {
    const photos = data.photoGallery && data.photoGallery.photos ? data.photoGallery.photos : [];
    if (!polaroidCarousel || !photos.length) return;

    const track = polaroidTrack || polaroidCarousel.querySelector('.polaroid-track');
    if (!track) return;

    // Render polaroids if track is empty or need synchronization
    track.innerHTML = photos.map((p, idx) => `
      <div class="polaroid-item ${idx === 0 ? 'active' : ''}" data-index="${idx}">
        <div class="polaroid-frame ${idx % 2 === 0 ? 'tilt-left' : 'tilt-right'}">
          <div class="polaroid-photo-box">
            <img src="${p.src}" alt="${p.alt || p.caption}" class="polaroid-img" loading="lazy" onerror="this.style.display='none'">
          </div>
          ${p.caption ? `<p class="polaroid-caption">${p.caption}</p>` : ''}
        </div>
      </div>
    `).join('');

    // Render dots
    if (galleryDots) {
      galleryDots.innerHTML = photos.map((_, idx) => `
        <button type="button" class="gallery-dot ${idx === 0 ? 'active' : ''}" data-slide="${idx}" aria-label="View photo ${idx + 1}"></button>
      `).join('');
    }

    const items = track.querySelectorAll('.polaroid-item');
    const dots = galleryDots ? galleryDots.querySelectorAll('.gallery-dot') : [];
    let currentIndex = 0;

    function goToSlide(index) {
      if (index < 0) index = photos.length - 1;
      if (index >= photos.length) index = 0;
      currentIndex = index;

      // Translate the track horizontally to slide to active photo
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      items.forEach((item, idx) => {
        item.classList.toggle('active', idx === currentIndex);
      });

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    // Previous and Next Buttons
    const prevBtn = document.getElementById('gallery-prev-btn');
    const nextBtn = document.getElementById('gallery-next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    // Dots navigation
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(idx);
      });
    });

    // Clicking photo directly: left 40% goes previous, right 60% goes next
    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        const rect = item.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        if (clickX < rect.width * 0.4) {
          goToSlide(currentIndex - 1);
        } else {
          goToSlide(currentIndex + 1);
        }
      });
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    polaroidCarousel.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = true;
      }
    }, { passive: true });

    polaroidCarousel.addEventListener('touchend', (e) => {
      if (!isSwiping || !e.changedTouches.length) return;
      isSwiping = false;
      const diffX = touchStartX - e.changedTouches[0].clientX;
      const diffY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
      }
    }, { passive: true });

    // Mouse drag support for desktop
    let mouseStartX = 0;
    let isMouseDown = false;

    polaroidCarousel.addEventListener('mousedown', (e) => {
      mouseStartX = e.clientX;
      isMouseDown = true;
    });

    window.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      const diffX = mouseStartX - e.clientX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
      }
    });

    // Initialize on first slide
    goToSlide(0);
  }

  initPolaroidGallery();

  /* ==========================================================================
     10. Multi-Colored Floating Petals Canvas (Marigold, Jasmine, Rose)
     ========================================================================== */
  function initPetalsCanvas() {
    if (!petalsCanvas) return;

    const ctx = petalsCanvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      petalsCanvas.width = width * dpr;
      petalsCanvas.height = height * dpr;
      petalsCanvas.style.width = width + 'px';
      petalsCanvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 28 multi-colored petals: marigold blossoms, jasmine petals, rose petals
    const petalCount = 28;
    const petals = [];
    const types = ['marigold', 'jasmine', 'rose', 'sparkle'];

    for (let i = 0; i < petalCount; i++) {
      const type = types[i % types.length];
      let size = Math.random() * 6 + 6;
      if (type === 'marigold') size = Math.random() * 6 + 9;
      if (type === 'jasmine') size = Math.random() * 5 + 7;
      if (type === 'sparkle') size = Math.random() * 2 + 1.5;

      petals.push({
        type: type,
        x: Math.random() * width,
        y: Math.random() * height,
        size: size,
        speedY: Math.random() * 0.75 + 0.35,
        speedX: (Math.random() - 0.5) * 0.4,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.025 + 0.015,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    function drawMarigold(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // Outer ruffled yellow petals
      const petalPetals = 8;
      for (let j = 0; j < petalPetals; j++) {
        ctx.save();
        ctx.rotate((j * Math.PI * 2) / petalPetals);
        ctx.fillStyle = j % 2 === 0 ? '#FDB813' : '#F6921E';
        ctx.beginPath();
        ctx.ellipse(0, p.size * 0.45, p.size * 0.3, p.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Warm amber center
      ctx.fillStyle = '#E37A08';
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function drawJasmine(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // 5 soft white petals
      const petalsCount = 5;
      for (let j = 0; j < petalsCount; j++) {
        ctx.save();
        ctx.rotate((j * Math.PI * 2) / petalsCount);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.ellipse(0, p.size * 0.5, p.size * 0.28, p.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Yellow pollen center
      ctx.fillStyle = '#F5D061';
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function drawRose(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // Delicate curved rose petal
      ctx.fillStyle = 'rgba(230, 80, 115, 0.72)';
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.quadraticCurveTo(p.size * 0.7, -p.size * 0.3, p.size * 0.5, p.size * 0.5);
      ctx.quadraticCurveTo(0, p.size * 0.9, -p.size * 0.5, p.size * 0.5);
      ctx.quadraticCurveTo(-p.size * 0.7, -p.size * 0.3, 0, -p.size);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    function drawSparkle(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = 'rgba(245, 220, 130, 0.65)';
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function renderPetal(p) {
      if (p.type === 'marigold') drawMarigold(p);
      else if (p.type === 'jasmine') drawJasmine(p);
      else if (p.type === 'rose') drawRose(p);
      else drawSparkle(p);
    }

    if (prefersReducedMotion) {
      petals.forEach(renderPetal);
      return;
    }

    function animatePetals() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petalCount; i++) {
        const p = petals[i];
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.45;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 25) {
          p.y = -25;
          p.x = Math.random() * width;
        }

        if (p.x > width + 25) {
          p.x = -25;
        } else if (p.x < -25) {
          p.x = width + 25;
        }

        renderPetal(p);
      }

      requestAnimationFrame(animatePetals);
    }

    animatePetals();
  }

  initPetalsCanvas();

  /* ==========================================================================
     11. Scroll-Triggered Reveal Animations (IntersectionObserver)
     ========================================================================== */
  let scrollObserver;

  function initScrollObserver() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -25px 0px'
    });

    revealElements.forEach(el => scrollObserver.observe(el));
  }

  function triggerScrollObserverRefresh() {
    const unrevealed = document.querySelectorAll('.reveal-on-scroll:not(.is-visible)');
    if (unrevealed.length && scrollObserver) {
      unrevealed.forEach(el => scrollObserver.observe(el));
    }
  }

  initScrollObserver();

  /* ==========================================================================
     12. Image & Media Fallback Error Handling
     ========================================================================== */
  function initImageFallbacks() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('error', () => {
        img.classList.add('img-load-error');
        img.style.display = 'none';
      });
    });

    window.addEventListener('error', (event) => {
      if (event.target && event.target.tagName === 'IMG') {
        event.target.classList.add('img-load-error');
        event.target.style.display = 'none';
      }
    }, true);
  }

  initImageFallbacks();
});
