/* tweaks-app.jsx — sci-fi gimmicks for aliiiii */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "scanlines": true,
  "neonGlow": true,
  "holoCards": true,
  "termCursor": true,
  "floatingHolo": false,
  "typewriter": true,
  "particleTrail": true,
  "radarPing": false,
  "transmissionStatic": false,
  "alienDecode": true,
  "parallaxDrift": false,
  "konamiEnabled": true
}/*EDITMODE-END*/;

/* ═══════════════════════════════════════════════
   CSS-ONLY EFFECTS
   ═══════════════════════════════════════════════ */
const scifiStyleId = '__scifi-fx-styles';
if (!document.getElementById(scifiStyleId)) {
  const s = document.createElement('style');
  s.id = scifiStyleId;
  s.textContent = `
    /* ── SCANLINES ── */
    .fx-scanlines .page::after {
      content:''; position:fixed; inset:0; pointer-events:none; z-index:9999;
      background:repeating-linear-gradient(0deg,transparent 0px,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px);
    }

    /* ── NEON GLOW ── */
    .fx-neon .panel {
      border-color:rgba(180,120,255,0.6)!important;
      box-shadow:0 0 18px rgba(180,120,255,0.25),0 0 4px rgba(180,120,255,0.15),inset 0 0 14px rgba(180,120,255,0.08)!important;
    }
    .fx-neon .panel:hover {
      box-shadow:0 0 32px rgba(180,120,255,0.4),0 0 8px rgba(180,120,255,0.25),inset 0 0 22px rgba(180,120,255,0.12)!important;
    }

    /* ── HOLOGRAPHIC CARDS ── */
    @keyframes holoShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    .fx-holo .project-card::after {
      content:''; position:absolute; inset:0; pointer-events:none; border-radius:inherit;
      background:linear-gradient(135deg,rgba(255,0,128,0.18),rgba(0,200,255,0.18),rgba(128,0,255,0.18),rgba(255,200,0,0.18),rgba(0,255,128,0.18));
      background-size:300% 300%; animation:holoShift 4s ease infinite; mix-blend-mode:color-dodge;
    }
    .fx-holo .project-card{position:relative}

    /* ── TERMINAL CURSOR ── */
    @keyframes cursorBlink{0%,49%{opacity:1}50%,100%{opacity:0}}
    .fx-cursor .hero__quote::after {
      content:'█'; display:inline; margin-left:4px;
      animation:cursorBlink 1s step-end infinite; color:inherit; opacity:0.6;
    }

    /* ── FLOATING HOLOGRAMS ── */
    @keyframes floatDrift{0%{transform:translateY(110vh) rotate(0deg)}100%{transform:translateY(-20vh) rotate(360deg)}}
    .holo-shape {
      position:fixed; pointer-events:none; z-index:1; opacity:0.12;
      border:1.5px solid rgba(180,120,255,0.6);
      animation:floatDrift linear infinite;
    }

    /* ── RADAR PING ── */
    @keyframes radarSweep{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
    @keyframes radarPulse{0%,100%{opacity:0.15}50%{opacity:0.35}}
    .radar-container {
      position:fixed; bottom:20px; left:20px; width:80px; height:80px;
      border-radius:50%; border:1px solid rgba(180,120,255,0.25);
      pointer-events:none; z-index:9998; overflow:hidden;
      background:rgba(20,10,30,0.3); animation:radarPulse 3s ease infinite;
    }
    .radar-sweep {
      position:absolute; top:50%; left:50%; width:50%; height:2px;
      transform-origin:left center; background:linear-gradient(90deg,rgba(180,120,255,0.8),transparent);
      animation:radarSweep 3s linear infinite;
    }
    .radar-ring{position:absolute;border-radius:50%;border:0.5px solid rgba(180,120,255,0.15)}
    .radar-ring.r1{inset:25%}.radar-ring.r2{inset:42%}
    .radar-cross{position:absolute;background:rgba(180,120,255,0.1)}
    .radar-cross.h{top:50%;left:0;right:0;height:0.5px}
    .radar-cross.v{left:50%;top:0;bottom:0;width:0.5px}
    .radar-dot{position:absolute;width:3px;height:3px;border-radius:50%;background:rgba(180,120,255,0.7)}

    /* ── TRANSMISSION STATIC ── */
    @keyframes staticFlash{0%,94%,100%{opacity:0}95%{opacity:0.08}97%{opacity:0.04}}
    .static-overlay {
      position:fixed; inset:0; pointer-events:none; z-index:9998;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      animation:staticFlash 8s ease infinite;
    }

    /* ── ALIEN DECODER ── */
    .fx-alien [data-alien-hover]{cursor:default}

    /* ── PARALLAX DRIFT ── */
    .fx-parallax .panel{transition:transform 0.3s ease}

    /* ── KONAMI MATRIX ── */
    @keyframes matrixFall{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
    .konami-overlay {
      position:fixed; inset:0; z-index:99999; pointer-events:none;
      background:rgba(0,0,0,0.85); overflow:hidden;
      animation:fadeIn 0.3s ease;
    }
    @keyframes fadeIn{0%{opacity:0}100%{opacity:1}}
    .matrix-col{position:absolute;top:0;font-family:'Electrolize',monospace;
      font-size:14px;color:#0f0;opacity:0.8;white-space:pre;line-height:1.2;
      animation:matrixFall linear infinite;text-shadow:0 0 8px rgba(0,255,0,0.5)}
  `;
  document.head.appendChild(s);
}


