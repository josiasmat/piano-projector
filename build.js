import { argv, stderr } from 'node:process';
import * as esbuild from 'esbuild';
import fs, { readdirSync } from 'node:fs';
import { copyFile, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve, relative, basename, dirname, sep } from 'node:path';
import { stdout } from 'node:process';
import { minifyTemplates, writeFiles } from "esbuild-minify-templates";
import { sassPlugin } from 'esbuild-sass-plugin';
import posthtml from "posthtml";
import include from "posthtml-include";
import htmlnano from "htmlnano";
import { minify } from '@putout/minify';

const productionMode = ('--dev' !== (argv[2] || process.env.NODE_ENV));
const targetBrowsers = ['chrome130','firefox132'];

const BASE_PATH = resolve('.');

const SRC_PWA_PATH = resolve('.', 'pwa');
const PUB_PATH = resolve('.', 'pub');
const PUB_PWA_PATH = resolve(PUB_PATH, 'pwa');

const HTML_SRC_PATH = resolve(SRC_PWA_PATH, 'html');
const HTML_SRC_FILEPATH = resolve(HTML_SRC_PATH, 'main.html');
const HTML_OUT_FILEPATH = resolve(PUB_PWA_PATH, 'index.html');

const CSS_SRC_FILEPATH = resolve(SRC_PWA_PATH, 'css', 'main.css');
const CSS_OUT_FILENAME = 'bundle.css';
const CSS_OUT_FILEPATH = resolve(PUB_PWA_PATH, CSS_OUT_FILENAME);
const CSS_MAP_FILEPATH = resolve(PUB_PWA_PATH, CSS_OUT_FILENAME+'.map');

const JS_SRC_FILEPATH = resolve(SRC_PWA_PATH, 'js', 'main.js');
const JS_OUT_FILENAME = 'bundle.js';
const JS_OUT_FILEPATH = resolve(PUB_PWA_PATH, JS_OUT_FILENAME);
const JS_MAP_FILEPATH = resolve(PUB_PWA_PATH, JS_OUT_FILENAME+'.map');

const SW_FILENAME = 'sw.js';
const SW_TEMPLATE_FILE = resolve(SRC_PWA_PATH, `${SW_FILENAME}.template`);
const SW_OUT_FILEPATH = resolve(PUB_PWA_PATH, SW_FILENAME);

const ASSETS_DIRNAME = 'assets';
const ASSETS_SRC_PATH = resolve(SRC_PWA_PATH, ASSETS_DIRNAME);
const ASSETS_OUT_PATH = resolve(PUB_PWA_PATH, ASSETS_DIRNAME);

const I18N_DIRNAME = 'i18n';
const I18N_SRC_PATH = resolve(SRC_PWA_PATH, I18N_DIRNAME);
const I18N_OUT_PATH = resolve(PUB_PWA_PATH, I18N_DIRNAME);

const LANDING_PAGE_DIRNAME = 'landing';
const LANDING_PAGE_SRC_PATH = resolve(BASE_PATH, LANDING_PAGE_DIRNAME);
const LANDING_PAGE_OUT_PATH = PUB_PATH;

const COPY_LIST = [
  {src: LANDING_PAGE_SRC_PATH, dest: LANDING_PAGE_OUT_PATH, 
    exclude: ["index.html", "script.js", "style.css"]},
  {src: resolve(BASE_PATH, 'LICENSE.md'), dest: resolve(PUB_PATH, 'LICENSE.md')},
  {src: join(SRC_PWA_PATH, 'manifest.json'), dest: join(PUB_PWA_PATH, 'manifest.json')},
  {src: ASSETS_SRC_PATH, dest: ASSETS_OUT_PATH},
  {src: I18N_SRC_PATH, dest: I18N_OUT_PATH},
];

const LANDING_HTML_LIST = getIndexHtmlFiles(LANDING_PAGE_SRC_PATH).map(file => ({
  src: file, dest: join(LANDING_PAGE_OUT_PATH, relative(LANDING_PAGE_SRC_PATH, file))
}));

/** @type {esbuild.BuildOptions} */
const commonCssBuildOptions = {
    bundle: true,
    target: targetBrowsers,
    logLevel: productionMode ? 'error' : 'info',
    minify: productionMode,
    sourcemap: !productionMode,
    external: ['*.woff2']
};

