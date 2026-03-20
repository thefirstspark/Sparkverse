// ====== SPARKVERSE WHOP INTEGRATION ======
// Shared membership gating and Whop CTAs for all premium pages

(function () {
    'use strict';

    // ── Whop URL constants ──────────────────────────────────────────────────
    var WHOP = {
        base: 'https://whop.com/sparkverse-511c/',
        discover: 'https://whop.com/discover/sparkverse-511c/',
        player: 'https://whop.com/sparkverse-511c/the-players-lounge/',
        og: 'https://whop.com/sparkverse-511c/og-spark-lifetime-access/',
        soulMap: 'https://whop.com/sparkverse-511c/get-your-personal-soul-map/',
        community: 'https://whop.com/thefirstspark/'
    };

    var TIER_LABELS = {
        player: { label: 'Players Lounge', price: '$33/mo', icon: '◆', url: WHOP.player },
        og:     { label: 'OG Spark',       price: '$519 lifetime', icon: '⚡', url: WHOP.og }
    };

    var STORAGE_KEY = 'sparkverse_member_tier';

    // ── Helpers ─────────────────────────────────────────────────────────────
    function getRequiredTier() {
        // Accept either <meta name="whop-tier" content="player|og">
        // or <body data-whop-tier="player|og">
        var meta = document.querySelector('meta[name="whop-tier"]');
        if (meta) return meta.getAttribute('content');
        return document.body.getAttribute('data-whop-tier') || null;
    }

    function getStoredTier() {
        try { return localStorage.getItem(STORAGE_KEY) || ''; } catch (e) { return ''; }
    }

    function storeTier(tier) {
        try { localStorage.setItem(STORAGE_KEY, tier); } catch (e) { /* ignore */ }
    }

    function tierLevel(tier) {
        return tier === 'og' ? 2 : tier === 'player' ? 1 : 0;
    }

    function hasSufficientTier(required) {
        return tierLevel(getStoredTier()) >= tierLevel(required);
    }

    // ── Styles ───────────────────────────────────────────────────────────────
    function injectStyles() {
        var css = [
            /* Floating tier badge */
            '#whop-badge{position:fixed;top:14px;right:14px;z-index:9999;display:flex;align-items:center;gap:6px;',
            'padding:6px 12px;border-radius:50px;font-family:"Space Mono",monospace;font-size:0.65rem;',
            'letter-spacing:0.06em;font-weight:700;cursor:pointer;text-decoration:none;',
            'backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);',
            'border:1px solid rgba(255,209,102,0.35);',
            'background:rgba(10,10,15,0.82);color:#f0c27f;',
            'transition:all 0.25s ease;box-shadow:0 4px 16px rgba(0,0,0,0.4);}',
            '#whop-badge:hover{background:rgba(240,194,127,0.12);border-color:rgba(255,209,102,0.7);',
            'box-shadow:0 6px 24px rgba(240,194,127,0.2);transform:translateY(-1px);}',
            '#whop-badge .wb-icon{font-size:0.75rem;}',

            /* Membership gate overlay */
            '#whop-gate{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;',
            'padding:20px;background:rgba(5,5,10,0.94);backdrop-filter:blur(20px);',
            '-webkit-backdrop-filter:blur(20px);}',
            '#whop-gate-box{max-width:440px;width:100%;border-radius:20px;padding:36px 30px;text-align:center;',
            'background:linear-gradient(135deg,rgba(20,20,28,0.98),rgba(14,14,20,0.98));',
            'border:1px solid rgba(255,209,102,0.2);box-shadow:0 24px 64px rgba(0,0,0,0.7);}',
            '#whop-gate-box .wg-spark{font-size:2.4rem;display:block;margin-bottom:14px;}',
            '#whop-gate-box h2{font-family:"Orbitron","Space Mono",monospace;font-size:1.05rem;',
            'letter-spacing:0.12em;color:#f0c27f;margin-bottom:8px;font-weight:700;}',
            '#whop-gate-box p{font-size:0.82rem;color:rgba(255,255,255,0.55);line-height:1.6;margin-bottom:24px;',
            'font-family:"Rajdhani","DM Sans",sans-serif;}',
            '#whop-gate-box .wg-tier{display:inline-flex;align-items:center;gap:6px;',
            'padding:5px 14px;border-radius:50px;margin-bottom:22px;',
            'font-family:"Space Mono",monospace;font-size:0.7rem;font-weight:700;',
            'background:rgba(240,194,127,0.1);color:#f0c27f;border:1px solid rgba(240,194,127,0.3);}',
            '.wg-btn{display:block;width:100%;padding:13px 20px;border-radius:50px;',
            'font-family:"Orbitron","Space Mono",monospace;font-size:0.72rem;letter-spacing:0.1em;font-weight:700;',
            'text-decoration:none;cursor:pointer;transition:all 0.25s ease;margin-bottom:10px;border:none;}',
            '.wg-btn-primary{background:linear-gradient(135deg,#d4a84b,#a07840);color:#0a0a0c;}',
            '.wg-btn-primary:hover{box-shadow:0 8px 24px rgba(212,168,75,0.35);transform:translateY(-1px);}',
            '.wg-btn-secondary{background:transparent;border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.6);}',
            '.wg-btn-secondary:hover{border-color:rgba(255,255,255,0.35);color:rgba(255,255,255,0.85);}',
            '.wg-price{font-family:"Space Mono",monospace;font-size:0.65rem;color:rgba(255,209,102,0.7);margin-top:6px;}'
        ].join('');

        var style = document.createElement('style');
        style.id = 'whop-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // ── Floating Badge ───────────────────────────────────────────────────────
    function renderBadge(tier) {
        var info = TIER_LABELS[tier];
        if (!info) return;

        var badge = document.createElement('a');
        badge.id = 'whop-badge';
        badge.href = info.url;
        badge.target = '_blank';
        badge.rel = 'noopener noreferrer';
        badge.setAttribute('aria-label', 'Join ' + info.label + ' on Whop');
        badge.innerHTML = '<span class="wb-icon">' + info.icon + '</span>' +
            '<span>JOIN WHOP</span>';
        document.body.appendChild(badge);
    }

    // ── Membership Gate ──────────────────────────────────────────────────────
    function renderGate(tier) {
        var info = TIER_LABELS[tier];
        if (!info) return;

        var gate = document.createElement('div');
        gate.id = 'whop-gate';
        gate.setAttribute('role', 'dialog');
        gate.setAttribute('aria-modal', 'true');
        gate.setAttribute('aria-label', 'Membership required');

        gate.innerHTML = [
            '<div id="whop-gate-box">',
            '  <span class="wg-spark">', tier === 'og' ? '⚡' : '◆', '</span>',
            '  <h2>MEMBERSHIP REQUIRED</h2>',
            '  <p>This content is available to <strong style="color:#f0c27f">', info.label, '</strong> members of The First Spark community on Whop.</p>',
            '  <div class="wg-tier">', info.icon, ' ', info.label.toUpperCase(), '</div>',
            '  <a href="', info.url, '" target="_blank" rel="noopener noreferrer" class="wg-btn wg-btn-primary" id="whop-join-btn">',
            '    Join Now &rarr;',
            '  </a>',
            '  <div class="wg-price">', info.price, '</div>',
            '  <button class="wg-btn wg-btn-secondary" id="whop-member-btn" style="margin-top:18px">',
            "    I'm already a member",
            '  </button>',
            '  <a href="tools.html" style="display:block;margin-top:12px;font-size:0.7rem;color:rgba(255,255,255,0.3);text-decoration:none;font-family:Space Mono,monospace;">',
            '    ← Back to Tools',
            '  </a>',
            '</div>'
        ].join('');

        document.body.appendChild(gate);

        // "Already a member" stores tier and closes gate
        document.getElementById('whop-member-btn').addEventListener('click', function () {
            storeTier(tier);
            gate.remove();
        });

        // Clicking outside the box closes and remembers for session
        gate.addEventListener('click', function (e) {
            if (e.target === gate) gate.remove();
        });

        // Escape key
        document.addEventListener('keydown', function handler(e) {
            if (e.key === 'Escape') { gate.remove(); document.removeEventListener('keydown', handler); }
        });
    }

    // ── Main init ────────────────────────────────────────────────────────────
    function init() {
        var tier = getRequiredTier();
        if (!tier) return; // No tier required — nothing to do

        injectStyles();
        renderBadge(tier);

        if (!hasSufficientTier(tier)) {
            renderGate(tier);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
