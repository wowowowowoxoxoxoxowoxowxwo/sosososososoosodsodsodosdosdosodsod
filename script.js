const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isMobileSize = window.innerWidth <= 900;

if (isTouchDevice || isMobileUA || isMobileSize) {
    document.body.classList.add('is-mobile');
}

const viewTriggers = document.querySelectorAll('.view-trigger');
const backButtons = document.querySelectorAll('.back-btn');
const panels = document.querySelectorAll('.view-panel');
const landingView = document.getElementById('landing-view');

viewTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const targetId = trigger.getAttribute('data-target');
        const targetView = document.getElementById(targetId);
        
        if (targetView) {
            landingView.classList.remove('active');
            targetView.classList.add('active');
            
            if (targetId === 'view-members') {
                resetMembersView();
            } else if (targetId === 'view-partners') {
                resetPartnersView();
            }
        }
    });
});

backButtons.forEach(btn => {
    if (btn.id !== 'members-back-btn' && btn.id !== 'partners-back-btn') {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            panels.forEach(panel => {
                if (panel.id !== 'landing-view') {
                    panel.classList.remove('active');
                }
            });
            landingView.classList.add('active');
        });
    }
});

const membersBackBtn = document.getElementById('members-back-btn');
const membersListMenu = document.getElementById('members-list-menu');
const profileDetails = document.querySelectorAll('.member-profile-detail');
const profileTriggers = document.querySelectorAll('.profile-trigger');

function resetMembersView() {
    membersListMenu.classList.add('active');
    profileDetails.forEach(detail => detail.classList.remove('active'));
    membersBackBtn.innerHTML = '&larr; [ back ]';
}

profileTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const targetProfileId = trigger.getAttribute('data-profile');
        const targetProfile = document.getElementById(targetProfileId);
        
        if (targetProfile) {
            membersListMenu.classList.remove('active');
            profileDetails.forEach(detail => detail.classList.remove('active'));
            targetProfile.classList.add('active');
            membersBackBtn.innerHTML = '&larr; [ back to list ]';
        }
    });
});

if (membersBackBtn) {
    membersBackBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        let activeProfile = null;
        profileDetails.forEach(detail => {
            if (detail.classList.contains('active')) {
                activeProfile = detail;
            }
        });
        
        if (activeProfile) {
            activeProfile.classList.remove('active');
            membersListMenu.classList.add('active');
            membersBackBtn.innerHTML = '&larr; [ back ]';
        } else {
            document.getElementById('view-members').classList.remove('active');
            landingView.classList.add('active');
        }
    });
}

const partnersBackBtn = document.getElementById('partners-back-btn');
const partnersListMenu = document.getElementById('partners-list-menu');
const partnerDetails = document.querySelectorAll('.partner-profile-detail');
const partnerTriggers = document.querySelectorAll('.partner-trigger');

function resetPartnersView() {
    partnersListMenu.classList.add('active');
    partnerDetails.forEach(detail => detail.classList.remove('active'));
    partnersBackBtn.innerHTML = '&larr; [ back ]';
}

partnerTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const targetProfileId = trigger.getAttribute('data-partner');
        const targetProfile = document.getElementById(targetProfileId);
        
        if (targetProfile) {
            partnersListMenu.classList.remove('active');
            partnerDetails.forEach(detail => detail.classList.remove('active'));
            targetProfile.classList.add('active');
            partnersBackBtn.innerHTML = '&larr; [ back to list ]';
        }
    });
});

if (partnersBackBtn) {
    partnersBackBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        let activeProfile = null;
        partnerDetails.forEach(detail => {
            if (detail.classList.contains('active')) {
                activeProfile = detail;
            }
        });
        
        if (activeProfile) {
            activeProfile.classList.remove('active');
            partnersListMenu.classList.add('active');
            partnersBackBtn.innerHTML = '&larr; [ back ]';
        } else {
            document.getElementById('view-partners').classList.remove('active');
            landingView.classList.add('active');
        }
    });
}

const parallaxBg = document.querySelector('.parallax-bg-container');
let mouseX = 0;
let mouseY = 0;

