#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    if (ch === "\r") {
      continue;
    }

    field += ch;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  if (!rows.length) return [];
  const headers = rows[0];
  return rows.slice(1).map((r) => {
    const obj = {};
    for (let i = 0; i < headers.length; i += 1) {
      obj[headers[i]] = r[i] || "";
    }
    return obj;
  });
}

function yamlString(value) {
  return JSON.stringify(String(value ?? ""));
}

function decodeHtmlEntities(text) {
  return String(text)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function replaceGalleryEmbeds(html) {
  const pattern = /<div class="image-gallery-embed"[^>]*data-attrs="([^"]+)"[^>]*><\/div>/g;
  return html.replace(pattern, (_full, encodedAttrs) => {
    try {
      const attrs = JSON.parse(decodeHtmlEntities(encodedAttrs));
      const gallery = attrs && attrs.gallery ? attrs.gallery : {};
      const staticImg = gallery.staticGalleryImage && gallery.staticGalleryImage.src;
      const firstImg = Array.isArray(gallery.images) && gallery.images[0] ? gallery.images[0].src : "";
      const src = staticImg || firstImg;
      if (!src) return "";

      const alt = escapeHtml(gallery.alt || "");
      const caption = gallery.caption ? `<figcaption>${escapeHtml(gallery.caption)}</figcaption>` : "";
      const safeSrc = escapeHtml(src);
      return `<figure class="substack-gallery-fallback"><a class="substack-image-open" href="${safeSrc}" target="_blank" rel="noopener noreferrer"><img src="${safeSrc}" alt="${alt}" loading="lazy" decoding="async" /></a>${caption}</figure>`;
    } catch (_err) {
      return "";
    }
  });
}

function normalizeImageLinks(html) {
  const anchorPattern = /<a([^>]*class="[^"]*\bimage-link\b[^"]*"[^>]*)>([\s\S]*?)<\/a>/g;
  return html.replace(anchorPattern, (full, attrs, inner) => {
    const imgMatch = inner.match(/<img[^>]*src="([^"]+)"/i);
    if (!imgMatch || !imgMatch[1]) return full;

    const src = escapeHtml(imgMatch[1]);
    let cleanedAttrs = attrs
      .replace(/\s+href="[^"]*"/gi, "")
      .replace(/\s+target="[^"]*"/gi, "")
      .replace(/\s+rel="[^"]*"/gi, "")
      .trim();

    cleanedAttrs = cleanedAttrs ? ` ${cleanedAttrs}` : "";
    return `<a${cleanedAttrs} href="${src}" target="_blank" rel="noopener noreferrer">${inner}</a>`;
  });
}

function getSlugFromPostId(postId, title) {
  if (postId && postId.includes(".")) {
    return postId.split(".").slice(1).join(".").trim();
  }
  return String(title || "post")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const exportDir = process.argv[2] || "Wt-6NaubSlGLcaTaeSTwvw";
  const csvPath = path.join(exportDir, "posts.csv");
  const htmlDir = path.join(exportDir, "posts");
  const outDir = path.join("src", "blog", "posts");

  if (!fs.existsSync(csvPath)) {
    console.error(`Cannot find posts.csv at ${csvPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(htmlDir)) {
    console.error(`Cannot find posts html folder at ${htmlDir}`);
    process.exit(1);
  }

  ensureDir(outDir);

  const csv = fs.readFileSync(csvPath, "utf8");
  const rows = parseCsv(csv);
  const published = rows.filter((r) => r.is_published === "true");

  let imported = 0;
  let skippedNoHtml = 0;
  let skippedNoDate = 0;

  for (const row of published) {
    if (!row.post_date) {
      skippedNoDate += 1;
      continue;
    }

    const postId = row.post_id;
    const title = row.title || "Untitled";
    const subtitle = row.subtitle || "";
    const slug = getSlugFromPostId(postId, title);
    const htmlFile = path.join(htmlDir, `${postId}.html`);
    if (!fs.existsSync(htmlFile)) {
      skippedNoHtml += 1;
      continue;
    }

    const rawHtmlBody = fs.readFileSync(htmlFile, "utf8").trim();
    const htmlBody = normalizeImageLinks(replaceGalleryEmbeds(rawHtmlBody));
    const fileName = `${slug}.md`;
    const outPath = path.join(outDir, fileName);
    const substackUrl = `https://fabioxie.substack.com/p/${slug}`;

    const frontmatter = [
      "---",
      `title: ${yamlString(title)}`,
      `date: ${yamlString(row.post_date)}`,
      "tags:",
      "  - blog",
      "reading: true",
      "draft: false",
      "backHref: /blog/",
      "backLabel: Blog",
      `permalink: ${yamlString(`/blog/${slug}/index.html`)}`,
      `substackUrl: ${yamlString(substackUrl)}`,
      "---",
      "",
      `# ${title}`,
      "",
    ];

    if (subtitle) {
      frontmatter.push(`_${subtitle}_`, "");
    }

    frontmatter.push('<div class="substack-import">', htmlBody, "</div>", "");

    fs.writeFileSync(outPath, frontmatter.join("\n"), "utf8");
    imported += 1;
  }

  console.log(`Published rows: ${published.length}`);
  console.log(`Imported posts: ${imported}`);
  console.log(`Skipped (missing html): ${skippedNoHtml}`);
  console.log(`Skipped (missing date): ${skippedNoDate}`);
}

main();
