/*************************************************************************
 * Name          : blog_posts_search.js                                  *
 * Purpose       : Implementation of Search Function for Blog Posts      *
 * Author        : Abu Md. Maruf Sarker                                  *
 * Copyright (c) : 2016-Present, Abu Md. Maruf Sarker                    *
 * Website       : https://marufsarker.github.io                         *
 * License       : MIT License (https://opensource.org/licenses/MIT)     *
 *************************************************************************/

var searchFormID = 'amms-blog-post-search'
var searchQueryInputID = 'amms-blog-post-search-box'
var searchResultsHolderDivID = 'amms-blog-post-search-results'
var seacrhResultsClearButton = 'amms-blog-post-search-clear'
var initialURIChecked = false

var finalDOMNode = document.getElementById(searchResultsHolderDivID)
var elemSearchForm = document.getElementById(searchFormID)
var elemResultsClear = document.getElementById(seacrhResultsClearButton)

function getHTML (domNode, options) {
  var domElem = document.createElement(domNode)
  for (var k in options) {
    var v = options[k]
    if (k === 'innerText') {
      domElem.appendChild(document.createTextNode(v))
    } else {
      domElem.setAttribute(k, v)
    }
  }
  return domElem
}

function emptyDOMElem (elem) {
  while (elem.hasChildNodes()) {
    elem.removeChild(elem.lastChild)
  }
}

function createSearchResultsHTML (keys) {
  if (keys.length <= 0) {
    emptyDOMElem(finalDOMNode)
  } else {
    var allPosts = window.store
    emptyDOMElem(finalDOMNode)
    for (var i = 0; i < keys.length; i++) {
      var post = allPosts[keys[i]]
      var div = getHTML('div', {
        'class': 'amms-blog-post-search-result-container'
      })
      var h3 = getHTML('h3', {
        'class': 'amms-blog-post-search-result-title'
      })
      var a = getHTML('a', {
        'class': 'amms-blog-post-search-result-link',
        'href': post.url,
        'alt': post.title,
        'title': post.title,
        'innerText': post.title
      })
      var small = getHTML('small', {
        'class': 'amms-blog-post-search-result-date',
        'innerText': post.date
      })
      h3.appendChild(a)
      h3.appendChild(small)
      div.appendChild(h3)
      finalDOMNode.appendChild(div)
    }
  }
}

function displaySearchResults (resultKeys) {
  var processedResults = []
  for (var i = 0; i < resultKeys.length; i++) {
    var k = resultKeys[i].ref
    if (processedResults.indexOf(k) < 0) {
      processedResults.push(k)
    }
  }
  createSearchResultsHTML(processedResults)
}

function searchPost (query) {
  if (lunr) {
    var idx = lunr(function () {
      this.field('id')
      this.field('title', { boost: 10 })
    })
    for (var key in window.store) {
      idx.add({
        'id': key,
        'title': window.store[key].title
      })
    }
    var results = idx.search(query)
    displaySearchResults(results)
  }
}

function clearQuery () {
  document.forms[searchFormID][searchQueryInputID].value = ''
}

function trimString (s) {
  try {
    return s.trim()
  } catch (e) {
    return s.replace(/^\s+|\s+$/gm, '')
  }
}

function getQuery () {
  var searchQuery = document.forms[searchFormID][searchQueryInputID].value
  searchQuery = trimString(searchQuery)
  searchPost(searchQuery)
}

function checkURI () {
  var queries = window.location.search.substring(1).split('&')
  if (queries.length > 0) {
    for (var i = 0; i < queries.length; i++) {
      var pair = queries[i].split('=')
      if (pair[0] === 'query' && pair.length > 0) {
        var searchQuery = trimString(pair[1])
        initialURIChecked = true
        searchPost(searchQuery)
      }
    }
  }
}

function initialURICheck () {
  if (initialURIChecked === false) {
    checkURI()
  }
}

if (elemSearchForm.addEventListener) {
  elemSearchForm.addEventListener('submit', function (evt) {
    evt.preventDefault()
    getQuery()
  }, false)
}

if (elemResultsClear.addEventListener) {
  elemResultsClear.addEventListener('click', function (evt) {
    evt.preventDefault()
    emptyDOMElem(finalDOMNode)
    clearQuery()
  }, false)
}

if (window.addEventListener) {
  window.addEventListener('load', initialURICheck, false)
} else if (window.attachEvent) {
  window.attachEvent('onload', initialURICheck)
}