/** @type {esbuild.BuildOptions} */
const pwaCssBuildOptions = {
  ...commonCssBuildOptions,
    entryPoints: [CSS_SRC_FILEPATH],
    outfile: CSS_OUT_FILEPATH,
    plugins: [sassPlugin({
      filter: /\.scss$/
    })],
    loader: {
      ".scss": "css",
    }
};

const landingPageCssBuildOptions = {
  ...commonCssBuildOptions,
  entryPoints: [join(LANDING_PAGE_SRC_PATH, "style.css")],
  outfile: join(LANDING_PAGE_OUT_PATH, "style.css")
};

/** JS bundle parameters @type {esbuild.BuildOptions} */
const commonJsBuildOptions = {
    format: 'esm',
    bundle: true,
    target: targetBrowsers,
    drop: productionMode ? ['debugger'] : [],
    pure: productionMode ? [
      'console.debug', 
      'console.info', 
      'console.assert'
    ] : [],
    logLevel: productionMode ? 'error' : 'info',
    minify: productionMode,
    sourcemap: !productionMode
};

const pwaJsBuildOptions = {
    ...commonJsBuildOptions,
    entryPoints: [JS_SRC_FILEPATH],
    outfile: JS_OUT_FILEPATH,
    plugins: [
      minifyTemplates({ taggedOnly: true }), 
      writeFiles()
    ],
    write: false
};

const landingPageJsBuildOptions = {
  ...commonJsBuildOptions,
  entryPoints: [join(LANDING_PAGE_SRC_PATH, "script.js")],
  outfile: join(LANDING_PAGE_OUT_PATH, "script.js")
};


// define assets to precache
const PRECACHE = {
  root: PUB_PWA_PATH,
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
    'orbitron-license.txt'
  ]
}


// Begin build

console.log(`Starting ${ productionMode ? 'PRODUCTION' : 'DEVELOPMENT' } build:\n`);

createDirectory(PUB_PATH) || emptyDir(PUB_PATH);
createDirectory(PUB_PWA_PATH);
await copyFilesAndDirs(COPY_LIST);


if ( productionMode ) {

  // Production build:
  // generates a service worker to cache files for offline usage

  // deleteSourceMaps();
  await buildHtml(HTML_SRC_FILEPATH, HTML_OUT_FILEPATH, true);
  for ( const {src,dest} of LANDING_HTML_LIST ) await buildHtml(src, dest, true);
  await bundleCssAndJs([
    pwaCssBuildOptions, 
    pwaJsBuildOptions,
    landingPageCssBuildOptions,
    landingPageJsBuildOptions
  ]);
  const precacheAssets = buildPrecacheAssetsList(PRECACHE);
  const hash = computeHexHash([SW_TEMPLATE_FILE, ...precacheAssets]);
  const cacheName = 'pp-' + hash.slice(0, 16);
  generateServiceWorker(SW_TEMPLATE_FILE, cacheName, precacheAssets);
  console.log("\nFinished production build.");

} else {

  // Development build:
  // builds and watches for changes while running a HTTP server

  deleteServiceWorker();

  await buildHtml(HTML_SRC_FILEPATH, HTML_OUT_FILEPATH, false);
  for ( const {src,dest} of LANDING_HTML_LIST ) await buildHtml(src, dest, false);

  watchForHtmlChanges(HTML_SRC_PATH, HTML_SRC_FILEPATH, HTML_OUT_FILEPATH);
  LANDING_HTML_LIST.forEach(({src,dest}) => watchForHtmlChanges(src, src, dest));
  
  const builds = await Promise.all([
    esbuild.context(pwaCssBuildOptions),
    esbuild.context(pwaJsBuildOptions),
    esbuild.context(landingPageCssBuildOptions),
    esbuild.context(landingPageJsBuildOptions)
  ]);
  
  for ( const build of builds ) await build.watch();

  watchForFileChanges(COPY_LIST);

  await builds[0].serve({
    servedir: PUB_PATH
  });

}


/** Removes existing source maps (used only for development). */
function deleteSourceMaps() {
  stdout.write("Deleting existing map files...");
  for ( const mapfile of [CSS_MAP_FILEPATH, JS_MAP_FILEPATH] ) {
    try { 
      fs.unlinkSync(mapfile); 
    } catch {}
  }
  stdout.write(" done.\n");
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
    return true;
  } catch (e) {
    if ( e.code == 'EEXIST' ) {
      console.log(`Directory "${relative(BASE_PATH, dir)}" already exists.`);
      return false;
    }
    throw e;
  }
}


