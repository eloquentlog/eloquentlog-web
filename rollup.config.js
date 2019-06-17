import path from 'path';

import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-only';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import stylus from 'rollup-plugin-stylus-compiler';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const root = __dirname
    , src = path.join(root, 'src')
    , dst = path.join(root, 'dst')
    ;

const development = {
  input: path.join(src, 'index.ts')
, output: {
    file: path.join(dst, 'index.js')
  , format: 'iife'
  , sourcemap: true
  }
, plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  , json()
  , resolve({
      browser: true
    , preferBuiltins: false
    , mainFields: ['dev:module', 'module', 'main', 'jsnext:main']
    , extensions: ['.js', '.json', '.ts']
    })
  , stylus()
  , css()
  , commonjs()
  , typescript({
      abortOnError: false
    , cacheRoot: '.cache'
    })
  , buble()
  ]
};

const production = {
  input: path.join(src, 'index.ts')
, output: [{
    file: path.join(dst, 'index.min.js')
  , format: 'iife'
  , sourcemap: false
  }]
, plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  , json()
  , resolve({
      browser: true
    , preferBuiltins: false
    , mainFields: ['module', 'main', 'jsnext:main']
    , extensions: ['.js', '.json', '.ts']
    })
  , stylus()
  , css()
  , commonjs()
  , typescript({
      abortOnError: true
    , cacheRoot: '.cache'
    })
  , buble()
  , terser()
  ]
};

export default (args) => {
  if (args.configBuildDevelopment === true) {
    return development;
  } else if (args.configServe === true) {
    // NOTE:
    // The import of rollup-plugin-serve makes
    // rollup never stopping :'(
    const s = 'rollup-plugin-serve';
    import(s).then((serve) => {
      development.plugins.push(
        serve({
          contentBase: ['dst']
        , historyApiFallback: [
            { from: /.*/, to: 'index.html' }
          ]
        , host: 'localhost'
        , port: 3000
        })
      );
    });
    return development;
  }
  return production;
};
