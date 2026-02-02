import { argv } from 'node:process';
import * as esbuild from 'esbuild';
import { unlinkSync, writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { minifyTemplates, writeFiles } from "esbuild-minify-templates";
import { sassPlugin } from 'esbuild-sass-plugin';

const productionMode = ('--dev' !== (argv[2] || process.env.NODE_ENV));
const targetBrowsers = ['chrome130','firefox132'];

const SW_FILENAME = 'sw.js';
const SW_FILE = resolve('pwa', SW_FILENAME);
const SW_TEMPLATE_FILE = resolve('pwa', `${SW_FILENAME}.template`);

console.log(`${ productionMode ? 'production' : 'development' } build`);

// bundle CSS
const buildCSS = await esbuild.context({
    entryPoints: [ 'pwa/css/main.css' ],
    bundle: true,
    target: targetBrowsers,
    logLevel: productionMode ? 'error' : 'info',
    minify: productionMode,
    sourcemap: !productionMode,
    loader: {
      ".scss": "css",
    },
    plugins: [sassPlugin({
      filter: /\.scss$/
    })],
    outfile: 'pwa/bundle.css',
    external: [ '*.woff2' ]
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
    outfile: 'pwa/bundle.js',
    write: false,
    plugins: [
      sassPlugin({
        filter: /\.scss$/
      }),
      minifyTemplates({ taggedOnly: true }), 
      writeFiles()
    ],
    loader: {
      ".scss": "css",
    }
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

  // define assets to precache
  const precache = {
    folders: [
      'assets/'
    ],
    include: [
      './',
      'index.html',
      'bundle.js',
      'bundle.css',
      'manifest.json',
    ],
    exclude: [
      'assets/font/orbitron-license.txt'
    ]
  }

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

  // Initialize precache assets list
  const precacheAssets = [...precache.include];

  // Collect all assets from folders listed in precache.folders
  for (const folder of precache.folders) {
    const folderPath = resolve('pwa', folder);
    const allAssets = collectAssets(folderPath, folder).sort();
    
    // Filter out excluded assets
    const filteredAssets = allAssets.filter(asset => !precache.exclude.includes(asset));
    precacheAssets.push(...filteredAssets);
  }

  // Compute hash of all precache assets
  const hash = createHash('md5');
  const computeHash = (path) => {
    try {
      const content = readFileSync(path);
      hash.update(content);
    } catch (error) {
      console.warn(`unable to read ${asset} for hashing:`, error.message);
    }
  }

  computeHash(SW_TEMPLATE_FILE);

  for (const asset of precacheAssets) {
    if (asset === './') { continue; }
    const assetPath = resolve('pwa', asset);
    computeHash(assetPath);
  }
  
  const cacheName = 'pp-' + hash.digest('hex').slice(0, 16);

  // Generate a production service-worker.js by filling the template
  try {
    const template = readFileSync(SW_TEMPLATE_FILE, 'utf8');
    const swContent = template
      .replace("'%%CACHE_NAME%%'", JSON.stringify(cacheName))
      .replace("'%%PRECACHE_ASSETS%%'", JSON.stringify(precacheAssets, null, 2));

    writeFileSync(SW_FILE, swContent);
    console.log(`wrote production ${SW_FILENAME} from template with embedded cache list\n`+
                `  cache name: ${cacheName}\n`+
                `  precache assets: ${precacheAssets.length} files`
    );
  } catch (err) {
    console.error(`failed to write ${SW_FILENAME} from template:`, err);
  }

} else {

  // in development mode, remove any existing service worker file
  try {
    unlinkSync(SW_FILE);
    console.log('deleted', SW_FILE);
  } catch {}

  // watch for file changes
  await buildCSS.watch();
  await buildJS.watch();

  // development server
  await buildCSS.serve({
    servedir: '.'
  });

}
