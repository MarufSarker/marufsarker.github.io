---
author: "Maruf Sarker"
categories: ["WebDev"]
description: "ReactJS is a view engine and ReduxJS is a state management system/predictable state container and GraphQL is declarative data query language build for client side. In this article we will discuss about implementing them together."
keywords: "reactjs,react,reduxjs,redux,graphql,node,npm,html,css,jsx"
layout: post
tagline: "React-Redux with GraphQL for Simpler Data Query"
tags: ["reactjs", "reduxjs", "graphql", "nodejs", "javascript"]
thumbnail: "/assets/posts/2016-05-09-react-redux-with-graphql/react-redux-graphql.png"
title:  "Implementing React Redux with GraphQL"
post_url: 2016-05-09-react-redux-with-graphql
---

<figure class="amms-gb-img-figure-centered">
	<figcaption>ReactJS, ReduxJS and GraphQL</figcaption>
	<img src="/assets/posts/2016-05-09-react-redux-with-graphql/react-redux-graphql.png" alt="ReactJS, ReduxJS and GraphQL" title="ReactJS, ReduxJS and GraphQL">
</figure>

## Introduction

ReactJS is a view library, where ReduxJS is state management system and GraphQL is a declarative data query language. Now, if you're confused with any of these terms, I can assure you that these libraries/languages are those what they're called, so if you understand what they do, these terms will become much more meaningful then. And, I'll try to simplify things as much as I can, because one thing I've learnt while experimenting with them is that, while most of the concepts behind these libraries are simple and straightforward, not understanding the implementation could make things much worse than it should be and, when you finally get the concept you will realize that, the concept wasn't that hard to grasp, at all. So, I'll discuss them as humanly as possible, thus you might have to read a bit longer here. That's why here is a list of sections which I'll discuss here, and you can skip to any of these -

