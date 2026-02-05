import { argv } from 'node:process';
import * as esbuild from 'esbuild';
import BuildOptions from 'esbuild';
import fs from 'node:fs';
import { copyFile, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve, relative } from 'node:path';
import { minifyTemplates, writeFiles } from "esbuild-minify-templates";
import { sassPlugin } from 'esbuild-sass-plugin';

const productionMode = ('--dev' !== (argv[2] || process.env.NODE_ENV));
const targetBrowsers = ['chrome130','firefox132'];

const BASE_PATH = resolve();

const SRC_PATH = resolve('.', 'src');
const PUB_PATH = resolve('.', 'pub');
const PWA_PATH = resolve(PUB_PATH, 'pwa');

const CSS_SRC_FILEPATH = resolve(SRC_PATH, 'css', 'main.css');
const CSS_OUT_FILENAME = 'bundle.css';
const CSS_OUT_FILEPATH = resolve(PWA_PATH, CSS_OUT_FILENAME);
const CSS_MAP_FILEPATH = resolve(PWA_PATH, CSS_OUT_FILENAME+'.map');

const JS_SRC_FILEPATH = resolve(SRC_PATH, 'js', 'main.js');
const JS_OUT_FILENAME = 'bundle.js';
const JS_OUT_FILEPATH = resolve(PWA_PATH, JS_OUT_FILENAME);
const JS_MAP_FILEPATH = resolve(PWA_PATH, JS_OUT_FILENAME+'.map');

const SW_FILENAME = 'sw.js';
const SW_TEMPLATE_FILE = resolve(SRC_PATH, `${SW_FILENAME}.template`);
const SW_OUT_FILEPATH = resolve(PWA_PATH, SW_FILENAME);

const DATA_DIRNAME = 'data';
const LANDING_DIRNAME = 'landing';
const ASSETS_DIRNAME = 'assets';
const I18N_DIRNAME = 'i18n';

const COPY_LIST = [
  {src: LANDING_DIRNAME, dest: PUB_PATH},
  {src: 'LICENSE.md', dest: resolve(PUB_PATH, 'LICENSE.md')},
  {src: join(SRC_PATH, 'index.html'), dest: join(PWA_PATH, 'index.html')},
  {src: join(SRC_PATH, 'manifest.json'), dest: join(PWA_PATH, 'manifest.json')},
  {src: join(DATA_DIRNAME, ASSETS_DIRNAME), dest: join(PWA_PATH, ASSETS_DIRNAME)},
  {src: join(DATA_DIRNAME, I18N_DIRNAME), dest: join(PWA_PATH, I18N_DIRNAME)},
];

/** CSS bundle parameters @type {BuildOptions} */
const cssBuildOptions = {
    entryPoints: [ CSS_SRC_FILEPATH ],
    bundle: true,
    target: targetBrowsers,
    logLevel: productionMode ? 'error' : 'info',
    minify: productionMode,
    sourcemap: !productionMode,
    outfile: CSS_OUT_FILEPATH,
    plugins: [sassPlugin({
      filter: /\.scss$/
    })],
    loader: {
      ".scss": "css",
    },
    external: [ '*.woff2' ]
};

/** JS bundle parameters @type {BuildOptions} */
const jsBuildOptions = {
    entryPoints: [ JS_SRC_FILEPATH ],
    format: 'esm',
    bundle: true,
    target: targetBrowsers,
    drop: productionMode ? ['debugger', 'console'] : [],
    logLevel: productionMode ? 'error' : 'info',
    minify: productionMode,
    sourcemap: !productionMode,
    outfile: JS_OUT_FILEPATH,
    write: false,
    plugins: [
      minifyTemplates({ taggedOnly: true }), 
      writeFiles()
    ]
};

// define assets to precache
const PRECACHE = {
  folders: [
    ASSETS_DIRNAME,
    I18N_DIRNAME
  ],
  include: [
    './',
    'index.html',
    'bundle.js',
    'bundle.css',
    'manifest.json',
  ],
  exclude: [
    ASSETS_DIRNAME+'font/orbitron-license.txt'
  ]
}


// Begin build

console.log(`Starting ${ productionMode ? 'Production' : 'Development' } build...`);

createDirectory(PUB_PATH);
createDirectory(PWA_PATH);
await copyFilesAndDirs(COPY_LIST);

if ( productionMode ) {

  // Production build:
  // generates a service worker to cache files for offline usage

  deleteSourceMaps();
  await bundleCssAndJs(cssBuildOptions, jsBuildOptions);
  const precacheAssets = buildPrecacheAssetsList(PRECACHE, PWA_PATH);
  const hash = computeHexHash([SW_TEMPLATE_FILE, ...precacheAssets]);
  const cacheName = 'pp-' + hash.slice(0, 16);
  generateServiceWorker(SW_TEMPLATE_FILE, cacheName, precacheAssets);

} else {

  // Development build:
  // builds and watches for changes while running a HTTP server

  deleteServiceWorker();

  const buildCSS = await esbuild.context(cssBuildOptions);
  const buildJS = await esbuild.context(jsBuildOptions);
  
  await buildCSS.watch();
  await buildJS.watch();

  COPY_LIST.forEach(entry => fs.watch(
    entry.src, 
    {recursive: true}, 
    () => copyFilesAndDirs(COPY_LIST)
  ));

  await buildCSS.serve({
    servedir: PUB_PATH
  });

}


