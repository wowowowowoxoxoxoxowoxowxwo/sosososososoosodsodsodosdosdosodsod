window.addEventListener('error', (e) => {
    console.error("Global script error:", e.message, "at line", e.lineno);
});
const cursorDot = document.getElementById('custom-cursor-dot');
let cursorX = 0, cursorY = 0;
let lastParticleTime = 0;
let lastX = 0, lastY = 0;

if (cursorDot) {
    window.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        
        cursorDot.style.top = `${cursorY}px`;
        cursorDot.style.left = `${cursorX}px`;
        
        const now = Date.now();
        const dist = Math.hypot(cursorX - lastX, cursorY - lastY);
        
        if (dist > 35 && (now - lastParticleTime > 150)) {
            lastParticleTime = now;
            lastX = cursorX;
            lastY = cursorY;
            createAsteriskParticle(cursorX, cursorY);
        }
    });

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, input, select, textarea, .nav-btn, .toggle-btn, .partner-menu-item-btn')) {
            cursorDot.classList.add('active');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, input, select, textarea, .nav-btn, .toggle-btn, .partner-menu-item-btn')) {
            cursorDot.classList.remove('active');
        }
    });
}

function createAsteriskParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'snowflake-particle';
    particle.textContent = '*';
    
    particle.style.position = 'fixed';
    particle.style.pointerEvents = 'none';
    particle.style.color = 'var(--theme-color)';
    particle.style.fontFamily = 'monospace';
    particle.style.fontSize = `${Math.random() * 5 + 6}px`;
    particle.style.lineHeight = '1';
    particle.style.zIndex = '9998';
    particle.style.userSelect = 'none';
    particle.style.willChange = 'transform, opacity';
    particle.style.transition = 'color 2s ease';
    
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    document.body.appendChild(particle);
    
    const drift = (Math.random() - 0.5) * 40;
    const fall = 35 + Math.random() * 45;
    const duration = 0.8 + Math.random() * 0.6;
    
    particle.animate([
        { transform: 'translate3d(0, 0, 0)', opacity: 0.8 },
        { transform: `translate3d(${drift}px, ${fall}px, 0)`, opacity: 0 }
    ], {
        duration: duration * 1000,
        easing: 'linear',
        fill: 'forwards'
    });
    
    setTimeout(() => {
        particle.remove();
    }, duration * 1000 + 50);
}

const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isMobileSize = window.innerWidth <= 900;

if (isTouchDevice || isMobileUA || isMobileSize) {
    document.body.classList.add('is-mobile');
}

document.body.classList.add('entered');

const glowContainer = document.createElement('div');
glowContainer.className = 'bg-glows';
document.body.prepend(glowContainer);

const themes = [
    {
        color: '#907aa9', 
        glow: 'rgba(144, 122, 169, 0.15)',
        bgGlow: 'rgba(144, 122, 169, 0.04)',
        h: 270,
        s: '20%'
    },
    {
        color: '#7aa98c', 
        glow: 'rgba(122, 169, 140, 0.15)',
        bgGlow: 'rgba(122, 169, 140, 0.04)',
        h: 140,
        s: '20%'
    },
    {
        color: '#b88a92', 
        glow: 'rgba(184, 138, 146, 0.15)',
        bgGlow: 'rgba(184, 138, 146, 0.04)',
        h: 350,
        s: '22%'
    },
    {
        color: '#7a98a9',
        glow: 'rgba(122, 152, 169, 0.15)',
        bgGlow: 'rgba(122, 152, 169, 0.04)',
        h: 200,
        s: '22%'
    },
    {
        color: '#a99a7a',
        glow: 'rgba(169, 154, 122, 0.15)',
        bgGlow: 'rgba(169, 154, 122, 0.04)',
        h: 40,
        s: '22%'
    }
];

function applyRandomTheme() {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    document.documentElement.style.setProperty('--theme-color', randomTheme.color);
    document.documentElement.style.setProperty('--theme-color-glow', randomTheme.glow);
    document.documentElement.style.setProperty('--theme-color-bg-glow', randomTheme.bgGlow);
    document.documentElement.style.setProperty('--theme-h', randomTheme.h);
    document.documentElement.style.setProperty('--theme-s', randomTheme.s);
}

const bgAsciiElement = document.getElementById('bg-ascii-art');
const asciiFiles = [
    'ascii/asciiart.txt',
    'ascii/asciiart1.txt',
    'ascii/ascii2.txt',
    'ascii/aciiart3.txt',
    'ascii/asciirt4.txt',
    'ascii/asciiart5.txt'
];

function loadBgAscii() {
    if (!bgAsciiElement) return;
    
    bgAsciiElement.style.opacity = '0';
    
    applyRandomTheme();
    
    const randomFile = asciiFiles[Math.floor(Math.random() * asciiFiles.length)];
    
    setTimeout(() => {
        fetch(randomFile)
            .then(res => {
                if (!res.ok) throw new Error("Failed to load: " + randomFile);
                return res.text();
            })
            .then(text => {
                bgAsciiElement.textContent = text;
                bgAsciiElement.style.opacity = '0.22';
            })
            .catch(err => {
                console.error("Error loading ASCII file:", err);
            });
    }, 400);
}

function initSnow() {
    const snowContainer = document.createElement('div');
    snowContainer.id = 'snow-container';
    snowContainer.style.position = 'fixed';
    snowContainer.style.inset = '0';
    snowContainer.style.pointerEvents = 'none';
    snowContainer.style.zIndex = '-1';
    snowContainer.style.overflow = 'hidden';
    document.body.prepend(snowContainer);

    const maxSnowflakes = 45;
    for (let i = 0; i < maxSnowflakes; i++) {
        createSnowflake(snowContainer, true);
    }
}

