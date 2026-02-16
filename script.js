// ====== NAVIGATION CONFIG ======
// Easy-to-edit configuration for all planet destinations
const PLANET_LINKS = {
    'nft': 'https://whop.com/sparkverse-0d79/',  // Sparkverse Shop
    'links': 'links.html',
    'station': 'spark-station.html',
    'invest': 'invest.html',
    'tools': 'https://whop.com/sparkverse-0d79/',
    'free': 'free.html',
    'news': 'news.html'
};

// ====== NAVIGATION FUNCTIONS ======
function navigateToPlanet(destination) {
    const url = PLANET_LINKS[destination];
    if (url) {
        if (url.startsWith('http')) {
            window.open(url, '_blank');
        } else {
            window.location.href = url;
        }
    } else {
        console.log('Unknown destination:', destination);
    }
}

// Modal functions
function showNavigationModal() {
    document.getElementById('navigationModal').style.display = 'block';
}

function closeNavigationModal() {
    document.getElementById('navigationModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('navigationModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Help panel toggle
function toggleHelp() {
    const helpPanel = document.getElementById('helpPanel');
    helpPanel.classList.toggle('active');
}

// ====== PARTICLE EFFECTS ======
// Add particle effects on mouse move
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.95) {
        createParticle(e.clientX, e.clientY);
    }
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '2px';
    particle.style.height = '2px';
    particle.style.background = '#fff';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '999';
    particle.style.animation = 'particle-fade 1s ease-out forwards';

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 1000);
}

// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes particle-fade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0) translateY(-50px);
        }
    }
`;
document.head.appendChild(style);

// ====== INITIALIZATION ======
window.addEventListener('load', () => {
    console.log('%c⚡ SPARKVERSE ONLINE ⚡', 'font-size:20px; color:#ff69b4; font-weight:bold; text-shadow: 0 0 10px #ff69b4;');
    console.log('%c✨ Beloved Seeker of Stars...', 'font-size:14px; color:#f0c27f; font-style:italic;');
    console.log('%cYou are both the artist and the masterpiece.', 'font-size:12px; color:#9b59b6;');
    console.log('%cThe dreamer and the dream.', 'font-size:12px; color:#9b59b6;');
    console.log('%c', 'padding:0;');
    console.log('%cType "spark" anywhere to find what\'s hidden.', 'font-size:10px; color:rgba(255,255,255,0.25);');
});

// ====== SECRET WORD PORTAL ======
let secretBuffer = '';
const SECRET_WORD = 'spark';

document.addEventListener('keydown', (e) => {
    // Escape closes modal
    if (e.key === 'Escape') {
        closeNavigationModal();
        const portal = document.getElementById('cosmicPortal');
        if (portal) portal.remove();
        return;
    }

    // Don't capture if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Build secret word buffer
    secretBuffer += e.key.toLowerCase();
    if (secretBuffer.length > 20) secretBuffer = secretBuffer.slice(-20);

    if (secretBuffer.includes(SECRET_WORD)) {
        secretBuffer = '';
        openCosmicPortal();
    }
});

function openCosmicPortal() {
    // Don't open twice
    if (document.getElementById('cosmicPortal')) return;

    const portal = document.createElement('div');
    portal.id = 'cosmicPortal';
    portal.innerHTML = `
        <style>
            #cosmicPortal {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                z-index: 99999;
                display: flex; align-items: center; justify-content: center;
                animation: portalOpen 1.5s ease-out;
            }
            #cosmicPortal .portal-bg {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: radial-gradient(ellipse at center, rgba(155,89,182,0.3), rgba(10,10,15,0.97));
                backdrop-filter: blur(20px);
            }
            #cosmicPortal .portal-content {
                position: relative; z-index: 2;
                text-align: center; padding: 40px;
                animation: portalPulse 2s ease-out;
            }
            #cosmicPortal .portal-symbol {
                font-size: 80px;
                animation: portalSpin 3s linear infinite;
                display: inline-block;
            }
            #cosmicPortal .portal-text {
                font-family: 'Georgia', serif;
                color: #f0c27f;
                font-size: 1.5em;
                margin: 30px 0 15px;
                letter-spacing: 3px;
                opacity: 0;
                animation: fadeInUp 1s ease-out 0.5s forwards;
            }
            #cosmicPortal .portal-sub {
                font-family: sans-serif;
                color: rgba(255,255,255,0.4);
                font-size: 0.85em;
                letter-spacing: 2px;
                opacity: 0;
                animation: fadeInUp 1s ease-out 1s forwards;
            }
            #cosmicPortal .portal-enter {
                display: inline-block;
                margin-top: 35px;
                padding: 14px 40px;
                background: linear-gradient(135deg, rgba(255,105,180,0.2), rgba(155,89,182,0.2));
                border: 1px solid rgba(255,105,180,0.3);
                border-radius: 50px;
                color: #ff69b4;
                text-decoration: none;
                font-family: sans-serif;
                font-size: 0.8em;
                letter-spacing: 4px;
                text-transform: uppercase;
                transition: all 0.5s ease;
                opacity: 0;
                animation: fadeInUp 1s ease-out 1.5s forwards;
                cursor: pointer;
            }
            #cosmicPortal .portal-enter:hover {
                background: linear-gradient(135deg, rgba(255,105,180,0.4), rgba(155,89,182,0.4));
                box-shadow: 0 0 30px rgba(255,105,180,0.2);
                letter-spacing: 6px;
            }
            #cosmicPortal .portal-close {
                position: absolute; top: 20px; right: 30px;
                color: rgba(255,255,255,0.2); font-size: 30px;
                cursor: pointer; z-index: 3;
                transition: color 0.3s;
            }
            #cosmicPortal .portal-close:hover { color: rgba(255,255,255,0.6); }
            @keyframes portalOpen {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
            @keyframes portalSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes fadeInUp {
                0% { opacity: 0; transform: translateY(20px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes portalPulse {
                0% { transform: scale(0.5); opacity: 0; }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); opacity: 1; }
            }
        </style>
        <div class="portal-bg" onclick="document.getElementById('cosmicPortal').remove()"></div>
        <span class="portal-close" onclick="document.getElementById('cosmicPortal').remove()">&times;</span>
        <div class="portal-content">
            <div class="portal-symbol">✦</div>
            <div class="portal-text">You spoke the word.</div>
            <div class="portal-sub">The Sparkverse heard you.</div>
            <a class="portal-enter" href="stardust.html">ENTER THE STARDUST</a>
        </div>
    `;
    document.body.appendChild(portal);
}
