// ====== NAVIGATION CONFIG ======
// Easy-to-edit configuration for all planet destinations
const PLANET_LINKS = {
    'nft': 'https://opensea.io/',  // Update with your collection URL
    'links': 'links.html',
    'station': 'spark-station.html',
    'invest': 'invest.html',
    'tools': 'https://whop.com/discover/sparkverse-511c/',
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
    console.log('Sparkverse loaded successfully');
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeNavigationModal();
    }
});
