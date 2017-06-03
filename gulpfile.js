/*************************************************************************
 * Name          : gulpfile.js                                           *
 * Purpose       : Instruction set for GulpJS automation toolkit         *
 * Author        : Abu Md. Maruf Sarker                                  *
 * Copyright (c) : 2016-Present, Abu Md. Maruf Sarker                    *
 * Website       : https://marufsarker.github.io                         *
 * License       : MIT License (https://opensource.org/licenses/MIT)     *
 *************************************************************************/

/**
 * Imported Modules
 */
const browserSync = require('browser-sync')
const childProcess = require('child_process')
const gulp = require('gulp')
const gulpAutoPrefixer = require('gulp-autoprefixer')
const gulpCleanCSS = require('gulp-clean-css')
const gulpConcat = require('gulp-concat')
const gulpRename = require('gulp-rename')
const gulpStandard = require('gulp-standard')
const gulpUglify = require('gulp-uglify')
const gulpUtil = require('gulp-util')
const lazypipe = require('lazypipe')
const path = require('path')
const del = require('del')

/**
 * colors utility from gulp-util
 */
const colors = gulpUtil.colors

/**
 * Local Directory/File(s)'s Relative Path(s)
 */

const siteRoot = './_site'
const budleDistPath = './_includes/bundle/'
const siteJSFilesAssetsDir = '/_assets/scripts/'

let cssFiles = {
  'css-highlighter': './_assets/web-stylesheets/pygments-highlighter/highlighter.css',
  'css-main': './_assets/stylesheets/styles.css',
  'css-normalize': './_assets/web-stylesheets/normalize.css/normalize.css'
}

let jsFiles = {
  'js-blog_posts_search': './_assets/scripts/blog_posts_search.js',
  'js-lunr': './node_modules/lunr/lunr.min.js',
  'js-main': './_assets/scripts/scripts.js'
}

let cleanDirFiles = [
  './_includes/bundle/**/*',
  './_site/**/*',
  './npm-debug.log'
]

const gulpWatchGlob = [
  './404.*',
  './_assets/**/*',
  './_includes/html/**/*',
  './_layouts/**/*',
  './_posts/**/*',
  './assets/**/*',
  './blog/**/*',
  './contact/**/*',
  './humans.*',
  './index.*',
  './robots.*'
]

/**
 * Configurations for modules
 */

const autoPrefixerConfigs = {
  'add': true,
  'browsers': ['last 5 versions', '> 1%'],
  'cascade': true,
  'flexbox': true,
  'grid': true,
  'remove': true
}

const uglifyJSConfigs = {
  'mangle': true,
  'preserveComments': 'license'
}

const gulpStandardReporterConfigs = {
  'breakOnError': false,
  'quiet': false
}

/**
 * logStart
 * @param  {String} title title of the task
 * @return {void}         logs out provided task's title
 */
const logStart = (title = '') => {
  console.log(
    colors.bgWhite(colors.black('GULP TASK') + colors.blue(' : ') +
    colors.green('PROCESS ' + title)) + colors.reset('')
  )
}

/**
 * gulpTaskLazypiped
 * @param  {Function} fn  working function of a module
 * @param  {Object}   arg required arguments for the module function
 * @return {Stream}       returns GulpJS stream
 */
const gulpTaskLazypiped = (fn, arg = {}) => {
  return lazypipe().pipe(fn, arg)()
}

/**
 * GulpJS task(s) to process CSS file(s)
 * returns GulpJS task(s), where -
 *   - takes cssFiles as source file(s)
 *   - concat/merge the file(s) into one CSS file defined in bundleName using gulp-concat
 *   - prefixes the CSS file considering configurations defined in autoPrefixerConfigs using gulp-autoprefixer
 *   - minify the CSS file using gulp-clean-css
 *   - rename the CSS file using gulp-rename considering defined name in bundleName
 *   - places the processed/generated file into budleDistPath directory
 */
let gulpCSSTasks = Object.keys(cssFiles)
gulpCSSTasks.map((key) => {
  gulp.task(key, () => {
    logStart(key)
    let bundleName = key + '.css'
    return gulp.src(cssFiles[key])
      .pipe(gulpTaskLazypiped(gulpConcat, bundleName))
      .pipe(gulpTaskLazypiped(gulpAutoPrefixer, autoPrefixerConfigs))
      .pipe(gulpTaskLazypiped(gulpCleanCSS))
      .pipe(gulpTaskLazypiped(gulpRename, bundleName))
      .pipe(gulp.dest(budleDistPath))
  })
})

