/*************************************************************************
 * Name          : script.js                                             *
 * Purpose       : Generally Required JavaScript Functions for the Site  *
 * Author        : Abu Md. Maruf Sarker                                  *
 * Copyright (c) : 2016-Present, Abu Md. Maruf Sarker                    *
 * Website       : https://marufsarker.github.io                         *
 * License       : MIT License (https://opensource.org/licenses/MIT)     *
 *************************************************************************/

/*
 * Navigation Button Toggle
 */
var navButtonClass = 'amms-nav-button'
var navButtonMenuClass = 'amms-nav-menu'
var navButtonToggleClass = 'amms-nav-menu-toogle-show'
var navButtonNodes = document.getElementsByClassName(navButtonClass)
var navButtonMenuNodes = document.getElementsByClassName(navButtonMenuClass)

function navButtonClassToggle (e) {
  var elem = navButtonMenuNodes[0]
  if (elem.classList) {
    elem.classList.toggle(navButtonToggleClass)
  } else {
    var classes = elem.className.split(' ')
    var existingIndex = -1
    for (var i = classes.length; i--;) {
      if (classes[i] === navButtonToggleClass) {
        existingIndex = i
      }
    }
    if (existingIndex >= 0) {
      classes.splice(existingIndex, 1)
    } else {
      classes.push(navButtonToggleClass)
    }
    elem.className = classes.join(' ')
  }
}

if (navButtonNodes.length > 0) {
  for (var i = 0; i < navButtonNodes.length; i++) {
    var navButtonNode = navButtonNodes[i]
    navButtonNode.addEventListener('click', navButtonClassToggle, false)
  }
}

/*
 * Navigation Bar Active Page Indication
 */
var navMenuItemClass = 'amms-nav-menu-item'
var navMenuCurrentLocationClass = 'amms-nav-current-location'

function elemAddClass (elem, cls) {
  if (elem.classList) {
    elem.classList.add(cls)
  } else {
    elem.className += ' ' + cls
  }
}

