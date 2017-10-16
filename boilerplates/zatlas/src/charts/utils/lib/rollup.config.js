/**
* @Author: eason
* @Date:   2017-06-12T10:14:32+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-06-12T16:28:37+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import jsx from 'rollup-plugin-jsx';

export default {
  format: 'iife',
  moduleName: 'Databinding',
  plugins: [
    resolve({
      jsnext: true,
    }),
    jsx({ factory: 'React.createElement' }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
        screw_ie8: false,
      },
      mangle: {
        screw_ie8: false,
      },
      output: {
        screw_ie8: false,
      },
    }),
    babel({
      exclude: 'node_modules/**',
      presets: [
        ['env', { modules: false }],
      ],
      plugins: [
        'add-module-exports',
        'transform-class-properties',
        'transform-object-rest-spread',
      ],
    }),
  ],
};
