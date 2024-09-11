import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import babel from '@rollup/plugin-babel';
import css from 'rollup-plugin-css-only';
import builtins from 'rollup-plugin-node-builtins';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';

const production = !process.env.ROLLUP_WATCH;

const main = {
    input: 'src/index.js',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'public/build/bundle.js',
        intro: 'var global = typeof self !== undefined ? self : this;',
        inlineDynamicImports: true
    },
    plugins: [

        json(),
        image(),

        // we'll extract any component CSS out into
        // a separate file - better for performance
        css({ output: 'bundle.css' }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.NODE_UNIQUE_ID': JSON.stringify(false),
            preventAssignment: true
        }),

        builtins(),

        babel({
            presets: ['@babel/preset-react'],
            babelHelpers: 'bundled',
            compact: false
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration —
        // consult the documentation for details:
        // https://github.com/rollup/rollup-plugin-commonjs
        resolve({
            browser: true,
            extensions: ['.js', '.jsx']
        }),

        commonjs({
            include: 'node_modules/**'
        }),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload('public'),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser()

    ],
    watch: {
        clearScreen: false
    }
};

export default [main];
