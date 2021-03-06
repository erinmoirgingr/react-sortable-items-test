'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var babel = require('gulp-babel');
var webpack = require('webpack-stream');
var realWebpack = require('webpack');
var path = require('path');
var del = require('del');
var extend = require('extend');

var commonConf = function(additions) {
  return extend(true, {
    context: __dirname,
    resolve: {
      extensions: ['', '.js']
    },
    module: {
      loaders: [
        { test: /\.jsx$/, loader: 'babel?presets[]=react,presets[]=es2015' }
      ]
    },
    externals: {
      'react': "React"
    },
    plugins: []
  }, additions)
};

gulp.task('build:browser', function() {
  gulp.src('src/Sortable.jsx')
    .pipe(webpack(commonConf({
      output: {
        filename: 'Sortable.js',
        library: "Sortable",
        libraryTarget: "var"
      }
    })))
    .pipe(gulp.dest('dist'));
  gulp.src('src/Sortable.jsx')
    .pipe(webpack(commonConf({
      output: {
        filename: 'Sortable.min.js',
        library: "Sortable",
        libraryTarget: "var"
      },
      plugins: [
        new realWebpack.DefinePlugin({
              "process.env": {
                "NODE_ENV": JSON.stringify('production')
              }
            }),
        new realWebpack.optimize.DedupePlugin(),
        new realWebpack.optimize.UglifyJsPlugin()
      ]
    })))
    .pipe(gulp.dest('dist'));
  gulp.src('src/SortableItemMixin.jsx')
      .pipe(webpack(commonConf({
        output: {
          filename: 'SortableItemMixin.js',
          library: "SortableItemMixin",
          libraryTarget: "var"
        }
      })))
      .pipe(gulp.dest('dist'));
  gulp.src('src/SortableItemMixin.jsx')
    .pipe(webpack(commonConf({
      output: {
        filename: 'SortableItemMixin.min.js',
        library: "SortableItemMixin",
        libraryTarget: "var"
      },
      plugins: [
        new realWebpack.DefinePlugin({
              "process.env": {
                "NODE_ENV": JSON.stringify('production')
              }
            }),
        new realWebpack.optimize.DedupePlugin(),
        new realWebpack.optimize.UglifyJsPlugin()
      ]
    })))
    .pipe(gulp.dest('dist'));

    gulp.src('src/SortableItem.jsx')
        .pipe(webpack(commonConf({
          output: {
            filename: 'SortableItem.js',
            library: "SortableItem",
            libraryTarget: "var"
          }
        })))
        .pipe(gulp.dest('dist'));

    gulp.src('src/SortableItem.jsx')
      .pipe(webpack(commonConf({
        output: {
          filename: 'SortableItem.min.js',
          library: "SortableItem",
          libraryTarget: "var"
        },
        plugins: [
          new realWebpack.DefinePlugin({
                "process.env": {
                  "NODE_ENV": JSON.stringify('production')
                }
              }),
          new realWebpack.optimize.DedupePlugin(),
          new realWebpack.optimize.UglifyJsPlugin()
        ]
      })))
      .pipe(gulp.dest('dist'));
});

gulp.task('build:node', function() {
  gulp.src('src/Sortable.jsx')
    .pipe(babel({
        presets: ['react']
    }))
    .pipe(rename('Sortable.js'))
    .pipe(gulp.dest(''));

  gulp.src('src/SortableItemMixin.jsx')
    .pipe(babel({
        presets: ['react']
    }))
    .pipe(rename('SortableItemMixin.js'))
    .pipe(gulp.dest(''));

  gulp.src('src/SortableItem.jsx')
    .pipe(babel({
      presets: ['es2015', 'react']
    }))
    .pipe(rename('SortableItem.js'))
    .pipe(gulp.dest(''));
});

gulp.task('build', ['build:node', 'build:browser']);

gulp.task('clean', function(cb) {
  del(['dist', 'Sortable.js', 'SortableItemMixin.js'], cb);
});

gulp.task('default', ['build']);
