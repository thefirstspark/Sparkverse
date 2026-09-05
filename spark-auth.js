/**
 * SparkAuth — Whop sign-in, tiers, on-page checkout, tool gating.
 *
 * Include on any Sparkverse page:
 *   <script src="spark-auth.js"></script>
 *   <script>SparkAuth.protect();</script>
 *
 * protect() reads tools-catalog.json and gates this page to its tier.
 * applyGate({ minTier: 'player' }) forces a tier without the catalog.
 * bootLobby() is for the galaxy home (sign-in + paywall + catalog clicks).
 */
const SparkAuth = (function () {
    'use strict';

    const CLIENT_ID = 'app_4AA9dex5xqN39E';
    const COMPANY_ID = 'biz_0xcayhWXVnKO9y';
    const REDIRECT_URI = 'https://sparkverse.thefirstspark.shop/auth-callback.html';
    const AUTHORIZE_URL = 'https://api.whop.com/oauth/authorize';
    const TOKEN_URL = 'https://api.whop.com/oauth/token';
    const USERINFO_URL = 'https://api.whop.com/oauth/userinfo';
    const ACCESS_URL_BASE = 'https://api.whop.com/api/v1/users/';
    const SITE_ORIGIN = 'https://sparkverse.thefirstspark.shop';
    const TOKEN_LIFETIME_MS = 60 * 60 * 1000;
    const KEY_PREFIX = 'spark_auth_';
    const CHECKOUT_LOADER = 'https://js.whop.com/static/checkout/loader.js';

    const PRODUCTS = {
        lobby: 'prod_sKMBjlUWsXQpn',
        player: 'prod_XgwlNB1M2gU9n',
        og: 'prod_UdVZpwarKmx81'
    };

    const PLANS = {
        lobby: 'plan_dBFxXLnwQoj1l',
        player: 'plan_okFWwlpgnc2bQ'
    };

    const TIER_RANK = { none: 0, public: 0, shop: 0, lobby: 1, player: 2, og: 3 };

    const TIER_META = {
        lobby: {
            title: 'Join the Sparkverse Lobby',
            blurb: 'Free. Creates your Whop account so you can use the tools.',
            planId: PLANS.lobby,
            cta: 'Join free'
        },
        player: {
            title: 'Enter the Players Lounge',
            blurb: '$33/month · first 3 days free. Unlocks player-only tools.',
            planId: PLANS.player,
            cta: 'Become a Player'
        }
    };

    let catalogCache = null;
    let pendingToolUrl = null;

    window.sparkWhopCheckoutComplete = function (planId, receiptId) {
        onCheckoutComplete(planId, receiptId);
    };

    function generateCodeVerifier() {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        const length = 64;
        const randomValues = crypto.getRandomValues(new Uint8Array(length));
        let verifier = '';
        for (let i = 0; i < length; i++) {
            verifier += charset[randomValues[i] % charset.length];
        }
        return verifier;
    }

    async function generateCodeChallenge(verifier) {
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        const bytes = new Uint8Array(digest);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    function generateState() {
        const randomBytes = crypto.getRandomValues(new Uint8Array(16));
        return Array.from(randomBytes).map(function (b) {
            return b.toString(16).padStart(2, '0');
        }).join('');
    }

    function setKey(name, value) {
        localStorage.setItem(KEY_PREFIX + name, value);
    }

    function getKey(name) {
        return localStorage.getItem(KEY_PREFIX + name);
    }

    function assetUrl(file) {
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const src = scripts[i].src || '';
            if (src.indexOf('spark-auth.js') !== -1) {
                return src.replace(/spark-auth\.js.*$/, file);
            }
        }
        return file;
    }

    async function login() {
        try {
            sessionStorage.setItem('spark_auth_return_to', window.location.href);
            const codeVerifier = generateCodeVerifier();
            sessionStorage.setItem('spark_auth_code_verifier', codeVerifier);
            const codeChallenge = await generateCodeChallenge(codeVerifier);
            const state = generateState();
            sessionStorage.setItem('spark_auth_state', state);

            const params = new URLSearchParams({
                client_id: CLIENT_ID,
                redirect_uri: REDIRECT_URI,
                response_type: 'code',
                scope: 'openid profile email',
                state: state,
                code_challenge: codeChallenge,
                code_challenge_method: 'S256'
            });
            window.location.href = AUTHORIZE_URL + '?' + params.toString();
        } catch (err) {
            console.error('[SparkAuth] Login error:', err);
            alert('Could not start login. Please try again in a modern browser.');
        }
    }

    function logout() {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(KEY_PREFIX)) keysToRemove.push(key);
        }
        keysToRemove.forEach(function (key) {
            localStorage.removeItem(key);
        });
        sessionStorage.removeItem('spark_auth_state');
        sessionStorage.removeItem('spark_auth_code_verifier');
        sessionStorage.removeItem('spark_auth_return_to');
        window.location.reload();
    }

    function isTokenExpired() {
        const timestamp = getKey('timestamp');
        if (!timestamp) return true;
        return Date.now() - parseInt(timestamp, 10) >= TOKEN_LIFETIME_MS;
    }

    function isLoggedIn() {
        const token = getKey('access_token');
        if (!token) return false;
        return !isTokenExpired();
    }

    function getUser() {
        const id = getKey('user_id');
        if (!id) return null;
        return {
            name: getKey('user_name') || '',
            email: getKey('user_email') || '',
            id: id
        };
    }

    function readFlags() {
        return {
            lobby: getKey('lobby') === 'true',
            player: getKey('player') === 'true',
            og: getKey('og') === 'true'
        };
    }

    function getTier() {
        const flags = readFlags();
        if (flags.og) return 'og';
        if (flags.player) return 'player';
        if (flags.lobby) return 'lobby';
        return 'none';
    }

    function hasAccess() {
        return TIER_RANK[getTier()] >= TIER_RANK.lobby;
    }

    function hasMinTier(minTier) {
        const need = TIER_RANK[minTier] || 0;
        if (need <= 0) return true;
        return TIER_RANK[getTier()] >= need;
    }

    function persistFlags(flags) {
        setKey('lobby', flags.lobby ? 'true' : 'false');
        setKey('player', flags.player ? 'true' : 'false');
        setKey('og', flags.og ? 'true' : 'false');
        const tier = flags.og ? 'og' : flags.player ? 'player' : flags.lobby ? 'lobby' : 'none';
        setKey('tier', tier);
        setKey('has_access', tier === 'none' ? 'false' : 'true');
        return tier;
    }

    async function refreshToken() {
        const refresh = getKey('refresh_token');
        if (!refresh) return false;
        try {
            const body = new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refresh,
                client_id: CLIENT_ID
            });
            const response = await fetch(TOKEN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString()
            });
            if (!response.ok) return false;
            const data = await response.json();
            if (data.access_token) {
                setKey('access_token', data.access_token);
                setKey('timestamp', Date.now().toString());
            }
            if (data.refresh_token) setKey('refresh_token', data.refresh_token);
            return true;
        } catch (err) {
            console.error('[SparkAuth] Token refresh error:', err);
            return false;
        }
    }

    async function checkProductAccess(token, userId, productId) {
        const urls = [
            ACCESS_URL_BASE + encodeURIComponent(userId) + '/access/' + encodeURIComponent(productId),
            'https://api.whop.com/api/v2/access/' + encodeURIComponent(productId),
            'https://api.whop.com/v5/users/' + encodeURIComponent(userId) + '/access/' + encodeURIComponent(productId)
        ];
        for (let i = 0; i < urls.length; i++) {
            try {
                const response = await fetch(urls[i], {
                    method: 'GET',
                    headers: { Authorization: 'Bearer ' + token }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.has_access !== undefined) return !!data.has_access;
                    if (data.valid !== undefined) return !!data.valid;
                    if (data.access === false) return false;
                    return true;
                }
            } catch (err) {
                console.warn('[SparkAuth] Access check failed for', productId, err);
            }
        }
        return false;
    }

    async function verifyAccess() {
        let token = getKey('access_token');
        const userId = getKey('user_id');
        if (!token || !userId) return false;

        if (isTokenExpired()) {
            const refreshed = await refreshToken();
            if (!refreshed) return false;
            token = getKey('access_token');
        }

        const [lobby, player, og, company] = await Promise.all([
            checkProductAccess(token, userId, PRODUCTS.lobby),
            checkProductAccess(token, userId, PRODUCTS.player),
            checkProductAccess(token, userId, PRODUCTS.og),
            checkProductAccess(token, userId, COMPANY_ID)
        ]);

        const flags = {
            lobby: lobby || (company && !player && !og),
            player: player,
            og: og
        };
        if (player || og) flags.lobby = true;
        persistFlags(flags);
        return flags.lobby || flags.player || flags.og;
    }

    function grantOptimistic(planId) {
        const flags = readFlags();
        if (planId === PLANS.lobby) flags.lobby = true;
        if (planId === PLANS.player) {
            flags.player = true;
            flags.lobby = true;
        }
        persistFlags(flags);
    }

    async function onCheckoutComplete(planId, receiptId) {
        console.log('[SparkAuth] Checkout complete', planId, receiptId);
        grantOptimistic(planId);
        closePaywall();
        updateChrome();

        if (isLoggedIn()) {
            for (let i = 0; i < 5; i++) {
                await new Promise(function (r) { setTimeout(r, 900 * (i + 1)); });
                await verifyAccess();
                if (hasMinTier(planId === PLANS.player ? 'player' : 'lobby')) break;
            }
            updateChrome();
            if (pendingToolUrl && hasMinTier(planId === PLANS.player ? 'player' : 'lobby')) {
                const next = pendingToolUrl;
                pendingToolUrl = null;
                window.location.href = next;
                return;
            }
            hideInjectedGate();
            return;
        }

        login();
    }

    function handleJoinReturn() {
        const params = new URLSearchParams(window.location.search);
        const joined = params.get('joined');
        const status = params.get('status');
        if (status === 'success' || joined === 'lobby' || joined === 'player') {
            if (joined === 'player' || params.get('plan_id') === PLANS.player) {
                grantOptimistic(PLANS.player);
            } else {
                grantOptimistic(PLANS.lobby);
            }
            if (!isLoggedIn()) {
                login();
                return true;
            }
            verifyAccess().then(function () {
                updateChrome();
                hideInjectedGate();
            });
            return true;
        }
        return false;
    }

    async function loadCatalog() {
        if (catalogCache) return catalogCache;
        try {
            const res = await fetch(assetUrl('tools-catalog.json'), { cache: 'no-store' });
            if (!res.ok) return null;
            catalogCache = await res.json();
            return catalogCache;
        } catch (err) {
            console.warn('[SparkAuth] Catalog load failed', err);
            return null;
        }
    }

    function currentPageTool(catalog) {
        if (!catalog || !catalog.tools) return null;
        const path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
        const href = window.location.href;
        for (let i = 0; i < catalog.tools.length; i++) {
            const tool = catalog.tools[i];
            const url = (tool.url || '').toLowerCase();
            if (!url || url.indexOf('http') === 0) continue;
            const file = url.split('/').pop();
            if (file === path || href.indexOf(url) !== -1) return tool;
        }
        return null;
    }

    function injectPaywallStyles() {
        if (document.getElementById('spark-auth-ui-styles')) return;
        const style = document.createElement('style');
        style.id = 'spark-auth-ui-styles';
        style.textContent = [
            '.spark-paywall{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:1.25rem;background:rgba(5,5,8,.92);backdrop-filter:blur(12px)}',
            '.spark-paywall.open{display:flex}',
            '.spark-paywall-card{width:min(520px,100%);max-height:92vh;overflow:auto;background:linear-gradient(165deg,#12121c,#07070d);border:1px solid rgba(251,191,36,.28);border-radius:1.1rem;padding:1.4rem 1.3rem 1.1rem;box-shadow:0 0 60px rgba(139,92,246,.22)}',
            '.spark-paywall-kicker{font-family:Orbitron,sans-serif;font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:#22d3ee;margin-bottom:.45rem}',
            '.spark-paywall-card h2{font-family:Orbitron,sans-serif;font-size:1.15rem;letter-spacing:.06em;margin:0 0 .5rem;color:#fff}',
            '.spark-paywall-card p{color:rgba(255,255,255,.62);font-size:.86rem;line-height:1.55;margin:0 0 1rem}',
            '.spark-paywall-actions{display:flex;flex-wrap:wrap;gap:.6rem;margin-bottom:1rem}',
            '.spark-paywall-btn{flex:1;min-width:140px;padding:.75rem 1rem;border-radius:.7rem;font-family:Orbitron,sans-serif;font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;border:none}',
            '.spark-paywall-btn.primary{background:linear-gradient(135deg,#fbbf24,#f97316,#ec4899);color:#050508}',
            '.spark-paywall-btn.ghost{background:transparent;border:1px solid rgba(255,255,255,.2);color:#fff}',
            '.spark-paywall-close{position:absolute;top:.7rem;right:.85rem;background:none;border:none;color:rgba(255,255,255,.45);font-size:1.2rem;cursor:pointer}',
            '.spark-checkout-slot{min-height:120px}',
            '.spark-checkout-slot iframe,.whop-checkout-wrapper iframe{width:100%!important}',
            '.spark-gate-overlay{position:fixed;inset:0;z-index:99990;display:flex;align-items:center;justify-content:center;padding:1.5rem;background:rgba(5,5,8,.88);backdrop-filter:blur(10px)}',
            '.spark-signin-btn{display:inline-flex;align-items:center;gap:.4rem;font-family:Orbitron,sans-serif;font-size:.68rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#050508;background:linear-gradient(135deg,#fbbf24,#f97316);border:none;border-radius:2rem;padding:.5rem 1rem;cursor:pointer}',
            '.spark-signin-btn.ghost{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.25)}',
            '.spark-user-badge{position:fixed;top:12px;right:12px;z-index:99999;display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,#12121a,#0a0a0f);border:1px solid rgba(212,175,55,.25);border-radius:6px;padding:8px 14px;font-family:"Space Mono",monospace;font-size:.72rem;color:rgba(255,255,255,.8);backdrop-filter:blur(10px)}',
            '.spark-user-badge-name{color:#d4af37;font-weight:700;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
            '.spark-user-badge-tier{font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;color:#22d3ee}',
            '.spark-user-badge-dot{width:6px;height:6px;border-radius:50%;background:#86efac;flex-shrink:0}',
            '.spark-user-badge-logout{background:none;border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.5);font-family:"Space Mono",monospace;font-size:.65rem;padding:3px 8px;border-radius:3px;cursor:pointer;text-transform:uppercase}',
            '.tool-tag.locked,.tool-card.locked{opacity:.85}',
            '.tool-tag .tier-pip,.tool-badge.extra{margin-left:.35rem;font-size:.58rem;letter-spacing:.08em}'
        ].join('\n');
        document.head.appendChild(style);
    }

    function ensureCheckoutLoader() {
        if (document.querySelector('script[src*="checkout/loader.js"]')) return;
        const s = document.createElement('script');
        s.src = CHECKOUT_LOADER;
        s.async = true;
        s.defer = true;
        document.head.appendChild(s);
    }

    function mountCheckout(slot, planId) {
        slot.innerHTML = '';
        const el = document.createElement('div');
        el.setAttribute('data-whop-checkout-plan-id', planId);
        el.setAttribute('data-whop-checkout-theme', 'dark');
        el.setAttribute('data-whop-checkout-theme-accent-color', 'gold');
        el.setAttribute('data-whop-checkout-skip-redirect', 'true');
        el.setAttribute('data-whop-checkout-on-complete', 'sparkWhopCheckoutComplete');
        el.setAttribute(
            'data-whop-checkout-return-url',
            SITE_ORIGIN + '/?joined=' + (planId === PLANS.player ? 'player' : 'lobby') + '&status=success'
        );
        el.setAttribute('data-whop-checkout-style-container-padding-x', '0');
        el.style.maxWidth = '440px';
        el.style.margin = '0 auto';
        slot.appendChild(el);
        ensureCheckoutLoader();
    }

    function paywallRoot() {
        return document.getElementById('spark-paywall');
    }

    function ensurePaywall() {
        injectPaywallStyles();
        if (paywallRoot()) return paywallRoot();
        const wrap = document.createElement('div');
        wrap.id = 'spark-paywall';
        wrap.className = 'spark-paywall';
        wrap.innerHTML = [
            '<div class="spark-paywall-card" style="position:relative">',
            '  <button type="button" class="spark-paywall-close" data-spark-close aria-label="Close">✕</button>',
            '  <div class="spark-paywall-kicker" data-spark-kicker>SPARKVERSE</div>',
            '  <h2 data-spark-title>Sign in to use the tools</h2>',
            '  <p data-spark-blurb>Join free on this page, or sign in if you already have Whop access.</p>',
            '  <div class="spark-paywall-actions">',
            '    <button type="button" class="spark-paywall-btn primary" data-spark-login>Sign in with Whop</button>',
            '    <button type="button" class="spark-paywall-btn ghost" data-spark-close>Not now</button>',
            '  </div>',
            '  <div class="spark-checkout-slot" data-spark-checkout></div>',
            '</div>'
        ].join('');
        wrap.addEventListener('click', function (e) {
            if (e.target === wrap || e.target.getAttribute('data-spark-close') !== null) closePaywall();
        });
        wrap.querySelector('[data-spark-login]').addEventListener('click', function () {
            login();
        });
        document.body.appendChild(wrap);
        return wrap;
    }

    function openPaywall(opts) {
        opts = opts || {};
        const minTier = opts.minTier === 'og' ? 'player' : (opts.minTier || 'lobby');
        const meta = TIER_META[minTier] || TIER_META.lobby;
        pendingToolUrl = opts.url || pendingToolUrl;
        const root = ensurePaywall();
        root.querySelector('[data-spark-kicker]').textContent = minTier === 'player' ? 'PLAYERS ONLY' : 'FREE LOBBY';
        root.querySelector('[data-spark-title]').textContent = opts.title || meta.title;
        root.querySelector('[data-spark-blurb]').textContent = opts.blurb || meta.blurb;
        const loginBtn = root.querySelector('[data-spark-login]');
        loginBtn.textContent = isLoggedIn() ? 'Refresh access' : 'Sign in with Whop';
        loginBtn.onclick = function () {
            if (isLoggedIn()) {
                verifyAccess().then(function () {
                    updateChrome();
                    if (hasMinTier(minTier)) {
                        closePaywall();
                        if (pendingToolUrl) window.location.href = pendingToolUrl;
                    }
                });
            } else {
                login();
            }
        };
        mountCheckout(root.querySelector('[data-spark-checkout]'), meta.planId);
        root.classList.add('open');
    }

    function closePaywall() {
        const root = paywallRoot();
        if (root) root.classList.remove('open');
    }

    function hideInjectedGate() {
        const gate = document.getElementById('spark-injected-gate');
        if (gate) gate.style.display = 'none';
        const legacy = document.querySelector('.spark-gate');
        if (legacy) legacy.style.display = 'none';
    }

    function showInjectedGate(minTier) {
        injectPaywallStyles();
        let gate = document.getElementById('spark-injected-gate');
        if (!gate) {
            gate = document.createElement('div');
            gate.id = 'spark-injected-gate';
            gate.className = 'spark-gate-overlay';
            document.body.appendChild(gate);
        }
        const meta = TIER_META[minTier] || TIER_META.lobby;
        const logged = isLoggedIn();
        gate.style.display = 'flex';
        gate.innerHTML = [
            '<div class="spark-paywall-card">',
            '  <div class="spark-paywall-kicker">' + (minTier === 'player' ? 'PLAYERS ONLY' : 'LOBBY ACCESS') + '</div>',
            '  <h2>' + meta.title + '</h2>',
            '  <p>' + (logged ? 'You\'re signed in, but this tool needs ' + (minTier === 'player' ? 'Players Lounge' : 'Lobby') + ' access. Join on this page.' : meta.blurb) + '</p>',
            '  <div class="spark-paywall-actions">',
            logged ? '' : '<button type="button" class="spark-paywall-btn ghost" id="spark-gate-login">Sign in with Whop</button>',
            '    <button type="button" class="spark-paywall-btn primary" id="spark-gate-join">' + meta.cta + '</button>',
            '  </div>',
            '  <p style="font-size:.72rem;opacity:.5;margin:0"><a href="index.html" style="color:#22d3ee">← Back to the galaxy</a></p>',
            '</div>'
        ].join('');
        const join = document.getElementById('spark-gate-join');
        if (join) join.addEventListener('click', function () { openPaywall({ minTier: minTier }); });
        const loginBtn = document.getElementById('spark-gate-login');
        if (loginBtn) loginBtn.addEventListener('click', login);
    }

    function createUserBadge(name) {
        const existing = document.getElementById('spark-user-badge');
        if (existing) existing.remove();
        injectPaywallStyles();
        const badge = document.createElement('div');
        badge.className = 'spark-user-badge';
        badge.id = 'spark-user-badge';

        const dot = document.createElement('span');
        dot.className = 'spark-user-badge-dot';
        const nameEl = document.createElement('span');
        nameEl.className = 'spark-user-badge-name';
        nameEl.textContent = name || 'Spark';
        const tierEl = document.createElement('span');
        tierEl.className = 'spark-user-badge-tier';
        const tier = getTier();
        tierEl.textContent = tier === 'none' ? 'guest' : tier;
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'spark-user-badge-logout';
        logoutBtn.textContent = 'Logout';
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
        badge.appendChild(dot);
        badge.appendChild(nameEl);
        badge.appendChild(tierEl);
        badge.appendChild(logoutBtn);
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            badge.style.position = 'static';
            headerActions.appendChild(badge);
        } else {
            document.body.appendChild(badge);
        }
    }

    function updateChrome() {
        const headerBtn = document.getElementById('spark-signin');
        if (isLoggedIn()) {
            const user = getUser();
            if (user) createUserBadge(user.name);
            if (headerBtn) headerBtn.style.display = 'none';
        } else if (headerBtn) {
            headerBtn.style.display = '';
            const existing = document.getElementById('spark-user-badge');
            if (existing) existing.remove();
        }
    }

    async function applyGate(opts) {
        opts = opts || {};
        const minTier = opts.minTier || 'lobby';
        if (TIER_RANK[minTier] <= 0) {
            if (isLoggedIn()) {
                const user = getUser();
                if (user) createUserBadge(user.name);
            }
            return true;
        }

        if (getKey('access_token') && isTokenExpired()) {
            const refreshed = await refreshToken();
            if (!refreshed) {
                logout();
                return false;
            }
            await verifyAccess();
        } else if (isLoggedIn() && getKey('tier') == null) {
            await verifyAccess();
        }

        if (hasMinTier(minTier)) {
            hideInjectedGate();
            const gateEl = document.querySelector('.spark-gate');
            if (gateEl) gateEl.style.display = 'none';
            updateChrome();
            return true;
        }

        showInjectedGate(minTier);
        updateChrome();
        return false;
    }

    async function protect() {
        handleJoinReturn();
        const catalog = await loadCatalog();
        const tool = currentPageTool(catalog);
        const minTier = (tool && tool.tier) || 'public';
        if (minTier === 'public' || minTier === 'shop') {
            updateChrome();
            if (isLoggedIn()) {
                const user = getUser();
                if (user) createUserBadge(user.name);
            }
            return;
        }
        await applyGate({ minTier: minTier });
    }

    function canEnter(tool) {
        const tier = (tool && tool.tier) || 'public';
        if (tier === 'public' || tier === 'shop') return true;
        return hasMinTier(tier);
    }

    function enterTool(tool, ev) {
        if (!tool) return;
        if (canEnter(tool)) {
            if (ev && ev.preventDefault) ev.preventDefault();
            window.location.href = tool.url;
            return;
        }
        if (ev && ev.preventDefault) ev.preventDefault();
        openPaywall({
            minTier: tool.tier,
            url: tool.url,
            title: tool.tier === 'player' ? 'Players only — ' + tool.title : 'Join to use ' + tool.title
        });
    }

    function renderToolTag(tool) {
        const a = document.createElement('a');
        a.className = 'tool-tag' + (canEnter(tool) ? '' : ' locked');
        a.href = tool.url;
        a.dataset.toolId = tool.id;
        a.dataset.tier = tool.tier;
        a.textContent = tool.title;
        if (tool.tier === 'player' || tool.tier === 'lobby') {
            const pip = document.createElement('span');
            pip.className = 'tier-pip';
            pip.textContent = canEnter(tool) ? '' : (tool.tier === 'player' ? ' · Players' : ' · Lobby');
            a.appendChild(pip);
        }
        a.addEventListener('click', function (e) {
            enterTool(tool, e);
        });
        return a;
    }

    async function decorateLobby() {
        const catalog = await loadCatalog();
        if (!catalog) return;
        const toolsByZone = {};
        catalog.tools.forEach(function (t) {
            if (!toolsByZone[t.zone]) toolsByZone[t.zone] = [];
            toolsByZone[t.zone].push(t);
        });

        const originalOpen = window.openModal;
        if (typeof originalOpen === 'function') {
            window.openModal = function (id) {
                originalOpen(id);
                const toolsEl = document.getElementById('modalTools');
                if (!toolsEl) return;
                const zoneTools = toolsByZone[id] || [];
                if (!zoneTools.length) return;
                toolsEl.innerHTML = '';
                zoneTools.forEach(function (tool) {
                    toolsEl.appendChild(renderToolTag(tool));
                });
            };
        }

        const originalLand = window.landOnPlanet;
        if (typeof originalLand === 'function') {
            window.landOnPlanet = function (id) {
                const zoneTools = toolsByZone[id] || [];
                const first = zoneTools[0];
                if (first && !canEnter(first) && first.tier !== 'public' && first.tier !== 'shop') {
                    enterTool(first);
                    return;
                }
                originalLand(id);
            };
        }
    }

    async function bootLobby() {
        injectPaywallStyles();
        ensureCheckoutLoader();
        handleJoinReturn();

        const signin = document.getElementById('spark-signin');
        if (signin) {
            signin.addEventListener('click', function (e) {
                e.preventDefault();
                if (isLoggedIn()) {
                    verifyAccess().then(updateChrome);
                } else {
                    openPaywall({ minTier: 'lobby', title: 'Sign in to the Sparkverse' });
                }
            });
        }

        const profileNav = document.querySelector('[data-spark-profile]');
        if (profileNav) {
            profileNav.addEventListener('click', function (e) {
                e.preventDefault();
                if (!isLoggedIn()) {
                    openPaywall({ minTier: 'lobby' });
                    return;
                }
                if (!hasMinTier('player')) {
                    openPaywall({ minTier: 'player', title: 'Upgrade to Players' });
                }
            });
        }

        if (getKey('access_token')) {
            if (isTokenExpired()) await refreshToken();
            if (isLoggedIn()) await verifyAccess();
        }
        updateChrome();
        await decorateLobby();
    }

    async function handleCallback(ui) {
        ui = ui || {};
        function setStatus(msg) { if (ui.setStatus) ui.setStatus(msg); }
        function showError(msg) { if (ui.showError) ui.showError(msg); }
        function showSuccess(name) { if (ui.showSuccess) ui.showSuccess(name); }

        try {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            const state = params.get('state');
            const error = params.get('error');
            const errorDescription = params.get('error_description');

            if (error) {
                showError('OAuth error: ' + (errorDescription || error));
                return;
            }
            if (!code) {
                showError('No authorization code received. Please try logging in again.');
                return;
            }
            if (!state) {
                showError('No state parameter received. Please try logging in again.');
                return;
            }

            const storedState = sessionStorage.getItem('spark_auth_state');
            if (!storedState || storedState !== state) {
                showError('Security check failed: state mismatch. Please try logging in again.');
                return;
            }

            const codeVerifier = sessionStorage.getItem('spark_auth_code_verifier');
            if (!codeVerifier) {
                showError('PKCE verification data missing. Please try logging in again.');
                return;
            }

            setStatus('Exchanging authorization code...');
            const tokenBody = new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
                client_id: CLIENT_ID,
                code_verifier: codeVerifier
            });
            const tokenResponse = await fetch(TOKEN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: tokenBody.toString()
            });
            if (!tokenResponse.ok) {
                showError('Failed to exchange authorization code. Please try logging in again.');
                return;
            }
            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.access_token;
            const refresh = tokenData.refresh_token;
            if (!accessToken) {
                showError('No access token received from Whop.');
                return;
            }

            setStatus('Retrieving your profile...');
            let userName = '';
            let userEmail = '';
            let userId = '';
            const userResponse = await fetch(USERINFO_URL, {
                method: 'GET',
                headers: { Authorization: 'Bearer ' + accessToken }
            });
            if (userResponse.ok) {
                const userData = await userResponse.json();
                userName = userData.name || userData.username || '';
                userEmail = userData.email || '';
                userId = userData.sub || userData.id || '';
            }

            setKey('access_token', accessToken);
            if (refresh) setKey('refresh_token', refresh);
            setKey('user_name', userName);
            setKey('user_email', userEmail);
            setKey('user_id', userId);
            setKey('timestamp', Date.now().toString());

            setStatus('Checking Lobby and Players access...');
            await verifyAccess();

            sessionStorage.removeItem('spark_auth_state');
            sessionStorage.removeItem('spark_auth_code_verifier');
            showSuccess(userName);

            const returnTo = sessionStorage.getItem('spark_auth_return_to') || '/';
            sessionStorage.removeItem('spark_auth_return_to');
            setTimeout(function () {
                window.location.href = returnTo;
            }, 1200);
        } catch (err) {
            console.error('[SparkAuth Callback]', err);
            showError('An unexpected error occurred: ' + err.message);
        }
    }

    function renderToolsGrid(container, filterTier) {
        return loadCatalog().then(function (catalog) {
            if (!catalog || !container) return;
            container.innerHTML = '';
            catalog.tools.forEach(function (tool) {
                if (filterTier && filterTier !== 'all' && tool.tier !== filterTier) return;
                const card = document.createElement('div');
                card.className = 'tool-card ' + tool.tier + (canEnter(tool) ? '' : ' locked');
                card.dataset.tier = tool.tier;
                const badge = document.createElement('span');
                badge.className = 'tool-badge ' + tool.tier;
                badge.textContent = (TIER_META[tool.tier] && TIER_META[tool.tier].cta) ? tool.tier.toUpperCase() : tool.tier.toUpperCase();
                const h3 = document.createElement('h3');
                h3.textContent = tool.title;
                const p = document.createElement('p');
                p.textContent = tool.blurb || '';
                const btn = document.createElement('button');
                btn.className = 'tool-btn ' + tool.tier;
                btn.textContent = canEnter(tool) ? 'Enter' : (tool.tier === 'player' ? 'Unlock as Player' : 'Join Lobby');
                btn.addEventListener('click', function () { enterTool(tool); });
                card.appendChild(badge);
                card.appendChild(h3);
                if (tool.blurb) card.appendChild(p);
                card.appendChild(btn);
                container.appendChild(card);
            });
        });
    }

    return {
        CLIENT_ID: CLIENT_ID,
        COMPANY_ID: COMPANY_ID,
        REDIRECT_URI: REDIRECT_URI,
        PRODUCTS: PRODUCTS,
        PLANS: PLANS,
        generateCodeVerifier: generateCodeVerifier,
        generateCodeChallenge: generateCodeChallenge,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        hasAccess: hasAccess,
        hasMinTier: hasMinTier,
        getTier: getTier,
        getUser: getUser,
        isTokenExpired: isTokenExpired,
        refreshToken: refreshToken,
        verifyAccess: verifyAccess,
        applyGate: applyGate,
        protect: protect,
        bootLobby: bootLobby,
        openPaywall: openPaywall,
        closePaywall: closePaywall,
        handleCallback: handleCallback,
        loadCatalog: loadCatalog,
        enterTool: enterTool,
        renderToolsGrid: renderToolsGrid,
        onCheckoutComplete: onCheckoutComplete
    };
})();
