/* ==========================================================================
   BRITT PORTFOLIO - JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const projectCards = document.querySelectorAll('.project-card');
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalProjectTitle = document.getElementById('modal-project-title');
  const modalProjectMeta = document.getElementById('modal-project-meta');
  const modalProjectSubtitle = document.getElementById('modal-project-subtitle');
  const modalIntroLines = modalOverlay?.querySelector('.modal-intro-lines');
  const modalGenericContent = document.getElementById('modal-generic-content');
  const modalVerpaktContent = document.getElementById('modal-verpakt-content');
  const modalWatkokContent = document.getElementById('modal-watkok-content');
  const modalScentoryContent = document.getElementById('modal-scentory-content');
  const modalKnownProjectCopy = document.getElementById('modal-known-project-copy');
  const modalTriggerLines = document.querySelector('.modal-trigger-lines');
  const modalPanel = modalOverlay?.querySelector('.paper-card--modal');
  let lastFocusedProject = null;
  let pageScrollY = 0;
  let previousBodyOverflow = '';

  /* --------------------------------------------------------------------------
     1. ACTIVE SECTION TRACKING ON SCROLL
     -------------------------------------------------------------------------- */
  function setActiveNav(sectionId) {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
    });
  }

  function updateActiveNav() {
    if (!sections.length) return;
    const headerHeight = document.querySelector('.header')?.getBoundingClientRect().height || 0;
    const activationLine = headerHeight + Math.min(window.innerHeight * 0.24, 180);
    let activeSection = sections[0];

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= activationLine) activeSection = section;
    });

    setActiveNav(activeSection.id);
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  window.addEventListener('resize', updateActiveNav, { passive: true });
  window.addEventListener('hashchange', updateActiveNav);
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetId = link.getAttribute('href')?.slice(1);
      if (targetId) setActiveNav(targetId);
    });
  });
  updateActiveNav(); // Initial check

  /* --------------------------------------------------------------------------
     1B. START SECTION: OPEN A PROCESS STEP INSIDE THE PAPER
     -------------------------------------------------------------------------- */
  const processContent = document.querySelector('.process-content');
  const processOverview = processContent?.querySelector('.process-sketch');
  const processDetail = processContent?.querySelector('.process-detail');

  if (processContent && processOverview && processDetail) {
    const detailIndex = processDetail.querySelector('.process-detail-index');
    const detailTitle = processDetail.querySelector('.process-detail-title');
    const detailCopy = processDetail.querySelector('.process-detail-copy');
    const backButton = processDetail.querySelector('.process-back');
    const stepCopy = {
      wat: {
        number: '01 / 06',
        title: 'Wat als...?',
        copy: 'Alles begint met nieuwsgierigheid. Ik stel vragen en ontdek nieuwe mogelijkheden.'
      },
      idee: {
        number: '02 / 06',
        title: 'Idee',
        copy: 'Een eerste ingeving groeit uit tot een concept. Wat zou er mogelijk zijn?'
      },
      onderzoek: {
        number: '03 / 06',
        title: 'Onderzoek',
        copy: 'Ik verdiep me in de doelgroep, het probleem en de achterliggende vraag.'
      },
      experiment: {
        number: '04 / 06',
        title: 'Experiment',
        copy: 'Ik probeer verschillende richtingen uit en ontdek wat wel en niet werkt.'
      },
      schets: {
        number: '05 / 06',
        title: 'Schets / Test',
        copy: 'Ik geef ideeën vorm met schetsen en prototypes en test mijn ontwerpen.'
      },
      ontwerp: {
        number: '06 / 06',
        title: 'Ontwerp',
        copy: 'Alle inzichten en experimenten komen samen in een uiteindelijk ontwerp.'
      }
    };
    let selectedStep = null;

    function openProcessStep(stepElement) {
      const content = stepCopy[stepElement.dataset.processStep];
      if (!content) return;

      selectedStep = stepElement;
      detailIndex.textContent = content.number;
      detailTitle.textContent = content.title;
      detailCopy.textContent = content.copy;
      processContent.classList.add('is-detail');
      processOverview.setAttribute('aria-hidden', 'true');
      processDetail.setAttribute('aria-hidden', 'false');
      backButton.focus({ preventScroll: true });
    }

    function returnToProcess() {
      processContent.classList.remove('is-detail');
      processOverview.setAttribute('aria-hidden', 'false');
      processDetail.setAttribute('aria-hidden', 'true');
      if (selectedStep) selectedStep.focus({ preventScroll: true });
    }

    processOverview.addEventListener('click', (event) => {
      const stepElement = event.target.closest('[data-process-step]');
      if (stepElement) openProcessStep(stepElement);
    });

    processOverview.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const stepElement = event.target.closest('[data-process-step]');
      if (!stepElement) return;
      event.preventDefault();
      openProcessStep(stepElement);
    });

    backButton.addEventListener('click', returnToProcess);
    processContent.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && processContent.classList.contains('is-detail')) {
        returnToProcess();
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. PROJECT MODAL OVERLAY
     -------------------------------------------------------------------------- */
  function openProjectModal(projectName, cardElement) {
    if (!modalOverlay || !modalProjectTitle || !cardElement) return;

    const isCoachCone = projectName === 'Coach Cone';
    const isVerpakt = projectName.toLowerCase() === 'verpakt in verpakking';
    const isWatkok = projectName.toLowerCase() === 'wat de kok';
    const isScentory = projectName.toLowerCase() === 'scentory';
    const cardCaption = cardElement.querySelector('.project-caption')?.textContent.trim() || '';
    const projectDescriptor = cardCaption.replace(/\s*·\s*klik om open te slaan\s*$/i, '');
    modalProjectTitle.textContent = projectName.toUpperCase();
    if (modalProjectMeta) {
      modalProjectMeta.textContent = isCoachCone
        ? 'Collectief 3 · De ander snapt er niks van · Groepsproject'
        : isVerpakt
          ? 'Graphic Matters · Grafisch ontwerp / campagneposter · Adobe Illustrator / Photoshop'
          : isWatkok
            ? 'Creative Technology 2 · AI · UX/UI · Vibe coding'
            : isScentory
              ? 'Appconcept · EveryHuman × Scentronix'
        : projectDescriptor;
    }
    if (modalIntroLines) modalIntroLines.hidden = isCoachCone || isVerpakt || isWatkok || isScentory;
    if (modalProjectSubtitle) {
      modalProjectSubtitle.textContent = isScentory
        ? 'Your perfume grows with you.'
        : isWatkok
          ? 'Een AI-kookassistent voor studenten.'
          : 'Een campagneconcept over oververpakking.';
      modalProjectSubtitle.hidden = !isVerpakt && !isWatkok && !isScentory;
    }
    if (modalGenericContent) modalGenericContent.hidden = isVerpakt || isWatkok || isScentory;
    if (modalVerpaktContent) modalVerpaktContent.hidden = !isVerpakt;
    if (modalWatkokContent) modalWatkokContent.hidden = !isWatkok;
    if (modalScentoryContent) modalScentoryContent.hidden = !isScentory;
    if (modalKnownProjectCopy) modalKnownProjectCopy.hidden = !isCoachCone;
    if (modalTriggerLines) modalTriggerLines.hidden = isCoachCone;

    lastFocusedProject = cardElement;
    pageScrollY = window.scrollY;
    previousBodyOverflow = document.body.style.overflow;

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (modalPanel) modalPanel.scrollTop = 0;
    modalCloseBtn?.focus({ preventScroll: true });
  }

  function closeProjectModal() {
    if (!modalOverlay) return;

    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousBodyOverflow;
    lastFocusedProject?.focus({ preventScroll: true });
    window.scrollTo(0, pageScrollY);
  }

  // Attach click events to project cards
  projectCards.forEach((card) => {
    card.addEventListener('click', () => {
      const projectName = card.getAttribute('data-project') || 'Project';
      openProjectModal(projectName, card);
    });
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      const projectName = card.getAttribute('data-project') || 'Project';
      openProjectModal(projectName, card);
    });
  });

  // Close modal events
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  modalVerpaktContent?.querySelector('.vvp-back-to-projects')?.addEventListener('click', closeProjectModal);
  modalWatkokContent?.querySelector('.watkok-back-to-projects')?.addEventListener('click', closeProjectModal);
  modalScentoryContent?.querySelector('.lp-back-to-projects')?.addEventListener('click', closeProjectModal);

  const aboutQuote = document.querySelector('.voorstellen-quote-wrapper');
  if (aboutQuote) {
    const quoteText = aboutQuote.querySelector('.quote-text');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (quoteText && finePointer.matches) {
      const aboutSection = aboutQuote.closest('.section-voorstellen') || aboutQuote;
      let isDodging = false;

      const resetQuotePosition = () => {
        isDodging = false;
        quoteText.style.setProperty('--quote-dodge-x', '0px');
        quoteText.style.setProperty('--quote-dodge-y', '0px');
      };

      const distanceFromRect = (x, y, rect) => {
        const dx = Math.max(rect.left - x, 0, x - rect.right);
        const dy = Math.max(rect.top - y, 0, y - rect.bottom);
        return Math.hypot(dx, dy);
      };

      const moveQuoteAway = (event) => {
        if (motionPreference.matches || (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen')) {
          resetQuotePosition();
          return;
        }

        const currentRect = quoteText.getBoundingClientRect();
        const currentX = Number.parseFloat(quoteText.style.getPropertyValue('--quote-dodge-x')) || 0;
        const currentY = Number.parseFloat(quoteText.style.getPropertyValue('--quote-dodge-y')) || 0;
        const baseRect = {
          left: currentRect.left - currentX,
          right: currentRect.right - currentX,
          top: currentRect.top - currentY,
          bottom: currentRect.bottom - currentY
        };
        const currentDistance = distanceFromRect(event.clientX, event.clientY, currentRect);
        const baseDistance = distanceFromRect(event.clientX, event.clientY, baseRect);
        const radius = 105;

        if ((!isDodging && currentDistance > radius) || (isDodging && currentDistance > radius && baseDistance > radius)) {
          resetQuotePosition();
          return;
        }

        isDodging = true;
        const clearance = 14;
        const centerX = (currentRect.left + currentRect.right) / 2;
        const wrapperRect = aboutQuote.getBoundingClientRect();
        const minX = wrapperRect.left - baseRect.left;
        const maxX = wrapperRect.right - baseRect.right;
        const sectionRect = aboutSection.getBoundingClientRect();
        const minY = Math.max(-32, sectionRect.top + 8 - baseRect.top);
        const maxY = Math.min(32, sectionRect.bottom - 8 - baseRect.bottom);
        if (minX > maxX || minY > maxY) {
          resetQuotePosition();
          return;
        }

        let targetX = currentX;
        let targetY = currentY;
        if (currentDistance <= clearance) {
          // When the cursor gets close, move just far enough to keep a clear gap.
          // Prefer whichever small shift (sideways or vertically) has room.
          const candidates = [
            { x: event.clientX + clearance - baseRect.left, y: currentY },
            { x: event.clientX - clearance - baseRect.right, y: currentY },
            { x: currentX, y: event.clientY - clearance - baseRect.bottom },
            { x: currentX, y: event.clientY + clearance - baseRect.top }
          ].filter((point) => point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY);

          candidates.sort((a, b) => Math.hypot(a.x - currentX, a.y - currentY) - Math.hypot(b.x - currentX, b.y - currentY));
          const nearest = candidates[0];
          if (nearest && Math.hypot(nearest.x - currentX, nearest.y - currentY) <= 38) {
            targetX = nearest.x;
            targetY = nearest.y;
          }
        } else {
          // At a comfortable distance, add only a small sideways nudge.
          const nudge = Math.min(9, (1 - currentDistance / radius) * 9);
          targetX = event.clientX <= centerX ? nudge : -nudge;
          targetY = 0;
          targetX = Math.max(minX, Math.min(maxX, targetX));
          const nextRect = {
            left: baseRect.left + targetX,
            right: baseRect.right + targetX,
            top: baseRect.top + targetY,
            bottom: baseRect.bottom + targetY
          };
          if (distanceFromRect(event.clientX, event.clientY, nextRect) < clearance) {
            targetX = currentX;
            targetY = currentY;
          }
        }

        quoteText.style.setProperty('--quote-dodge-x', `${targetX.toFixed(1)}px`);
        quoteText.style.setProperty('--quote-dodge-y', `${targetY.toFixed(1)}px`);
      };

      document.addEventListener('pointermove', moveQuoteAway, { passive: true });
      aboutSection.addEventListener('pointerleave', resetQuotePosition);
      window.addEventListener('blur', resetQuotePosition);
      motionPreference.addEventListener('change', (event) => {
        if (event.matches) resetQuotePosition();
      });
    }
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeProjectModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeProjectModal();
    }
  });

  /* --------------------------------------------------------------------------
     VISITOR SKETCHING: document-sized transparent canvas behind the portfolio
     -------------------------------------------------------------------------- */
  const sketchCanvas = document.querySelector('.sketch-canvas');
  const sketchEraser = document.querySelector('.sketch-eraser');
  const sketchHint = document.querySelector('.sketch-hint');
  const sketchContext = sketchCanvas?.getContext('2d');

  if (sketchHint) {
    let hintTimeout;
    sketchHint.addEventListener('click', () => {
      sketchHint.classList.add('is-hint-open');
      window.clearTimeout(hintTimeout);
      hintTimeout = window.setTimeout(() => {
        sketchHint.classList.remove('is-hint-open');
      }, 2600);
    });
  }

  if (sketchCanvas && sketchContext && sketchEraser) {
    const strokes = [];
    const maxStrokeCount = 160;
    const maxStoredPoints = 24000;
    let storedPointCount = 0;
    let activeStroke = null;
    let activePointerId = null;
    let canvasPixelRatio = 1;

    function sizeSketchCanvas() {
      const cssWidth = Math.max(document.documentElement.scrollWidth, window.innerWidth);
      const cssHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, window.innerHeight);
      canvasPixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      sketchCanvas.style.width = `${cssWidth}px`;
      sketchCanvas.style.height = `${cssHeight}px`;
      sketchCanvas.width = Math.round(cssWidth * canvasPixelRatio);
      sketchCanvas.height = Math.round(cssHeight * canvasPixelRatio);
      sketchContext.setTransform(canvasPixelRatio, 0, 0, canvasPixelRatio, 0, 0);
      redrawSketches();
    }

    function lineWidthFor(point, pointerType) {
      const naturalVariation = Math.sin((point.x + point.y) * 0.025) * 0.14;
      if (pointerType === 'pen' && point.pressure > 0) {
        return 1.05 + point.pressure * 1.8 + naturalVariation;
      }
      if (pointerType === 'touch') return 2 + naturalVariation;
      return 1.7 + naturalVariation;
    }

    function drawSegment(stroke, from, to) {
      sketchContext.beginPath();
      sketchContext.moveTo(from.x, from.y);
      sketchContext.lineTo(to.x, to.y);
      sketchContext.strokeStyle = '#111111';
      sketchContext.lineWidth = lineWidthFor(to, stroke.pointerType);
      sketchContext.lineCap = 'round';
      sketchContext.lineJoin = 'round';
      sketchContext.stroke();
    }

    function redrawSketches() {
      const width = sketchCanvas.width / canvasPixelRatio;
      const height = sketchCanvas.height / canvasPixelRatio;
      sketchContext.clearRect(0, 0, width, height);
      strokes.forEach((stroke) => {
        for (let i = 1; i < stroke.points.length; i += 1) {
          drawSegment(stroke, stroke.points[i - 1], stroke.points[i]);
        }
      });
    }

    function isDrawingBlocked(target) {
      if (!(target instanceof Element)) return true;
      const blockedElement = target.closest(
        'a, button, input, textarea, select, option, label, nav, header, summary, iframe, video, audio, [role="button"], [role="link"], [role="checkbox"], [role="tab"], [role="menuitem"], [role="switch"], [role="slider"], [role="radio"], [tabindex]:not([tabindex="-1"]), [contenteditable="true"], .interactive-step, .project-card, .paper-card, .contact-bubble, figure, img, picture, .sticker, .sketch-eraser, .modal-overlay'
      );
      return Boolean(blockedElement) || Boolean(document.querySelector('.modal-overlay.active'));
    }

    function pointFromPointer(event) {
      return {
        x: event.pageX,
        y: event.pageY,
        pressure: event.pressure || 0.5
      };
    }

    function beginSketch(event) {
      if (!event.isPrimary || event.button !== 0 || isDrawingBlocked(event.target)) return;

      event.preventDefault();
      const pointerType = event.pointerType || 'mouse';
      const firstPoint = pointFromPointer(event);
      activeStroke = { pointerId: event.pointerId, pointerType, points: [firstPoint] };
      activePointerId = event.pointerId;
      strokes.push(activeStroke);
      storedPointCount += 1;
      document.body.classList.add('is-sketching');

      if (event.target instanceof Element && event.target.setPointerCapture) {
        try { event.target.setPointerCapture(event.pointerId); } catch (_) { /* capture is optional */ }
      }
    }

    function continueSketch(event) {
      if (!activeStroke || event.pointerId !== activePointerId) return;
      const samples = typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : [event];
      samples.forEach((sample) => {
        const nextPoint = pointFromPointer(sample);
        const previousPoint = activeStroke.points[activeStroke.points.length - 1];
        if (Math.hypot(nextPoint.x - previousPoint.x, nextPoint.y - previousPoint.y) < 0.7) return;
        activeStroke.points.push(nextPoint);
        storedPointCount += 1;
        drawSegment(activeStroke, previousPoint, nextPoint);
      });

      while (strokes.length > maxStrokeCount || storedPointCount > maxStoredPoints) {
        const oldestStroke = strokes.shift();
        if (!oldestStroke) break;
        storedPointCount -= oldestStroke.points.length;
      }
    }

    function finishSketch(event) {
      if (!activeStroke || (event && event.pointerId !== activePointerId)) return;
      activeStroke = null;
      activePointerId = null;
      document.body.classList.remove('is-sketching');
    }

    document.addEventListener('pointerdown', beginSketch, { passive: false });
    document.addEventListener('pointermove', continueSketch, { passive: true });
    document.addEventListener('pointerup', finishSketch);
    document.addEventListener('pointercancel', finishSketch);
    window.addEventListener('blur', () => finishSketch());
    window.addEventListener('resize', sizeSketchCanvas, { passive: true });

    if ('ResizeObserver' in window) {
      const pageSizeObserver = new ResizeObserver(sizeSketchCanvas);
      pageSizeObserver.observe(document.body);
      pageSizeObserver.observe(document.documentElement);
    }

    sketchEraser.addEventListener('click', () => {
      strokes.length = 0;
      storedPointCount = 0;
      finishSketch();
      redrawSketches();
    });

    sizeSketchCanvas();
  }
});
