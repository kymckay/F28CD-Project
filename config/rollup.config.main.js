import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: './public/src/main.js',
    output: {
        file: './public/dist/main.js',
        format: 'iife',
        name: 'main'
    },
    plugins: [
        resolve(),
        commonjs(),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**'
        })
    ]
}
