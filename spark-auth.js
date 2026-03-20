/**
 * SparkAuth - Whop OAuth + PKCE Authentication for SparkVerse
 *
 * Shared auth module for all SparkVerse tool pages.
 * Include this script on any page that needs authentication gating.
 *
 * Usage:
 *   <script src="spark-auth.js"></script>
 *   <script>SparkAuth.applyGate();</script>
 *
 * The page should have a `.spark-gate` div. If none exists, no gating is applied.
 */

const SparkAuth = (function() {
    'use strict';

    // ========================================
    // Configuration
    // ========================================
    const CLIENT_ID = 'app_4AA9dex5xqN39E';
    const COMPANY_ID = 'biz_UFWoRUc3NZyLmq';
    const REDIRECT_URI = 'https://sparkverse.thefirstspark.shop/auth-callback.html';
    const AUTHORIZE_URL = 'https://api.whop.com/oauth/authorize';
    const TOKEN_URL = 'https://api.whop.com/oauth/token';
    const USERINFO_URL = 'https://api.whop.com/oauth/userinfo';
    const ACCESS_URL_BASE = 'https://api.whop.com/api/v1/users/';
    const WHOP_PURCHASE_URL = 'https://whop.com/sparkverse-0d79/';

    // Token lifetime: 1 hour (in milliseconds)
    const TOKEN_LIFETIME_MS = 60 * 60 * 1000;

    // localStorage key prefix
    const KEY_PREFIX = 'spark_auth_';

    // ========================================
    // PKCE Helpers (RFC 7636)
    // ========================================

    /**
     * Generate a cryptographically random code verifier.
     * Must be 43-128 characters from the set [A-Za-z0-9-._~].
     * @returns {string} The code verifier string
     */
    function generateCodeVerifier() {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
        const length = 64; // Good balance of security and compatibility
        const randomValues = crypto.getRandomValues(new Uint8Array(length));
        let verifier = '';
        for (let i = 0; i < length; i++) {
            verifier += charset[randomValues[i] % charset.length];
        }
        return verifier;
    }

    /**
     * Generate the S256 code challenge from a code verifier.
     * code_challenge = base64url(sha256(code_verifier))
     * @param {string} verifier - The code verifier
     * @returns {Promise<string>} The base64url-encoded SHA-256 hash
     */
    async function generateCodeChallenge(verifier) {
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const digest = await crypto.subtle.digest('SHA-256', data);

        // Convert ArrayBuffer to base64url string
        const bytes = new Uint8Array(digest);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        // Standard base64 then convert to base64url
        return btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    /**
     * Generate a random state parameter for CSRF protection.
     * @returns {string} A random hex string
     */
    function generateState() {
        const randomBytes = crypto.getRandomValues(new Uint8Array(16));
        return Array.from(randomBytes)
            .map(function(b) { return b.toString(16).padStart(2, '0'); })
            .join('');
    }

    // ========================================
    // Core Auth Functions
    // ========================================

    /**
     * Initiate the Whop OAuth login flow.
     * Stores PKCE verifier, state, and return URL in sessionStorage,
     * then redirects to Whop's authorize endpoint.
     */
    async function login() {
        try {
            // Store the current page URL so we can return after auth
            sessionStorage.setItem('spark_auth_return_to', window.location.href);

            // Generate PKCE code verifier and challenge
            const codeVerifier = generateCodeVerifier();
            sessionStorage.setItem('spark_auth_code_verifier', codeVerifier);

            const codeChallenge = await generateCodeChallenge(codeVerifier);

            // Generate random state for CSRF protection
            const state = generateState();
            sessionStorage.setItem('spark_auth_state', state);

            // Build the authorization URL
            const params = new URLSearchParams({
                client_id: CLIENT_ID,
                redirect_uri: REDIRECT_URI,
                response_type: 'code',
                scope: 'openid profile email',
                state: state,
                code_challenge: codeChallenge,
                code_challenge_method: 'S256'
            });

            const authorizeUrl = AUTHORIZE_URL + '?' + params.toString();

            // Redirect to Whop
            window.location.href = authorizeUrl;
        } catch (err) {
            console.error('[SparkAuth] Login error:', err);
            alert('Could not start login. Please check your browser supports modern security features and try again.');
        }
    }

    /**
     * Log out the current user.
     * Clears all spark_auth_* keys from localStorage and reloads the page.
     */
    function logout() {
        // Clear all spark_auth_ keys from localStorage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(KEY_PREFIX)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(function(key) {
            localStorage.removeItem(key);
        });

        // Also clear any sessionStorage auth keys
        sessionStorage.removeItem('spark_auth_state');
        sessionStorage.removeItem('spark_auth_code_verifier');
        sessionStorage.removeItem('spark_auth_return_to');

        // Reload to reset the page state
        window.location.reload();
    }

    /**
     * Check if the user is currently logged in.
     * A user is considered logged in if they have a non-expired access token.
     * @returns {boolean}
     */
    function isLoggedIn() {
        const token = localStorage.getItem(KEY_PREFIX + 'access_token');
        if (!token) return false;
        return !isTokenExpired();
    }

    /**
     * Check if the logged-in user has access to SparkVerse products.
     * @returns {boolean}
     */
    function hasAccess() {
        return localStorage.getItem(KEY_PREFIX + 'has_access') === 'true';
    }

    /**
     * Get the current user's info.
     * @returns {{name: string, email: string, id: string} | null}
     */
    function getUser() {
        const id = localStorage.getItem(KEY_PREFIX + 'user_id');
        if (!id) return null;
        return {
            name: localStorage.getItem(KEY_PREFIX + 'user_name') || '',
            email: localStorage.getItem(KEY_PREFIX + 'user_email') || '',
            id: id
        };
    }

    /**
     * Check if the stored access token has expired.
     * Tokens are considered valid for TOKEN_LIFETIME_MS (1 hour).
     * @returns {boolean} True if expired or no timestamp exists
     */
    function isTokenExpired() {
        const timestamp = localStorage.getItem(KEY_PREFIX + 'timestamp');
        if (!timestamp) return true;
        const elapsed = Date.now() - parseInt(timestamp, 10);
        return elapsed >= TOKEN_LIFETIME_MS;
    }

    /**
     * Refresh the access token using the stored refresh token.
     * Updates localStorage with the new tokens and timestamp.
     * @returns {Promise<boolean>} True if refresh succeeded
     */
    async function refreshToken() {
        const refresh = localStorage.getItem(KEY_PREFIX + 'refresh_token');
        if (!refresh) {
            console.warn('[SparkAuth] No refresh token available.');
            return false;
        }

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

            if (!response.ok) {
                console.error('[SparkAuth] Token refresh failed:', response.status);
                return false;
            }

            const data = await response.json();

            if (data.access_token) {
                localStorage.setItem(KEY_PREFIX + 'access_token', data.access_token);
                localStorage.setItem(KEY_PREFIX + 'timestamp', Date.now().toString());
            }
            if (data.refresh_token) {
                localStorage.setItem(KEY_PREFIX + 'refresh_token', data.refresh_token);
            }

            return true;
        } catch (err) {
            console.error('[SparkAuth] Token refresh error:', err);
            return false;
        }
    }

    /**
     * Re-verify the user's access by calling the Whop access endpoint.
     * Updates the has_access value in localStorage.
     * @returns {Promise<boolean>} True if user has access
     */
    async function verifyAccess() {
        const token = localStorage.getItem(KEY_PREFIX + 'access_token');
        const userId = localStorage.getItem(KEY_PREFIX + 'user_id');

        if (!token || !userId) return false;

        // If token is expired, try to refresh first
        if (isTokenExpired()) {
            const refreshed = await refreshToken();
            if (!refreshed) return false;
        }

        const currentToken = localStorage.getItem(KEY_PREFIX + 'access_token');

        try {
            const response = await fetch(
                ACCESS_URL_BASE + encodeURIComponent(userId) + '/access/' + COMPANY_ID,
                {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + currentToken }
                }
            );

            if (response.ok) {
                const data = await response.json();
                const access = data.has_access !== undefined ? !!data.has_access : true;
                localStorage.setItem(KEY_PREFIX + 'has_access', access ? 'true' : 'false');
                return access;
            } else {
                localStorage.setItem(KEY_PREFIX + 'has_access', 'false');
                return false;
            }
        } catch (err) {
            console.error('[SparkAuth] Access verification error:', err);
            return false;
        }
    }

    // ========================================
    // UI: Floating User Badge
    // ========================================

    /**
     * Inject the CSS for the floating user badge.
     * Called once when the badge is first created.
     */
    function injectBadgeStyles() {
        if (document.getElementById('spark-auth-badge-styles')) return;

        const style = document.createElement('style');
        style.id = 'spark-auth-badge-styles';
        style.textContent = [
            '.spark-user-badge {',
            '  position: fixed;',
            '  top: 12px;',
            '  right: 12px;',
            '  z-index: 99999;',
            '  display: flex;',
            '  align-items: center;',
            '  gap: 10px;',
            '  background: linear-gradient(135deg, #12121a 0%, #0a0a0f 100%);',
            '  border: 1px solid rgba(212, 175, 55, 0.25);',
            '  border-radius: 6px;',
            '  padding: 8px 14px;',
            '  font-family: "Space Mono", monospace;',
            '  font-size: 0.72rem;',
            '  color: rgba(255, 255, 255, 0.8);',
            '  backdrop-filter: blur(10px);',
            '  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);',
            '  transition: opacity 0.3s ease;',
            '}',
            '.spark-user-badge:hover {',
            '  border-color: rgba(212, 175, 55, 0.5);',
            '}',
            '.spark-user-badge-name {',
            '  color: #d4af37;',
            '  font-weight: 700;',
            '  max-width: 120px;',
            '  overflow: hidden;',
            '  text-overflow: ellipsis;',
            '  white-space: nowrap;',
            '}',
            '.spark-user-badge-dot {',
            '  width: 6px;',
            '  height: 6px;',
            '  border-radius: 50%;',
            '  background: #86efac;',
            '  flex-shrink: 0;',
            '}',
            '.spark-user-badge-logout {',
            '  background: none;',
            '  border: 1px solid rgba(255, 255, 255, 0.15);',
            '  color: rgba(255, 255, 255, 0.5);',
            '  font-family: "Space Mono", monospace;',
            '  font-size: 0.65rem;',
            '  padding: 3px 8px;',
            '  border-radius: 3px;',
            '  cursor: pointer;',
            '  transition: all 0.2s ease;',
            '  text-transform: uppercase;',
            '  letter-spacing: 0.05em;',
            '}',
            '.spark-user-badge-logout:hover {',
            '  border-color: rgba(220, 38, 38, 0.5);',
            '  color: #fca5a5;',
            '}',
            '@media (max-width: 480px) {',
            '  .spark-user-badge {',
            '    top: 8px;',
            '    right: 8px;',
            '    padding: 6px 10px;',
            '    font-size: 0.65rem;',
            '  }',
            '  .spark-user-badge-name {',
            '    max-width: 80px;',
            '  }',
            '}'
        ].join('\n');

        document.head.appendChild(style);
    }

    /**
     * Create and append the floating user badge to the page.
     * Shows the user's name, a green "online" dot, and a logout button.
     * @param {string} name - The user's display name
     */
    function createUserBadge(name) {
        // Remove existing badge if any
        const existing = document.getElementById('spark-user-badge');
        if (existing) existing.remove();

        injectBadgeStyles();

        const badge = document.createElement('div');
        badge.className = 'spark-user-badge';
        badge.id = 'spark-user-badge';

        const dot = document.createElement('span');
        dot.className = 'spark-user-badge-dot';

        const nameEl = document.createElement('span');
        nameEl.className = 'spark-user-badge-name';
        nameEl.textContent = name || 'Spark User';

        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'spark-user-badge-logout';
        logoutBtn.textContent = 'Logout';
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            logout();
        });

        badge.appendChild(dot);
        badge.appendChild(nameEl);
        badge.appendChild(logoutBtn);

        document.body.appendChild(badge);
    }

    // ========================================
    // Gate Logic
    // ========================================

    /**
     * Apply the authentication/access gate to the current page.
     *
     * Looks for a `.spark-gate` div on the page:
     * - If none exists, the page is considered free (no gating).
     * - If user has access: hides the gate div, shows a welcome badge.
     * - If user is logged in but no access: shows "Get Access" button.
     * - If user is not logged in: shows "Login with Whop" button.
     *
     * This is the main entry point that tool pages should call.
     */
    async function applyGate() {
        const gateEl = document.querySelector('.spark-gate');

        // No gate div = free page, nothing to do
        if (!gateEl) {
            // Still show user badge if logged in (even on free pages)
            if (isLoggedIn()) {
                const user = getUser();
                if (user) createUserBadge(user.name);
            }
            return;
        }

        // If token is expired but we have a refresh token, try to refresh silently
        if (localStorage.getItem(KEY_PREFIX + 'access_token') && isTokenExpired()) {
            const refreshed = await refreshToken();
            if (!refreshed) {
                // Refresh failed - clear stale auth data
                logout(); // This will reload, so the code below won't run
                return;
            }
            // After refresh, re-verify access
            await verifyAccess();
        }

        if (isLoggedIn() && hasAccess()) {
            // ---- User is logged in AND has access ----
            // Hide the gate entirely
            gateEl.style.display = 'none';

            // Show user badge
            const user = getUser();
            if (user) createUserBadge(user.name);

        } else if (isLoggedIn() && !hasAccess()) {
            // ---- User is logged in but does NOT have access ----
            // Replace gate content with "Get Access" message
            const user = getUser();
            if (user) createUserBadge(user.name);

            const actionsEl = gateEl.querySelector('.spark-gate-actions');
            if (actionsEl) {
                actionsEl.innerHTML = '';

                const getAccessBtn = document.createElement('a');
                getAccessBtn.href = WHOP_PURCHASE_URL;
                getAccessBtn.target = '_blank';
                getAccessBtn.rel = 'noopener noreferrer';
                getAccessBtn.className = 'spark-gate-btn spark-gate-btn-primary';
                getAccessBtn.textContent = 'Get Access on Whop';

                actionsEl.appendChild(getAccessBtn);
            }

            // Update the gate text
            const textEl = gateEl.querySelector('.spark-gate-text');
            if (textEl) {
                const p = textEl.querySelector('p');
                if (p) {
                    p.innerHTML = 'You\'re logged in but don\'t have access yet. <br>Get a SparkVerse membership to unlock all tools.';
                }
            }

            // Update the icon
            const iconEl = gateEl.querySelector('.spark-gate-icon');
            if (iconEl) {
                iconEl.textContent = '\u26A0\uFE0F'; // Warning sign
            }

        } else {
            // ---- User is NOT logged in ----
            // Replace the "I Have Tokens" button with "Login with Whop"
            const actionsEl = gateEl.querySelector('.spark-gate-actions');
            if (actionsEl) {
                // Find the secondary button ("I Have Tokens") and replace it
                const secondaryBtn = actionsEl.querySelector('.spark-gate-btn-secondary');
                if (secondaryBtn) {
                    const loginBtn = document.createElement('button');
                    loginBtn.className = 'spark-gate-btn spark-gate-btn-secondary';
                    loginBtn.textContent = 'Login with Whop';
                    loginBtn.style.cursor = 'pointer';
                    loginBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        login();
                    });
                    secondaryBtn.replaceWith(loginBtn);
                }
            }
        }
    }

    // ========================================
    // Public API
    // ========================================

    return {
        // Config (read-only references)
        CLIENT_ID: CLIENT_ID,
        COMPANY_ID: COMPANY_ID,
        REDIRECT_URI: REDIRECT_URI,

        // PKCE helpers
        generateCodeVerifier: generateCodeVerifier,
        generateCodeChallenge: generateCodeChallenge,

        // Auth flow
        login: login,
        logout: logout,

        // State checks
        isLoggedIn: isLoggedIn,
        hasAccess: hasAccess,
        getUser: getUser,
        isTokenExpired: isTokenExpired,

        // Async operations
        refreshToken: refreshToken,
        verifyAccess: verifyAccess,

        // Gate application (main entry point)
        applyGate: applyGate
    };

})();
