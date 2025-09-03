/*
  Migration script: Inspect and migrate posts from a SQLite database into Astro content markdown files.
  Phase 1: schema introspection and dry-run preview.
  Usage (PowerShell):
    pnpm node scripts/migrate-from-sqlite.mjs --db "D:\\Betsy\\test\\database.db" --dry-run
    pnpm node scripts/migrate-from-sqlite.mjs --db "D:\\Betsy\\test\\database.db" --out ./src/content/posts
*/

import fs from 'node:fs';
import path from 'node:path';
import initSqlJs from 'sql.js';

const argv = process.argv.slice(2);
const params = {};
for (let i = 0; i < argv.length; i++) {
  const tok = argv[i];
  if (!tok.startsWith('--')) continue;
  const eq = tok.indexOf('=');
  if (eq !== -1) {
    const key = tok.slice(2, eq);
    const val = tok.slice(eq + 1);
    params[key] = val === '' ? 'true' : val;
  } else {
    const key = tok.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      params[key] = next;
      i++;
    } else {
      params[key] = 'true';
    }
  }
}

const dbPath = params.db || params.database;
const outDir = params.out || './src/content/posts';
const dryRun = params['dry-run'] === 'true' || params['dry'] === 'true' || !!params['dry-run'] || !!params['dry'];

if (!dbPath) {
  console.error('Error: missing --db <path-to-sqlite-db>');
  process.exit(1);
}

if (!fs.existsSync(dbPath)) {
  console.error(`Error: DB not found at ${dbPath}`);
  process.exit(1);
}

/**
 * Basic helpers
 */
function sanitizeSlug(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'post';
}

