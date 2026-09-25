# 🚀 Discord Embed Studio

> **Design native Discord website previews with clickable link buttons, media galleries, rich markdown, and custom accent colors.** Includes a real-time Discord chat simulator and instant HTML code export.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-discordembeds.bobjoerules.com-5865F2?logo=firefox&logoColor=white)](https://discordembeds.bobjoerules.com/)
[![Discord](https://img.shields.io/badge/Discord-Component%20Embeds-5865F2?logo=discord&logoColor=white)](https://discord.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/Vanilla%20JS-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🌐 **Live Website**: [https://discordembeds.bobjoerules.com/](https://discordembeds.bobjoerules.com/)  
📖 **Full Documentation**: [https://discordembeds.bobjoerules.com/guide.html](https://discordembeds.bobjoerules.com/guide.html)

---

## ✨ Features

- **⚡ 1-Click Starter Templates**:
  - **👤 Profile Card**: Showcase developer bios, stats, avatar thumbnails, and GitHub repo lists.
  - **🌐 Socials**: Multi-platform creator bio linking personal site, YouTube, Twitch, Steam, Instagram, Threads, Bluesky, Letterboxd, and X.
  - **🛠️ Tool Portal**: Utility hub featuring [AMLL TTML Tool](https://ttmleditor.com/) with web editor launch & desktop release buttons.
  - **🚀 Announcement**: Major product release showcase with changelog bullets, image gallery, and documentation links.
- **💬 Real-Time Discord Chat Simulator**:
  - Live 1:1 preview matching Discord's dark theme typography, channel layout, user avatars, markdown formatting, and component rendering.
- **🎨 Accent Color Presets**:
  - Instant swatches for Discord Blurple, Red, Green, Yellow, Fuchsia, Dark Slate, Black, and White.
  - Automatic synchronization between hex codes and Discord's required decimal integer format (`accent_color`).
- **🔄 Dual Builder Modes**:
  - **Component Embeds (`type: 17`)**: Modern, interactive link buttons and layout structures embedded directly in HTML.
  - **Open Graph Fallback**: Standard `<meta property="og:...">` tags with `theme-color` and Twitter Card support.
- **📖 Built-In Comprehensive Guide**:
  - Complete, styled documentation browser (`guide.html`) detailing every component type, layout constraints, markdown quirks, and Open Graph requirements.

---

## 🛠️ How It Works

Discord Component Embeds render rich preview cards for websites when shared in chat—**without requiring a Discord bot or server integration**.

To enable this on any web page:
1. Include standard Open Graph meta tags in `<head>` as a fallback.
2. Add a `<script id="discord:component-embed" type="application/json">` block containing the component payload:

```html
<!-- Open Graph Fallback -->
<meta property="og:site_name" content="Discord Embed Studio" />
<meta property="og:title" content="Discord Embed Studio — Native Link Button & Media Builder" />
<meta property="og:description" content="Design native Discord website previews with clickable link buttons, media galleries, rich markdown, and custom accent colors." />
<meta property="og:url" content="https://discordembeds.bobjoerules.com/" />
<meta name="theme-color" content="#5865F2" />

<!-- Discord Component Embed Payload -->
<script id="discord:component-embed" type="application/json">
{
  "component": {
    "type": 17,
    "accent_color": 5793266,
    "components": [
      {
        "type": 9,
        "components": [
          {
            "type": 10,
            "content": "# **[Discord Embed Studio](https://discordembeds.bobjoerules.com/)**\nInteractive visual builder & live simulator for website previews in Discord."
          }
        ],
        "accessory": {
          "type": 2,
          "style": 5,
          "label": "Open Studio",
          "url": "https://discordembeds.bobjoerules.com/"
        }
      }
    ]
  }
}
</script>
```

---

## 📂 Project Structure

```text
├── index.html               # Main interactive visual builder & live simulator
├── guide.html               # Full documentation browser with live Markdown viewer
├── example.html             # Standalone production-ready embed HTML template
├── discord_embed_guide.md   # Comprehensive Discord Component Embed documentation
├── style.css                # Discord dark-theme UI design system & responsive layout
├── app.js                   # State management, component builder, simulator & code exporter
├── icon.png                 # High-resolution 256x256 embed thumbnail accessory
├── favicon.svg              # Scalable vector favicon
├── favicon.png              # High-resolution raster favicon
└── favicon.ico              # Standard browser favicon
```

---

## 🚀 Getting Started

Simply open `index.html` in any modern web browser, or serve locally with any static file server:

```bash
# Using Python
python3 -m http.server 5500

# Using Node.js (npx serve)
npx serve .
```

Open `http://localhost:5500` to start building embeds!

---

## 👤 Author

**Miles Chase** ([@bobjoerules](https://github.com/bobjoerules))
- Live Website: [discordembeds.bobjoerules.com](https://discordembeds.bobjoerules.com/)
- Portfolio: [bobjoerules.com](https://bobjoerules.com)
- GitHub: [@bobjoerules](https://github.com/bobjoerules)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
