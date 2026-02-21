# SPARKVERSE Landing Page

A responsive solar system navigation portal for The First Spark consciousness technology platform.

## Features

- **Solar System Navigation**: Interactive orbiting planets with smooth hover effects
- **Dark Cosmic Aesthetic**: Near-black backgrounds, soft gradients, muted glows
- **Starfield Animation**: Lightweight canvas-based drifting stars with twinkle effect
- **Mobile Responsive**: Switches to stacked pill buttons on small screens
- **Accessibility**: Keyboard navigable, focus styles, ARIA labels, reduced motion support
- **Modal Menu**: Center planet opens full navigation overlay

## File Structure

```
sparkverse-landing/
├── index.html          # Main solar system landing page
├── links.html          # Signal Links (social media)
├── spark-station.html  # Mobile Spark Station vision
├── invest.html         # Investor portal
├── free.html           # Free downloads/resources
├── news.html           # Updates and dev logs
├── styles.css          # All styles
├── app.js              # Starfield, orbit animation, modal
└── README.md           # This file
```

## Configuration

Edit the `CONFIG` object at the top of `app.js` to customize:

```javascript
const CONFIG = {
    planets: [
        {
            id: 'nft-vault',
            name: 'NFT VAULT',
            icon: '◈',
            url: 'https://opensea.io/your-collection', // <-- Change this
            external: true
        },
        // ... more planets
    ],
    orbit: {
        speed: 0.0003,      // Orbital rotation speed
        radius: 280,         // Orbit radius in pixels
        pauseOnHover: true   // Pause when hovering
    },
    starfield: {
        starCount: 200,      // Number of stars
        speed: 0.2,          // Drift speed
        minSize: 0.5,
        maxSize: 2
    }
};
```

## How to Deploy

### GitHub Pages (Recommended)

1. Create a new repository on GitHub
2. Upload all files to the repository
3. Go to Settings → Pages
4. Under "Source", select "Deploy from a branch"
5. Select `main` branch and `/ (root)` folder
6. Click Save
7. Your site will be live at `https://yourusername.github.io/repo-name/`

### Netlify

1. Drag and drop the folder to [netlify.com/drop](https://netlify.com/drop)
2. Done! You'll get a URL instantly

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project folder
3. Follow the prompts

### Any Static Host

Just upload all files to any web server. No build step required.

## Customization

### Change URLs

Edit the `href` attributes in `index.html` for the orbit planets, mobile list, and modal navigation. Also update the `CONFIG` object in `app.js`.

### Update Social Links

Edit `links.html` - each social link is a `.link-btn` element.

### Add/Remove Planets

1. Add/remove planet elements in `index.html` (both orbit and mobile versions)
2. Update the modal nav in `index.html`
3. Update the `CONFIG.planets` array in `app.js`
4. Add corresponding color variables in `styles.css` if needed

### Change Colors

Edit the CSS custom properties in `:root` at the top of `styles.css`:

```css
:root {
    --void-black: #050508;
    --spark-gold: #d4a574;
    /* ... etc */
}
```

### Fonts

The site uses Google Fonts (Orbitron + Rajdhani). To change:
1. Update the `<link>` tag in each HTML file
2. Update `--font-display` and `--font-body` in `styles.css`

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Respects `prefers-reduced-motion` for accessibility
- Graceful degradation on older browsers

## License

© 2025 The First Spark / Kate's Paint LLC. All rights reserved.

---

**Reality is programmable. You are the coder.**

https://thefirstspark.shop
