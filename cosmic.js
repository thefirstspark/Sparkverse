// ====== COSMIC UNDERCURRENT ======
// Hidden layer running beneath every page of the Sparkverse

// Console messages
console.log('%c⚡ SPARKVERSE', 'font-size:16px; color:#ff69b4; font-weight:bold;');
console.log('%c✨ The cosmos is listening...', 'font-size:12px; color:#f0c27f; font-style:italic;');
console.log('%cType "spark" to find what\'s hidden.', 'font-size:10px; color:rgba(255,255,255,0.2);');

// Secret word detection
let _sb = '';
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    _sb += e.key.toLowerCase();
    if (_sb.length > 20) _sb = _sb.slice(-20);
    if (_sb.includes('spark')) {
        _sb = '';
        if (document.getElementById('cosmicPortal')) return;
        const d = document.createElement('div');
        d.id = 'cosmicPortal';
        d.innerHTML = `<style>#cosmicPortal{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;display:flex;align-items:center;justify-content:center;animation:cpO 1s ease}#cosmicPortal .cpBg{position:absolute;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse,rgba(155,89,182,.3),rgba(10,10,15,.97));backdrop-filter:blur(20px)}#cosmicPortal .cpC{position:relative;z-index:2;text-align:center;padding:40px}#cosmicPortal .cpS{font-size:80px;animation:cpR 3s linear infinite;display:inline-block}#cosmicPortal .cpT{font-family:Georgia,serif;color:#f0c27f;font-size:1.5em;margin:30px 0 15px;letter-spacing:3px;opacity:0;animation:cpF 1s ease .5s forwards}#cosmicPortal .cpSb{font-family:sans-serif;color:rgba(255,255,255,.4);font-size:.85em;letter-spacing:2px;opacity:0;animation:cpF 1s ease 1s forwards}#cosmicPortal .cpE{display:inline-block;margin-top:35px;padding:14px 40px;background:linear-gradient(135deg,rgba(255,105,180,.2),rgba(155,89,182,.2));border:1px solid rgba(255,105,180,.3);border-radius:50px;color:#ff69b4;text-decoration:none;font-family:sans-serif;font-size:.8em;letter-spacing:4px;text-transform:uppercase;transition:all .5s;opacity:0;animation:cpF 1s ease 1.5s forwards;cursor:pointer}#cosmicPortal .cpE:hover{background:linear-gradient(135deg,rgba(255,105,180,.4),rgba(155,89,182,.4));box-shadow:0 0 30px rgba(255,105,180,.2);letter-spacing:6px}#cosmicPortal .cpX{position:absolute;top:20px;right:30px;color:rgba(255,255,255,.2);font-size:30px;cursor:pointer;z-index:3;transition:color .3s}#cosmicPortal .cpX:hover{color:rgba(255,255,255,.6)}@keyframes cpO{0%{opacity:0}to{opacity:1}}@keyframes cpR{to{transform:rotate(360deg)}}@keyframes cpF{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}</style><div class="cpBg" onclick="document.getElementById('cosmicPortal').remove()"></div><span class="cpX" onclick="document.getElementById('cosmicPortal').remove()">&times;</span><div class="cpC"><div class="cpS">✦</div><div class="cpT">You spoke the word.</div><div class="cpSb">The Sparkverse heard you.</div><a class="cpE" href="stardust.html">ENTER THE STARDUST</a></div>`;
        document.body.appendChild(d);
    }
    if (e.key === 'Escape') { const p = document.getElementById('cosmicPortal'); if (p) p.remove(); }
});