function elemRemoveClass (elem, cls) {
  if (elem.classList) {
    elem.classList.remove(cls)
  } else {
    elem.className = elem.className.replace(new RegExp('(^|\\b)' + cls.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
  }
}

function addRemoveActiveClass (r) {
  var navMenuItemNodes = document.getElementsByClassName(navMenuItemClass)
  if (r === null) {
    for (var i = 0; i < navMenuItemNodes.length; i++) {
      var nullNavMenuItemNode = navMenuItemNodes[i]
      elemRemoveClass(nullNavMenuItemNode, navMenuCurrentLocationClass)
    }
  } else {
    for (var j = 0; j < navMenuItemNodes.length; j++) {
      var navMenuItemNode = navMenuItemNodes[j]
      var navMenuItemPathname = navMenuItemNode.pathname + '/'
      var navMenuItemHref = navMenuItemNode.href + '/'
      if (r.test(navMenuItemPathname) || r.test(navMenuItemHref)) {
        elemAddClass(navMenuItemNode, navMenuCurrentLocationClass)
      } else {
        elemRemoveClass(navMenuItemNode, navMenuCurrentLocationClass)
      }
    }
  }
}

function stylizeNavBarFromURI () {
  var currentPathname = window.location.pathname
  var currentHref = window.location.href
  var rxAbout = /\/about\//
  var rxPortfolio = /\/portfolio\//
  var rxBlog = /\/blog\//
  var rxContact = /\/contact\//
  if (rxAbout.test(currentPathname) || rxAbout.test(currentHref)) {
    addRemoveActiveClass(rxAbout)
  } else if (rxPortfolio.test(currentPathname) || rxPortfolio.test(currentHref)) {
    addRemoveActiveClass(rxPortfolio)
  } else if (rxBlog.test(currentPathname) || rxBlog.test(currentHref)) {
    addRemoveActiveClass(rxBlog)
  } else if (rxContact.test(currentPathname) || rxContact.test(currentHref)) {
    addRemoveActiveClass(rxContact)
  } else {
    addRemoveActiveClass(null)
  }
}

if (window.addEventListener) {
  window.addEventListener('load', stylizeNavBarFromURI, false)
} else if (window.attachEvent) {
  window.attachEvent('onload', stylizeNavBarFromURI)
}

/*
 * Social Share Buttons
 */
function popupWindowManager (shareableLink) {
  var popup = {
    width: 500,
    height: 350
  }
  popup.top = (window.screen.height / 2) - (popup.height / 2)
  popup.left = (window.screen.width / 2) - (popup.width / 2)

  var sharingWindowFeatures = {
    left: popup.left,
    top: popup.top,
    height: popup.height,
    width: popup.width,
    menubar: 'no',
    toolbar: 'no',
    location: 'no',
    status: 'no',
    resizable: 'yes',
    scrollbars: 'yes'
  }

  sharingWindowFeatures = Object.keys(sharingWindowFeatures).map(function (key) {
    return key + '=' + sharingWindowFeatures[key]
  }).join(',')

  window.open(
    shareableLink,
    'sharingWindow',
    sharingWindowFeatures
  )
  return false
}

function shareableLinkGenerator (socilaMedia) {
  var pageTitle = encodeURIComponent(document.title)
  var pageLink = window.location.href || document.location.href

  if (socilaMedia === 'twitter') {
    return '//twitter.com/intent/tweet?' + 'text=' + pageTitle + '&url=' + pageLink + '&via=iMARUF'
  } else if (socilaMedia === 'facebook') {
    return '//facebook.com/sharer/sharer.php?' + 'u=' + pageLink
  } else if (socilaMedia === 'google-plus') {
    return '//plus.google.com/share?' + 'url=' + pageLink
  } else if (socilaMedia === 'reddit') {
    return '//reddit.com/submit?' + 'url=' + pageLink + '&title=' + pageTitle
  } else if (socilaMedia === 'linkedin') {
    return '//linkedin.com/shareArticle?' + 'mini=true' + '&url=' + pageLink
  } else if (socilaMedia === 'email') {
    return 'mailto:?' + 'subject=' + pageTitle + '&body=' + pageLink
  }
}

function socialShareManager (socilaMedia) {
  popupWindowManager(shareableLinkGenerator(socilaMedia))
  return false
}

/*
 * Site Warning Popup
 */
var siteWarningHolderID = 'amms-site-warning-holder'
var siteWarningConsentID = 'amms-site-warning-consent'
var siteWarningHolderRemoveClass = 'amms-site-warning-holder-hideme'
var siteWarningLocalStorageKey = 'AMMS_SITE_CONSENT'
var siteWarningLocalStorageValue = 'YES'
// var siteWarningCookieExpires = 7

function setSiteConsent (k, v) {
  return window.localStorage.setItem(k, v)
  // var d = new Date()
  // d.setTime(d.getTime() + (siteWarningCookieExpires*24*60*60*1000))
  // var expireCookie = '; expires=' + d.toUTCString()
  // var consentCookie = encodeURIComponent(k) + '=' + encodeURIComponent(v)
  // var pathCookie = '; path=/;'
  // document.cookie =  consentCookie + expireCookie + pathCookie
  // return true
}

function siteWarningConsentSet (k, v) {
  try {
    // var swlsv = decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(k).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null
    var swlsv = window.localStorage.getItem(k)
    if (swlsv && swlsv === v) {
      return true
    } else {
      return false
    }
  } catch (e) {
    return true
  }
}

function removeSiteWarning (elem, cls) {
  if (elem.classList) {
    elem.classList.add(cls)
  } else {
    elem.className += ' ' + cls
  }
  while (elem.hasChildNodes()) {
    elem.removeChild(elem.lastChild)
  }
}

function loadSiteWarningPopupHTML () {
  var domHolder = document.getElementById('amms-site-warning-holder')

  var domWarning = document.createElement('div')
  var domWarningMessage = document.createElement('p')
  var domLinkGoogleAnalytics = document.createElement('a')
  var domLinkGitHub = document.createElement('a')
  var domConsent = document.createElement('button')

  domWarning.setAttribute('class', 'amms-site-warning')
  domWarningMessage.setAttribute('class', 'amms-site-warning-message')
  domLinkGoogleAnalytics.setAttribute('target', '_blank')
  domLinkGoogleAnalytics.setAttribute('href', 'https://analytics.google.com/')
  domLinkGitHub.setAttribute('target', '_blank')
  domLinkGitHub.setAttribute('href', 'https://github.com/MarufSarker/marufsarker.github.io')
  domConsent.setAttribute('id', 'amms-site-warning-consent')

  domLinkGoogleAnalytics.appendChild(document.createTextNode('Google Analytics'))
  domLinkGitHub.appendChild(document.createTextNode('GitHub'))

  domWarningMessage.appendChild(document.createTextNode('This site uses '))
  domWarningMessage.appendChild(domLinkGoogleAnalytics)
  domWarningMessage.appendChild(document.createTextNode(' and hosted on '))
  domWarningMessage.appendChild(domLinkGitHub)
  domConsent.appendChild(document.createTextNode('OKAY'))

  domWarning.appendChild(domWarningMessage)
  domWarning.appendChild(domConsent)

  domHolder.appendChild(domWarning)
}

function siteWarningPopup () {
  if (siteWarningConsentSet(siteWarningLocalStorageKey, siteWarningLocalStorageValue) === false) {
    loadSiteWarningPopupHTML()
    var siteWarningHolderDOMNode = document.getElementById(siteWarningHolderID)
    var siteWarningConsentDOMNode = document.getElementById(siteWarningConsentID)

    if (siteWarningConsentDOMNode.addEventListener) {
      siteWarningConsentDOMNode.addEventListener('click', function (evt) {
        evt.preventDefault()
        setSiteConsent(siteWarningLocalStorageKey, siteWarningLocalStorageValue)
        removeSiteWarning(siteWarningHolderDOMNode, siteWarningHolderRemoveClass)
      }, false)
    }
  }
}

if (window.addEventListener) {
  window.addEventListener('load', siteWarningPopup, false)
} else if (window.attachEvent) {
  window.attachEvent('onload', siteWarningPopup)
}

/*
 * Welcoming Log
 */
var helloCSS = 'font-variant:small-caps;text-align:center;color:#FFF;background-color:#8A2BE2;font-size:50px;'
var wishCSS = 'font-variant:small-caps;text-align:center;color:#FFF;background-color:#6495ED;font-size:25px;'
var helloString = ' Hello There :) '
var hopeString = ' Hope You Have A Great Life Ahead :) '
var wishString = ' Wish You A Happy Day :) '
console.log('%c%s', helloCSS, helloString)
console.log('%c%s', wishCSS, hopeString)
console.log('%c%s', wishCSS, wishString)
