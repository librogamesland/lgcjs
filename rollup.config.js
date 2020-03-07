import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import toml from 'rollup-plugin-toml';
import livereload from 'rollup-plugin-livereload';
import globImport from 'rollup-plugin-glob-import'// Resolve glob inside imports
import serve from 'rollup-plugin-serve'
import { terser } from 'rollup-plugin-terser';
import { string } from "rollup-plugin-string";



const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'app',
		file: 'dist/build/bundle.js'
	},
  watch: { clearScreen: true },
	plugins: [
    toml,
    // Risolve gli import da cartella
    globImport({format: 'default'}),
    // Importa i file html come stringhe
    string({ include: ["**/*.htm", "**/*.xlgc"]}),
    // Compila i file svelte
		svelte({	dev: !production,		css: css => {	css.write('dist/build/bundle.css') }}),
    // Risolve gli import globali
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		commonjs(),
    // Minifica i js
    production && terser(),       // Minify only on production
    // Apre un server alla porta :10015 + livereload
    !production && serve({         // Open browser on watch
      open: true,
      contentBase: '../',
      openPage: '/lgcjs/dist/index.html',
      host: 'localhost',
      port: 10015,
    }),
    !production && livereload(),  // Livereload on watch
	],
};