if (parallaxBg) {
    window.addEventListener('mousemove', (e) => {
        if (document.body.classList.contains('is-mobile')) return;
        
        const normX = (e.clientX / window.innerWidth) - 0.5;
        const normY = (e.clientY / window.innerHeight) - 0.5;
        
        const moveX = -normX * 30;
        const moveY = -normY * 30;
        
        parallaxBg.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
}

const cursorDot = document.getElementById('custom-cursor-dot');
const cursorRing = document.getElementById('custom-cursor-ring');

let cursorX = 0, cursorY = 0;

let lastSnowflakeTime = 0;
let lastX = 0;
let lastY = 0;
const activeSnowflakes = [];

window.addEventListener('mousemove', (e) => {
    if (document.body.classList.contains('is-mobile')) return;
    
    cursorX = e.clientX;
    cursorY = e.clientY;
    
    cursorDot.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    
    const now = Date.now();
    const dist = Math.hypot(cursorX - lastX, cursorY - lastY);
    
    if (dist > 25 && (now - lastSnowflakeTime > 80)) {
        lastSnowflakeTime = now;
        lastX = cursorX;
        lastY = cursorY;
        createSnowflake(cursorX, cursorY);
    }
});

document.addEventListener('mouseover', (e) => {
    if (document.body.classList.contains('is-mobile')) return;
    if (e.target.closest('a, button, input, select, textarea, .menu-item, .back-btn')) {
        cursorDot.classList.add('cursor-active');
    }
});
document.addEventListener('mouseout', (e) => {
    if (document.body.classList.contains('is-mobile')) return;
    if (e.target.closest('a, button, input, select, textarea, .menu-item, .back-btn')) {
        cursorDot.classList.remove('cursor-active');
    }
});

function createSnowflake(x, y) {
    const flake = document.createElement('div');
    flake.className = 'snowflake-particle';
    flake.textContent = '•';
    
    const size = Math.random() * 6 + 4; // 4px to 10px range
    flake.style.fontSize = `${size}px`;
    
    document.body.appendChild(flake);
    
    const data = {
        el: flake,
        x: x,
        y: y + 2,
        vx: Math.random() * 0.8 - 0.4,
        vy: Math.random() * 0.2 + 0.1,
        opacity: 0.8,
        scale: 1,
        life: 60
    };
    
    activeSnowflakes.push(data);
}

function updateSnowflakes() {
    if (document.body.classList.contains('is-mobile')) {
        activeSnowflakes.forEach(flake => flake.el.remove());
        activeSnowflakes.length = 0;
        return;
    }

    for (let i = activeSnowflakes.length - 1; i >= 0; i--) {
        const flake = activeSnowflakes[i];
        flake.y += flake.vy;
        flake.vy += 0.012; // slow gravity build-up
        flake.x += flake.vx + Math.sin(flake.life * 0.15) * 0.25; // soft swaying wind drift
        flake.opacity -= 0.012; // slower fade
        flake.scale -= 0.006; // slower shrink
        
        if (flake.opacity <= 0 || flake.scale <= 0 || flake.life <= 0) {
            flake.el.remove();
            activeSnowflakes.splice(i, 1);
        } else {
            flake.life--;
            flake.el.style.transform = `translate3d(${flake.x}px, ${flake.y}px, 0) scale(${flake.scale})`;
            flake.el.style.opacity = flake.opacity;
        }
    }
    requestAnimationFrame(updateSnowflakes);
}
updateSnowflakes();

const audio = document.getElementById('bg-music');
const musicToggleBtn = document.getElementById('music-toggle-btn');
const volumeSlider = document.getElementById('volume-slider');

audio.volume = 0.08;

musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMusic();
});

function toggleMusic() {
    if (audio.paused) {
        audio.play().then(() => {
            musicToggleBtn.classList.add('playing');
        }).catch(err => console.log("Audio play blocked:", err));
    } else {
        audio.pause();
        musicToggleBtn.classList.remove('playing');
    }
}

volumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    audio.volume = val;
    audio.muted = val === 0;
});

function startMusicOnGesture() {
    audio.play().then(() => {
        musicToggleBtn.classList.add('playing');
        document.removeEventListener('click', startMusicOnGesture, true);
        document.removeEventListener('keydown', startMusicOnGesture, true);
    }).catch(err => {
        console.log("Audio play pending user interaction:", err);
    });
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

localStorage.removeItem('fatal-theme');
const bgImgElement = document.querySelector('.character-bg-img');
if (bgImgElement) {
    bgImgElement.src = 'images/background.jpg';
}

const meteorContainer = document.getElementById('meteor-container');
if (meteorContainer) {
    function spawnMeteor() {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        meteor.textContent = '+';
        const startX = Math.random() * (window.innerWidth * 0.9);
        const startY = Math.random() * (window.innerHeight * 0.2) - 30;
        meteor.style.left = `${startX}px`;
        meteor.style.top = `${startY}px`;
        const duration = Math.random() * 3.0 + 5.0;
        meteor.style.animation = `meteorFall ${duration}s linear forwards`;
        meteorContainer.appendChild(meteor);
        setTimeout(() => {
            meteor.remove();
        }, duration * 1000);
        setTimeout(spawnMeteor, Math.random() * 900 + 600);
    }
    setTimeout(spawnMeteor, 3500);
}

document.addEventListener('DOMContentLoaded', () => {
    animateTabTitle();
});
