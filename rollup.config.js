import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import sourcemaps from 'rollup-plugin-sourcemaps'
import { terser } from 'rollup-plugin-terser'
import json from "rollup-plugin-json"
import pkg from './package.json'
import typescript from 'rollup-plugin-typescript2';


const CJS_DEV = 'CJS_DEV'
const CJS_PROD = 'CJS_PROD'
const ES = 'ES'
const UMD_DEV = 'UMD_DEV'
const UMD_PROD = 'UMD_PROD'

const input = './compiled/index.js'
const exports = 'named'

const getExternal = (bundleType) => {
    const peerDependencies = Object.keys(pkg.peerDependencies)
    const dependencies = Object.keys(pkg.dependencies)

    // Hat-tip: https://github.com/rollup/rollup-plugin-babel/issues/148#issuecomment-399696316.
    const makeExternalPredicate = (externals) => {
        if (externals.length === 0) {
            return () => false
        }
        const pattern = new RegExp(`^(${externals.join('|')})($|/)`)
        return (id) => pattern.test(id)
    }

    switch (bundleType) {
        case CJS_DEV:
        case CJS_PROD:
        case ES:
            return makeExternalPredicate([...peerDependencies, ...dependencies])
        case UMD_DEV:
            return makeExternalPredicate([...peerDependencies, 'prop-types'])
        default:
            return makeExternalPredicate(peerDependencies)
    }
}

const isProduction = (bundleType) =>
    bundleType === CJS_PROD || bundleType === UMD_PROD

const getBabelConfig = (bundleType) => {
    const options = {
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [['@babel/env', { loose: true, modules: false }]],
        plugins: ['@babel/transform-runtime'],
        runtimeHelpers: true,
    }

    switch (bundleType) {
        case ES:
            return {
                ...options,
                plugins: [
                    ...options.plugins,
                ],
            }
        case UMD_PROD:
        case CJS_PROD:
            return {
                ...options,
                plugins: [
                    ...options.plugins,
                ],
            }
        default:
            return options
    }
}

const getPlugins = (bundleType) => [
    typescript({
        typescript: require('typescript'),
        tsconfigDefaults: { compilerOptions: { declaration: true } },
        tsconfig: "tsconfig.json",
        tsconfigOverride: { compilerOptions: { declaration: false } }
    }),
    nodeResolve(),
    commonjs({
        include: 'node_modules/**',
        namedExports: {
            'node_modules/prop-types/index.js': [
                'bool',
                'func',
                'object',
                'oneOf',
                'string',
            ],
        },
    }),
    babel(getBabelConfig(bundleType)),
    replace({
        'process.env.NODE_ENV': JSON.stringify(
            isProduction(bundleType) ? 'production' : 'development'
        ),
    }),
    sourcemaps(),
    json(),
    isProduction(bundleType) &&
    terser({
        output: { comments: false },
        compress: {
            keep_infinity: true, // eslint-disable-line @typescript-eslint/camelcase
            pure_getters: true, // eslint-disable-line @typescript-eslint/camelcase
        },
        warnings: true,
        ecma: 5,
        toplevel: false,
    }),
]

const getCjsConfig = (bundleType) => ({
    input,
    external: getExternal(bundleType),
    output: {
        exports,
        file: `dist/vbus-access.cjs.${
            isProduction(bundleType) ? 'production' : 'development'
        }.js`,
        format: 'cjs',
    },
    plugins: getPlugins(bundleType),
})

const getEsConfig = () => ({
    input,
    external: getExternal(ES),
    output: {
        exports,
        file: pkg.module,
        format: 'es',
    },
    plugins: getPlugins(ES),
})

const getUmdConfig = (bundleType) => ({
    input,
    external: getExternal(bundleType),
    output: {
        exports,
        file: `dist/vbus-access.umd.${
            isProduction(bundleType) ? 'production' : 'development'
        }.js`,
        format: 'umd',
        globals: {
            ...(isProduction(bundleType) ? {} : { 'prop-types': 'PropTypes' }),
            'react-dom': 'ReactDOM',
            react: 'React',
        },
        name: 'NProgress',
    },
    plugins: getPlugins(bundleType),
})

export default [
    getCjsConfig(CJS_DEV),
    getCjsConfig(CJS_PROD),
    getEsConfig(),
    getUmdConfig(UMD_DEV),
    getUmdConfig(UMD_PROD),
]
