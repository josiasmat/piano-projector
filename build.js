import { argv } from 'node:process';
import * as esbuild from 'esbuild';
import { unlinkSync } from 'node:fs';

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
    outfile: 'pwa/bundle.css'
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

  for ( const mapfile of ['pwa/bundle.css.map', 'pwa/bundle.js.map'] ) {
    try { 
      unlinkSync(mapfile); 
      console.log(`deleted ${mapfile}`);
    } catch {}
  }

  // single production build
  await buildCSS.rebuild();
  buildCSS.dispose();

  await buildJS.rebuild();
  buildJS.dispose();

} else {

  // watch for file changes
  await buildCSS.watch();
  await buildJS.watch();

  // development server
  await buildCSS.serve({
    servedir: '.'
  });

}
