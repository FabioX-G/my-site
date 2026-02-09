#!/usr/bin/env node
/* eslint-disable no-console */

const books = require("../src/_data/library.js");

function normalize(value = "") {
  return value
    .toString()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function buildAmazonLink(book) {
  if (book.amazon) return String(book.amazon).trim();
  if (book.asin) return `https://www.amazon.com/dp/${String(book.asin).trim()}`;
  return "";
}

const errors = [];
const warnings = [];

const seenByTitleAuthor = new Map();
const seenByAsin = new Map();

books.forEach((book, idx) => {
  const row = idx + 1;
  const label = `${book.title || "<missing title>"} @ item ${row}`;

  if (!book.title || !book.author || !book.year) {
    errors.push(`${label}: missing required field(s) title/author/year.`);
  }

  const key = `${normalize(book.title)}|${normalize(book.author)}`;
  if (seenByTitleAuthor.has(key)) {
    errors.push(`${label}: duplicate title+author with item ${seenByTitleAuthor.get(key)}.`);
  } else {
    seenByTitleAuthor.set(key, row);
  }

  const asin = String(book.asin || "").trim();
  if (asin) {
    if (!/^[A-Z0-9]{10}$/.test(asin)) {
      errors.push(`${label}: ASIN "${asin}" is not a valid 10-char Amazon ASIN format.`);
    }
    if (seenByAsin.has(asin)) {
      warnings.push(`${label}: ASIN "${asin}" is reused (also item ${seenByAsin.get(asin)}).`);
    } else {
      seenByAsin.set(asin, row);
    }
  }

  if (!asin && !book.amazon) {
    errors.push(`${label}: missing purchase link source (asin or amazon).`);
  }

  const link = buildAmazonLink(book);
  if (link) {
    let parsed;
    try {
      parsed = new URL(link);
    } catch {
      errors.push(`${label}: malformed purchase URL "${link}".`);
      return;
    }

    if (!/(^|\.)amazon\.com$/i.test(parsed.hostname)) {
      errors.push(`${label}: purchase URL must use amazon.com host, got "${parsed.hostname}".`);
    }

    if (!parsed.pathname.includes("/dp/")) {
      warnings.push(`${label}: purchase URL does not use /dp/ canonical format.`);
    }
  }
});

console.log(`Bookshelf entries: ${books.length}`);
if (warnings.length) {
  console.log(`Warnings: ${warnings.length}`);
  warnings.forEach((w) => console.log(`- ${w}`));
}

if (errors.length) {
  console.error(`Errors: ${errors.length}`);
  errors.forEach((e) => console.error(`- ${e}`));
  process.exit(1);
}

console.log("Validation passed: no duplicates, required fields present, and amazon.com purchase links are valid.");
