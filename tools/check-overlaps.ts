#!/usr/bin/env -S npx tsx
/**
 * check-overlaps.ts
 * --------------------------------------------------------------------------
 * Vérification automatique des chevauchements entre skills Claude Code.
 *
 * Scanne tous les `skills/*\/SKILL.md`, extrait pour chaque skill :
 *   - `owns`     → ses responsabilités canoniques (section "Responsibilities")
 *   - `excludes` → ce qu'il délègue explicitement (section "Explicitly Excluded")
 * (déclarés dans le frontmatter YAML, langage-neutres et déterministes).
 *
 * Détecte :
 *   [CRITIQUE] une même responsabilité possédée par >1 skill   → exit ≠ 0
 *   [CRITIQUE] frontmatter invalide / `owns` manquant          → exit ≠ 0
 *   [CRITIQUE] un skill qui exclut une responsabilité qu'il possède → exit ≠ 0
 *   [AVERTISSEMENT] `excludes` pointant une responsabilité possédée par personne
 *
 * Produit un rapport lisible puis sort avec un code non nul si un conflit
 * critique est détecté (utilisable en local et en CI).
 *
 * Usage : npx tsx tools/check-overlaps.ts   (aucune dépendance externe)
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = join(ROOT, "skills");

interface Skill {
  name: string;
  version: string | null;
  file: string;
  owns: string[];
  excludes: string[];
}

const SEMVER = /^\d+\.\d+\.\d+$/;

/** Extrait le bloc frontmatter (entre les deux premiers `---`). */
function extractFrontmatter(content: string): string | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : null;
}

/** Parse les champs simples dont on a besoin : `name`, `owns`, `excludes`. */
function parseFrontmatter(fm: string): { name?: string; version?: string; owns: string[]; excludes: string[] } {
  const lines = fm.split(/\r?\n/);
  let name: string | undefined;
  let version: string | undefined;
  const owns: string[] = [];
  const excludes: string[] = [];
  let current: "owns" | "excludes" | null = null;

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    const nameMatch = line.match(/^name:\s*(.+)$/);
    if (nameMatch) {
      name = nameMatch[1].trim().replace(/^["']|["']$/g, "");
      current = null;
      continue;
    }
    const versionMatch = line.match(/^version:\s*(.+)$/);
    if (versionMatch) {
      version = versionMatch[1].trim().replace(/^["']|["']$/g, "");
      current = null;
      continue;
    }
    if (/^owns:\s*$/.test(line)) { current = "owns"; continue; }
    if (/^excludes:\s*$/.test(line)) { current = "excludes"; continue; }
    // Nouvelle clé de premier niveau → on quitte la liste courante.
    if (/^[A-Za-z0-9_-]+:/.test(line) && !/^\s/.test(raw)) { current = null; continue; }
    const item = line.match(/^\s*-\s*(.+)$/);
    if (item && current) {
      const token = item[1].trim().replace(/^["']|["']$/g, "");
      if (current === "owns") owns.push(token);
      else excludes.push(token);
    }
  }
  return { name, version, owns, excludes };
}

function loadSkills(): Skill[] {
  let entries: string[];
  try {
    entries = readdirSync(SKILLS_DIR);
  } catch {
    console.error(`✗ Dossier introuvable : ${SKILLS_DIR}`);
    process.exit(2);
  }
  const skills: Skill[] = [];
  for (const entry of entries) {
    const dir = join(SKILLS_DIR, entry);
    if (!statSync(dir).isDirectory()) continue;
    const file = join(dir, "SKILL.md");
    let content: string;
    try {
      content = readFileSync(file, "utf8");
    } catch {
      console.error(`✗ ${entry}/SKILL.md manquant`);
      process.exitCode = 1;
      continue;
    }
    const fm = extractFrontmatter(content);
    if (!fm) {
      console.error(`✗ ${entry}/SKILL.md : frontmatter YAML absent`);
      process.exitCode = 1;
      continue;
    }
    const { name, version, owns, excludes } = parseFrontmatter(fm);
    skills.push({ name: name ?? entry, version: version ?? null, file: `skills/${entry}/SKILL.md`, owns, excludes });
  }
  return skills;
}

function main(): void {
  const skills = loadSkills();
  const critical: string[] = [];
  const warnings: string[] = [];

  // Index responsabilité -> skills qui la possèdent.
  const ownersOf = new Map<string, string[]>();
  for (const s of skills) {
    if (s.owns.length === 0) {
      critical.push(`${s.name} : aucune responsabilité 'owns' déclarée`);
    }
    if (!s.version) {
      warnings.push(`${s.name} : champ 'version' absent du frontmatter`);
    } else if (!SEMVER.test(s.version)) {
      warnings.push(`${s.name} : version "${s.version}" non conforme à semver (X.Y.Z)`);
    }
    for (const token of s.owns) {
      const arr = ownersOf.get(token) ?? [];
      arr.push(s.name);
      ownersOf.set(token, arr);
    }
  }

  // [CRITIQUE] responsabilité dupliquée entre plusieurs skills.
  for (const [token, owners] of ownersOf) {
    if (owners.length > 1) {
      critical.push(`Responsabilité dupliquée "${token}" possédée par : ${owners.join(", ")}`);
    }
  }

  // [CRITIQUE] un skill exclut ce qu'il possède / [AVERTISSEMENT] exclusion orpheline.
  for (const s of skills) {
    for (const token of s.excludes) {
      if (s.owns.includes(token)) {
        critical.push(`${s.name} : exclut "${token}" alors qu'il le possède`);
      } else if (!ownersOf.has(token)) {
        warnings.push(`${s.name} : exclut "${token}" qui n'est possédé par aucun skill (référence orpheline)`);
      }
    }
  }

  // ---- Rapport ----
  console.log("\n═══ Cartographie des responsabilités ═══\n");
  for (const s of [...skills].sort((a, b) => a.name.localeCompare(b.name))) {
    console.log(`▸ ${s.name}  (v${s.version ?? "?"})`);
    console.log(`    owns     : ${s.owns.join(", ") || "—"}`);
    console.log(`    excludes : ${s.excludes.join(", ") || "—"}`);
  }

  const totalTokens = ownersOf.size;
  console.log(`\n${skills.length} skills · ${totalTokens} responsabilités canoniques uniques\n`);

  if (warnings.length) {
    console.log("─── Avertissements ───");
    for (const w of warnings) console.log(`  ⚠ ${w}`);
    console.log("");
  }

  if (critical.length) {
    console.log("─── Conflits critiques ───");
    for (const c of critical) console.log(`  ✗ ${c}`);
    console.error(`\n❌ ${critical.length} conflit(s) critique(s) détecté(s). Voir docs/skill-boundaries.md.`);
    process.exit(1);
  }

  console.log("✅ Aucun chevauchement critique : chaque responsabilité appartient à un seul skill.");
  process.exit(process.exitCode ?? 0);
}

main();
