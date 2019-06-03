import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const buildDevelopment = {
  input: './src/index.ts'
, output: {
    file: './dst/index.js'
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
  , commonjs()
  , typescript({
      abortOnError: false
    , cacheRoot: '.cache'
    })
  , buble()
  ]
};

const buildProduction = {
  input: './src/index.ts'
, output: [{
    file: './dst/index.min.js'
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
    return buildDevelopment;
  } else if (args.configServe === true) {
    // NOTE:
    // The import of rollup-plugin-serve makes
    // rollup never stopping :'(
    const s = 'rollup-plugin-serve';
    import(s).then((serve) => {
      buildDevelopment.plugins.push(
        serve({
          contentBase: ['src', 'dst']
        , historyApiFallback: [
            { from: /.*/, to: 'index.html' }
          ]
        , host: 'localhost'
        , port: 3000
        })
      );
    });
    return buildDevelopment;
  }
  return buildProduction;
};