/* ═══════════════════════════════════════════════
   JS-DRIVEN EFFECTS (managed via refs/cleanup)
   ═══════════════════════════════════════════════ */

// ── FLOATING HOLOGRAMS ──
let holoShapes = [];
function startHolograms() {
  stopHolograms();
  const shapes = ['△','◇','⬡','◻','⬢'];
  for (let i = 0; i < 6; i++) {
    const el = document.createElement('div');
    el.className = 'holo-shape';
    const size = 20 + Math.random() * 40;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = (Math.random() * 90 + 5) + '%';
    el.style.animationDuration = (12 + Math.random() * 18) + 's';
    el.style.animationDelay = -(Math.random() * 20) + 's';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.fontSize = (size * 0.6) + 'px';
    el.style.color = 'rgba(180,120,255,0.2)';
    el.textContent = shapes[i % shapes.length];
    document.body.appendChild(el);
    holoShapes.push(el);
  }
}
function stopHolograms() {
  holoShapes.forEach(el => el.remove());
  holoShapes = [];
}

// ── TYPEWRITER ──
let typewriterTimer = null;
let originalQuote = '';
function startTypewriter() {
  stopTypewriter();
  const el = document.querySelector('.hero__quote');
  if (!el) return;
  // Ensure left alignment during typing
  el.style.textAlign = 'left';
  const textNode = el.querySelector('span') || el;
  originalQuote = originalQuote || textNode.textContent.trim();
  textNode.textContent = '';
  let i = 0;
  typewriterTimer = setInterval(() => {
    if (i < originalQuote.length) {
      textNode.textContent += originalQuote[i];
      i++;
    } else {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
    }
  }, 35);
}
function stopTypewriter() {
  if (typewriterTimer) { clearInterval(typewriterTimer); typewriterTimer = null; }
  if (originalQuote) {
    const el = document.querySelector('.hero__quote');
    if (el) {
      const textNode = el.querySelector('span') || el;
      textNode.textContent = originalQuote;
    }
  }
}

