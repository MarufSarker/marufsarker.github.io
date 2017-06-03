---
author: "Maruf Sarker"
categories: ["WebDev"]
description: "Webpack is a module bundler with potential of replacing other task runners, which minimizes the development workload while keeping the configuration process as simple as possible."
keywords: "webpack,configuration,javascript,js,nodejs,npm,module,bundler"
layout: post
tagline: "Webpack is a module bundler with potential of replacing other task runners, which minimizes the development workload while keeping the configuration process as simple as possible."
tags: ["webpack", "nodejs", "javascript"]
thumbnail: "/assets/posts/2016-04-10-introduction-about-webpack-configuration/what-is-webpack.png"
title:  "An Introduction about Webpack Configuration"
---

<figure class="amms-gb-img-figure-centered">
	<figcaption>Webpack's Working Principle</figcaption>
	<img src="/assets/posts/2016-04-10-introduction-about-webpack-configuration/what-is-webpack.png" alt="Webpack's Working Principle" title="Webpack's Working Principle" />
</figure>

### Introduction

In a single sentence, Webpack is a module bundler. Since the beginning of web apps, JavaScript files have began to get larger and larger, thus it became necessary to split the code-base and organize them as needed, and JavaScript and NodeJS made it easier to do so. These separated files and their required packages are called modules, and webpack deals with them in a smarter way. See the [referencces](#references) section to know more about webpack.

### Installation

It's generally better to install webpack globally, as webpack will be mostly used during development builds and keeping it globally installed reduces one step down.

To install webpack globally run (presuming NodeJS is installed) -

```shell
npm install -g webpack
```

For non-global installation use the command -

```shell
npm install webpack
```

### How to use?

There are mainly two ways to use webpack -
- Pure CLI Method
- CLI Using Configuration File Method

### Pure CLI Method

To use webpack using command line it's always preferred to install webpack globally. After successful installation, webpack can be run as -

```shell
webpack ./entry.js bundle.js
```

in your project directory. Where `entry.js` is the entry point of your project files, and `bundle.js` will be the output file from webpack.

You can also pass other options available for webpack through command line, but very fast the pure CLI method will become tedious and too much lengthy and very much error-prone to write, so I'll leave it here for now, and you can always check the documentation for CLI options in webpack's documentation page (link is listed in the [referencces](#references)).

### CLI Using Configuration File Method

Using configuration file is much more convenient and error-proof, and the globally installed webpack is still needed (generally, otherwise locally) for CLI purposes.

#### Creating Configuration File

The webpack configuration file is named as `webpack.config.js`, which would be placed in your project directory and can be used by running `webpack` command in command line in your project's root directory.

The configuration file would export a pure JavaScript object which would contain some required parameter along with some others if needed. The beauty of using JavaScript object is that, any other operations can be processed before serving the object to webpack, which led to perform much more conditional functionalities.

To achieve the similar output as `webpack ./entry.js bundle.js`, the minimal configuration would be -

```javascript
module.exports = {
  entry: './entry.js',
  output: {
    filename: 'bundle.js'
  }
}
```

Save the file as `webpack.config.js` into the root directory of the project and run `webpack` in the command line. This will take the `entry.js` from the root directory of the project and output `bundle.js`, as defined in the sub-key `filename`, in the same root directory of the project.

The main keys in the above configuration are `entry` and `output`.

#### entry:

`entry` is the key which takes the entry point of the project. `entry` accepts mainly four types entry point configurations.

1. **Single String**
```javascript
entry: './entry'
```
In single string method it's very simple straightforward way to point to the entry point of the project.


2. **Array of Strings**
```javascript
entry: ['./entry', './yetAnotherEntry']
```
Array methods helps for projects with multiple entry point, it also lets to add/load polyfills into your projects before compiling your project files, just remember to place polyfills in the beginning of the array.

3. **Named Entry Points**
```javascript
entry: {
  app: './entry',
  another: './yetAnotherEntry',
  vendors: ['vendor1', 'vendor2']
}
```
Named entry point lets to group entry points along with having all the capabilities of above two methods.

4. **Name-spaced Entry Point**
```javascript
entry: {
  'dist/app': './entry',
  'dist/another': './yetAnotherEntry',
  'dist/vendors': ['vendor1', 'vendor2']
}
```
Name-spaced entry points are more declarative than named entry points and the benefit of this is that, along with helping categorizing outputs, outputs will be placed into the folders as named, but remember all these folders will be created into the folder mentioned into the `output` keys sub-key `path`.

To know more about webpack's entry point configuration please see in the [referencces](#references) for link(s).

#### output:

`output` is another primary key in webpack configuration which deals with the process how generated output files will be placed in project's directory. Though `entry` key can have multiple entry-points, `output` can have only one output point. The main sub-key of `output` key are `filename` and `path`, along with other important sub-keys.

#### output.filename:

```javascript
output: {
  filename: 'bundle.js'
}
```

`output`'s `filename` can be of two types -

1. **Fixed Filename**
```javascript
output: {
  filename: 'bundle.js'
}
```
In fixed file name method the output filename is pre-determined and output is generated and written as the filename specified.

2. **Dynamic Filename**
```javascript
output: {
  filename: '[name].js'
}
```
In dynamic filename method some interesting parameters appear to generate filename, those are `[name]`, `[hash]`, `[chunkhash]`. Where `[name]` is the name specified in the named or name-spaced entry points. In short, this `[name]` parameter will work if the entry point itself has a named key. Care to remember that, in name-spaced method the the filename will be the last string after all forward-slashes (`/`), thus `'dist/app'` would result a output file in `dist` folder named `app`. `[hash]` and `[chunkhash]` are the hashes generated while compiling the outputs, where `[hash]` is the hash of the final output and `[chunkhash]` is the hash for individual chunks, and can be used as -
```javascript
output: {
  filename: '[name]-[hash].js'
}
```
The placement of the parameter is not fixed, place it/them as needed.\\
_(* as mentioned in webpack's documentation, while using `[hash]` and `[chunkhash]` make sure to have a consistent ordering of modules, use `OccurenceOrderPlugin` or `recordsPath`. See [referencces](#references) for link(s))_\\
You can even play with these parameter, like -
```javascript
output: {
  filename: '[name]-[name]-whatever-[hash].js'
}
```
and, it won't hurt.


#### output.path:

```javascript
output: {
  path: __dirname + '/built'
}
```

`path` parameter of `output` defines the path from root directory of the project to put generated output files. Care to mind that, in name-spaced entry points the directory will be inside the defined directory in `path` sub-key parameter.

#### output.publicPath:

```javascript
output: {
  publicPath: '/assets/'
}
```

`publicPath` parameter is used by loaders which embeds `<script>` or `<link>` tags or for other static assets and `publicPath` is used inside the `href` or `url()`. It's a great way to direct path for static assets, but the `publicPath` is not a must have parameter in webpack's configuration but widely used.

There are several other configuration parameter for `output` parameter in webpack, you can see them in webpack's documentation (see [referencces](#references) for link(s)).

Although `entry` and `output` are the must have configuration for webpack, as the setup begins to grow, some other options like `module`, `plugins` etc., become as much important as them and, it's very unlikely to see any project setup without them.

#### module:

As webpack is a module bundler, the `module` key is one of the most important and useful feature of webpack. The most important sub-key of `module` is `loaders`, which works like a task scheduler to handle several aspects of the code manipulation before the final compilation by webpack. Basically loaders are functions which takes your code and returns transpiled code as defined in the configuration. There are hundreds of loaders build for webpack, a list can be found in webpack's documentation. There are lots of benefit and usage conditions for loaders which can also be found in webpack's documentation (see [referencces](#references) for link(s)).

#### module.loaders:

```javascript
module: {
  loaders: [
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  ]
}
```

`loaders` is an array, which holds configuration for multiple individual loaders. An individual loader configuration has several pre-defined keys -

- **`test`**
`test` defines a condition that has to be met to make this loader active for the source file. Generally it defines the file-types, as seen in the above code snippet, the `test` parameter tests if the source file is a `.js` file or not, if so then the loader will be applied.

- **`loader`**
`loader` is to hold the name of the loader, in above snippet the loader is `babel-loader`. `loader` can hold multiple loaders, separated by `!`. Care to remember that, the loaders are loaded from right to left. So, if loaders are defined as `loader: 'loader-1!loader-2!loader-3'`, then the source file will be first transpiled by `loader-3` then the output of `loader-3` will be transpiled by `loader-2` and, finally the output from `loader-2` will be transpiled by `loader-1`.

- **`loaders`**
`loaders` is just the array version of `loader` key, where rather than writing all loaders in a single string, loaders are listed in an array. (*use either*)

- **`include`**
`include` is the way of directing webpack towards the directory where the source files for the loader can be found.

- **`exclude`**
As projects can have several directories not to be included in the final compiled version of the source file, like - node_modules, `exclude` lets to define those directories not to be bothered by the loader.

There are several other configuration keys for `module` which can be found in the webpack's documentation (see [referencces](#references) for link(s)).

#### plugins:

Plugins are ways to minimize build tasks, and can be referred as optional/extra task-runners, like - optimizing compilation for production build, serving templates and so on. Webpack has lots of built-in plugins and they're quite easy to use, other than built-in plugins there are also a lot of other open-source plugins to achieve lots of necessary optimizations (see [referencces](#references) for link(s)).

Like `module.loaders` `plugins` is also an array, which accepts a list of plugins along with their configurations.

#### Example configuration of plugins

**UglifyJsPlugin**

`UglifyJsPlugin`is a built-in plugin of webpack to minimize JavaScript files/chunks. The configuration is as -

```javascript
plugins: [
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      drop_console: true
    },
    mangle: {
      except: ['$super', '$', 'exports', 'require']
    }
  })
]
```

The above configuration tells webpack to use `UglifyJsPlugin`, and tells `UglifyJsPlugin` to compress the output, while disabling logs of `warning` messages into the console, removing all the `console.*` statements from whole code-base and, also not minifying the global variables named `$super`, `$`, `exports`, `require`. The `mangle` feature is useful for scenarios like, later-on you want to use `jQuery` from your front-end and `jQuery` is also added to your `bundle.js` and is exposed as `$`, so leaving `$` from being mangled into something else you get the `$` variable even after code has been minified. As every plugins have their own set of configuration settings, `UglifyJsPlugin` has also some settings for itself (see [referencces](#references) for link(s)) which can help for your needs.

**html-webpack-plugin**

`html-webpack-plugin` is an open-source plugin to supply a bare-bone html template for your project. It comes handy in SPA build process, though it has some limitations but using another module named `html-webpack-template` along with this helps minimizing those limitations in some extends, namely serving a custom template as needed.

*Sample Production Configuration*

```javascript
plugins: [
  new HTMLWebpackPlugin({
    template: path.resolve(__dirname, 'node_modules/html-webpack-template/index.ejs'),
    title: 'Work Time Recorder',
    chunks: ['dist/vendors', 'dist/bundle'],
    filename: 'index.html',
    appMountId: 'app',
    inject: false,
    mobile: true,
    hash: false,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      collapseInlineTagWhitespace: true,
    }
  })
]
```

*Sample Development Configuration*

```javascript
plugins: [
  new HTMLWebpackPlugin({
    template: path.resolve(__dirname, 'node_modules/html-webpack-template/index.ejs'),
    devServer: 'http://localhost:3000', /* do not add last slash, see the templates script, why? */
    title: 'Work Time Recorder',
    chunks: ['dist/vendors', 'dist/bundle'],
    filename: 'index.html',
    appMountId: 'app',
    inject: false,
    mobile: true,
    hash: false
  })
]
```

As seen above two configurations, for production purposes and for development purposes, are presented for `html-webpack-plugin` plugin. Both `html-webpack-plugin` and `html-webpack-template` have their specific options which can be found on their documentation pages (see [referencces](#references) for link(s)).

### Conclusion

In this article I tried to touch several aspects of webpack configurations in a short but somewhat informative manner. To learn more, see webpack's documentation, it has a lot of explanations and examples. I'll also try to add/update more aspects of webpack, gradually. There are also some configuration and optimization tips from webpack. Links of all talked options are listed in the [referencces](#references). Like many things, webpack's configuration is also not so this-and-that, it always depends on your need, and experience with it, but webpack is also much simpler than many others.

### Sample Configurations

#### Configuration - Development Build

```javascript
var path = require('path');
var precss = require('precss');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var packageJSON = require('./package.json');
var HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  return {
    entry: {
      'dist/bundle': path.resolve(__dirname, 'src', 'index.js'),
      'dist/vendors': Object.keys(packageJSON.dependencies)
    },
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: '[name].js'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          loader: "style-loader!css-loader!postcss-loader"
        }
      ],
    },
    postcss: function () {
      return {
        defaults: [ autoprefixer, precss ],
        cleaner: [ autoprefixer({ browsers: ['last 2 versions'] }) ]
      }
    },
    plugins: [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.CommonsChunkPlugin('dist/vendors', 'dist/vendors.bundle.js'),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"development"'
      }),
      new HTMLWebpackPlugin({
        template: path.resolve(__dirname, 'node_modules/html-webpack-template/index.ejs'),
        devServer: 'http://localhost:3000', /* do not add last slash, see the templates script, why? */
        title: 'Document Title',
        chunks: ['dist/vendors', 'dist/bundle'],
        filename: 'index.html',
        appMountId: 'app',
        inject: false,
        mobile: true,
        hash: false
      }),
    ]
  }
}
```

#### Configuration - Production Build

```javascript
var path = require('path');
var precss = require('precss');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var packageJSON = require('./package.json');
var HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  return {
    entry: {
      'dist/bundle': path.resolve(__dirname, src, 'index.js'),
      'dist/vendors': Object.keys(packageJSON.dependencies)
    },
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: '[name].js'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          loader: "style-loader!css-loader!postcss-loader"
        }
      ],
    },
    postcss: function () {
      return {
        defaults: [ autoprefixer, precss ],
        cleaner: [ autoprefixer({ browsers: ['last 2 versions'] }) ]
      }
    },
    plugins: [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.CommonsChunkPlugin('dist/vendors', 'dist/vendors.bundle.js'),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: true
        },
        mangle: {
          except: ['$super', '$', 'exports', 'require']
        }
      }),
      new HTMLWebpackPlugin({
        template: path.resolve(__dirname, 'node_modules/html-webpack-template/index.ejs'),
        title: 'Work Time Recorder',
        chunks: ['dist/vendors', 'dist/bundle'],
        filename: 'index.html',
        appMountId: 'app',
        inject: false,
        mobile: true,
        hash: false,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseInlineTagWhitespace: true,
        }
      }),
    ]
  }
}
```

### References

- <a href="https://webpack.github.io/docs/what-is-webpack.html" rel="nofollow" target="_blank">Webpack Introduction</a>
- <a href="https://webpack.github.io/docs/cli.html" rel="nofollow" target="_blank">Webpack CLI</a>
- <a href="https://webpack.github.io/docs/configuration.html#entry" rel="nofollow" target="_blank">Webpack Configuration - entry</a>
- <a href="https://webpack.github.io/docs/configuration.html#output" rel="nofollow" target="_blank">Webpack Configuration - output</a>
- <a href="https://webpack.github.io/docs/configuration.html#module" rel="nofollow" target="_blank">Webpack Configuration - module</a>
- <a href="https://webpack.github.io/docs/loaders.html" rel="nofollow" target="_blank">Webpack Configuration - loaders</a>
- <a href="https://webpack.github.io/docs/list-of-loaders.html" rel="nofollow" target="_blank">Webpack Loaders List</a>
- <a href="https://webpack.github.io/docs/using-loaders.html" rel="nofollow" target="_blank">Webpack Using Loaders</a>
- <a href="https://webpack.github.io/docs/plugins.html" rel="nofollow" target="_blank">Webpack Plugins</a>
- <a href="https://webpack.github.io/docs/using-plugins.html" rel="nofollow" target="_blank">Webpack Using Plugins</a>
- <a href="https://webpack.github.io/docs/list-of-plugins.html" rel="nofollow" target="_blank">Webpack's Built-in Plugins</a>
- <a href="https://github.com/mishoo/UglifyJS2#usage" rel="nofollow" target="_blank">UglifyJsPlugin Configuration Options</a>
- <a href="https://github.com/ampedandwired/html-webpack-plugin" rel="nofollow" target="_blank">HTML Webpack Plugin</a>
- <a href="https://github.com/jaketrent/html-webpack-template" rel="nofollow" target="_blank">HTML Webpack Template</a>
- <a href="https://webpack.github.io/docs/list-of-hints.html" rel="nofollow" target="_blank">Webpack's Hints</a>
