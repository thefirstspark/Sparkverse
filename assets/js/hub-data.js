// ============================================================
// SPARKVERSE HUB — Data (Paths + Planets)
// Loaded first: all other hub modules depend on these constants.
// ============================================================

// Path definitions — keys MUST stay stable (used by quiz select values
// and localStorage affinity key).
const PATHS = {
    mirror: {
        name: 'Mirror Path',
        color: '#ff5df0',
        desc: 'Reflective • Introspective • Observer',
        trait: 'You see patterns in chaos and wisdom in silence.'
    },
    glitch: {
        name: 'Glitch Path',
        color: '#ff4757',
        desc: 'Disruptive • Experimental • Boundary-Breaker',
        trait: 'You find power in breaking rules and reimagining systems.'
    },
    fire: {
        name: 'Fire Path',
        color: '#ff9f1c',
        desc: 'Creative • Passionate • Builder',
        trait: 'You transform vision into reality through relentless creation.'
    },
    garden: {
        name: 'Garden Path',
        color: '#51e04d',
        desc: 'Nurturing • Patient • Cultivator',
        trait: 'You grow knowledge carefully and help others flourish.'
    },
    source: {
        name: 'Source Path',
        color: '#45d7ff',
        desc: 'Foundational • Systematic • Truth-Seeker',
        trait: 'You dive to first principles and illuminate the roots.'
    }
};

// Planet data — all FREE to access.
const PLANETS = [
    {
        name: 'Philosophy Nexus',
        emoji: '🌌',
        desc: 'Ancient wisdom meets modern thought',
        topics: ['Ethics', 'Epistemology', 'Existentialism', 'Logic'],
        free: true
    },
    {
        name: 'Code Forge',
        emoji: '💻',
        desc: 'Learn programming from first principles',
        topics: ['JavaScript', 'Python', 'Algorithms', 'Web Dev'],
        free: true
    },
    {
        name: 'Art & Design',
        emoji: '🎨',
        desc: 'Creative expression across mediums',
        topics: ['Visual Design', 'Music Theory', 'Writing', 'UX'],
        free: true
    },
    {
        name: 'Science Lab',
        emoji: '🔬',
        desc: 'Explore the physical universe',
        topics: ['Physics', 'Biology', 'Chemistry', 'Astronomy'],
        free: true
    },
    {
        name: 'Math Dimension',
        emoji: '📐',
        desc: 'Pure logic and beautiful patterns',
        topics: ['Calculus', 'Linear Algebra', 'Statistics', 'Number Theory'],
        free: true
    },
    {
        name: 'History Archives',
        emoji: '📜',
        desc: 'Learn from the past to build the future',
        topics: ['World History', 'Philosophy of History', 'Cultural Studies'],
        free: true
    }
];
