const fs = require("fs");
const path = require("path");
const os = require("os");

try {
  const dir = path.join(
    os.homedir(),
    ".cache/dotslash/64/ed7915e5fef86802e862c274e17f780fa75388/React Native DevTools-linux-x64"
  );
  const bin = path.join(dir, "React Native DevTools.bin");
  const exe = path.join(dir, "React Native DevTools");

  if (fs.existsSync(exe) && !fs.existsSync(bin)) {
    fs.chmodSync(dir, 0o755);
    fs.renameSync(exe, bin);
    const wrapperContent = `#!/bin/bash\nDIR="$(cd "$(dirname "$0")" && pwd)"\nexec "$DIR/React Native DevTools.bin" --no-sandbox "$@"\n`;
    fs.writeFileSync(exe, wrapperContent, { mode: 0o755 });
    console.log("Successfully wrapped React Native DevTools with --no-sandbox");
  }
} catch (err) {
  // Ignore if cache directory does not exist yet
}
