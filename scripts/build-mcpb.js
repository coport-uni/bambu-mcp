import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const STAGING = path.join(ROOT, "mcpb-staging");

function clean(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function copyDir(src, dest, filter) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, filter);
    } else if (!filter || filter(entry.name)) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log("1/6  Cleaning staging directory...");
clean(STAGING);
fs.mkdirSync(STAGING, { recursive: true });

console.log("2/6  Copying compiled JS to server/...");
const distDir = path.join(ROOT, "dist");
if (!fs.existsSync(distDir)) {
  console.error("dist/ not found. Run 'npm run build' first.");
  process.exit(1);
}
copyDir(distDir, path.join(STAGING, "server"), (name) => name.endsWith(".js"));

console.log("3/6  Copying manifest.json and icon...");
fs.copyFileSync(path.join(ROOT, "manifest.json"), path.join(STAGING, "manifest.json"));
fs.copyFileSync(path.join(ROOT, "icon.png"), path.join(STAGING, "icon.png"));

console.log("4/6  Creating package.json for staging...");
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf-8"));
const stagingPkg = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  type: pkg.type,
  main: "server/index.js",
  dependencies: pkg.dependencies,
  engines: pkg.engines,
};
fs.writeFileSync(path.join(STAGING, "package.json"), JSON.stringify(stagingPkg, null, 2));

fs.writeFileSync(
  path.join(STAGING, "package-lock.json"),
  fs.readFileSync(path.join(ROOT, "package-lock.json"), "utf-8")
);

console.log("5/6  Installing production dependencies...");
execSync("npm ci --omit=dev", { cwd: STAGING, stdio: "inherit" });

console.log("6/6  Validating and packing...");
execSync("mcpb validate .", { cwd: STAGING, stdio: "inherit" });

const outputFile = path.join(ROOT, `bambu-mcp-${pkg.version}.mcpb`);
execSync(`mcpb pack . "${outputFile}"`, { cwd: STAGING, stdio: "inherit" });

clean(STAGING);

console.log(`\nDone! Created ${path.basename(outputFile)}`);