function toISODateTime(v) {
  if (!v) return new Date().toISOString();
  try {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.toISOString();
  } catch {}
  // if it's integer timestamp (seconds or ms)
  if (/^\d+$/.test(String(v))) {
    const n = Number(v);
    const ms = n > 1e12 ? n : n * 1000;
    const d = new Date(ms);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

function yamlEscape(str) {
  if (str == null) return '';
  const s = String(str);
  if (/[:\-{}\[\],&*#?]|^\s|\s$|^$|\n/.test(s)) {
    return JSON.stringify(s);
  }
  return s;
}

function writeMarkdown(outBase, fileSlug, frontmatter, body) {
  const dir = path.join(outBase, fileSlug);
  const file = path.join(outBase, `${fileSlug}.md`);
  // if user wants nested directories by date/slug, adjust here
  const fm = [];
  fm.push('---');
  fm.push(`title: ${yamlEscape(frontmatter.title || 'Untitled')}`);
  fm.push(`published: ${frontmatter.published || new Date().toISOString()}`);
  if (frontmatter.updated) fm.push(`updated: ${frontmatter.updated}`);
  fm.push(`description: ${yamlEscape(frontmatter.description || '')}`);
  if (frontmatter.image) fm.push(`image: ${yamlEscape(frontmatter.image)}`);
  fm.push(`tags: ${JSON.stringify(frontmatter.tags || [])}`);
  if (frontmatter.draft) fm.push(`draft: true`);
  fm.push(`lang: ${yamlEscape(frontmatter.lang || '')}`);
  fm.push('---');
  fm.push('');
  fm.push(body || '');
  const fmLines = fm.join('\n');

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, fmLines, 'utf8');
  return file;
}

async function main() {
  const SQL = await initSqlJs({ locateFile: (f) => `node_modules/sql.js/dist/${f}` });
  const u8 = new Uint8Array(fs.readFileSync(dbPath));
  const db = new SQL.Database(u8);

  // 1) Introspect tables
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
  const tableNames = tables[0]?.values?.map((row) => row[0]) || [];
  console.log('Tables:', tableNames);

  // Optional: inspect resources table if present (for images mapping)
  if (tableNames.includes('resources')) {
    try {
      const rCols = db.exec('PRAGMA table_info(resources);')[0]?.values?.map((r) => ({ cid: r[0], name: r[1], type: r[2] })) || [];
      console.log('resources Columns:', rCols);
      const rSample = db.exec('SELECT * FROM resources LIMIT 3;');
      if (rSample.length) {
        const cols = rSample[0].columns;
        const vals = rSample[0].values.map((row) => Object.fromEntries(row.map((v, i) => [cols[i], v])));
        console.log('resources Preview (first 3):', vals);
      }
    } catch (e) {
      console.log('resources inspect error:', e?.message || e);
    }
  }

  // Heuristics: find likely posts table and columns
  const candidateTables = tableNames.filter((t) => /post|article|blog|entry|project|note/i.test(t));
  let postsTable = candidateTables[0] || tableNames[0];
  if (!postsTable) {
    console.error('No tables found in DB.');
    process.exit(1);
  }

  const pragma = db.exec(`PRAGMA table_info(${postsTable});`);
  const columns = pragma[0]?.values?.map((r) => ({ cid: r[0], name: r[1], type: r[2] })) || [];
  console.log(`Using posts table: ${postsTable}`);
  console.log('Columns:', columns);

  // 2) Pull rows
  const rowsRes = db.exec(`SELECT * FROM ${postsTable} ORDER BY rowid ASC;`);
  if (!rowsRes.length) {
    console.warn('No rows found in table', postsTable);
    return;
  }
  const res = rowsRes[0];
  const colNames = res.columns;
  const rows = res.values.map((r) => Object.fromEntries(r.map((v, i) => [colNames[i], v])));

  // 3) Basic mapping guesses
  const mapGuess = {
    title: colNames.find((c) => /title|name|subject/i.test(c)),
    content: colNames.find((c) => /content|body|markdown|md|text/i.test(c)),
    published: colNames.find((c) => /published|created_at|create|date|time|pub/i.test(c)),
    updated: colNames.find((c) => /updated|update|modified|modify/i.test(c)),
    tags: colNames.find((c) => /tags|label|keywords/i.test(c)),
    image: colNames.find((c) => /image|cover|banner|thumb/i.test(c)),
    slug: colNames.find((c) => /slug|path|url|link/i.test(c)),
    draft: colNames.find((c) => /draft|hidden|private/i.test(c)),
    lang: colNames.find((c) => /lang|language/i.test(c)),
    description: colNames.find((c) => /description|desc|summary|abstract|excerpt/i.test(c)),
  };

  console.log('Mapping guess:', mapGuess);

  // 4) Preview first 3 rows
  const preview = rows.slice(0, 3).map((row) => ({
    title: row[mapGuess.title],
    published: row[mapGuess.published],
    updated: row[mapGuess.updated],
    slug: row[mapGuess.slug],
  tags: row[mapGuess.tags] || (row.category ? [row.category] : undefined),
  }));
  console.log('Preview (first 3):', preview);

  if (dryRun) {
    console.log('\nDry-run only. No files written. Re-run without --dry-run to export.');
    return;
  }

  // 5) Export posts
  let count = 0;
  const used = new Set();
  for (const row of rows) {
    const title = row[mapGuess.title] || 'Untitled';
    const body = String(row[mapGuess.content] || '');
    const published = toISODateTime(row[mapGuess.published]);
    const updated = row[mapGuess.updated] ? toISODateTime(row[mapGuess.updated]) : '';
    const image = row[mapGuess.image] || '';
    const draft = !!row[mapGuess.draft] && String(row[mapGuess.draft]).toLowerCase() !== 'false' && row[mapGuess.draft] !== 0;
    const lang = row[mapGuess.lang] || '';
    const description = row[mapGuess.description] || '';
    let tags = row[mapGuess.tags];
    if (typeof tags === 'string') {
      try {
        // try parse JSON array or comma separated
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) tags = parsed.map(String);
        else tags = String(tags).split(/[ ,;]+/).filter(Boolean);
      } catch {
        tags = String(tags).split(/[ ,;]+/).filter(Boolean);
      }
    } else if (!Array.isArray(tags)) {
      tags = [];
    }

    // file slug prefer: explicit slug -> sanitized title
    let fileSlug = sanitizeSlug(row[mapGuess.slug] || title);
    let base = fileSlug;
    let idx = 1;
    while (used.has(fileSlug)) {
      fileSlug = `${base}-${idx++}`;
    }
    used.add(fileSlug);

    const frontmatter = {
      title,
      published,
      updated,
      description,
      image,
      tags,
      draft,
      lang,
    };

    const filePath = writeMarkdown(outDir, fileSlug, frontmatter, body);
    count++;
    if (count <= 5) {
      console.log(`✓ Wrote ${filePath}`);
    }
  }

  console.log(`Done. Exported ${count} posts to ${outDir}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