// ── PARTICLE TRAIL ──
let particleHandler = null;
function startParticles() {
  stopParticles();
  particleHandler = (e) => {
    const p = document.createElement('div');
    p.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:4px;height:4px;
      border-radius:50%;background:rgba(180,120,255,0.7);pointer-events:none;z-index:9998;
      box-shadow:0 0 6px rgba(180,120,255,0.5);transition:all 0.8s ease;`;
    document.body.appendChild(p);
    requestAnimationFrame(() => {
      p.style.transform = `translate(${(Math.random()-0.5)*30}px, ${-10-Math.random()*20}px)`;
      p.style.opacity = '0';
    });
    setTimeout(() => p.remove(), 800);
  };
  window.addEventListener('mousemove', particleHandler);
}
function stopParticles() {
  if (particleHandler) { window.removeEventListener('mousemove', particleHandler); particleHandler = null; }
}

// ── RADAR PING ──
let radarEl = null;
function startRadar() {
  stopRadar();
  radarEl = document.createElement('div');
  radarEl.className = 'radar-container';
  radarEl.innerHTML = `
    <div class="radar-cross h"></div><div class="radar-cross v"></div>
    <div class="radar-ring r1"></div><div class="radar-ring r2"></div>
    <div class="radar-sweep"></div>
    <div class="radar-dot" style="top:30%;left:60%"></div>
    <div class="radar-dot" style="top:65%;left:35%"></div>
    <div class="radar-dot" style="top:45%;left:70%"></div>
  `;
  document.body.appendChild(radarEl);
}
function stopRadar() {
  if (radarEl) { radarEl.remove(); radarEl = null; }
}

// ── TRANSMISSION STATIC ──
let staticEl = null;
function startStatic() {
  stopStatic();
  staticEl = document.createElement('div');
  staticEl.className = 'static-overlay';
  document.body.appendChild(staticEl);
}
function stopStatic() {
  if (staticEl) { staticEl.remove(); staticEl = null; }
}

// ── ALIEN DECODER ──
let alienTimers = [];
const alienChars = '⌰⍙⎔⏣⏚⌬⍟⎊⏛⌭⍜⏠⌮⍝⎋⏡⌯⍞⎌⏢';
function startAlienDecode() {
  stopAlienDecode();
  // Auto-decode titles: aliiiii, Projects, Writing, Gallery
  const heroName = document.querySelector('.hero__name');
  const panelLabels = document.querySelectorAll('.panel__label');
  const targets = [];
  if (heroName) targets.push(heroName);
  panelLabels.forEach(el => {
    const text = el.textContent.trim();
    if (['Projects', 'Writing', 'Gallery'].includes(text)) targets.push(el);
  });

  targets.forEach((el, idx) => {
    const orig = el.textContent.trim();
    // Start scrambled
    const scrambled = orig.split('').map(() => alienChars[Math.floor(Math.random()*alienChars.length)]).join('');
    el.textContent = scrambled;
    // Decode after staggered delay
    const startDelay = setTimeout(() => {
      let step = 0;
      const interval = setInterval(() => {
        if (step >= orig.length) { el.textContent = orig; clearInterval(interval); return; }
        el.textContent = orig.slice(0, step + 1) + scrambled.slice(step + 1);
        step++;
      }, 60);
      alienTimers.push(interval);
    }, 500 + idx * 800);
    alienTimers.push(startDelay);
  });
}
function stopAlienDecode() {
  alienTimers.forEach(id => clearTimeout(id));
  alienTimers.forEach(id => clearInterval(id));
  alienTimers = [];
  // Restore original text
  const heroName = document.querySelector('.hero__name');
  if (heroName && heroName.textContent.match(/[⌰⍙⎔⏣⏚⌬⍟⎊⏛⌭⍜⏠⌮⍝⎋⏡⌯⍞⎌⏢]/)) {
    heroName.textContent = 'aliiiii';
  }
  document.querySelectorAll('.panel__label').forEach(el => {
    if (el.textContent.match(/[⌰⍙⎔⏣⏚⌬⍟⎊⏛⌭⍜⏠⌮⍝⎋⏡⌯⍞⎌⏢]/)) {
      // Try to restore from known labels
      const parent = el.closest('.projects-panel, .blog-panel, .gallery-panel');
      if (parent?.classList.contains('projects-panel')) el.textContent = 'Projects';
      else if (parent?.classList.contains('blog-panel')) el.textContent = 'Writing';
      else if (parent?.classList.contains('gallery-panel')) el.textContent = 'Gallery';
    }
  });
}

// ── PARALLAX DRIFT ──
let parallaxHandler = null;
function startParallax() {
  stopParallax();
  document.body.classList.add('fx-parallax');
  parallaxHandler = (e) => {
    const cx = (e.clientX / window.innerWidth - 0.5) * 2;
    const cy = (e.clientY / window.innerHeight - 0.5) * 2;
    document.querySelectorAll('.panel').forEach((el, i) => {
      const depth = 0.8 + (i % 3) * 0.6;
      el.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
    });
  };
  window.addEventListener('mousemove', parallaxHandler);
}
function stopParallax() {
  if (parallaxHandler) { window.removeEventListener('mousemove', parallaxHandler); parallaxHandler = null; }
  document.body.classList.remove('fx-parallax');
  document.querySelectorAll('.panel').forEach(el => el.style.transform = '');
}

// ── KONAMI CODE ──
const KONAMI_CODE = ['a','l','i','i','i','i','i'];
let konamiPos = 0;
let konamiOverlay = null;
let konamiKeyHandler = null;
function startKonami() {
  stopKonami();
  konamiPos = 0;
  konamiKeyHandler = (e) => {
    if (e.key.toLowerCase() === KONAMI_CODE[konamiPos]) {
      konamiPos++;
      if (konamiPos === KONAMI_CODE.length) {
        triggerMatrix();
        konamiPos = 0;
      }
    } else { konamiPos = 0; }
  };
  window.addEventListener('keydown', konamiKeyHandler);
}
function stopKonami() {
  if (konamiKeyHandler) { window.removeEventListener('keydown', konamiKeyHandler); konamiKeyHandler = null; }
  if (konamiOverlay) { konamiOverlay.remove(); konamiOverlay = null; }
}
function triggerMatrix() {
  if (konamiOverlay) return;
  konamiOverlay = document.createElement('div');
  konamiOverlay.className = 'konami-overlay';
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF';
  for (let i = 0; i < 30; i++) {
    const col = document.createElement('div');
    col.className = 'matrix-col';
    col.style.left = (i * 3.33) + '%';
    col.style.animationDuration = (2 + Math.random() * 3) + 's';
    col.style.animationDelay = -(Math.random() * 3) + 's';
    col.style.opacity = 0.4 + Math.random() * 0.5;
    let text = '';
    for (let j = 0; j < 40; j++) text += chars[Math.floor(Math.random()*chars.length)] + '\n';
    col.textContent = text;
    konamiOverlay.appendChild(col);
  }
  // Add message
  const msg = document.createElement('div');
  msg.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:Audiowide,sans-serif;font-size:28px;color:#0f0;text-shadow:0 0 20px rgba(0,255,0,0.6);z-index:1;text-align:center;letter-spacing:0.1em';
  msg.textContent = 'WELCOME TO THE MATRIX';
  konamiOverlay.appendChild(msg);
  document.body.appendChild(konamiOverlay);
  setTimeout(() => { if (konamiOverlay) { konamiOverlay.remove(); konamiOverlay = null; } }, 5000);
}


/* ═══════════════════════════════════════════════
   APPLY ALL TWEAKS
   ═══════════════════════════════════════════════ */
function applyTweaks(t) {
  const b = document.body;

  // CSS class toggles
  b.classList.toggle('fx-scanlines', !!t.scanlines);
  b.classList.toggle('fx-neon', !!t.neonGlow);
  b.classList.toggle('fx-holo', !!t.holoCards);
  b.classList.toggle('fx-cursor', !!t.termCursor);

  // JS-driven effects
  t.floatingHolo ? startHolograms() : stopHolograms();
  t.typewriter ? startTypewriter() : stopTypewriter();
  t.particleTrail ? startParticles() : stopParticles();
  t.radarPing ? startRadar() : stopRadar();
  t.transmissionStatic ? startStatic() : stopStatic();
  t.alienDecode ? startAlienDecode() : stopAlienDecode();
  t.parallaxDrift ? startParallax() : stopParallax();
  t.konamiEnabled ? startKonami() : stopKonami();
}


/* ═══════════════════════════════════════════════
   TWEAKS PANEL UI
   ═══════════════════════════════════════════════ */
function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const prevRef = React.useRef(t);

  React.useEffect(() => {
    // Only re-run changed keys to avoid restarting typewriter etc. on every toggle
    const prev = prevRef.current;
    const changed = Object.keys(t).some(k => t[k] !== prev[k]);
    if (changed) applyTweaks(t);
    prevRef.current = t;
  }, [t]);

  // Initial apply
  React.useEffect(() => { applyTweaks(t); }, []);

  return (
    <TweaksPanel title="Sci-Fi Gimmicks">
      <TweakSection label="Overlays" />
      <TweakToggle label="CRT scanlines" value={t.scanlines}
        onChange={(v) => setTweak('scanlines', v)} />
      <TweakToggle label="Neon glow" value={t.neonGlow}
        onChange={(v) => setTweak('neonGlow', v)} />
      <TweakToggle label="Transmission static" value={t.transmissionStatic}
        onChange={(v) => setTweak('transmissionStatic', v)} />

      <TweakSection label="Animations" />
      <TweakToggle label="Floating holograms" value={t.floatingHolo}
        onChange={(v) => setTweak('floatingHolo', v)} />
      <TweakToggle label="Cursor particle trail" value={t.particleTrail}
        onChange={(v) => setTweak('particleTrail', v)} />
      <TweakToggle label="Radar ping" value={t.radarPing}
        onChange={(v) => setTweak('radarPing', v)} />
      <TweakToggle label="Parallax drift" value={t.parallaxDrift}
        onChange={(v) => setTweak('parallaxDrift', v)} />

      <TweakSection label="Cards & Text" />
      <TweakToggle label="Holographic cards" value={t.holoCards}
        onChange={(v) => setTweak('holoCards', v)} />
      <TweakToggle label="Terminal cursor" value={t.termCursor}
        onChange={(v) => setTweak('termCursor', v)} />
      <TweakToggle label="Typewriter intro" value={t.typewriter}
        onChange={(v) => setTweak('typewriter', v)} />
      <TweakToggle label="Alien text decoder" value={t.alienDecode}
        onChange={(v) => setTweak('alienDecode', v)} />

      <TweakSection label="Easter Eggs" />
      <TweakToggle label="Konami code" value={t.konamiEnabled}
        onChange={(v) => setTweak('konamiEnabled', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<TweaksApp />);