function createSnowflake(container, startRandomY = false) {
    const flake = document.createElement('div');
    flake.className = 'snowflake';
    flake.textContent = '*';
    flake.style.position = 'absolute';
    flake.style.color = 'var(--theme-color)';
    flake.style.fontFamily = 'monospace';
    flake.style.fontSize = `${Math.random() * 8 + 8}px`;
    flake.style.opacity = (Math.random() * 0.25 + 0.1).toFixed(2);
    flake.style.userSelect = 'none';
    flake.style.transition = 'color 0.8s ease';
    
    const startX = Math.random() * 100; 
    const startY = startRandomY ? Math.random() * 100 : -10; 
    
    flake.style.left = `${startX}%`;
    flake.style.top = `${startY}%`;
    
    container.appendChild(flake);
    
    const fallDuration = 8000 + Math.random() * 12000;
    const driftDistance = (Math.random() - 0.5) * 150;
    
    const anim = flake.animate([
        { transform: `translate3d(0, 0, 0)` },
        { transform: `translate3d(${driftDistance}px, ${window.innerHeight * (1.1 - startY/100)}px, 0)` }
    ], {
        duration: startRandomY ? fallDuration * (1 - startY/100) : fallDuration,
        easing: 'linear'
    });
    
    anim.onfinish = () => {
        flake.remove();
        createSnowflake(container, false);
    };
}


const toggleGroups = document.querySelectorAll('.toggle-group');
const toggleButtons = document.querySelectorAll('.toggle-btn, .nav-btn[data-target]');
const profileCards = document.querySelectorAll('.profile-card');
const profileBackBtns = document.querySelectorAll('.profile-back-btn');
const partnerMenuBtns = document.querySelectorAll('.partner-menu-item-btn');

toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const isActive = btn.classList.contains('active');
        const parentGroup = btn.closest('.toggle-group');
        
        toggleButtons.forEach(t => t.classList.remove('active'));
        toggleGroups.forEach(g => g.classList.remove('active'));
        
        if (isActive) {
            closeActiveProfile();
        } else {
            btn.classList.add('active');
            if (parentGroup) parentGroup.classList.add('active');
            
            profileCards.forEach(card => {
                card.classList.remove('active');
                if (card.id === `profile-${targetId}`) {
                    card.classList.add('active');
                }
            });
            
            document.body.classList.add('modal-active');
        }
    });
});

partnerMenuBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target'); 
        
        profileCards.forEach(card => {
            card.classList.remove('active');
            if (card.id === `profile-${targetId}`) {
                card.classList.add('active');
            }
        });
    });
});

profileBackBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.profile-card');
        if (card.id === 'profile-partner-swatted' || card.id === 'profile-partner-cybershield') {
            profileCards.forEach(c => c.classList.remove('active'));
            document.getElementById('profile-partners').classList.add('active');
        } else {
            closeActiveProfile();
        }
    });
});

function closeActiveProfile() {
    toggleButtons.forEach(t => t.classList.remove('active'));
    toggleGroups.forEach(g => g.classList.remove('active'));
    profileCards.forEach(card => card.classList.remove('active'));
    document.body.classList.remove('modal-active');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.toggle-btn') && 
        !e.target.closest('.nav-btn[data-target]') && 
        !e.target.closest('.profile-card') &&
        !e.target.closest('.partner-menu-item-btn')) {
        const anyProfileActive = Array.from(profileCards).some(c => c.classList.contains('active'));
        if (anyProfileActive) {
            closeActiveProfile();
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeActiveProfile();
    }
});

const audio = document.getElementById('bg-music');
const musicToggleBtn = document.getElementById('music-toggle-btn');
const volumeSlider = document.getElementById('volume-slider');

if (audio) {
    audio.volume = 0.08;
}

if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMusic();
    });
}

function toggleMusic(forcePlay = false) {
    if (!audio || !musicToggleBtn) return;
    if (forcePlay || audio.paused) {
        audio.play().then(() => {
            musicToggleBtn.innerHTML = '&#10074;&#10074;'; 
        }).catch(err => console.log("Audio play blocked by browser:", err));
    } else {
        audio.pause();
        musicToggleBtn.innerHTML = '&#9658;'; 
    }
}

if (volumeSlider && audio) {
    volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        audio.volume = val;
        audio.muted = val === 0;
    });
}

function startMusicOnGesture() {
    toggleMusic(true);
    document.removeEventListener('click', startMusicOnGesture, true);
    document.removeEventListener('keydown', startMusicOnGesture, true);
}
document.addEventListener('click', startMusicOnGesture, true);
document.addEventListener('keydown', startMusicOnGesture, true);

const baseTitle = "Fatal.sh";
let titleCharIndex = 0;

function animateTabTitle() {
    if (titleCharIndex === baseTitle.length) {
        document.title = ":3";
        titleCharIndex = 0;
    } else {
        let animatedTitle = "";
        for (let i = 0; i < baseTitle.length; i++) {
            if (i === titleCharIndex) {
                animatedTitle += baseTitle[i].toUpperCase();
            } else {
                animatedTitle += baseTitle[i].toLowerCase();
            }
        }
        document.title = animatedTitle;
        titleCharIndex++;
    }
    setTimeout(animateTabTitle, 350);
}

loadBgAscii();
initSnow();
animateTabTitle();