/** Removes existing source maps (used only for development). */
function deleteSourceMaps() {
  console.log("\nDeleting existing map files...");
  for ( const mapfile of [CSS_MAP_FILEPATH, JS_MAP_FILEPATH] ) {
    try { 
      fs.unlinkSync(mapfile); 
    } catch {}
  }
  console.log("done");
}


function deleteServiceWorker() {
  try {
    fs.unlinkSync(SW_OUT_FILEPATH);
    console.log('deleted', relative(BASE_PATH, SW_OUT_FILEPATH));
  } catch {}
}


function createDirectory(dir) {
  try {
    fs.mkdirSync(dir);
    console.log(`Created directory "${relative(BASE_PATH, dir)}".`);
  } catch (e) {
    if ( e.code == 'EEXIST' )
      console.log(`Directory "${relative(BASE_PATH, dir)}" already exists.`);
    else
      throw e;
  }
}


/** 
 * Copies files. 
 * @param {object[]} files
 * @param {string} files[].src
 * @param {string} files[].dest
 */
async function copyFilesAndDirs(files) {
  console.log("\nCopying files/directories...");
  const result = await Promise.allSettled(
    files.map(({src, dest}) => {
      const isDir = fs.existsSync(src) && fs.lstatSync(src).isDirectory();
      if ( isDir )
        return cp(src, dest, {
          recursive: true,
          preserveTimestamps: true
        }).then(
          () => console.log(`  directory "${relative(BASE_PATH, src)}" copied to "${relative(BASE_PATH, dest)}".`),
          (e) => console.error(`  error when copying dir "${relative(BASE_PATH, src)}": ${e}`)
        );
      else
        return copyFile(src, dest).then(
          () => console.log(`  file "${relative(BASE_PATH, src)}" copied to "${relative(BASE_PATH, dest)}".`),
          (e) => console.error(`  error when copying file "${relative(BASE_PATH, src)}": ${e}`)
        );
    })
  );
  console.log(( result[0].errors || result[1].errors )
    ? "finished copy with errors." : "finished copy without errors."
  );
}


/** Builds CSS and JS files. */
async function bundleCssAndJs(cssOptions, jsOptions) {
  console.log("\nBundling CSS and JS files...");

  const builder = (async (options) => {
    const ctx = await esbuild.context(options);
    const result = await ctx.rebuild();
    ctx.dispose();
    return result;
  }); 

  const [cssResult, jsResult] = await Promise.all([
    builder(cssOptions), builder(jsOptions)
  ]);

  if ( cssResult.errors.length || jsResult.errors.length ) {
    console.error("finished bundle with errors:");
    console.error(cssResult.errors.toString());
    console.error(jsResult.errors.toString());
  } else {
    console.log("finished bundle without errors.");
  }
}


/** 
 * Builds the precache assets list. 
 * @param {object} obj
 * @param {string[]} obj.folders
 * @param {string[]} obj.include
 * @param {string[]} obj.exclude
 * @param {string} basePath
 */
function buildPrecacheAssetsList(obj, basePath) {

  const collectAssets = (dir, basePrefix) => {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = resolve(dir, entry.name);
      const relativePath = join(basePrefix, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...collectAssets(fullPath, relativePath + '/'));
      } else {
        files.push(relativePath);
      }
    }
    
    return files;
  }

  console.log("\nCollecting assets for precache...");

  // Initialize precache assets list
  const assets = [...obj.include];

  // Collect all assets from folders listed in precache.folders
  for (const folder of obj.folders) {
    const folderPath = resolve(basePath, folder);
    const allAssets = collectAssets(folderPath, folder).sort();
    
    // Filter out excluded assets
    const filteredAssets = allAssets.filter(asset => !obj.exclude.includes(asset));
    assets.push(...filteredAssets);
  }

  console.log(`collected ${assets.length} entries.`);

  return assets;
}


/** 
 * Computes hash of multiple files. 
 * @param {string[]} files
 */
function computeHexHash(files) {

  let successCount = 0;
  let errorCount = 0;
 
  const computeFileHash = (path) => {
    try {
      const content = fs.readFileSync(path);
      hash.update(content);
      successCount++;

    } catch (error) {
      errorCount++;
      console.warn(`  unable to read ${relative(BASE_PATH, path)} for hashing:`, error.message);
    }
  }

  console.log("\nComputing hash for asset files...");
  const hash = createHash('md5');

  for (const asset of files) {
    if (asset === './') { continue; }
    const assetPath = resolve(PWA_PATH, asset);
    computeFileHash(assetPath);
  }

  console.log(`done with ${successCount} file(s) cached and ${errorCount} error(s).`);

  return hash.digest('hex');
}


/** 
 * Generates a service worker file from a template. 
 * @param {string} templateFile
 * @param {string} cacheName
 * @param {string[]} assetsList
 */
function generateServiceWorker(templateFile, cacheName, assetsList) {
  try {
    console.log("\nGenerating service worker file:");
    const template = fs.readFileSync(templateFile, 'utf8');
    const swContent = template
      .replace("'%%CACHE_NAME%%'", JSON.stringify(cacheName))
      .replace("'%%PRECACHE_ASSETS%%'", JSON.stringify(assetsList, null, 2));

    fs.writeFileSync(SW_OUT_FILEPATH, swContent);
    console.log(`wrote production ${SW_FILENAME} from template with embedded cache list\n`+
                `  cache name: ${cacheName}\n`+
                `  precache assets: ${assetsList.length} files`
    );
  } catch (err) {
    console.error(`failed to write ${SW_FILENAME} from template:`, err);
  }
}