/** 
 * Copies files. 
 * @param {object[]} files
 * @param {string} files[].src
 * @param {string} files[].dest
 * @param {string} [filter]
 */
async function copyFilesAndDirs(files, filter = null) {
  console.log("\nCopying files/directories...");
  let filecount = 0;
  let errorcount = 0;
  await Promise.allSettled(
    files.map(({src, dest, exclude}) => {
      if ( isDir(src) ) {
        return cp(src, dest, {
          recursive: true,
          preserveTimestamps: true,
          filter: (sf, df) => { 
            const isFile = !isDir(sf);
            const result = !isExcluded(sf, exclude) && ( !(filter) || !isFile || df.endsWith(filter) );
            if ( result && isFile ) {
              console.log(`  copying file "${basename(sf)}" to "${relative(BASE_PATH, dirname(df))+sep}"`);
              filecount++;
            }
            return result;
          }
        }).catch((e) => {
          console.error(`  error when copying dir "${relative(BASE_PATH, src)}": ${e}`);
          errorcount++;
        });
      } else {
        if ( !isExcluded(src, exclude) && ( !(filter) || dest.endsWith(filter) ) ) {
          console.log(`  copying file "${basename(src)}" to "${relative(BASE_PATH, dirname(dest))+sep}"`);
          filecount++;
          return copyFile(src, dest).catch((e) => {
            console.error(`  error when copying file "${relative(BASE_PATH, src)}": ${e}`);
            errorcount++;
        });
        } else return null;
    }})
  );
  if ( filecount > 0 )
    console.log(( errorcount )
      ? `finished copy of ${filecount-errorcount} file(s) with ${errorcount} error(s).\n` 
      : `finished copy of ${filecount} file(s) without errors.\n`
    );
}


/** Builds CSS and JS files. */
async function bundleCssAndJs(options_array) {
  stdout.write("Bundling CSS and JS files...");

  const builder = (async (options) => {
    const ctx = await esbuild.context(options);
    const result = await ctx.rebuild();
    ctx.dispose();
    return result;
  }); 

  const results = await Promise.all(
    options_array.map(options => builder(options))
  );

  if ( results.reduce((sum,r) => sum + r.errors.length), 0) {
    stdout.write(" done with errors.\n");
    results.forEach(r => stderr.write(r.errors.toString() + '\n'));
    return false;
  } else {
    stdout.write(" done without errors.\n");
    return true;
  }
}


/** 
 * Builds the precache assets list. 
 * @param {object} obj
 * @param {string} obj.root
 * @param {string[]} obj.folders
 * @param {string[]} obj.include
 * @param {string[]} obj.exclude
 */
function buildPrecacheAssetsList(obj) {

  const collectAssets = (dir, basePrefix) => {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
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

  stdout.write("Collecting assets for precache...");

  // Initialize precache assets list
  const assets = [...obj.include];

  // Collect all assets from folders listed in precache.folders
  for (const folder of obj.folders) {
    const folderPath = resolve(obj.root, folder);
    const relativeFolder = folder.endsWith('/') ? folder : folder + '/';
    const allAssets = collectAssets(folderPath, relativeFolder).sort();
    
    // Filter out excluded assets
    const filteredAssets = allAssets.filter(asset => !obj.exclude.includes(asset));
    assets.push(...filteredAssets);
  }

  stdout.write(` done: collected ${assets.length} assets.\n`);

  return assets;
}


/** 
 * Computes hash of multiple files. 
 * @param {string[]} files
 */
function computeHexHash(files) {

  let successCount = 0;
  let errors = [];
 
  const computeFileHash = (path) => {
    try {
      const content = fs.readFileSync(path);
      hash.update(content);
      successCount++;

    } catch (e) {
      errors.push(`  "${relative(BASE_PATH, path)}": ${e}`);
    }
  }

  stdout.write("Computing hash for asset files...");
  const hash = createHash('md5');

  for (const asset of files) {
    if (asset === './') { continue; }
    const assetPath = resolve(PUB_PWA_PATH, asset);
    computeFileHash(assetPath);
  }

  if ( !errors.length ) {
    stdout.write(` done: ${successCount} file(s) read.\n`);
  } else {
    stdout.write(` done: ${successCount} file(s) read, ${errors.length} error(s):\n`);
    errors.forEach(e => stderr.write(e + '\n'));
  }

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
    stdout.write("Generating service worker file...");
    const template = fs.readFileSync(templateFile, 'utf8');
    const swContent = template
      .replace("'%%CACHE_NAME%%'", JSON.stringify(cacheName))
      .replace("'%%PRECACHE_ASSETS%%'", JSON.stringify(assetsList, null, 2));

    const swMinified = minify(swContent);
    fs.writeFileSync(SW_OUT_FILEPATH, swMinified);
    stdout.write(` done: cache name is "${cacheName}."\n`);
  } catch (e) {
    stdout.write('\n');
    stderr.write(` error: ${e}\n`);
  }
}


