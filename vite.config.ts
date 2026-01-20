import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Plugin to inject build timestamp into service worker
function serviceWorkerVersionPlugin() {
  return {
    name: 'sw-version',
    writeBundle() {
      const swPath = path.resolve(__dirname, 'dist/sw.js');
      
      if (fs.existsSync(swPath)) {
        let content = fs.readFileSync(swPath, 'utf8');
        // Replace the placeholder version with build timestamp
        const buildVersion = Date.now().toString();
        content = content.replace(
          /const CACHE_VERSION = ['"][^'"]+['"]/,
          `const CACHE_VERSION = '${buildVersion}'`
        );
        fs.writeFileSync(swPath, content);
        console.log(`[sw-version] Injected build version: ${buildVersion}`);
      }
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile(), serviceWorkerVersionPlugin()],
  server: {
    host: true, // Expose to network for mobile testing
  },
  publicDir: 'public',
})

