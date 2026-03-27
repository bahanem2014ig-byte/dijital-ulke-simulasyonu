import fs from "fs";
import path from "path";

const TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const OWNER = "bahanem2014ig-byte";
const REPO = "dijital-ulke-simulasyonu";
const ROOT = "/home/runner/workspace";

if (!TOKEN) {
  console.error("GITHUB_PERSONAL_ACCESS_TOKEN bulunamadı");
  process.exit(1);
}

const EXCLUDE_PATTERNS = [
  "node_modules",
  ".git",
  ".local",
  "dist",
  ".cache",
  "tsbuildinfo",
  ".replit-artifact",
  "attached_assets",
  ".npmrc",
  ".replitignore",
  ".replit",
  "replit.nix",
];

function shouldExclude(filePath: string): boolean {
  return EXCLUDE_PATTERNS.some(
    (pattern) => filePath.includes(pattern) || path.basename(filePath) === pattern
  );
}

function getAllFiles(dir: string, base: string = dir): string[] {
  const files: string[] = [];
  let entries: string[];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return files;
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const relPath = path.relative(base, fullPath);
    if (shouldExclude(relPath) || shouldExclude(entry)) continue;
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        files.push(...getAllFiles(fullPath, base));
      } else if (stat.size < 10 * 1024 * 1024) { // 10MB limit
        files.push(relPath);
      }
    } catch {
      // skip
    }
  }
  return files;
}

async function githubFetch(endpoint: string, options: RequestInit = {}) {
  const url = `https://api.github.com${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `token ${TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<any>;
}

async function main() {
  // Adım 1: README ile başlangıç commit'i oluştur
  console.log("Repository başlatılıyor...");
  const readmeContent = Buffer.from(
    `# Dijital Ülke Simülasyonu\n\nİnternet verilerine dayalı yapay zeka kişiliklerinden oluşan Dijital Ülke Simülasyonu.\n\nHer vatandaş, insanların internete yüklediği içeriklere göre karakterize edilmiş bir yapay zeka modelidir.\n\n## Teknolojiler\n- React + Vite\n- TypeScript\n- Express.js\n- OpenAI GPT\n- Tailwind CSS\n- Drizzle ORM + PostgreSQL\n`
  ).toString("base64");

  await githubFetch(`/repos/${OWNER}/${REPO}/contents/README.md`, {
    method: "PUT",
    body: JSON.stringify({
      message: "chore: README ekle",
      content: readmeContent,
    }),
  });
  console.log("README oluşturuldu");

  // Adım 2: Son commit SHA'sını al
  const refData = await githubFetch(`/repos/${OWNER}/${REPO}/git/ref/heads/main`);
  const latestSha = refData.object.sha;
  console.log(`Başlangıç commit SHA: ${latestSha}`);

  // Adım 3: Base tree SHA al
  const commitData = await githubFetch(`/repos/${OWNER}/${REPO}/git/commits/${latestSha}`);
  const baseTreeSha = commitData.tree.sha;

  // Adım 4: Dosyaları topla ve blob'ları oluştur
  console.log("Dosyalar toplanıyor...");
  const files = getAllFiles(ROOT);
  console.log(`${files.length} dosya bulundu, blob'lar oluşturuluyor...`);

  const treeItems: { path: string; mode: string; type: string; sha: string }[] = [];
  let skipped = 0;

  for (let i = 0; i < files.length; i++) {
    const relPath = files[i];
    const fullPath = path.join(ROOT, relPath);

    try {
      const content = fs.readFileSync(fullPath);
      const base64 = content.toString("base64");

      const blob = await githubFetch(`/repos/${OWNER}/${REPO}/git/blobs`, {
        method: "POST",
        body: JSON.stringify({ content: base64, encoding: "base64" }),
      });

      treeItems.push({
        path: relPath,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      });

      if ((i + 1) % 20 === 0) {
        console.log(`  ${i + 1}/${files.length} dosya işlendi`);
      }
    } catch (err: any) {
      skipped++;
    }
  }

  console.log(`${treeItems.length} dosya hazırlandı, ${skipped} dosya atlandı`);

  // Adım 5: Tree oluştur
  console.log("Git tree oluşturuluyor...");
  const tree = await githubFetch(`/repos/${OWNER}/${REPO}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ tree: treeItems, base_tree: baseTreeSha }),
  });

  // Adım 6: Commit oluştur
  console.log("Commit oluşturuluyor...");
  const commit = await githubFetch(`/repos/${OWNER}/${REPO}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message: "feat: Dijital Ülke Simülasyonu - tüm proje dosyaları",
      tree: tree.sha,
      parents: [latestSha],
    }),
  });

  // Adım 7: Main branch'i güncelle
  console.log("Branch güncelleniyor...");
  await githubFetch(`/repos/${OWNER}/${REPO}/git/refs/heads/main`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });

  console.log(`\n✓ Tamamlandı!`);
  console.log(`  Repository: https://github.com/${OWNER}/${REPO}`);
}

main().catch((err) => {
  console.error("Hata:", err.message);
  process.exit(1);
});
