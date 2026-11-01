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
  function updateActiveNav() {
    const scrollPosition = window.scrollY + 120; // Offset for sticky header

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
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
    if (modalIntroLines) modalIntroLines.hidden = isVerpakt || isWatkok || isScentory;
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
});
