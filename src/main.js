import './styles.css';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.documentElement.classList.add('js');

const giftIntro = document.querySelector('[data-gift-intro]');
const giftBox = document.querySelector('[data-gift-box]');
const finalToggle = document.querySelector('[data-final-toggle]');
const finalMessage = document.querySelector('[data-final-message]');
const giftSeenKey = 'babasiteGiftOpened';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const hasSeenGift = () => {
  try {
    return window.localStorage.getItem(giftSeenKey) === 'true';
  } catch {
    return false;
  }
};

const rememberGiftOpened = () => {
  try {
    window.localStorage.setItem(giftSeenKey, 'true');
  } catch {
    document.cookie = `${giftSeenKey}=true; max-age=31536000; path=/; samesite=lax`;
  }
};

const setGiftProgress = (progress) => {
  const eased = clamp(progress, 0, 1);

  document.documentElement.style.setProperty('--gift-progress', eased.toFixed(3));
  document.documentElement.style.setProperty('--gift-box-y', `${eased * -18}px`);
  document.documentElement.style.setProperty('--gift-box-scale', `${1 - eased * 0.08}`);
  document.documentElement.style.setProperty('--gift-box-opacity', `${1 - eased * 0.16}`);
  document.documentElement.style.setProperty('--gift-lid-y', `${eased * -132}px`);
  document.documentElement.style.setProperty('--gift-lid-rotate', `${eased * -14}deg`);
  document.documentElement.style.setProperty('--gift-bow-y', `${eased * -118}px`);
  document.documentElement.style.setProperty('--gift-ribbon-gap', `${eased * 115}%`);
  document.documentElement.style.setProperty('--gift-wrap-opacity', `${1 - eased * 0.6}`);
  document.documentElement.style.setProperty('--gift-wrap-y', `${eased * -34}px`);
  document.documentElement.style.setProperty('--gift-sparkle-scale', `${0.85 + eased * 1.1}`);
  document.documentElement.style.setProperty('--gift-ribbon-y', `${eased * 82}px`);
  document.documentElement.style.setProperty('--gift-hint-opacity', `${0.62 - eased * 0.5}`);
};

if (giftIntro && (prefersReducedMotion || hasSeenGift())) {
  giftIntro.remove();
} else if (giftIntro && giftBox) {
  document.documentElement.classList.add('gift-gated');
  setGiftProgress(0);

  let pointerId = null;
  let startY = 0;
  let currentProgress = 0;
  let giftOpened = false;

  const threshold = () => (window.matchMedia('(max-width: 640px)').matches ? 92 : 128);

  const openGift = () => {
    if (giftOpened) return;

    giftOpened = true;
    rememberGiftOpened();
    pointerId = null;
    currentProgress = 1;
    setGiftProgress(1);
    giftBox.setAttribute('data-open', 'true');
    document.documentElement.classList.add('gift-opening');

    window.setTimeout(() => {
      document.documentElement.classList.add('gift-open');
      document.documentElement.classList.remove('gift-gated', 'gift-opening');
      giftIntro.setAttribute('aria-hidden', 'true');
      giftIntro.setAttribute('tabindex', '-1');
    }, 720);
  };

  const resetGift = () => {
    pointerId = null;
    currentProgress = 0;
    setGiftProgress(0);
    giftBox.removeAttribute('data-open');
    giftIntro.classList.remove('is-dragging');
  };

  const onPointerMove = (event) => {
    if (pointerId !== event.pointerId) return;

    const dragDistance = Math.max(startY - event.clientY, 0);
    currentProgress = clamp(dragDistance / threshold(), 0, 1);
    setGiftProgress(currentProgress);

    if (currentProgress > 0.96) {
      giftIntro.releasePointerCapture(pointerId);
      giftIntro.removeEventListener('pointermove', onPointerMove);
      openGift();
    }
  };

  const onPointerUp = (event) => {
    if (pointerId !== event.pointerId) return;

    giftIntro.releasePointerCapture(pointerId);
    giftIntro.removeEventListener('pointermove', onPointerMove);
    giftIntro.classList.remove('is-dragging');

    if (currentProgress >= 0.58) {
      openGift();
    } else {
      resetGift();
    }
  };

  giftIntro.addEventListener('pointerdown', (event) => {
    if (document.documentElement.classList.contains('gift-open')) return;

    pointerId = event.pointerId;
    startY = event.clientY;
    currentProgress = 0;
    giftIntro.classList.add('is-dragging');
    giftIntro.setPointerCapture(pointerId);
    giftIntro.addEventListener('pointermove', onPointerMove);
    giftIntro.addEventListener('pointerup', onPointerUp, { once: true });
    giftIntro.addEventListener('pointercancel', resetGift, { once: true });
  });

  giftIntro.addEventListener('keydown', (event) => {
    if (!['Enter', ' ', 'ArrowUp'].includes(event.key)) return;

    event.preventDefault();
    openGift();
  });
}

const launchHearts = (source) => {
  if (prefersReducedMotion) return;

  const rect = source.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  for (let index = 0; index < 18; index += 1) {
    const heart = document.createElement('span');
    const driftX = (Math.random() - 0.5) * 180;
    const driftY = -90 - Math.random() * 110;
    const size = 14 + Math.random() * 16;

    heart.className = 'floating-heart';
    heart.textContent = '♥';
    heart.style.left = `${originX}px`;
    heart.style.top = `${originY}px`;
    heart.style.fontSize = `${size}px`;
    heart.style.setProperty('--heart-x', `${driftX}px`);
    heart.style.setProperty('--heart-y', `${driftY}px`);
    heart.style.animationDelay = `${index * 18}ms`;

    document.body.append(heart);
    heart.addEventListener('animationend', () => heart.remove(), { once: true });
  }
};

if (finalToggle && finalMessage) {
  finalToggle.hidden = false;
  finalMessage.hidden = true;
  finalToggle.setAttribute('aria-expanded', 'false');

  finalToggle.addEventListener('click', () => {
    const isOpen = finalToggle.getAttribute('aria-expanded') === 'true';
    finalToggle.setAttribute('aria-expanded', String(!isOpen));
    finalMessage.hidden = isOpen;
    launchHearts(finalToggle);

    if (!isOpen && !prefersReducedMotion) {
      finalMessage.animate(
        [
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 320, easing: 'ease-out' }
      );
    }
  });
}

const revealItems = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          activeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: '0px 0px -40px 0px' }
  );

  revealItems.forEach((item) => observer.observe(item));
}
