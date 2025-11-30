import { argv } from 'node:process';
import * as esbuild from 'esbuild';
import { unlinkSync, writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const productionMode = ('--dev' !== (argv[2] || process.env.NODE_ENV));
const targetBrowsers = ['chrome130','firefox132'];

console.log(`${ productionMode ? 'production' : 'development' } build`);

// bundle CSS
const buildCSS = await esbuild.context({
    entryPoints: [ 'pwa/css/main.css' ],
    bundle: true,
    format: 'esm',
    target: targetBrowsers,
    logLevel: productionMode ? 'error' : 'info',
    minify: productionMode,
    sourcemap: !productionMode,
    outfile: 'pwa/bundle.css',
    external: [ '*.woff2' ],
});

// bundle JS
const buildJS = await esbuild.context({
    entryPoints: [ 'pwa/js/main.js' ],
    format: 'esm',
    bundle: true,
    target: targetBrowsers,
    drop: productionMode ? ['debugger', 'console'] : [],
    logLevel: productionMode ? 'error' : 'info',
    minify: productionMode,
    sourcemap: !productionMode,
    outfile: 'pwa/bundle.js'
});


if (productionMode) {

  // remove existing source maps (used only for development)
  for ( const mapfile of ['pwa/bundle.css.map', 'pwa/bundle.js.map'] ) {
    try { 
      unlinkSync(mapfile); 
      console.log(`deleted ${mapfile}`);
    } catch {}
  }

  // build JavaScript and CSS bundles
  await buildCSS.rebuild();
  buildCSS.dispose();

  await buildJS.rebuild();
  buildJS.dispose();

  // Generate cache.json with hashed cache name
  const precacheFolders = [
    'assets/'
  ];

  const precacheInclude = [
    './',
    'index.html',
    'bundle.js',
    'bundle.css',
    'manifest.json',
  ];

  const precacheExclude = [
    'assets/font/orbitron-license.txt'
  ];

  // Recursively collect all files from pwa/assets directory
  function collectAssets(dir, basePrefix) {
    const files = [];
    const entries = readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = resolve(dir, entry.name);
      const relativePath = basePrefix + entry.name;
      
      if (entry.isDirectory()) {
        files.push(...collectAssets(fullPath, relativePath + '/'));
      } else {
        files.push(relativePath);
      }
    }
    
    return files;
  }

  // Collect all assets from folders listed in precacheFolders
  for (const folder of precacheFolders) {
    const folderPath = resolve('pwa', folder);
    const allAssets = collectAssets(folderPath, folder).sort();
    
    // Filter out excluded assets
    const filteredAssets = allAssets.filter(asset => !precacheExclude.includes(asset));
    precacheInclude.push(...filteredAssets);
  }

  // Compute hash of all precache assets
  const hash = createHash('md5');
  for (const asset of precacheInclude) {
    if (asset === './') { continue; }
    const assetPath = resolve('pwa', asset);
    try {
      const content = readFileSync(assetPath);
      hash.update(content);
    } catch (error) {
      console.warn(`unable to read ${asset} for hashing:`, error.message);
    }
  }
  const cacheName = 'pp-' + hash.digest('hex').slice(0, 13);

  const cacheConfig = {
    cacheName,
    precacheAssets: precacheInclude
  };

  writeFileSync(
    resolve('pwa', 'cache.json'),
    JSON.stringify(cacheConfig, null, 2)
  );
  console.log(`generated pwa/cache.json with cache name: ${cacheName}`);

} else {

  // remove cache.json in development mode
  try {
    unlinkSync(resolve('pwa', 'cache.json'));
    console.log('deleted pwa/cache.json');
  } catch {}

  // watch for file changes
  await buildCSS.watch();
  await buildJS.watch();

  // development server
  await buildCSS.serve({
    servedir: '.'
  });

}