- [Project Setup](#project-setup)
- [Developing Using ReactJS](#the-reactjs-app)
- [Developing Using ReduxJS](#using-reduxjs)
- [Adding GraphQL with ReduxJS](#adding-graphql-with-reduxjs)
- [Project Files](#project-files)
- [References](#references)

You can skip to any of these and I'll  keep a summary of what I've discussed on earlier sections in the beginning. Sections like "Project Setup" won't be fully discussed in the beginning, and will be expanded to other sections. The initial discussion of "Project Setup" will target towards the ReactJS implementation.

One thing to note that, what I'll not discuss here is, how to use JSX syntax. Here I'll concentrate on ReduxJS and a bit of GraphQL and a bit of ReactJS as necessary, so I'll skip explaining JSX syntax.

## Project Setup

As you gradually get the grasp of the libraries/technologies you're using in your project(s), one thing might bite you in the long run is the project setup, in short the boilerplate for your project. NO, I'm not saying that you should avoid boilerplates, no definitely not. Using something that someone else has already build/solved is what open-culture open-source teaches. So, I'm not against boilerplate at all. If you prefer any boilerplate of others, use it as you wish and as their *licenses* say. What I'm saying is that, when using others' boilerplate, *understand* what they have used and why. Because not all the features they've added is/will be useful for you, rather might become a problem for your current project. Understand their setup reasons, so that if the boilerplate is no longer maintained or, you need to re-configure as your need, you can do that.

As stated earlier, in this build process I will focus on setup for ReactJS and, when ReduxJS and GraphQL processes will start, I'll discuss relative changes and additions for their build processes only. So, in short ReactJS's build setup will be a base for others and, I'll not discuss all these over again except the relative ones for that specific process only.

**Folder Structure**

```shell
tutorial-react-redux-graphql
|   .babelrc
|   package.json
|   server.js
|   webpack.config.js
|
+---public
|   |   favicon.ico
|
+---server
|       server.dev.js
|       server.prod.js
|
+---src
|   |   index.js
|   |
|   +---components
|   |       AddTodo.js
|   |       App.js
|   |       TodoList.js
|   |
|   \---styles
|           styles.css
|
\---webpack
				vendors.js
				webpack.config.dev.js
				webpack.config.prod.js
```

As you see the folder structure, you might wonder, why there is no *index.html* or similar *view engine* files in my folder structure. The reason behind is that, I'll use webpack's module to serve my *html* file, as ReactJS based web-applications just need a hook in html file to add itself to get started and, I'm willing to leverage that process to webpack to handle. But if you want to go that route, I'll add a html snippet which can be used instead of my webpack's specific configuration, which I'll mention later.

**Webpack Configuration**

**webpack/vendor.js**

```javascript
module.exports = [
	"babel-polyfill",
	"react",
	"react-dom"
]
```

*webpack/vendor.js* contains the names of the npm packages which will be used by webpack to merge and compress them separately to be served as separate file while serving files using web server. You can skip this step if you want to bundle all of your JS files into a single file rather than separate files for dependencies. The names listed here are specific for ReactJS build, and this list will grow on ReduxJS and GraphQL build and I'll mention the necessary changes when they appear.

**webpack/webpack.config.dev.js**

```javascript
var path = require('path')
var precss = require('precss')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var HTMLWebpackPlugin = require('html-webpack-plugin')

var vendors = require('./vendors')

module.exports = function(env) {
	return {
		entry: {
			'dist/bundle': path.resolve(__dirname, '..', 'src', 'index.js'),
			'dist/vendors': vendors
		},
		output: {
			path: path.resolve(__dirname, '..', 'public'),
			filename: '[name].js'
		},
		module: {
			loaders: [{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}, {
				test: /\.css$/,
				exclude: /node_modules/,
				loader: "style-loader!css-loader!postcss-loader"
			}],
		},
		postcss: function() {
			return {
				defaults: [autoprefixer, precss],
				cleaner: [autoprefixer({ browsers: ['last 2 versions'] })]
			}
		},
		plugins: [
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.CommonsChunkPlugin('dist/vendors', 'dist/vendors.bundle.js'),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': env
			}),
			new HTMLWebpackPlugin({
				template: path.resolve(__dirname, '..', 'node_modules/html-webpack-template/index.ejs'),
				devServer: 'http://localhost:3000',
				title: 'React Redux GraphQL',
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

*webpack/webpack.config.dev.js* is projected towards the development build. If you have experience with webpack, this setup should be easier to grasp. But if you have any confusion you can check in webpack's documentation and I also have another post describing webpack's configurations (*links are in the [references](#references)*).

But I'll try to put the configuration into simpler language. Here I'm using two entry points for webpack, one is the application's source entry point and another is the list of vendors mentioned earlier.

The webpack outputs will be served into the public folder but, as this will use `webpack-dev-server`, so you won't see any actual files there, but will see in production build mode, as `webpack-dev-server` won't be used then.

As loaders I'm using `babel-loader` to enable using ES6/7 features, and `style-loader`, `css-loader` to use *css* files inside *js* files and, `postcss-loader` to use *AutoPrefixer* feature. The `postcss` key is for `postcss-loader`.

In plugins `DedupePlugin` is used to reduce bundle size by removing duplicates for same file additions. `CommonsChunkPlugin` is used to create multiple output files. `DefinePlugin` is used to define global variable `process.env.NODE_ENV` to be used by libraries, as the `NODE_ENV` variable is not exposed to client side. `HTMLWebpackPlugin` is the one which will serve the required *html* file required by ReactJS to hook into. `HTMLWebpackPlugin` internally using `html-webpack-template` to enable several features which aren't available to `html-webpack-plugin`.

**webpack/webpack.config.prod.js**

```javascript
var path = require('path')
var precss = require('precss')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var HTMLWebpackPlugin = require('html-webpack-plugin')

var vendors = require('./vendors')

module.exports = function(env) {
	return {
		entry: {
			'dist/bundle': path.resolve(__dirname, '..', 'src', 'index.js'),
			'dist/vendors': vendors
		},
		output: {
			path: path.resolve(__dirname, '..', 'public'),
			filename: '[name].js'
		},
		module: {
			loaders: [{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}, {
				test: /\.css$/,
				exclude: /node_modules/,
				loader: "style-loader!css-loader!postcss-loader"
			}],
		},
		postcss: function() {
			return {
				defaults: [autoprefixer, precss],
				cleaner: [autoprefixer({ browsers: ['last 2 versions'] })]
			}
		},
		plugins: [
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.CommonsChunkPlugin('dist/vendors', 'dist/vendors.bundle.js'),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': env
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
				template: path.resolve(__dirname, '..', 'node_modules/html-webpack-template/index.ejs'),
				title: 'React Redux GraphQL',
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

*webpack/webpack.config.prod.js* is somewhat similar to *webpack/webpack.config.dev.js*. The difference comes into the *plugins* key, where `UglifyJsPlugin` is used to minify output bundles, and the `HTMLWebpackPlugin` also uses its minify feature to minify serving *html* file.

**webpack.config.js**

```javascript
var env = process.env.NODE_ENV
env = JSON.stringify(env)

if (env === '"development"') {
	module.exports = require('./webpack/webpack.config.dev.js')(env)
} else if (env === '"production"') {
	module.exports = require('./webpack/webpack.config.prod.js')(env)
}
```

The *webpack.config.js* serves webpack's configuration depending on the current *NODE_ENV* value.

**Server Configuration**

**server/server.dev.js**

```javascript
import express from 'express'
import path from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackConfig from '../webpack.config.js'

const APP_PORT = 3000

var compiler = webpack(webpackConfig)

var app = new WebpackDevServer(compiler, {
	contentBase: '/public/',
	stats: {
		chunks: false,
		colors: true,
	}
})

app.use('/', express.static(path.resolve(__dirname, '..', 'public')))
app.listen(APP_PORT, (err) => {
	if (err) {
		console.log(err)
	} else {
		console.log(`App is running at http://localhost:${APP_PORT}`)
	}
})
```

You can see, I'm using ES6 features in *server/server.dev.js* file and will be used everywhere beyond, as I'll use `bable-polyfill` for *client* side and `babel-register` for *server* side to provide capabilities to *NodeJS* to handle these bleeding edge ES6/7 features. In *server.dev.js* along with several normal configurations I'm using `webpack-dev-server` to serve webpack's output files from *public* folder.

**server/server.prod.js**

```javascript
import express from 'express'
import path from 'path'

const APP_PORT = 3000

let app = express()

app.use('/', express.static(path.resolve(__dirname, '..', 'public')))
app.listen(APP_PORT, (err) => {
	if (err) {
		console.log(err)
	} else {
		console.log(`App is running at http://localhost:${APP_PORT}`)
	}
})
```

In *server/server.prod.js* the only change is to get rid of `webpack-dev-server` and use `express` only.

**server.js**

```javascript
require('babel-register')

var env = process.env.NODE_ENV
env = JSON.stringify(env)

if (env === '"development"') {
	require('./server/server.dev.js')
} else if (env === '"production"') {
	require('./server/server.prod.js')
}
```

The *server.js* serves server configuration depending on *NODE_ENV*, as webpack's configuration.

**NodeJS Configuration**

**package.json**

```json
{
	"name": "tutorial-react-redux-graphql",
	"private": true,
	"version": "0.1.0",
	"description": "Simple React Redux example with GraphQL",
	"main": "server.js",
	"scripts": {
		"build-prod": "node ./node_modules/webpack/bin/webpack.js && node ./server.js",
		"prod": "node ./node_modules/cross-env/bin/cross-env.js NODE_ENV=production npm run build-prod",
		"build-dev": "node ./server.js",
		"dev": "node ./node_modules/cross-env/bin/cross-env.js NODE_ENV=development npm run build-dev",
		"start": "npm run prod"
	},
	"dependencies": {
		"autoprefixer": "",
		"babel-core": "",
		"babel-loader": "",
		"babel-polyfill": "",
		"babel-preset-es2015": "",
		"babel-preset-react": "",
		"babel-preset-stage-0": "",
		"babel-register": "",
		"cross-env": "",
		"css-loader": "",
		"express": "",
		"html-webpack-plugin": "",
		"html-webpack-template": "",
		"postcss-loader": "",
		"precss": "",
		"react": "",
		"react-dom": "",
		"style-loader": "",
		"webpack": ""
	},
	"devDependencies": {
		"webpack-dev-server": ""
	}
}
```

In *package.json*'s *scripts* key you can see the *prod* key runs the production build and serves using production server and the *dev* key builds and serves using development configurations.

Now will be a nice time to install all the packages, just run `npm install` or `npm i` in the root directory of the project.

**Other Configurations**

**.babelrc**

```json
{
	"presets": ["es2015", "stage-0", "react"]
}
```

The *.babelrc* file is a vital configuration file for `babel` to let it know which features to make available for *NodeJS* compatibility. Here I'm using `es2015` for *classes* and others, `react` for *jsx*, *react-jsx* and others.

### The ReactJS App

ReactJS is a view-library, which means it cares about how your app will be displayed rather than your data. A top-down process is followed to pass data while developing ReactJS apps where most of the components don't even know where the data is coming from, they just produce the view using the data is given to them. So, no matter how you're getting your data, you don't have to worry about integrating them with ReactJS components. And, this is why ReactJS components can easily be integrated with any other libraries. In short ReactJS doesn't care about your project setup. To learn more about ReactJS, please visit ReactJS's documentation (*links are in the [references](#references)*).

As I will not be discussing the *JSX* syntax, let me get straight into the app's behavioral idea. The app will show a *todo list*, and will take *todos* as input and let those *todos* be *crossed-out*, that's it, the ABC example of any explanation you can find on the Internet. Let's get coding -

**src/index.js**

```javascript
import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App'

ReactDOM.render(
	<App/>,
	document.getElementById('app')
)
```

In *src/index.js* I'm using `babel-polyfill` to enable ES6/7 features compatibility in client-side. Right now if you run `npm run dev` or any other defined script, you'll get an error. Because the *App* component is not defined. So if you create a file in *components* folder named *App.js* and put below code -

```javascript
import React from 'react'

class App extends React.Component {
	render() {
		return (
			<div>
				<i>Hello</i>
			</div>
		);
	}
}

export default App;
```

And, goto `http://localhost:3000` in your browser, you'll see a simple text saying *Hello*

But let me put the whole structure of *App.js*, and then I'll describe it.

**src/components/App.js**

```javascript
import React from 'react'

import '../styles/styles.css'

import AddTodo from './AddTodo'
import TodoList from './TodoList'

class App extends React.Component {
	state = {
		todos: [
			{ id: "0", text: 'Todo 0', completed: false },
			{ id: "1", text: 'Todo 1', completed: false }
		]
	}
	todoID = () => {
		return Date.now().toString()
	}
	receiveTodos = () => {
		return this.state.todos
	}
	addTodo = (text) => {
		if (text.trim().length <= 0) {
			return;
		}
		let id = this.todoID()
		let todos = [
			...this.state.todos, {
				id: id,
				text: text,
				completed: false
			}
		]
		this.setState({
			todos: todos
		})
	}
	toggleTodo = (id) => {
		let todos = this.state.todos.map(todo => {
			if (todo.id !== id) {
				return todo
			}
			return {
				...todo,
				completed: !todo.completed
			}
		})
		this.setState({
			todos: todos
		})
	}
	render() {
		return (
			<div>
				<AddTodo
					addTodo={this.addTodo}
				/>
				<TodoList
					todos={this.state.todos}
					onTodoClick={this.toggleTodo}
					receiveTodos={this.receiveTodos}
				/>
			</div>
		);
	}
}

export default App
```

Suddenly here is too many things. Let's go one by one.

Initially I'm *import*ing *React*, attaching a *styles.css* file, which will be handled by *webpack*, and then two other components *AddTodo*, *TodoList*, though their name suggest what they do, let's pretend we don't know.

Then the main *App* component happens. Here it starts as a *extend*ed *class* of *React.Component* and, the first key it has is *state*. In *React* this *state* key plays a vital role, this is the data container. For any changes in *state*, the total view is re-rendered in *virtual-dom*, and changes are added back to the *DOM* by *React*. *State* holds a predefined application state, which can be passed down to any components and, later-on we'll discuss about this state being managed by *Redux*.

So, here this *state* has a key named *todos* which holds an array of *todo*.

Later, there is a function named *todoID* which generates a *string* based on current time and this value will be used later on while adding new *todo*.

The *receiveTodos* function is totally unnecessary for this scenario, but I'll keep this baggage just to make some things simpler to describe later on. And if not needed, you definately do not need this kind of function in your code, as this function just gets the current *todos* from the *state* which is already present to you by `this.state.todos` parameter.

The *addTodo* function just adds a *todo* to the *todos* key of *state*. Notice the use of *todoID* function here. And, the most important part is here the *todo* addition method. Notice how I used

```javascript
let todos = [
	...this.state.todos, {
		id: id,
		text: text,
		completed: false
	}
]
```

What this does is, it takes the *state* *todos* and creates a new array of *todos* which I finally save into *state* *todos*. It's equal to `Array.concat` method, but in ES6 way. Right now it is over-doing, I could have just used the `Array.push` method, but the thing here I'm demonstrating is something called *immutable* data manipulation, where the main data is not altered but a new instance is created from the old data, though the old data here *state.todos* is being altered finally, but this is the thing we'll discuss preventing in *ReduxJS* and, this concept of *immutable* data is vital for *ReduxJS*.

The *toggleTodo* function is somewhat similar to *addTodo* function, but it just *toggles* the state of any *todo* being marked as *completed* or not. Here in this function again, I've over-done the *immutable* demonstration for the purpose of easier understanding of *immutable* data concept.

Finally in the *render* function, I've rendered *AddTodo* and *TodoList* components, while passing down *addTodo*, *todos*, *onTodoClick* and *receiveTodos* properties, which those *components* can get using `this.props` property.

**src/components/AddTodo.js**

```javascript
import React from 'react'

class AddTodo extends React.Component {
	render() {
		let { addTodo } = this.props;
		let input;
		return (
			<div>
				<input type="text" placeholder="Enter Todo" ref={i => input = i}/>
				<input type="button" value="Add Todo" onClick={() => {
					addTodo(input.value)
					input.value = ''
				}}/>
			</div>
		)
	}
}

export default AddTodo
```

The *src/components/AddTodo.js* component receives *addTodo* property from *src/components/App.js* and after submitting input data it uses that property/function to pass the received input data. Notice how it doesn't care what that data is used for or whatever. Here the *AddTodo* component is being used as a view component only.

**src/components/TodoList.js**

```javascript
import React from 'react'

const Todo = ({ text, completed, onClick }) =&gt; {
	return (
		<li
			onClick={onClick}
			style={ {textDecoration: completed ? 'line-through' : 'none'} }
		>
			{ text }
		</li>
	)
}

class TodoList extends React.Component {
	componentDidMount() {
		this.props.receiveTodos()
	}
	render() {
		const { todos, onTodoClick, receiveTodos } = this.props
		return (
			<div>
				<button onClick={() => receiveTodos()}>RECEIVE</button>
				<ul>
					{
						todos.map(todo => {
							return (
								<Todo
									key={todo.id}
									{...todo}
									onClick={() => onTodoClick(todo.id)}
								/>
							)
						})
					}
				</ul>
			</div>
		)
	}
}

export default TodoList
```

As *src/components/AddTodo.js*, *src/components/TodoList.js* component also works as a view component and shows a list of *todos* using the received data from the *todos*, *onTodoClick* and *receiveTodos* which are passed down through `this.props` property.

As of now, we have a working application which will take text as input and add it as a *todo* and display a *todo list* and, also will  mark our *todo* as *complete* or vice versa if we click on it. Just start the application, or if you've already started it previously and, browse to `http://localhost:3000` to see a preview. One thing you will notice that, if you refresh the page, everything will start from the beginning, because we haven't setup something which will save the data as persistent. Now, let's start the *ReduxJS* process.



## Using ReduxJS

> In the previous section, we've developed our fully-functional application using *ReactJS* only. Where *App* component holds all the *state* data and all other functions and, other components - *AddTodo* and *TodoList* are used as view-component only.

*ReduxJS* is a *state* management system/*predictable state container* and, used to leverage the *state* manipulation of *ReactJS* applications. *ReduxJS* encourages to use *pure functional* and *immutable* data/*state* approach and, works *synchronously*. To learn more about ReduxJS, please visit ReduxJS's documentation (*links are in the [references](#references)*).

### Project Setup for ReduxJS

Project setup for *ReduxJS* will slightly change, and I will mention all the changes in details. I will not include those files which are identical to *ReactJS* setup, but the others. (*hope you're using git, doesn't matter here, though*)

**Folder Structure**
```shell
tutorial-react-redux-graphql
...
|
+---src
|   ...
|   |
|   +---actions
|   |       index.js
|   |
|   +---components
|   |       App.js
|   |
|   +---containers
|   |       AddTodo.js
|   |       TodoList.js
|   |
|   +---reducers
|   |       index.js
|   |
|   +---store
|   |       index.js
|   |
|   ...
...
```

In the folder-structure noticeable changes are inside the *src* folder, where some *components* have been moved into *containers* folder and, *actions*, *reducers* and *store* folders has been introduced.

**package.json**

In *package.json* file nothing has changed primarily, but some new packages has been installed for *ReduxJS*.

```shell
npm install -S react-redux redux redux-thunk
```

```shell
npm install -D redux-logger
```


**webpack/vendors.js**

In *webpack/vendors.js* only the new *ReduxJS* related packages has been added.

```javascript
module.exports = [
	"babel-polyfill",
	"react",
	"react-dom",
	"react-redux",
	"redux",
	"redux-thunk"
]
```

All other files are identical as *ReactJS* setup except files from *src* folder.

### ReduxJS Build Process

In *ReduxJS* build process, rather than going from *index.js* to downwards, we'll go step by step while discussing several components/concepts of *ReduxJS* and, finally we'll attach our *ReduxJS* components with the *ReactJS* ones.

#### Actions

*Actions* are simple/plain JavaScript objects which must contain a property named `type`. That's about it.

```json
{
	"type": "NAME_OF_THE_ACTION/ANYTHING YOU WISH"
}
```

The above one is the simplest form of an *action* in *ReduxJS*. But is it? Yes, it is. *Actions* are related to user interactions/*the view*. When a user does something to the *data*, the *actions* of *ReduxJS* handles the aftermath and returns the produced data. But what they don't do is manipulating the actual *state* of the application. Let's say in our *todo* application when user will try to *add* any *todo* to the *list*, the *text* of that *todo* will be received by an *action*, and if any processing is needed that *action* will process the *text* and output the processed data. But, what happens to that data, after that? In short, the *reducers* receives those *data* from *actions*, we'll discuss those soon. In *ReduxJS*, *actions* processes data receiving, editing. *Actions* are the place where *network calls* for *remote data* happens. As I've previously stated that *ReduxJS* works *synchronously*, so, how can a *network call* process be *synchronous*? Well for that matter, *ReduxJS* allows to use some *middlewares* like `redux-thunk`, `redux-promise` etc., to manage its *synchronous* behavior. Even the `redux-logger` we've installed during build process is a *ReduxJS* middleware, which by the way, lets us know the currents *actions* being executed by logging them into the *console*.

**src/actions/index.js**

```javascript
let dbTodoList = {
	todos: [
		{ id: 0, text: 'Todo 0', completed: false },
		{ id: 1, text: 'Todo 1', completed: false }
	]
}

export const CONSTANTS = {
	'ADD_TODO': 'ADD_TODO',
	'TOGGLE_TODO': 'TOGGLE_TODO',
	'ASYNC_ACTION': 'ASYNC_ACTION',
	'RECEIVE_TODOS': 'RECEIVE_TODOS'
}

const todoID = () => {
	return Date.now().toString()
}

const asyncGetTodos = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(dbTodoList)
		}, 2000)
	})
}

const asyncAddTodo = (text) => {
	let id = todoID()
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			dbTodoList.todos = [
				...dbTodoList.todos, {
					id: id,
					text: text,
					completed: false
				}
			]
			resolve(id)
		}, 2000)
	})
}

const asyncToogleTodo = (id) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			dbTodoList.todos = dbTodoList.todos.map(todo => {
				if (todo.id !== id) {
					return todo
				}
				return {
					...todo,
					completed: !todo.completed
				}
			})
			resolve(id)
		}, 2000)
	})
}

const asyncAction = () => {
	return {
		type: CONSTANTS['ASYNC_ACTION']
	}
}

export const receiveTodos = () => {
	return (dispatch) => {
		dispatch(asyncAction())
		return asyncGetTodos()
			.then(todoList => dispatch({
				type: CONSTANTS['RECEIVE_TODOS'],
				todos: todoList.todos
			}))
	}
}

export const addTodo = (text) => {
	return (dispatch) => {
		dispatch(asyncAction())
		return asyncAddTodo(text)
			.then(id => {
				dispatch({
					type: CONSTANTS['ADD_TODO'],
					text: text,
					id: id
				})
			})
	}
}

export const toggleTodo = (id) => {
	return (dispatch) => {
		dispatch(asyncAction())
		return asyncToogleTodo(id)
			.then(id => {
				dispatch({
					type: CONSTANTS['TOGGLE_TODO'],
					id
				})
			})
	}
}
```

These will be our *actions* for the app. But before anything, let me clarify one thing, as earlier I've kept some unnecessary codes inside *ReactJS* components, I've also kept some unnecessary codes here to achieve the *asynchronous* behaviour *artificially*. And, those *artificial* parts are NO-WAY necessary for any real-app. I've implemented those just because as we'll finally implement a network layer with our app, I've tried to pre-introduce with those concepts.

Now, here we can see four actions, which are *ADD_TODO*, *TOGGLE_TODO*, *RECEIVE_TODOS* and *ASYNC_ACTION*. By the way, the *ASYNC_ACTION* is purely *artificial* one.

The *dbTodoList* is similar to the *ReactJS*'s *App* component's *state*, which we had used to pre-load some *todos*. But here I've used it both for pre-loading purpose and to represent a *database*, let's say we're receiving those data from a database. And, for this *database* reason I've kept those *artificial* methods.

After that there is *object* called *CONSTANTS*, which actually does nothing but hold some keys and values (*they seems similar here, but can be anything*). This is not a part of *ReduxJS* at all, but this method is used generally, just to avoid errors. The *type* we've discussed earlier which are a *must have* property for *actions*, will use these values and, the *type* of *actions* are also used by *reducers* and if somehow they are not matched the application might not work. You can keep this constant variable(s) in separate files too, doesn't matter, and will be used by both *actions* and *reducers*.

The *todoID* is just as earlier *todoID* function of *ReactJS*'s *App* component.

The *asyncGetTodos*, *asyncAddTodo* and *asyncToogleTodo* are all the *artificial asynchronous* functions just to represent *network call*. Here *asyncGetTodos* returns the *dbTodoList*, *asyncAddTodo* adds a new *todo* into the *dbTodoList* and *asyncToggleTodo* toggles the state of any *todo* from *not-completed* to *completed* or vice-versa. In all these functions I'm using *ES6*'s *Promise* function/method. Another thing is that, the way I'm editing *dbTodoList*'s data aren't *ReduxJS* related issue, your *database* will let to edit it's data the way(s) it offers.

*asyncAction* is a *action* which returns only an object which contains only a key named *type* (*must have*).

*receiveTodos* is another action which returns a function, where the function takes *dispatch* as a argument. In the beginning, the function *dispatch*es *asyncAction* and let *Redux* know that some action is being executed. After that an asynchronous function *asyncGetTodos* happens, which waits till it gets return data and, after getting returned data it *dispatch*es the final *action* with two keys, *type* and *todos*.

You might be wondering, wasn't *actions* supposed to return an object and, what is this *dispatch*?

Let's first clarify, *dispatch*. When the *view* interacts with *Redux* it dispatches an/any *action* and, this this *dispatch* comes from there. Now, an *action* have to return an object with at least one key named *type*. But another thing is that, you can return as many *actions* as you wish. That's why in *receiveTodos* action we're initially returning the *asyncAction* *action*, which itself is a proper *action*, then we're performing an asynchronous *action* and after its completion returning another object which is a proper *action* behavior.

But, are these two *actions* necessary? And, who's helping *Redux* to maintain its synchronous behavior during those waiting periods?

The first *asyncAction* *action* is to let your app that, an *action* is performing, you can do any other things during this process. And, `redux-thunk` will help *Redux* during those waiting periods to maintain synchronous behavior.

*addTodo* and *toggleTodo* are two similar *actions* like *receiveTodos*. But rather than receiving *todos*, the *addTodo* adds new *todos* to *dbTodoList* and *toggleTodo* toggles *todo*'s state.

#### Reducers

*Reducers* are application *state* handler. Where *actions* lets the application to know that, something has happened and works with data *retrieval* or etc., but after having those data *actions* don't do anything with those data, rather passes those data to *reducers* and then *reducers* changes the application *state* depending on the *actions* those happened.

```javascript
function reducerFunction(state = initialState, action) {
	switch (action.type) {
		case 'THIS_ACTION_HAPPENED':
			return NEW_STATE
		case 'DIFFERENT_ACTION_HAPPENED':
			return DIFFERENT_NEW_STATE
		default:
			return state
	}
}
```

Functions which handles *reducers* functionality, can use any methods you want, here I've used `switch` statement, but you can also use `if-else` method.

One *important* thing is that, the *function* will take the *initial state* and the *action type* and, depending on the *action type*, change the *state* of the application. The *initial state* will be swapped to the *current state* when the application will start running and, this swapping will continue every time. Thus the *initial state* will always be the *current state* of the application and, the *returning state* from the *reducer* function will be the *new/next state*.

Now, before further, one thing is that, while working with *ReduxJS* you'll come across a term, *Pure Function*. If you're not familiar with *functional programming* or such, this might sound odd. But in simple words, it's a *function* which *returned* value depends solely on the *input* value(s) and *NOT* on any others.

But, aren't all *functions* depends on their *inputs* thus, are pure functions? Well, not really. Let's take *asyncGetTodos* from *src/actions/index.js*. What does it do? Whatever *arguments* you pass into it, though it doesn't take any *inputs* explicitly but *JS* won't bite, it will always return the *dbTodoList* which is not from any *arguments* passed into the *asyncGetTodos* function, thus the function isn't a *pure function*. Even the innocent function *todoID* isn't a *pure function*. Why, because, it doesn't depends on the *arguments* rather the *current time*, which is not a passed *argument* into it. Even passing the *current time* won't make it *pure function* as, internally it won't depend on the passed *argument* rather re-calculate the *current time* and *return* the value.

So, how can we implement a *pure function*? Let's take the *todoID* function and try to make it a *pure function.*

```javascript
function todoID(currentTime) {
	return currentTime.toString()
}
```

Now, the *todoID* function is dependent on the passed value and, whatever value you pass into it, it will return a *string* using solely that *input* value, not anything else.

So, basically,

```javascript
function add(a, b) {
	return a + b
}
```

is a *Pure Function*. Where,

```javascript
var a = 1;
function add(b) {
	return a + b
}
```

is *NOT* a *pure function*.

You'll find a list of *DO NOT DO* list on *ReducJS* documentation page for *pure functions*, which is -

> It’s very important that the reducer stays pure. Things you should **never** do inside a reducer:
- Mutate its arguments
- Perform side effects like API calls and routing transitions
- Call non-pure functions, e.g. `Date.now()` or `Math.random()`


**src/reducers/index.js**

```javascript
import { combineReducers } from 'redux'

import { CONSTANTS } from '../actions'

const todoHandler = (todo, action) => {
	switch (action.type) {
		case CONSTANTS['ADD_TODO']:
			return {
				id: action.id,
				text: action.text,
				completed: false
			};
		case CONSTANTS['TOGGLE_TODO']:
			if (todo.id !== action.id) {
				return todo
			}
			return {
				...todo,
				completed: !todo.completed
			};
		default:
			return todo
	}
}

let initialState = {
	todos: [],
	isFetching: false
}

const todosHandler = (state = initialState.todos, action) => {
	switch (action.type) {
		case CONSTANTS['ADD_TODO']:
			return [
				...state,
				todoHandler(undefined, action)
			];
		case CONSTANTS['TOGGLE_TODO']:
			return state.map(todo =>
				todoHandler(todo, action)
			)
		default:
			return state
	}
}

const todoListHandler = (state = initialState, action) => {
	switch (action.type) {
		case CONSTANTS['ASYNC_ACTION']:
			return Object.assign({}, state, {
				isFetching: true
			})
		case CONSTANTS['RECEIVE_TODOS']:
			return Object.assign({}, state, {
				isFetching: false,
				todos: action.todos
			})
		case CONSTANTS['ADD_TODO']:
		case CONSTANTS['TOGGLE_TODO']:
			return Object.assign({}, state, {
				isFetching: false,
				todos: todosHandler(state.todos, action)
			})
		default:
			return state
	}
}

const todoApp = combineReducers({
	todoList: todoListHandler
});

export default todoApp
```

If you've understood most of the things above, till now, this code snippet from *src/reducers/index.js* should be fairly understandable to you and, some small portions might have some issues. So, lets go briefly over all of them.

We're importing *CONSTANTS* from *actions*, which in *actions* section is already mentioned that, will be used by both *actions* and *reducers*. Later you can see that, all the functions are using values from *CONSTANTS* to prepare their *return* value.

You might have already noticed some unnecessary codes I've used, to demonstrate *immutable* data manipulation, in several earlier sections. Those all were like a practice for this section. Here you can see that, all the reducers functions are *returning* *new state* depending on the *input values/previous state and action types*, but one thing is that, they are never *destroying* the *previous state*, rather they're just *returning* a data object/array using the *previous state* and *action type*. In some places, `Object.assign` and in some places *ES6*'s *Array.concat* is being used. In `Object.assign` methods, we're passing an empty *object* to create a new *state* from previous *state*.

Lastly, the *combineReducer* is a *Redux* function which helps to combine multiple *reducer* functions into a single node/object, by which (*object*) we can easily grab any specific *reducer* as a *key* of that object. Like here, if we've to access this specific *reducer* from the application, we can easily get it using `something.todoList` key and, all it's *return* values (here *todos* and *isFetching*) will be available to us. (*the "something" will depend on the name you provide in a function. don't get confused, this will be discussed soon*).

#### Store

*Store* is kind of a containing wrapper of *actions* and *reducers* and holds the application *state*. As state in *ReduxJS* documentations -

> The store has the following responsibilities:
- Holds application state
- Allows access to state via `getState()`
- Allows state to be updated via `dispatch(action)`
- Registers listeners via `subscribe(listener)`
- Handles unregistering of listeners via the function returned by `subscribe(listener)`

*Store* lets *reducers* know which *actions* are happening and creates an interrelation in-between them. A *ReduxJS* application can have *only one store*. If your *state* has to be handled by multiple data handling logics, you can do all thos into the *reducers* section, as we've already seen in *reducers* that, the *combineReducers* function merges all the *reducers* functions into a single object, so that won't be an issue and all those *reducers* will be seen from an single object by *store*.

```javascript
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

let middlewares = [thunkMiddleware]

if (JSON.stringify(process.env.NODE_ENV) === '"development"') {
	var loggerMiddleware = require('redux-logger')
	middlewares = [...middlewares, loggerMiddleware()]
}

import todoReducers from '../reducers'

export default createStore(
	todoReducers,
	applyMiddleware(...middlewares)
)
```

Here seems like some interesting stuffs are going on. The *thunkMiddleware* and *loggerMiddleware* are both middlewares, where *thunkMiddleware* handles the *asynchronous* actions and keeps the *ReduxJS* flow *synchronous* and, *loggerMiddleware* is a *developer friendly* middleware, which logs out current *actions* into the browser's console. But why is *loggerMiddleware* imported in such manner? Because, though it's helpful for developers but, there's no use of *loggerMiddleware* in a *production* build and, rather it might become a security issue. So, it's included only when in *development* mode, which is determined by *process.env.NODE_ENV*, which by the way is provided by *webpack*'s `DefinePlugin` plugin. By the way, here *ES5*'s `require` is used because, *ES6*'s `import` is not accepted inside a *conditional* statement, yet, by *babel-eslint/babylon parser* and, thus throws an error.

Finally, we create a store combining *reducers* and *middlewares*.

#### Containers

Containers are not something special from *ReduxJS*, these are just those components which are connected to the *Store* and interacting with it by *dispatching actions*.

**src/containers/AddTodo.js**

```javascript
import React from 'react'
import { connect } from 'react-redux'

import { addTodo } from '../actions'

let AddTodo = ({ dispatch }) => {
	let input;
	return (
		<div>
			<input type="text" placeholder="Enter Todo" ref={i => input = i}/>
			<input type="button" value="Add Todo" onClick={() => {
				dispatch(addTodo(input.value))
				input.value = ''
			}}/>
		</div>
	)
}

export default connect()(AddTodo)
```

Here *AddTodo* is container/component which, like earlier in *ReactJS*, displays a *input* form and passes the input value upon submit. Though the component seems similar to *ReactJS* one, but here it's a function which takes *dispatch* as a parameter and, rather than passing its input value to any of it *props* it *dispatches* an *action* and, passes the value inside it.

So, where does this *dispatch* comes from and, what happens when we *dispatch* the *action*?

Notice, the `connect` function which is being exported while adding *AddTodo* along with it. This *connect* function is providing the *dispatch* parameter to *AddTodo* while being exported. And this *connect* connects the component with the *Store*. So, when we *dispatch* the *addTodo action*, the *store* executes the *addTodo action* and the returned value of *addTodo action* is then handled by *reducers* to change the *current state* of the application.

**src/containers/TodoList.js**

```javascript
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggleTodo, receiveTodos } from '../actions'

const Todo = ({ text, completed, onClick }) => {
	return (
		<li
			onClick={onClick}
			style={ {textDecoration: completed ? 'line-through' : 'none'} }
		>
			{ text }
		</li>
	)
}

class TodoList extends Component {
	componentDidMount() {
		const { receiveTodos } = this.props
		receiveTodos()
	}
	render() {
		const { todos, onTodoClick, receiveTodos } = this.props
		return (
			<div>
				<button onClick={() => receiveTodos()}>RECEIVE</button>
				<ul>
					{
						todos.map(todo => {
							return (
								<Todo
									key={todo.id}
									{...todo}
									onClick={() => onTodoClick(todo.id)}
								/>
							)
						})
					}
				</ul>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		todos: state.todoList.todos
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onTodoClick: (id) => {
			dispatch(toggleTodo(id))
		},
		receiveTodos: () => {
			dispatch(receiveTodos())
		}
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TodoList)
```

In previous *AddTodo* component we've *dispatched* an action, but here in *TodoList* to display the list we also need to have access to the *todo list* from the *state*. The `connect` method also provides access to the *state* but, we just have to go through some manual process to get those values.

The *mapStateToProps* and *mapDispatchToProps* are those manual process. These names are just some random names, you can have anything you want. Here, the *mapStateToProps* is getting the *state* parameter from *connect* function and, from that parameter we're getting the *todoList*, which is by the way, from the *combineReducer* method. Remember the *something*? This *state* is that *something* and, as it's a functions parameter and could be named anything, I used *something* there.

The *mapDispatchToProps* is also getting the *dispatch* parameter form the *connect* function and, we're using that *dispatch* just to pre-configure some functions which handles some *action*'s *dispatch*.

But how come, *mapDispatchToProps* gets *dispatch* as parameter and *mapStateToProps* gets *state* as a parameter from a similar situation? That's because of their position inside the *connect* function call.

```javascript
connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])
```

Above is the original sequence of the *connect* function. And, as we've placed the *mapStateToProps* in the first and *mapDispatchToProps* in the second, they're getting *state* and *dispatch* respectively.

#### Components

```javascript
import React from 'react'

import '../styles/styles.css'

import AddTodo from '../containers/AddTodo'
import TodoList from '../containers/TodoList'

class App extends React.Component {
	render() {
		return (
			<div>
				<AddTodo/>
				<TodoList/>
			</div>
		);
	}
}

export default App
```

As our application is a simpler one, and every other components are already build, our *App.js* seems to be a simpler one right now, specially compared to our previous *ReactJS* one. Though if needed, some more *view only* components can be build here.

Now, if you run `npm run dev` inside your project root and, browse to `https://localhost:3000`, you won't see anything different than the previous *ReactJS* one, as we've not added any more functionality here in *ReduxJS* one. But you will see the lag of 2 seconds for any actions, very noticeably, as in our code we've added 2 seconds response delay for every action. Something very noticeable will be in the *browser's console*. Open it and, you'll see log for every action you're performing in your application. These logs are generated by the *loggerMiddleware*.

## Adding GraphQL with ReduxJS

*GraphQL* is a declarative data query language. Basically, *GraphQL* works as a layer in-between *server* and *client*.

So, what's the benefit of adding another layer? Let's say, in our *ReduxJS* application, we were using *MongoDB* as a database. So, then to retrieve/process data form the database we had to write some *MongoDB* specific methods. That doesn't seem any problem at all. But, if we decided to change our database from *MongoDB* to *Firebase*, later on, realize how many things/methods we had to re-check to make the application work properly? But this doesn't validate *GraphQL* usage, yet. So, what *GraphQL* is offering? As said earlier, *GraphQL* acts as a layer and, it lets the *client* side to *query* database data using some *strong-typed* schema. What this means is that, the *client* side will interact with *GraphQL* but not with the *data-server* itself. Thus no matter what database technology is being used, *client* side doesn't need to know anything about that. One thing is that, these doesn't mean that, you don't have to re-write schema when you're changing database solution. As *GraphQL* interacts with database so, changing database technology will require re-write methods which will interact with the database, but the benefit of *GraphQL* is that, the *client-side* is being un-affected while you've changed your database solution. This also benefits using same *GraphQL* schema for different types of *front-end* technology, like web-apps or native application, no matter what you're using, your database interaction is being similar to *GraphQL* only. To learn more about GraphQL, please visit GrpahQL's documentation (*links are in the [references](#references)*).

### Project Setup for GraphQL

As of *ReduxJS* one, we'll have some slight changes in project setup for *GrpahQL* also.

**Folder Structure (changes only)**

```shell
tutorial-react-redux-graphql
...
|
+---data
|       index.js
|
+---graphql
|       schema.js
|
+---src
|   |
|   ...
|   |
|   +---actions
|   |       graphQLFetcher.js
```

As you see there's a slight change in folder structure, there is also a little change in the code-base.

**package.json**

The changes on *package.json* file are new *packages* for *GraphQL* only.

```shell
npm install -S express-graphql graphql isomorphic-fetch
```

**webpack/vendors.js**

```javascript
module.exports = [
	"babel-polyfill",
	"isomorphic-fetch",
	"react",
	"react-dom",
	"react-redux",
	"redux",
	"redux-thunk"
]
```

**server/server.dev.js**

```javascript
import express from 'express'
import path from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackConfig from '../webpack.config.js'
import GraphQLHTTP from 'express-graphql'
import schema from '../graphql/schema'

const APP_PORT = 3000

var compiler = webpack(webpackConfig)

var app = new WebpackDevServer(compiler, {
	contentBase: '/public/',
	stats: {
		chunks: false,
		colors: true,
	}
});

app.use('/', express.static(path.resolve(__dirname, '..', 'public')))
app.use('/graphql', GraphQLHTTP((req) => {
	return {
		schema: schema,
		graphiql: true
	}
}))
app.listen(APP_PORT, (err) => {
	if (err) {
		console.log(err)
	} else {
		console.log(`GraphQL is serving at http://localhost:${APP_PORT}`)
		console.log(`App is running at http://localhost:${APP_PORT}`)
	}
})
```

**server/server.prod.js**

```javascript
import express from 'express'
import path from 'path'
import GraphQLHTTP from 'express-graphql'
import schema from '../graphql/schema'

const APP_PORT = 3000

let app = express()

app.use('/', express.static(path.resolve(__dirname, '..', 'public')))
app.use('/graphql', GraphQLHTTP((req) => {
	return {
		schema: schema,
		graphiql: true
	}
}))
app.listen(APP_PORT, (err) => {
	if (err) {
		console.log(err)
	} else {
		console.log(`GraphQL is serving at http://localhost:${APP_PORT}`)
		console.log(`App is running at http://localhost:${APP_PORT}`)
	}
})
```

In both server configurations, at `http://localhost:3000/graphql` the *GraphQL middleware* is added to interact with *GraphQL*.


### GraphQL Build Process

In *GraphQL* build process our main concentration will be building a *GraphQL schema* file, which will used by *server* files to interact with database, thus by the *ReduxJS* application/*client-side*.

**data/index.js**

```javascript
let dbTodoList = {
	todos: [
		{ id: "0", text: 'Todo 0', completed: false },
		{ id: "1", text: 'Todo 1', completed: false }
	]
}

export const getTodos = () => {
	return dbTodoList
}

export const addTodo = ({ id, text }) => {
	dbTodoList.todos = [
		...dbTodoList.todos, {
			id: id,
			text: text,
			completed: false
		}
	]
	return id
}

export const toggleTodo = ({ id }) => {
	database.todos = database.todos.map(todo => {
		if (todo.id !== id) {
			return todo
		}
		return {
			...todo,
			completed: !todo.completed
		}
	})
	return id
}
```

**graphql/schema.js**

```javascript
import {
	GraphQLBoolean,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} from 'graphql'

import { getTodos, addTodo, toggleTodo } from '../data'

const todoType = new GraphQLObjectType({
	name: 'ToDo',
	description: 'Single instance of a todo',
	fields: {
		id: {
			type: GraphQLString,
			description: 'ID of the todo item'
		},
		text: {
			type: GraphQLString,
			description: 'Text of the todo item'
		},
		completed: {
			type: GraphQLBoolean,
			description: 'Completion status of the todo item'
		}
	}
})

const todosType = new GraphQLObjectType({
	name: 'Todos',
	description: 'List of Todos',
	fields: {
		todos: {
			type: new GraphQLList(todoType),
			resolve: (data) => {
				return data.map(todo => todo)
			}
		}
	}
})

const queryType = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		todos: {
			type: new GraphQLList(todoType),
			resolve: (root) => {
				return getTodos().todos.map(todo => todo)
			}
		},
	}),
})

const addTodoMutation = {
	name: 'AddTodoMutation',
	description: 'Mutation for adding todo',
	type: GraphQLString,
	args: {
		text: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'Text of the todo'
		},
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'ID of the todo'
		}
	},
	resolve: (root, args) => {
		let { id, text } = args
		return addTodo({ id, text })
	}
}

const toggleTodoMutation = {
	name: 'ToogleTodoMutation',
	description: 'Mutation for toggling todo status',
	type: GraphQLString,
	args: {
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'ID of the todo'
		}
	},
	resolve: (root, args) => {
		let { id } = args
		return toggleTodo({ id })
	}
}

const mutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		addTodo: addTodoMutation,
		toggleTodo: toggleTodoMutation
	})
})

const Schema = new GraphQLSchema({
	query: queryType,
	mutation: mutationType
})

export default Schema
```

Woo, what is this? Like *ReduxJS* one, let's go one by one, briefly.

In *data/index.js* we're exporting similar functions like *ReduxJS* ones.

*GraphQL*'s data query methods are called *query* and data manipulation are called *mutation*.

In *graphql/schema.js* the *GraphQLObjectType* you're seeing, are defining the data object types. These schemas have some specific keys, like - *name*, *description*, *fields* etc. The *fields* key holds the main keys which defines the database object. Like in our, *todoType* there are keys like *id*, *text* and *completed*, which all are same as a single *todo* object coming from database. These keys holds keys like *type*, *description*, *resolve*. Where *type* defines the type of the data, *description* holds is a non-must key, where you can keep a short description of the key, *resolve* is a functional key which will return value as defined. In *todosType*'s *todos* key's *type*, what the *GraphQLList* is describing is that, the *todos* will hold a list of *todoType* objects, and in the *resolve* function we're returning a list of objects which matches the *todoType* schema.

*Mutations* are like *queries*, where *args* contains the input values for the data modification, and *resolve* is the function which *returns* the returned values to the *client-side*.

The final *query* and *mutation* keys are the keys which lets *GraphQL* to group *queries* and *mutations* in a *GraphQLSchema* function.

### ReduxJS Build Process

To attach *GraphQL* with *ReduxJS* we don't need to change a lot of things, but the sections from *actions* which previously interacted with database.

**src/actions/graphQLFetcher.js**

```javascript
import fetch from 'isomorphic-fetch'

const graphqlServer = window.location.origin + '/graphql'

const todoID = () => {
	return Date.now().toString()
}

const graphQLFetcher = (graphQLParams) => {
	return new Promise((resolve, reject) => {
		fetch(graphqlServer, {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/graphql'
			},
			body: graphQLParams,
		}).then(response => resolve(response.json()))
	})
}

export const asyncGetTodos = () => {
	return new Promise((resolve, reject) => {
		graphQLFetcher(`
			query {
				todos {
					id,
					text,
					completed
				}
			}
		`).then(json => resolve(json.data))
	})
}

export const asyncAddTodo = (text) => {
	let id = todoID()
	return new Promise((resolve, reject) => {
		graphQLFetcher(`
			mutation {
				addTodo(text: "${text}", id: "${id}")
			}
		`).then(json => resolve(json.data.addTodo))
	})
}

export const asyncToogleTodo = (id) => {
	return new Promise((resolve, reject) => {
		graphQLFetcher(`
			mutation {
			toggleTodo(id: "${id}")
			}
		`).then(json => resolve(json.data.toggleTodo))
	})
}
```

**src/actions/index.js**

```javascript
import {
	asyncGetTodos,
	asyncAddTodo,
	asyncToogleTodo
} from './graphQLFetcher'

export const CONSTANTS = {
	'ADD_TODO': 'ADD_TODO',
	'TOGGLE_TODO': 'TOGGLE_TODO',
	'ASYNC_ACTION': 'ASYNC_ACTION',
	'RECEIVE_TODOS': 'RECEIVE_TODOS'
}

const asyncAction = () => {
	return {
		type: CONSTANTS['ASYNC_ACTION']
	}
}

export const receiveTodos = () => {
	return (dispatch) => {
		dispatch(asyncAction())
		return asyncGetTodos()
			.then(todoList => dispatch({
				type: CONSTANTS['RECEIVE_TODOS'],
				todos: todoList.todos
			}))
	}
}

export const addTodo = (text) => {
	return (dispatch) => {
		dispatch(asyncAction())
		return asyncAddTodo(text)
			.then(id => {
				dispatch({
					type: CONSTANTS['ADD_TODO'],
					text: text,
					id: id
				})
			})
	}
}

export const toggleTodo = (id) => {
	return (dispatch) => {
		dispatch(asyncAction())
		return asyncToogleTodo(id)
			.then(id => {
				dispatch({
					type: CONSTANTS['TOGGLE_TODO'],
					id
				})
			})
	}
}
```

In *src/actions/graphQLFetcher.js* we're using `isomorphic-fetch` to connect with the server.

The *graphQLFetcher* is the function which will connect to the *GraphQL* server. *GraphQL* always requires a "POST" method and in *headers* the *Content-Type* should be *'application/graphql'* and, in the *body* a specialized string has to be passed.

The specialized string has to contain *query* for the data queries and *mutation* for the data mutation, in the beginning. Notice the double-quotes inside *mutation*, if the parameter is a string, you have to wrap them inside double-quotes (""), and not inside single-quote.

In our *src/actions/index.js* every manual functions for database connection is replaced by functions from *src/actions/graphQLFetcher.js*.

Now, if you start your program, you should see a working application similar to previous ones. By the way, the artificial-delays from *ReduxJS* won't be here, as they've been replaced, but the *asynchronous* process is happening, actually. this time it's happening as an actual process, not an artificial-one.

Thanks for reading :)

## What's Next

If you want to learn *ReduxJS* from the creator, listen to Getting Started with Redux, by - Dan Abramov

## Project Files

- Github - [https://github.com/MarufSarker/tutorial-react-redux-graphql](https://github.com/MarufSarker/tutorial-react-redux-graphql)

The GitHub repository has three branches, of which -

- `master`: full build using *ReactJS*, *ReduxJS* and *GraphQL*
- `react`: using *ReactJS* only
- `redux`: using both *ReactJS* and *ReduxJS* but, not *GraphQL*


## References

- <a href="{{ site.url }}{% post_url 2016-04-10-introduction-about-webpack-configuration %}">An Introduction about Webpack Configuration</a>
- <a href="https://webpack.github.io/docs/what-is-webpack.html" target="_blank" rel="nofollow">Webpack Documentation</a>
- <a href="https://facebook.github.io/react/docs/getting-started.html" target="_blank" rel="nofollow">ReactJS Documentation</a>
- <a href="http://redux.js.org/" target="_blank" rel="nofollow">ReduxJS Documentation</a>
- <a href="http://graphql.org/docs/getting-started/" target="_blank" rel="nofollow">GraphQL Documentation</a>
