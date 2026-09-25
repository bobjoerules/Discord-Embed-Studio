# The Ultimate Guide to Customizing Website Embeds in Discord

When someone drops a link to your website into Discord, Discord automatically fetches your page and transforms it into a rich visual card (a process known as **unfurling**).

Discord allows websites to render rich **Component Embeds**. You are no longer restricted to traditional title/description boxes—you can now build full **Components V2 layouts** with interactive-style link buttons, media galleries, separators, spoilers, and markdown directly from your website's HTML, **without needing a Discord bot or application!**

---

## Table of Contents
1. [How Discord Reads Your Website](#1-how-discord-reads-your-website)
2. [Method 1: The New Component Embeds](#2-method-1-the-new-component-embeds)
   - [How It Works](#how-it-works)
   - [Option A: Inline Script](#option-a-inline-script)
   - [Option B: Linked JSON File](#option-b-linked-json-file)
   - [Supported Components & Allowed Fields](#supported-components--allowed-fields)
   - [Complete Component Embed Template](#complete-component-embed-template)
3. [Method 2: Standard Open Graph & Twitter Cards](#3-method-2-standard-open-graph--twitter-cards)
   - [Quick Start OG Tags](#quick-start-og-tags)
   - [Pro Tricks (Markdown, Accent Color, Galleries & Video)](#pro-tricks-markdown-accent-color-galleries--video)
4. [Testing, Caching & Debugging](#4-testing-caching--debugging)
5. [Troubleshooting Checklist](#5-troubleshooting-checklist)

---

## 1. How Discord Reads Your Website

When a link is posted:
1. Discord sends a `GET` request using the User-Agent:
   ```http
   Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)
   ```
2. **Server-Side Rendered (SSR) only**: Discord **does not execute client-side JavaScript**. All meta tags and embed scripts must be present in the initial server response HTML.
3. **Speed & Timeout**: The entire fetch (page HTML + images/media metadata) must finish within **10 seconds**.
4. Always serve over **HTTPS** with a valid 2xx status code.

---

## 2. Method 1: The New Component Embeds

Component Embeds allow your website to render as a Discord **Components V2** container embed. This replaces the default preview card with custom Discord UI elements like link buttons, markdown headings, image galleries, and spoiler tags.

### Key Rules
- **Display-only & No Bot Required**: Buttons must be link buttons (`style: 5`) pointing to URLs. They do not trigger bot interaction events, meaning no bot token or server setup is required.
- **Root Element**: Must always be a `Container` (`type: 17`).
- **Capacity**: Up to 40 components per embed.
- **Always provide Open Graph fallbacks** in case Discord cannot display the component embed.

---

### Option A: Inline Script (Easiest)

Add a `<script id="discord:component-embed" type="application/json">` inside the `<head>` of your HTML document:

```html
<head>
  <script id="discord:component-embed" type="application/json">
  {
    "component": {
      "type": 17,
      "accent_color": 5793266,
      "components": [
        {
          "type": 10,
          "content": "# Update v2.4 Released!\n- Added new questlines\n- Improved rendering performance\n- Fixed sound effects in dungeons"
        },
        {
          "type": 1,
          "components": [
            {
              "type": 2,
              "style": 5,
              "label": "Read Patch Notes",
              "url": "https://example.com/patch-notes"
            }
          ]
        }
      ]
    }
  }
  </script>
</head>
```

> **Note:** The `type` attribute must be strictly `application/json`. Do not wrap the JSON in variables or functions.

---

### Option B: Linked JSON File

If you prefer serving the JSON payload from an endpoint or static file, use `<link rel="discord:component-embed">`:

```html
<link
  rel="discord:component-embed"
  type="application/json"
  href="https://example.com/embeds/article.json"
>
```

**Requirements for Linked JSON:**
- `href` must be an absolute `https://` URL.
- Must be **same-site** (the page's host, a subdomain, or its parent domain—e.g., `cdn.example.com` for `example.com`).
- Max file size: **3,000 bytes** raw response.

---

### Supported Components & Allowed Fields

| Type | Name | Description & Constraints |
|:---:|:---|:---|
| **17** | **Container** | The mandatory root wrapper. Supports `accent_color` (integer) and `spoiler` (boolean). |
| **1** | **Action Row** | Holds a horizontal row of buttons. |
| **2** | **Button** | Must use link style (`style: 5`). Allowed fields: `type`, `style`, `url`, `label`, `emoji`, `disabled`. **Forbidden**: `id`, `custom_id`, `sku_id` (will invalidate the payload). |
| **9** | **Section** | Contains child text components with an optional `accessory` (such as a thumbnail or button). |
| **10** | **Text Display** | Supports full Discord Markdown: headings (`#`), bold (`**`), italics (`*`), strikethrough, spoiler bars (`||`), code blocks, bullet points, and links. |
| **11** | **Thumbnail** | Image-only accessory for Sections. Uses `{ "url": "https://..." }`. Supports `spoiler: true`. |
| **12** | **Media Gallery** | Grid of images or playable videos (`items: [{ "media": { "url": "https://..." } }]`). |
| **14** | **Separator** | Visual horizontal divider. Can specify `"spacing": 1`. |

---

### Complete Component Embed Template

Here is a full copy-paste HTML example featuring a banner section, link button, media gallery, and text divider:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>CyberStrike v3.0 Announcement</title>

  <!-- Open Graph Fallback (Mandatory) -->
  <meta property="og:site_name" content="CyberStrike Game" />
  <meta property="og:title" content="CyberStrike v3.0 Announcement" />
  <meta property="og:description" content="Explore the brand new Neon City update!" />
  <meta property="og:image" content="https://example.com/assets/banner.jpg" />
  <meta property="og:url" content="https://example.com/updates/v3" />
  <meta name="theme-color" content="#5865F2" />
  <meta name="twitter:card" content="summary_large_image" />

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
              "content": "# **[CyberStrike v3.0 Launch](https://example.com/updates/v3)**\nNeon City is now live for all players!"
            }
          ],
          "accessory": {
            "type": 2,
            "style": 5,
            "url": "https://example.com/play",
            "label": "Play Now"
          }
        },
        {
          "type": 14,
          "spacing": 1
        },
        {
          "type": 12,
          "items": [
            { "media": { "url": "https://example.com/screenshots/city1.png" }, "description": "Downtown Neon" },
            { "media": { "url": "https://example.com/screenshots/city2.png" } }
          ]
        },
        {
          "type": 10,
          "content": "### What's New:\n- 12 new customizable cyber-weapons\n- 4k texture enhancements\n- Cross-platform guild raids"
        },
        {
          "type": 1,
          "components": [
            { "type": 2, "style": 5, "url": "https://example.com/wiki", "label": "Wiki" },
            { "type": 2, "style": 5, "url": "https://example.com/discord", "label": "Community" },
            { "type": 2, "style": 5, "url": "https://example.com/patch-notes", "label": "Full Notes" }
          ]
        }
      ]
    }
  }
  </script>
</head>
<body>
  <h1>CyberStrike v3.0 Launch</h1>
  <p>Neon City is now live for all players!</p>
</body>
</html>
```

---

### Real-World Component Patterns & Templates

#### Pattern 1: GitHub Developer Profile Card
*Includes: Right-aligned avatar thumbnail accessory (`type: 11`), bio, formatted stats, clickable repository list, and a dual-button Action Row.*

```html
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
            "content": "# **[Miles Chase (bobjoerules)](https://github.com/bobjoerules)**\n*Just a guy with hands*\n📍 Portland, OR · 📦 **20** public repositories · 👥 **3** followers"
          }
        ],
        "accessory": {
          "type": 11,
          "media": { "url": "https://github.com/bobjoerules.png" }
        }
      },
      {
        "type": 14
      },
      {
        "type": 10,
        "content": "**Featured Repositories**\n1. **[AMLL-TTML-TOOL](https://github.com/bobjoerules/AMLL-TTML-TOOL)** — Feature-packed TTML lyrics editor with Discord RPC & macOS fixes\n2. **[Liquid-Lyrics](https://github.com/bobjoerules/Liquid-Lyrics)** — iOS app for word-by-word Spotify lyrics using Spicy Lyrics API\n3. **[osu-rooms](https://github.com/bobjoerules/osu-rooms)** — Rate rooms at Oregon State University\n4. **[discord-css-snippets](https://github.com/bobjoerules/discord-css-snippets)** — Essential Discord CSS tweaks & themes"
      },
      {
        "type": 1,
        "components": [
          {
            "type": 2,
            "style": 5,
            "label": "GitHub Profile",
            "url": "https://github.com/bobjoerules"
          },
          {
            "type": 2,
            "style": 5,
            "label": "Website",
            "url": "https://bobjoerules.com"
          }
        ]
      }
    ]
  }
}
</script>
```

---

#### Pattern 2: Multi-Action Tool / Software Portal
*Includes: Red accent line, small uppercase eyebrow category, app logo thumbnail, multiple stacked action sections each with its own right-aligned button, and a subtext footer.*

```html
<script id="discord:component-embed" type="application/json">
{
  "component": {
    "type": 17,
    "accent_color": 15875907,
    "components": [
      {
        "type": 9,
        "components": [
          {
            "type": 10,
            "content": "-# OPEN-SOURCE UTILITY\n## **[Web Audio & Waveform Suite](https://example.com/audio-suite)**\nCreate, time, edit, and export audio waveforms directly in your browser."
          }
        ],
        "accessory": {
          "type": 11,
          "media": { "url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop" }
        }
      },
      {
        "type": 14
      },
      {
        "type": 9,
        "components": [
          {
            "type": 10,
            "content": "**Open Web Editor**\nLaunch the current web version and start editing audio files."
          }
        ],
        "accessory": {
          "type": 2,
          "style": 5,
          "label": "Launch App",
          "url": "https://example.com/editor"
        }
      },
      {
        "type": 9,
        "components": [
          {
            "type": 10,
            "content": "**Desktop Releases**\nDownload the latest standalone builds for Mac & Windows."
          }
        ],
        "accessory": {
          "type": 2,
          "style": 5,
          "label": "View Releases",
          "url": "https://github.com/example/releases"
        }
      },
      {
        "type": 10,
        "content": "-# tools.example.com · Free and Open Source"
      }
    ]
  }
}
</script>
```

---

## 3. Method 2: Standard Open Graph & Twitter Cards

If you do not need buttons or custom component layouts, standard `<meta>` tags create clean, classic embed cards.

### Quick Start OG Tags

```html
<head>
  <!-- Site Name (appears above the title) -->
  <meta property="og:site_name" content="My Project" />

  <!-- Title & Description -->
  <meta property="og:title" content="Fast, Modern Web Framework" />
  <meta property="og:description" content="Build lightning fast web apps with zero configuration." />

  <!-- Destination URL -->
  <meta property="og:url" content="https://myproject.com" />

  <!-- Accent Color (Border bar on Discord desktop) -->
  <meta name="theme-color" content="#5865F2" />

  <!-- Big Image Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="og:image" content="https://myproject.com/assets/og-cover.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
</head>
```

### Pro Tricks

1. **Enable Markdown in Open Graph Descriptions:**
   Set `<meta property="og:type" content="rich" />`. When set to `rich`, Discord will parse markdown (e.g. `**bold**`, `*italics*`, `[links](...)`, and \`code\`) in `og:description`!
2. **Accent Colors (`theme-color`):**
   Must be a 6 or 8 digit hex code (e.g., `#5865F2` or `#5865F2FF`). Shorthand like `#FFF` or CSS names like `red` are ignored by Discord.
3. **Multi-Image Gallery:**
   Provide 2 to 4 `<meta property="og:image">` tags. Discord automatically combines them into a 2x2 or grid gallery.
4. **Always Specify Image Dimensions:**
   Include `og:image:width` and `og:image:height`. If Discord has to download and measure the image manually and the 10-second fetch budget expires, the image will be discarded.
5. **Inline Video Player:**
   Point `<meta property="og:video" content="https://example.com/video.mp4" />` at a direct `.mp4`, `.webm`, or `.mov` file, set `<meta property="og:type" content="video.other" />`, and provide an `og:image` to serve as the poster frame.

---

## 4. Testing, Caching & Debugging

### Cache Invalidation Trick
Discord caches link previews for **~30 minutes**. If you update your meta tags or component payload, simply re-sharing the same URL will show the old cached embed.
- **Bypass Cache**: Append a dummy query parameter when sharing, e.g.:
  `https://example.com/my-page?v=1`, `https://example.com/my-page?v=2`
- *Note*: Hash fragments (`#section`) do not bypass the cache.

### Official Embed Debugger
Discord provides an interactive inspection tool:
👉 [Discord Embed Debugger](https://discord.com/developers/embeds)

---

## 5. Troubleshooting Checklist

| Issue | Cause & Solution |
|:---|:---|
| **No embed appears at all** | • Your WAF or Cloudflare is blocking the `Discordbot` user agent. Whitelist `Mozilla/5.0 (compatible; Discordbot/2.0...)`.<br>• The tags were rendered via client-side JavaScript. Ensure they are rendered on the server.<br>• Exceeded character limits: `og:site_name` > 256 chars or URL > 2,048 chars will abort the entire embed. |
| **Image is missing** | • Image took too long to load (missing `og:image:width` and `og:image:height`).<br>• Unsupported image format (Discord accepts PNG, JPEG, GIF, WebP, AVIF).<br>• Image URL is relative without a leading `/`. |
| **Component embed ignored** | • Invalid component type or prohibited button property (buttons must be `style: 5` without `custom_id` or `id`).<br>• Script `type` is not exactly `application/json`.<br>• Root is not Container `type: 17`. |
| **Embed looks outdated** | • Discord cache hit. Reshare the link with `?v=newNumber`. |
