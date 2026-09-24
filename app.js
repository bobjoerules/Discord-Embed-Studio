// Discord Embed Studio - Fully Modular Dynamic Component Builder
document.addEventListener("DOMContentLoaded", () => {
  // Navigation & Tabs
  const tabComponentBtn = document.getElementById("tab-component");
  const tabOgBtn = document.getElementById("tab-og");
  const componentControls = document.getElementById("component-controls");
  const ogControls = document.getElementById("og-controls");

  // Presets
  const presetProfileBtn = document.getElementById("preset-profile");
  const presetSocialsBtn = document.getElementById("preset-socials");
  const presetToolBtn = document.getElementById("preset-tool");
  const presetReleaseBtn = document.getElementById("preset-release");
  const presetClearBtn = document.getElementById("preset-clear");

  // Container Settings
  const inputUrl = document.getElementById("comp-url");
  const inputColor = document.getElementById("comp-color");
  const inputColorHex = document.getElementById("comp-color-hex");
  const inputSpoiler = document.getElementById("comp-spoiler");
  const compCountBadge = document.getElementById("comp-count-badge");

  // Dynamic Component List
  const componentsListEl = document.getElementById("components-list");

  // Add Component Buttons
  const btnAddSectionThumb = document.getElementById("btn-add-section-thumb");
  const btnAddSectionBtn = document.getElementById("btn-add-section-btn");
  const btnAddText = document.getElementById("btn-add-text");
  const btnAddActionRow = document.getElementById("btn-add-action-row");
  const btnAddSeparator = document.getElementById("btn-add-separator");
  const btnAddGallery = document.getElementById("btn-add-gallery");

  // OG Form Inputs
  const ogSiteName = document.getElementById("og-sitename");
  const ogTitle = document.getElementById("og-title");
  const ogDesc = document.getElementById("og-desc");
  const ogImage = document.getElementById("og-image");
  const ogColor = document.getElementById("og-color");
  const ogColorHex = document.getElementById("og-color-hex");
  const ogCardType = document.getElementById("og-card-type");

  // Output Previews
  const msgUsername = document.getElementById("msg-username");
  const msgLink = document.getElementById("msg-link");
  const previewCard = document.getElementById("discord-embed-card");
  const generatedCodeEl = document.getElementById("generated-code");
  const copyBtn = document.getElementById("copy-code-btn");
  const toast = document.getElementById("toast");

  let currentMode = "component"; // "component" or "og"
  let componentIdCounter = 1;

  // Active list of components
  let components = [];

  // Color syncing
  function syncColorInputs(colorPicker, hexInput) {
    colorPicker.addEventListener("input", (e) => {
      hexInput.value = e.target.value.toUpperCase();
      renderPreviewAndCode();
    });
    hexInput.addEventListener("input", (e) => {
      let val = e.target.value.trim();
      if (!val.startsWith("#")) val = "#" + val;
      if (/^#[0-9A-F]{6}$/i.test(val)) {
        colorPicker.value = val;
        renderPreviewAndCode();
      }
    });
  }
  syncColorInputs(inputColor, inputColorHex);
  syncColorInputs(ogColor, ogColorHex);

  document.querySelectorAll(".preset-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const color = chip.getAttribute("data-color");
      const isInsideOg = !!chip.closest("#og-controls");
      if (isInsideOg || currentMode === "og") {
        ogColor.value = color;
        ogColorHex.value = color.toUpperCase();
      } else {
        inputColor.value = color;
        inputColorHex.value = color.toUpperCase();
      }
      renderPreviewAndCode();
    });
  });

  inputUrl.addEventListener("input", () => {
    msgLink.textContent = inputUrl.value || "https://example.com/project";
    msgLink.href = inputUrl.value || "#";
    renderPreviewAndCode();
  });
  inputSpoiler.addEventListener("change", renderPreviewAndCode);

  // Tab switching
  tabComponentBtn.addEventListener("click", () => {
    currentMode = "component";
    tabComponentBtn.classList.add("active");
    tabOgBtn.classList.remove("active");
    componentControls.style.display = "block";
    ogControls.style.display = "none";
    renderPreviewAndCode();
  });

  tabOgBtn.addEventListener("click", () => {
    currentMode = "og";
    tabOgBtn.classList.add("active");
    tabComponentBtn.classList.remove("active");
    componentControls.style.display = "none";
    ogControls.style.display = "block";
    renderPreviewAndCode();
  });

  [ogSiteName, ogTitle, ogDesc, ogImage, ogColor, ogColorHex, ogCardType].forEach(el => {
    if (el) el.addEventListener("input", renderPreviewAndCode);
  });

  // Markdown parsing helper for Discord
  function renderDiscordMarkdown(text) {
    if (!text) return "";
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^### (.*$)/gim, '<div style="font-size: 1rem; font-weight:700; margin: 4px 0;">$1</div>');
    html = html.replace(/^## (.*$)/gim, '<div style="font-size: 1.15rem; font-weight:700; margin: 4px 0;">$1</div>');
    html = html.replace(/^# (.*$)/gim, '<div style="font-size: 1.35rem; font-weight:700; margin: 4px 0;">$1</div>');

    // Bold & Italics
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
    html = html.replace(/__(.*?)__/g, "<u>$1</u>");
    html = html.replace(/~~(.*?)~~/g, "<del>$1</del>");

    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" style="color: #00a8fc; text-decoration: none; font-weight:600;">$1</a>');

    // Code blocks & inline code
    html = html.replace(/`([^`]+)`/g, '<code style="background: #111214; padding: 2px 4px; border-radius: 3px; font-size: 0.85em; color: #38bdf8;">$1</code>');

    // Subtext (-# text)
    html = html.replace(/^-# (.*$)/gim, '<div style="font-size: 0.72rem; color: #949ba4; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 2px;">$1</div>');

    // Bullet points
    html = html.replace(/^- (.*$)/gim, '<div style="padding-left: 1rem;">• $1</div>');

    return html;
  }

  function hexToInt(hex) {
    const val = parseInt((hex || "").replace("#", ""), 16);
    return isNaN(val) ? 5793266 : val;
  }

  // Add Component handlers
  btnAddSectionThumb.addEventListener("click", () => {
    addComponent({
      id: componentIdCounter++,
      type: "section-thumb",
      content: "# **[Section Title](https://example.com/project)**\nSubtitle or description goes here.",
      thumbUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      spoiler: false
    });
  });

  btnAddSectionBtn.addEventListener("click", () => {
    addComponent({
      id: componentIdCounter++,
      type: "section-btn",
      content: "**Open Web Editor**\nLaunch the current web version in browser.",
      btnLabel: "Open tool",
      btnUrl: "https://example.com/editor"
    });
  });

  btnAddText.addEventListener("click", () => {
    addComponent({
      id: componentIdCounter++,
      type: "text",
      content: "**Top Items**\n1. **[First Link](https://example.com/1)** — Description text · 2.5K views\n2. **[Second Link](https://example.com/2)** — Description text · 1.8K views"
    });
  });

  btnAddActionRow.addEventListener("click", () => {
    addComponent({
      id: componentIdCounter++,
      type: "action-row",
      buttons: [
        { label: "View Website", url: "https://example.com" },
        { label: "Documentation", url: "https://example.com/docs" }
      ]
    });
  });

  btnAddSeparator.addEventListener("click", () => {
    addComponent({
      id: componentIdCounter++,
      type: "separator",
      spacing: false
    });
  });

  btnAddGallery.addEventListener("click", () => {
    addComponent({
      id: componentIdCounter++,
      type: "gallery",
      images: [
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&fit=crop",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&fit=crop"
      ]
    });
  });

  function addComponent(comp) {
    if (components.length >= 40) {
      alert("Discord Component Embeds allow a maximum of 40 components.");
      return;
    }
    components.push(comp);
    renderBuilderList();
    renderPreviewAndCode();
  }

  // Render the Builder Controls Cards
  function renderBuilderList() {
    compCountBadge.textContent = `${components.length} / 40`;
    componentsListEl.innerHTML = "";

    if (components.length === 0) {
      componentsListEl.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--discord-text-muted); border: 1px dashed var(--discord-border); border-radius: 8px;">
          No components added yet.<br>Click any button above to add components or load a starter template!
        </div>
      `;
      return;
    }

    components.forEach((comp, index) => {
      const card = document.createElement("div");
      card.className = "comp-builder-card";
      card.dataset.id = comp.id;

      let badgeName = "Component";
      let typeLabel = "";
      let fieldsHtml = "";

      if (comp.type === "section-thumb") {
        badgeName = "Section + Thumbnail";
        typeLabel = "Type: 9 (Section) + 11 (Thumb)";
        fieldsHtml = `
          <div class="form-group">
            <label>Markdown Content (Title, Subtitle, Text)</label>
            <textarea class="comp-input" data-field="content" rows="3">${comp.content}</textarea>
          </div>
          <div class="form-group">
            <label>Thumbnail Image URL (Square 80x80)</label>
            <input type="url" class="comp-input" data-field="thumbUrl" value="${comp.thumbUrl}" />
          </div>
        `;
      } else if (comp.type === "section-btn") {
        badgeName = "Section + Button";
        typeLabel = "Type: 9 (Section) + 2 (Button)";
        fieldsHtml = `
          <div class="form-group">
            <label>Markdown Content (Row Text)</label>
            <textarea class="comp-input" data-field="content" rows="2">${comp.content}</textarea>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <div class="form-group" style="flex: 1;">
              <label>Button Label</label>
              <input type="text" class="comp-input" data-field="btnLabel" value="${comp.btnLabel}" />
            </div>
            <div class="form-group" style="flex: 1.5;">
              <label>Button URL</label>
              <input type="url" class="comp-input" data-field="btnUrl" value="${comp.btnUrl}" />
            </div>
          </div>
        `;
      } else if (comp.type === "text") {
        badgeName = "Text Display";
        typeLabel = "Type: 10";
        fieldsHtml = `
          <div class="form-group">
            <label>Markdown Text (Supports headings, bold, -# subtext, lists, links)</label>
            <textarea class="comp-input" data-field="content" rows="3">${comp.content}</textarea>
          </div>
        `;
      } else if (comp.type === "action-row") {
        badgeName = "Action Row";
        typeLabel = "Type: 1 (Buttons: Type 2, Style 5)";
        let btnsHtml = comp.buttons.map((b, bIdx) => `
          <div style="display: flex; gap: 0.4rem; margin-bottom: 0.4rem;" data-btn-idx="${bIdx}">
            <input type="text" class="comp-btn-label" value="${b.label}" placeholder="Label" style="flex: 1;" />
            <input type="url" class="comp-btn-url" value="${b.url}" placeholder="URL" style="flex: 1.5;" />
            <button type="button" class="comp-tool-btn delete-btn btn-remove-subbtn" title="Remove button">✕</button>
          </div>
        `).join("");

        fieldsHtml = `
          <div class="form-group">
            <label>Buttons (Max 5)</label>
            <div class="comp-buttons-sublist">${btnsHtml}</div>
            <button type="button" class="btn-add-comp btn-add-subbtn" style="margin-top: 4px; padding: 3px 8px; font-size: 0.75rem;">+ Add Another Button</button>
          </div>
        `;
      } else if (comp.type === "separator") {
        badgeName = "Separator";
        typeLabel = "Type: 14 (Divider)";
        fieldsHtml = `
          <div style="font-size: 0.8rem; color: var(--discord-text-muted);">
            Horizontal divider line between sections.
          </div>
        `;
      } else if (comp.type === "gallery") {
        badgeName = "Media Gallery";
        typeLabel = "Type: 12 (Gallery)";
        fieldsHtml = `
          <div class="form-group">
            <label>Image 1 URL</label>
            <input type="url" class="comp-gallery-img" data-img-idx="0" value="${comp.images[0] || ''}" />
          </div>
          <div class="form-group">
            <label>Image 2 URL (Optional)</label>
            <input type="url" class="comp-gallery-img" data-img-idx="1" value="${comp.images[1] || ''}" />
          </div>
        `;
      }

      card.innerHTML = `
        <div class="comp-card-header">
          <div class="comp-card-type">
            <span class="comp-card-badge">${badgeName}</span>
            <span class="comp-card-label">${typeLabel}</span>
          </div>
          <div class="comp-card-tools">
            ${index > 0 ? `<button type="button" class="comp-tool-btn btn-move-up" title="Move Up">▲</button>` : ''}
            ${index < components.length - 1 ? `<button type="button" class="comp-tool-btn btn-move-down" title="Move Down">▼</button>` : ''}
            <button type="button" class="comp-tool-btn delete-btn btn-delete-comp" title="Delete Component">✕</button>
          </div>
        </div>
        <div class="comp-card-body">${fieldsHtml}</div>
      `;

      // Event listeners for this card
      card.querySelectorAll(".comp-input").forEach(input => {
        input.addEventListener("input", (e) => {
          const field = e.target.dataset.field;
          comp[field] = e.target.value;
          renderPreviewAndCode();
        });
      });

      card.querySelectorAll(".comp-gallery-img").forEach(input => {
        input.addEventListener("input", (e) => {
          const idx = parseInt(e.target.dataset.imgIdx);
          comp.images[idx] = e.target.value.trim();
          renderPreviewAndCode();
        });
      });

      // Sub-buttons inside action-row
      const sublist = card.querySelector(".comp-buttons-sublist");
      if (sublist) {
        sublist.addEventListener("input", () => {
          const btnRows = sublist.querySelectorAll("[data-btn-idx]");
          comp.buttons = Array.from(btnRows).map(row => ({
            label: row.querySelector(".comp-btn-label").value,
            url: row.querySelector(".comp-btn-url").value
          }));
          renderPreviewAndCode();
        });

        sublist.querySelectorAll(".btn-remove-subbtn").forEach((bBtn, bIdx) => {
          bBtn.addEventListener("click", () => {
            comp.buttons.splice(bIdx, 1);
            renderBuilderList();
            renderPreviewAndCode();
          });
        });

        const addSubBtn = card.querySelector(".btn-add-subbtn");
        if (addSubBtn) {
          addSubBtn.addEventListener("click", () => {
            if (comp.buttons.length < 5) {
              comp.buttons.push({ label: "New Button", url: "https://example.com" });
              renderBuilderList();
              renderPreviewAndCode();
            }
          });
        }
      }

      // Reordering & Deleting
      const btnUp = card.querySelector(".btn-move-up");
      if (btnUp) {
        btnUp.addEventListener("click", () => {
          [components[index - 1], components[index]] = [components[index], components[index - 1]];
          renderBuilderList();
          renderPreviewAndCode();
        });
      }

      const btnDown = card.querySelector(".btn-move-down");
      if (btnDown) {
        btnDown.addEventListener("click", () => {
          [components[index], components[index + 1]] = [components[index + 1], components[index]];
          renderBuilderList();
          renderPreviewAndCode();
        });
      }

      card.querySelector(".btn-delete-comp").addEventListener("click", () => {
        components.splice(index, 1);
        renderBuilderList();
        renderPreviewAndCode();
      });

      componentsListEl.appendChild(card);
    });
  }

  // Render the Live Discord Preview and Code Output
  function renderPreviewAndCode() {
    if (currentMode === "component") {
      renderComponentMode();
    } else {
      renderOgMode();
    }
  }

  function renderComponentMode() {
    const url = inputUrl.value.trim() || "https://example.com/project";
    const colorHex = inputColorHex.value.trim() || "#5865F2";
    const colorInt = hexToInt(colorHex);
    const isSpoiler = inputSpoiler.checked;

    previewCard.style.borderLeftColor = colorHex;
    previewCard.innerHTML = "";

    const payloadComponents = [];

    components.forEach((comp) => {
      if (comp.type === "section-thumb") {
        const sectionEl = document.createElement("div");
        sectionEl.className = "embed-section";
        sectionEl.innerHTML = `
          <div class="embed-section-content">
            <div class="embed-description">${renderDiscordMarkdown(comp.content)}</div>
          </div>
          ${comp.thumbUrl ? `<img src="${comp.thumbUrl}" class="embed-thumbnail-img" alt="Thumbnail" onerror="this.style.display='none'" />` : ''}
        `;
        previewCard.appendChild(sectionEl);

        const secObj = {
          type: 9,
          components: [{ type: 10, content: comp.content }]
        };
        if (comp.thumbUrl) {
          secObj.accessory = {
            type: 11,
            media: { url: comp.thumbUrl }
          };
        }
        payloadComponents.push(secObj);
      } else if (comp.type === "section-btn") {
        const rowEl = document.createElement("div");
        rowEl.className = "embed-sub-section-item";
        rowEl.innerHTML = `
          <div class="embed-sub-section-text">
            <div class="embed-description">${renderDiscordMarkdown(comp.content)}</div>
          </div>
          <a href="${comp.btnUrl || url}" target="_blank" class="discord-link-btn">
            ${comp.btnLabel || "Open"}
            <svg viewBox="0 0 24 24"><path d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z"/></svg>
          </a>
        `;
        previewCard.appendChild(rowEl);

        payloadComponents.push({
          type: 9,
          components: [{ type: 10, content: comp.content }],
          accessory: {
            type: 2,
            style: 5,
            label: comp.btnLabel || "Open",
            url: comp.btnUrl || url
          }
        });
      } else if (comp.type === "text") {
        const textEl = document.createElement("div");
        textEl.className = "embed-description";
        textEl.innerHTML = renderDiscordMarkdown(comp.content);
        previewCard.appendChild(textEl);

        payloadComponents.push({
          type: 10,
          content: comp.content
        });
      } else if (comp.type === "action-row") {
        const rowEl = document.createElement("div");
        rowEl.className = "embed-action-row";
        comp.buttons.forEach(b => {
          rowEl.innerHTML += `
            <a href="${b.url || url}" target="_blank" class="discord-link-btn">
              ${b.label || "Link"}
              <svg viewBox="0 0 24 24"><path d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z"/></svg>
            </a>
          `;
        });
        previewCard.appendChild(rowEl);

        payloadComponents.push({
          type: 1,
          components: comp.buttons.map(b => ({
            type: 2,
            style: 5,
            label: b.label || "Link",
            url: b.url || url
          }))
        });
      } else if (comp.type === "separator") {
        const sepEl = document.createElement("div");
        sepEl.className = "embed-separator";
        previewCard.appendChild(sepEl);

        payloadComponents.push({
          type: 14
        });
      } else if (comp.type === "gallery") {
        const validImgs = comp.images.filter(Boolean);
        if (validImgs.length > 0) {
          const galEl = document.createElement("div");
          galEl.className = `embed-gallery grid-${validImgs.length}`;
          validImgs.forEach(img => {
            galEl.innerHTML += `
              <div class="gallery-item">
                <img src="${img}" alt="Preview" onerror="this.style.display='none'" />
              </div>
            `;
          });
          previewCard.appendChild(galEl);

          payloadComponents.push({
            type: 12,
            items: validImgs.map(u => ({ media: { url: u } }))
          });
        }
      }
    });

    const payload = {
      component: {
        type: 17,
        accent_color: colorInt,
        spoiler: isSpoiler,
        components: payloadComponents
      }
    };

    const firstTextComp = components.find(c => c.content);
    const fallbackTitle = firstTextComp ? firstTextComp.content.split('\n')[0].replace(/[#*\[\]\(\)]/g, '').trim() : 'Website';

    const code = `<!-- Open Graph Fallback (Required by Discord) -->
<meta property="og:title" content="${fallbackTitle}" />
<meta property="og:url" content="${url}" />
<meta name="theme-color" content="${colorHex}" />

<!-- Discord Component Embed Payload -->
<script id="discord:component-embed" type="application/json">
${JSON.stringify(payload, null, 2)}
</script>`;

    generatedCodeEl.textContent = code;
  }

  function renderOgMode() {
    const siteName = ogSiteName.value.trim() || "My Website";
    const title = ogTitle.value.trim() || "Open Graph Embed Title";
    const desc = ogDesc.value.trim();
    const image = ogImage.value.trim();
    const colorHex = ogColorHex.value.trim() || "#5865F2";
    const isLarge = ogCardType.value === "summary_large_image";

    previewCard.style.borderLeftColor = colorHex;
    previewCard.innerHTML = `
      <div class="embed-eyebrow">${siteName}</div>
      <div class="embed-title"><a href="#">${title}</a></div>
      <div class="embed-description">${renderDiscordMarkdown(desc)}</div>
      ${image ? `
        <div class="embed-gallery grid-1" style="margin-top: 0.5rem;">
          <div class="gallery-item">
            <img src="${image}" alt="Preview" onerror="this.style.display='none'" />
          </div>
        </div>
      ` : ''}
    `;

    const code = `<!-- Standard Open Graph & Twitter Card Embed -->
<meta property="og:site_name" content="${siteName}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:type" content="rich" />
<meta name="theme-color" content="${colorHex}" />
<meta name="twitter:card" content="${isLarge ? 'summary_large_image' : 'summary'}" />
${image ? `<meta property="og:image" content="${image}" />\n<meta property="og:image:width" content="1200" />\n<meta property="og:image:height" content="630" />` : ''}`;

    generatedCodeEl.textContent = code;
  }

  // Generic Presets Loader
  function loadPreset(type) {
    [presetProfileBtn, presetSocialsBtn, presetToolBtn, presetReleaseBtn, presetClearBtn].forEach(b => b && b.classList.remove("active"));
    const activeBtn = document.getElementById(`preset-${type}`);
    if (activeBtn) activeBtn.classList.add("active");

    if (type === "profile") {
      inputUrl.value = "https://github.com/bobjoerules";
      inputColor.value = "#5865F2";
      inputColorHex.value = "#5865F2";
      msgUsername.textContent = "bobjoerules";
      msgLink.textContent = "https://github.com/bobjoerules";

      components = [
        {
          id: componentIdCounter++,
          type: "section-thumb",
          content: "# **[Miles Chase (bobjoerules)](https://github.com/bobjoerules)**\n*Just a guy with hands*\n📍 Portland, OR · 📦 **20** public repositories · 👥 **3** followers",
          thumbUrl: "https://github.com/bobjoerules.png",
          spoiler: false
        },
        {
          id: componentIdCounter++,
          type: "separator"
        },
        {
          id: componentIdCounter++,
          type: "section-btn",
          content: "🌐 **Personal Website**",
          btnLabel: "Visit Website",
          btnUrl: "https://bobjoerules.com"
        },
        {
          id: componentIdCounter++,
          type: "separator"
        },
        {
          id: componentIdCounter++,
          type: "text",
          content: "**Featured Repositories**\n1. **[AMLL-TTML-TOOL](https://github.com/bobjoerules/AMLL-TTML-TOOL)** — Feature-packed TTML lyrics editor with Discord RPC & macOS fixes\n2. **[Liquid-Lyrics](https://github.com/bobjoerules/Liquid-Lyrics)** — iOS app for word-by-word Spotify lyrics using Spicy Lyrics API\n3. **[osu-rooms](https://github.com/bobjoerules/osu-rooms)** — Rate rooms at Oregon State University\n4. **[discord-css-snippets](https://github.com/bobjoerules/discord-css-snippets)** — Essential Discord CSS tweaks & themes"
        },
        {
          id: componentIdCounter++,
          type: "action-row",
          buttons: [
            { label: "GitHub Profile", url: "https://github.com/bobjoerules" }
          ]
        }
      ];
    } else if (type === "socials") {
      inputUrl.value = "https://bobjoerules.com";
      inputColor.value = "#FFFFFF";
      inputColorHex.value = "#FFFFFF";
      msgUsername.textContent = "bobjoerules";
      msgLink.textContent = "https://bobjoerules.com";

      components = [
        {
          id: componentIdCounter++,
          type: "section-thumb",
          content: "# **[Miles Chase · Socials](https://bobjoerules.com)**\n*Filmmaker, gamer, and professional larper*",
          thumbUrl: "https://github.com/bobjoerules.png",
          spoiler: false
        },
        {
          id: componentIdCounter++,
          type: "separator"
        },
        {
          id: componentIdCounter++,
          type: "section-btn",
          content: "🌐 **Personal Website**\nPortfolio, active projects, photo gallery, films & web tools.",
          btnLabel: "Visit Website",
          btnUrl: "https://bobjoerules.com"
        },
        {
          id: componentIdCounter++,
          type: "section-btn",
          content: "📺 **Film Channel**\nShort films, animations, and polished videos.",
          btnLabel: "See YouTube",
          btnUrl: "https://www.youtube.com/@bobjoerules"
        },
        {
          id: componentIdCounter++,
          type: "section-btn",
          content: "🐙 **GitHub Repositories**\nOpen source TTML tools, Liquid-Lyrics, and dev snippets.",
          btnLabel: "View GitHub",
          btnUrl: "https://github.com/bobjoerules"
        },
        {
          id: componentIdCounter++,
          type: "separator"
        },
        {
          id: componentIdCounter++,
          type: "action-row",
          buttons: [
            { label: "Twitch", url: "https://twitch.tv/bobjoerules" },
            { label: "Steam", url: "https://steamcommunity.com/id/Bobjoerules" },
            { label: "Letterboxd", url: "https://letterboxd.com/bobjoerules/" }
          ]
        },
        {
          id: componentIdCounter++,
          type: "action-row",
          buttons: [
            { label: "Instagram", url: "https://instagram.com/bobjoerules" },
            { label: "Threads", url: "https://www.threads.com/@bobjoerules" },
            { label: "X / Twitter", url: "https://x.com/yobobjoerules" },
          ]
        }
      ];
    } else if (type === "tool") {
      inputUrl.value = "https://ttmleditor.com/";
      inputColor.value = "#18A058";
      inputColorHex.value = "#18A058";
      msgUsername.textContent = "bobjoerules";
      msgLink.textContent = "https://ttmleditor.com/";

      components = [
        {
          id: componentIdCounter++,
          type: "section-thumb",
          content: "-# OPEN-SOURCE UTILITY\n## **[AMLL TTML Tool](https://ttmleditor.com/)**\nFeature-packed syllable & word-by-word TTML lyrics editor with Discord RPC & macOS fixes.",
          thumbUrl: "https://ttmleditor.com/apple-touch-icon.png?v=2",
          spoiler: false
        },
        {
          id: componentIdCounter++,
          type: "separator"
        },
        {
          id: componentIdCounter++,
          type: "section-btn",
          content: "**Launch Web Editor**\nCreate, time, and edit synchronized TTML lyrics directly in your browser.",
          btnLabel: "Open Editor",
          btnUrl: "https://ttmleditor.com/"
        },
        {
          id: componentIdCounter++,
          type: "section-btn",
          content: "**Desktop Releases**\nDownload standalone desktop builds with native Discord RPC for macOS & Windows.",
          btnLabel: "View Releases",
          btnUrl: "https://github.com/bobjoerules/AMLL-TTML-TOOL/releases"
        },
        {
          id: componentIdCounter++,
          type: "separator"
        },
        {
          id: componentIdCounter++,
          type: "action-row",
          buttons: [
            { label: "Web App", url: "https://ttmleditor.com/" },
            { label: "GitHub Repository", url: "https://github.com/bobjoerules/AMLL-TTML-TOOL" }
          ]
        },
        {
          id: componentIdCounter++,
          type: "text",
          content: "-# ttmleditor.com · Free & Open Source by @bobjoerules"
        }
      ];
    } else if (type === "release") {
      inputUrl.value = "https://example.com/update";
      inputColor.value = "#F0B232";
      inputColorHex.value = "#F0B232";
      msgUsername.textContent = "bobjoerules";
      msgLink.textContent = "https://example.com/update";

      components = [
        {
          id: componentIdCounter++,
          type: "section-btn",
          content: "# **[Version 2.0 Released!](https://example.com/update)**\nBrand new Component Embed engine and performance boosts.",
          btnLabel: "Read Notes",
          btnUrl: "https://example.com/update"
        },
        {
          id: componentIdCounter++,
          type: "separator"
        },
        {
          id: componentIdCounter++,
          type: "gallery",
          images: [
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&fit=crop",
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&fit=crop"
          ]
        },
        {
          id: componentIdCounter++,
          type: "text",
          content: "### What's New:\n- 🚀 Native Component Embed layouts\n- ⚡ 40% faster rendering times\n- 🎨 Dark mode custom palette"
        },
        {
          id: componentIdCounter++,
          type: "action-row",
          buttons: [
            { label: "Documentation", url: "https://example.com/docs" },
            { label: "Community", url: "https://example.com/discord" }
          ]
        }
      ];
    } else if (type === "clear") {
      inputUrl.value = "https://example.com/project";
      inputColor.value = "#5865F2";
      inputColorHex.value = "#5865F2";
      components = [];
    }

    renderBuilderList();
    renderPreviewAndCode();
  }

  presetProfileBtn.addEventListener("click", () => loadPreset("profile"));
  presetSocialsBtn.addEventListener("click", () => loadPreset("socials"));
  presetToolBtn.addEventListener("click", () => loadPreset("tool"));
  presetReleaseBtn.addEventListener("click", () => loadPreset("release"));
  presetClearBtn.addEventListener("click", () => loadPreset("clear"));

  // Copy code with toast
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(generatedCodeEl.textContent).then(() => {
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2400);
    });
  });

  // Initial load with generic profile preset
  loadPreset("profile");
});