/**
 * GulpJS task(s) to process JavaScript file(s)
 * returns GulpJS task(s), where -
 *   - takes jsFiles as source file(s)
 *   - concat/merge the file(s) into one JavaScript file defined in bundleName using gulp-concat
 *   - if site's own script(s)
 *     - lints the script using gulp-standard
 *     - minifies the script using gulp-uglify
 *   - rename the JavaScript file using gulp-rename considering defined name in bundleName
 *   - places the processed/generated file into budleDistPath directory
 */
let gulpJSTasks = Object.keys(jsFiles)
gulpJSTasks.map((key) => {
  gulp.task(key, () => {
    logStart(key)
    let bundleName = key + '.js'
    let siteScriptsRX = new RegExp(siteJSFilesAssetsDir, 'gi')
    let matchSiteScriptsRX = jsFiles[key].match(siteScriptsRX)
    let matchedSiteScript = false
    if (matchSiteScriptsRX != null && matchSiteScriptsRX.length > 0) {
      matchedSiteScript = true
    }
    let tempGulpTask = gulp.src(jsFiles[key])
                      .pipe(gulpTaskLazypiped(gulpConcat, bundleName))
    if (matchedSiteScript === true) {
      tempGulpTask = tempGulpTask.pipe(gulpStandard())
        .pipe(gulpStandard.reporter('default', gulpStandardReporterConfigs))
        .pipe(gulpTaskLazypiped(gulpUglify, uglifyJSConfigs))
    }
    return tempGulpTask
      .pipe(gulpTaskLazypiped(gulpRename, bundleName))
      .pipe(gulp.dest(budleDistPath))
  })
})

/**
 * gulp-build
 * GulpJS task to process other GulpJS task(s) in one call/command
 */
let gulpBuildTasks = gulpCSSTasks.concat(gulpJSTasks)
gulp.task('gulp-build', gulpBuildTasks)

/**
 * jekyll-build
 * GulpJS task to process JekyllRB build process
 * - processes gulp-build GulpJS task before proceeding
 * - executes Jekyll build command utilizing child_process
 * - logs out outputs utilizing gulp-util's log module
 */
gulp.task('jekyll-build', ['gulp-build'], () => {
  logStart('jekyll-build')
  const jekyllCommandProd = 'bundle exec jekyll build --config=_config.yml'
  const jekyllCommandDev = 'bundle exec jekyll build --config=_config.yml,_config_dev.yml'
  // if (process.env.NODE_ENV) {
  //   process.env.JEKYLL_ENV = process.env.NODE_ENV
  // }
  let execCMD = (process.env.NODE_ENV === 'development') ? jekyllCommandDev : jekyllCommandProd
  let jekyllBuild = childProcess.exec(execCMD)
  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gulpUtil.log('Jekyll: ' + message))
  }
  jekyllBuild.stdout.on('data', jekyllLogger)
  jekyllBuild.stderr.on('data', jekyllLogger)
})

/**
 * serve
 * GulpJS task to serve files using HTTP protocol
 * - uses browser-sync to create local HTTP server
 * - serves local files to browser using browser-sync while keeping changes in-sync from location defined in siteRoot
 * - watches file changes in locations defined in gulpWatchGlob using GulpJS's watch module
 * - runs jekyll-build GulpJS task if change(s) occur(s)
 */
gulp.task('serve', ['jekyll-build'], () => {
  logStart('serve')
  browserSync.create().init({
    files: [path.join(siteRoot, '/**')],
    port: 4000,
    server: {
      baseDir: siteRoot
    },
    logFileChanges: false
  })
  gulp.watch(gulpWatchGlob, ['jekyll-build'])
})

/**
 * clean
 * GulpJS task to clean generated bundle files
 * - uses del to remove file(s) defined in cleanDirFiles
 */
gulp.task('clean', () => {
  return del(cleanDirFiles).then(paths => {
    console.log(
      colors.bgRed(colors.white('Removed Directories and Files:')) + '\n' +
      colors.yellow(paths.join('\n'))
    )
  })
})

/**
 * default
 * GulpJS default task
 * - runs by the command gulp
 * - processes the serve GulpJS task
 */
gulp.task('default', ['serve'])