function isDir(path) {
  return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
}


function watchForFileChanges(copy_list) {
  const debounceMap = new Map();
  const DEBOUNCE_MS = 200;

  COPY_LIST.forEach(({src}) => 
    fs.watch(
      src, 
      {recursive: true}, 
      (type, filename) => {
        if ( !filename ) return;
        clearTimeout(debounceMap.get(filename));
        debounceMap.set(
          filename,
          setTimeout(() => {
            stdout.write("[Change detected] ");
            copyFilesAndDirs(copy_list, filename);
            debounceMap.delete(filename);
          }, DEBOUNCE_MS)
        );
      } 
    )
  );
}


function watchForHtmlChanges(watched, src, dest) {
  const DEBOUNCE_MS = 200;
  let timeout = null;
  console.log(`Watching for changes in "${relative(BASE_PATH, watched)}"...`);

  fs.watch(
    watched,
    { recursive: isDir(watched) },
    (type, filename) => {
      if ( !filename.endsWith(".html") && !filename.endsWith(".htm") ) return;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        stdout.write("[Change detected] ");
        buildHtml(src, dest, false);
      }, DEBOUNCE_MS);
    }
  );
  
}

/** 
 * @param {string} src
 * @param {string} dest
 * @param {boolean} minify 
 */
async function buildHtml(src, dest, minify = true) {
  stdout.write(`Building HTML file "${relative(BASE_PATH, dest)}"...`);

  const htmlnanoOptions = {
    collapseWhitespace: 'conservative',
    minifyCss: false,
    minifyHtmlTemplate: true,
    minifyConditionalComments: true,
    minifyJs: true,
    minifyJson: false,
    minifyAttributes: false,
    minifySvg: false,
    removeComments: true,
    removeEmptyAttributes: false
  };

  const posthtmlIncludeOptions = {
    root: dirname(src)
  };

  const html = fs.readFileSync(src, "utf8");
  const combined = await posthtml([include(posthtmlIncludeOptions)]).process(html);
  if ( minify ) {
    const pre_minified = combined.html.replace(/\s+/g, ' ').trim();
    const minified = await htmlnano.process(pre_minified, htmlnanoOptions);
    fs.writeFileSync(dest, minified.html);
  } else {
    fs.writeFileSync(dest, combined.html);
  }

  stdout.write(` done.\n`);
}


/** @param {string} path */
function emptyDir(path, first=true) {
  try {
    if ( first ) stdout.write(`Emptying directory "${relative(BASE_PATH, path)}"...`);
    const files = fs.readdirSync(path);
    for ( const file of files ) {
      const filePath = resolve(path, file);
      if ( isDir(filePath) ) {
        emptyDir(filePath, false);
        fs.rmdirSync(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    }
    if ( first ) stdout.write(` done.\n`);
  } catch (e) {
    stdout.write(` error: "${e}"\n`);
    if ( e.code !== 'ENOENT' )
      throw e;
  }
}


/** @param {string} path @param {string[]} exclude_list */
function isExcluded(path, exclude_list) {
  if ( !exclude_list ) return false;
  for ( const exclude of exclude_list ) {
    if ( path.includes(exclude) )
      return true;
  }
  return false;
}


/**
 * @param {string} path 
 * @returns {string[]}
 */
function getIndexHtmlFiles(path) {
  const result = [];
  for ( const child of readdirSync(LANDING_PAGE_SRC_PATH) ) {
    const childPath = join(path, child);
    if ( isDir(childPath) )
      result.push(...getIndexHtmlFiles(childPath));
    else
      if ( child === "index.html" || child === "index.html" )
        result.push(childPath);
  }
  return result;
}
