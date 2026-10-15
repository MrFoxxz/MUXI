#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { fileURLToPath } from 'node:url';

const SENSITIVE_FILE_NAMES = new Set([
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  '.npmrc',
  '.pypirc',
  'id_rsa',
  'id_dsa',
  'id_ecdsa',
  'id_ed25519',
]);

const SENSITIVE_EXTENSIONS = new Set(['.pem', '.key', '.p12', '.pfx']);

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg.startsWith('--')) {
      throw new Error(`Argumento inesperado: ${arg}`);
    }

    const key = arg.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

function isSensitiveFile(fileName) {
  const lowerName = fileName.toLowerCase();
  return (
    SENSITIVE_FILE_NAMES.has(lowerName) ||
    SENSITIVE_EXTENSIONS.has(path.extname(lowerName))
  );
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function confirmOverwrite(relativePath) {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(
    `El archivo "${relativePath}" ya existe. Sobrescribir? [y/N] `,
  );
  rl.close();

  return answer.trim().toLowerCase() === 'y';
}

async function copyDirectory(sourceDir, targetDir, baseDir, results, options) {
  await fs.mkdir(targetDir, { recursive: true });

  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);
    const relativePath = path.relative(baseDir, sourcePath);

    if (entry.name === '.git') {
      results.omitted.push(`${relativePath} (carpeta Git omitida)`);
      continue;
    }

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, targetPath, baseDir, results, options);
      continue;
    }

    if (!entry.isFile()) {
      results.omitted.push(`${relativePath} (tipo de archivo no soportado)`);
      continue;
    }

    if (isSensitiveFile(entry.name)) {
      results.omitted.push(`${relativePath} (archivo sensible omitido)`);
      continue;
    }

    const targetExists = await pathExists(targetPath);

    if (targetExists && !options.force) {
      if (!options.interactive) {
        results.omitted.push(`${relativePath} (ya existe)`);
        continue;
      }

      const shouldOverwrite = await confirmOverwrite(relativePath);

      if (!shouldOverwrite) {
        results.omitted.push(`${relativePath} (ya existe)`);
        continue;
      }
    }

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.copyFile(sourcePath, targetPath);
    results.copied.push(relativePath);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const project = args.project;
  const source = args.source;

  if (!project || typeof project !== 'string') {
    throw new Error('Falta --project. Ejemplo: --project seralogin_plus');
  }

  if (!/^[a-z0-9][a-z0-9_-]*$/.test(project)) {
    throw new Error(
      'El proyecto debe usar solo minusculas, numeros, guiones o guiones bajos.',
    );
  }

  if (!source || typeof source !== 'string') {
    throw new Error('Falta --source. Ejemplo: --source "C:/proyecto/.muxi"');
  }

  const sourceDir = path.resolve(source);
  const sourceStats = await fs.stat(sourceDir).catch(() => null);

  if (!sourceStats) {
    throw new Error(`La ruta de origen no existe: ${sourceDir}`);
  }

  if (!sourceStats.isDirectory()) {
    throw new Error(`La ruta de origen no es una carpeta: ${sourceDir}`);
  }

  if (path.basename(sourceDir) !== '.muxi') {
    throw new Error('La ruta de origen debe terminar en una carpeta llamada .muxi');
  }

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(scriptDir, '..');
  const targetDir = path.join(repoRoot, 'muxi_docs', project);
  const results = { copied: [], omitted: [] };

  await copyDirectory(sourceDir, targetDir, sourceDir, results, {
    force: Boolean(args.force),
    interactive: Boolean(process.stdin.isTTY),
  });

  console.log(`\nImportacion finalizada para "${project}".`);
  console.log(`Origen: ${sourceDir}`);
  console.log(`Destino: ${targetDir}`);

  console.log('\nArchivos copiados:');
  if (results.copied.length === 0) {
    console.log('- Ninguno');
  } else {
    for (const file of results.copied) {
      console.log(`- ${file}`);
    }
  }

  console.log('\nArchivos omitidos:');
  if (results.omitted.length === 0) {
    console.log('- Ninguno');
  } else {
    for (const file of results.omitted) {
      console.log(`- ${file}`);
    }
  }
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
