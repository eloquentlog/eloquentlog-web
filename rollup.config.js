import fs from 'fs';
import path from 'path';

import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

// NOTE:
// It seems that @rollup/pluginutils's createFilter returns inconsistent result
// for now. So we use an old plugin here to use rollup-pluginutils instead.
// import strip from '@rollup/plugin-strip';
import strip from 'rollup-plugin-strip';

import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import stylus from 'rollup-plugin-stylus-compiler';
import css from 'rollup-plugin-css-only';


const root = __dirname
    , src = path.join(root, 'src')
    , dst = path.join(root, 'dst')
    , mod = path.join(root, 'node_modules')
    ;

const debug = {
  input: path.join(src, 'index.ts')
, output: {
    file: path.join(dst, 'js', 'index.js')
  , format: 'iife'
  , sourcemap: true
  }
, external: ['http', 'https', 'url', 'stream', 'assert', 'zlib']
, plugins: [
    typescript({
      abortOnError: false
    , cacheRoot: '.cache'
    })
  , replace({
      preventAssignment: true
    , values: {
        'process.env.NODE_ENV': JSON.stringify('development')
      }
    })
  , resolve({
      browser: true
    , preferBuiltins: false
    , mainFields: ['dev:module', 'module', 'main', 'jsnext:main']
    , extensions: ['.js', '.json', '.ts']
    })
  , commonjs()
  , json()
  , stylus()
  , css({
			// https://github.com/thgh/rollup-plugin-css-only/issues/34
			output: function (data, _nodes) {
        const file = path.join(dst, 'css', 'index.css');
        fs.mkdir(path.dirname(file), {recursive: true}, (err) => {
          if (err) throw err;
          fs.writeFileSync(file, data);
        });
			}
    })
  , buble({
      objectAssign: 'Object.assign'
    , transforms: {
        asyncAwait: false
      , forOf: false
      }
    })
  , strip({
      debugger: false
    , functions: []
    , include: [
        path.join(src, '**/*.ts')
      , path.join(mod, '**/*.(ts|js)')
      ]
    , sourceMap: true
    })
  ]
};

const release = {
  input: path.join(src, 'index.ts')
, output: [{
    file: path.join(dst, 'js', 'index.min.js')
  , format: 'iife'
  , sourcemap: false
  }]
, external: ['http', 'https', 'url', 'stream', 'assert', 'zlib']
, plugins: [
    typescript({
      abortOnError: true
    , cacheRoot: '.cache'
    })
  , replace({
      preventAssignment: true
    , values: {
        'process.env.NODE_ENV': JSON.stringify('production')
      }
    })
  , resolve({
      browser: true
    , preferBuiltins: false
    , mainFields: ['module', 'main', 'jsnext:main']
    , extensions: ['.js', '.json', '.ts']
    })
  , commonjs()
  , json()
  , stylus()
  , css({
			output: function (data, _nodes) {
        const file = path.join(dst, 'css', 'index.min.css');
        fs.mkdir(path.dirname(file), {recursive: true}, (err) => {
          if (err) throw err;
          fs.writeFileSync(file, data);
        });
			}
    })
  , buble({
      objectAssign: 'Object.assign'
    , transforms: {
        asyncAwait: false
      , forOf: false
      }
    })
  , strip({
      debugger: true
    , functions: ['console.*', 'assert.*']
    , include: [
        path.join(src, '**/*.ts')
      , path.join(mod, '**/*.(js|ts)')
      ]
    , sourceMap: false
    })
  , terser()
  ]
};

export default (args) => {
  if (args.configBuildDebug) {
    return debug;
  } else if (args.configRunServer) {
    // NOTE:
    // The import of rollup-plugin-serve makes
    // rollup never stopping :'(
    const s = 'rollup-plugin-serve';
    import(s).then((serve) => {
      debug.plugins.push(
        serve.default({
          contentBase: ['dst']
        , historyApiFallback: [
            { from: /.*/, to: 'index.html' }
          ]
        , host: 'localhost'
        , port: 3000
        })
      );
    }).catch((e) => {
      console.log(e);
    });
    return debug;
  }
  return release;
};
