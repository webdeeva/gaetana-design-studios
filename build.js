#!/usr/bin/env node
/**
 * Static site builder for Gaetana Design Studios.
 *
 * Renders templates/*.hbs against content.json into dist/, then copies
 * static assets (CSS, JS, images) alongside the generated HTML.
 *
 * The admin agent only ever edits content.json — never the templates or
 * markup — so a non-technical client cannot break the layout.
 */
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

const ROOT = __dirname;
const TEMPLATES = path.join(ROOT, 'templates');
const PARTIALS = path.join(TEMPLATES, 'partials');
const DIST = path.join(ROOT, 'dist');

// --- Service icons (fixed SVGs, referenced by name from content.json) ---
const ICONS = {
  residential: `<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 9.5L12 2L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>`,
  commercial: `<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M5 21V7L12 2L19 7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9 21V14H15V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 9H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M14 9H14.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>`,
  consulting: `<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L13.09 8.26L19 9L13.45 12.82L15.18 19L12 15.27L8.82 19L10.55 12.82L5 9L10.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M5 5L7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M19 5L17 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M5 19L7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>`,
};

// --- Helpers ---
Handlebars.registerHelper('add', (a, b) => Number(a) + Number(b));
Handlebars.registerHelper('mul', (a, b) => Number(a) * Number(b));
Handlebars.registerHelper('icon', (name) => {
  const svg = ICONS[name];
  if (!svg) {
    console.warn(`  ! unknown service icon "${name}" — falling back to "residential"`);
  }
  return new Handlebars.SafeString(svg || ICONS.residential);
});

// --- Register partials ---
for (const file of fs.readdirSync(PARTIALS)) {
  if (file.endsWith('.hbs')) {
    const name = path.basename(file, '.hbs');
    Handlebars.registerPartial(name, fs.readFileSync(path.join(PARTIALS, file), 'utf8'));
  }
}

// --- Load content ---
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'content.json'), 'utf8'));

// --- Asset copying ---
const ASSET_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.css', '.js']);

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyAssets() {
  // Root-level static files (css/js/images)
  for (const entry of fs.readdirSync(ROOT)) {
    const full = path.join(ROOT, entry);
    if (fs.statSync(full).isFile() && ASSET_EXTS.has(path.extname(entry).toLowerCase())) {
      if (entry === 'build.js') continue;
      fs.copyFileSync(full, path.join(DIST, entry));
    }
  }
  // public/ directory (logos, photos, gallery)
  const publicDir = path.join(ROOT, 'public');
  if (fs.existsSync(publicDir)) {
    copyRecursive(publicDir, path.join(DIST, 'public'));
  }
}

// --- Build ---
const PAGES = [
  { template: 'index.hbs', out: 'index.html' },
  { template: 'about.hbs', out: 'about.html' },
  { template: 'gallery.hbs', out: 'portfolio-gallery.html' },
];

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  for (const page of PAGES) {
    const src = fs.readFileSync(path.join(TEMPLATES, page.template), 'utf8');
    const html = Handlebars.compile(src, { noEscape: false })(content);
    fs.writeFileSync(path.join(DIST, page.out), html);
    console.log(`  ✓ ${page.out}`);
  }

  copyAssets();
  console.log('  ✓ assets copied');
  console.log(`\nBuilt site -> ${path.relative(ROOT, DIST)}/`);
}

build();
