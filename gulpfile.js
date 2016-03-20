'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const insert = require('gulp-insert');
const zip = require('gulp-zip');
const del = require('del');
const install = require('gulp-install');
const runSequence = require('run-sequence');
const awsLambda = require('node-aws-lambda');

gulp.task('babel', () =>
	  gulp.src('src/**/*.js')
	  .pipe(sourcemaps.init())
	  .pipe(insert.append('\nimport \'source-map-support/register\''))
	  .pipe(babel({
	    presets: ['es2015', 'stage-0'],
	    plugins: ['transform-runtime']
	  }))
	  .pipe(sourcemaps.write('.'))
	  .pipe(gulp.dest('lib'))
	 );

gulp.task('clean', () => del(['dist', 'dist.zip', 'lib']))

gulp.task('modules', () =>
	  gulp.src('package.json')
	  .pipe(gulp.dest('dist'))
	  .pipe(install({ production: true }))
	 );

gulp.task('js', () =>
	  gulp.src('lib/**/*')
	  .pipe(gulp.dest('dist'))
	 );

gulp.task('zip', () =>
	  gulp.src(['dist/**/*', '!dist/package.json'])
	  .pipe(zip('dist.zip'))
	  .pipe(gulp.dest('.'))
	 );

gulp.task('upload', callback => awsLambda.deploy('dist.zip', require('./lambda-config.js'), callback));

gulp.task('deploy', callback => runSequence(['clean'], ['babel'], ['js', 'modules'], ['zip'], ['upload'], callback));
