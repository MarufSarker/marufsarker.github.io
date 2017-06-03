---
author: "Maruf Sarker"
categories: ["WebDev"]
description: "Building simple social sharing buttons without any external libraries."
keywords: "social,media,share,button,twitter,facebook,googleplus,reddit,linkedin,email,javascript,js,html,css"
layout: post
tagline: "Building simple social media sharing buttons without any external libraries."
tags: ["html", "css", "javascript"]
thumbnail: "/assets/posts/2016-04-22-building-simple-social-media-sharing-buttons/social-media-sharing-buttons.png"
title:  "Building Simple Social Media Sharing Buttons Without Any External Libraries"
---

## Introduction

Due to the amazing growth of social-medias it has become an important aspect to share informations using social medias, thus including the 'share' feature in the websites and applications. For an straightforward solution adding those share buttons are done by adding their respective sharing libraries, and this methods are widely used also. But there are some minor drawbacks for those features too, generally they increases the network overhead and, though the libraries are quite small in size, but increases the page-load size also. Thus often many uses their custom built share buttons, of-course following proper documentations, almost all of the time, and for flexible customization. For these reasons I'm going to explain some basics about building your own set of sharing buttons.

## What We Will Build?

<figure class="amms-gb-img-figure-centered">
	<img src="/assets/posts/2016-04-22-building-simple-social-media-sharing-buttons/social-media-sharing-buttons.png" alt="Simple Social Share Button" title="Simple Social Share Button">
	<figcaption>Simple Social Share Button</figcaption>
</figure>

We will build a group of share buttons aligned horizontally.

### Social Medias

For this we will target -

- Twitter
- Facebook
- Reddit
- Google Plus
- LinkedIn
- eMail

## Sharing Links

The first and utmost important things in these processes are the links using which the sharing actions will be done.

Following is a list of base URLs for sharing links on those respective platforms -

- Twitter - `//twitter.com/intent/tweet`
- Facebook - `//facebook.com/sharer/sharer.php`
- Google Plus - `//plus.google.com/share`
- Reddit - `//reddit.com/submit`
- LinkedIn - `//linkedin.com/shareArticle`
- eMail - `mailto:`

All the links listed are the base URLs for using the sharing features of respective platforms, and all those links requires and uses pre-defined keywords to accept data to be shared.

## Platform Specific Keywords

### Twitter

- `url` - (*must*) url is the URL of the page you are trying to share. The link is auto shortened into Twitter's own *t.co* link, and if the page is optimized for Twitter card, it will populate a Twitter card while sharing.
- `text` - text keyword can be any text, from the title of the page to anything you want, and also will be editable while sharing pop-up comes up.

For other keywords please see Twitter's documentations (*links are in the [references](#references)*)

### Facebook

- `u` - (*must*) The u keyword takes the link of the page

### Google Plus

- `url` - (*must*) The url keyword takes the link of the page

For other keywords see Google Developers Guide (*links are in the [references](#references)*)

### Reddit

- `url` - (*must*) The url keyword takes the link of the page
- `title` - title can be the title of the page, or any text you want, and it also can be edited later.

### LinkedIn

- `url` - (*must*) The url keyword takes the link of the page

For other keywords see LinkedIn's sharing guide (*links are in the [references](#references)*)

### eMail

eMail basically doesn't need anything as a must, but things can be added as wish.

- `subject` - subject is the subject of an email, and can be the title of the page
- `body` - body can hold the url of the page to be shared

(*see [references](#references) for more details*)

## Building Buttons

The basic structure of buttons will be using HTML & CSS but to make the links dynamic vanilla JavaScript (without any library like, jQuery and/or others) will be used.

### Buttons HTML

All the buttons will be placed inside a container which will center the elements inside itself. And all the buttons will be created using `div` tag rather than `button` tag. And all the images for the buttons will be `svg` images, you can also use `jpg` images, but I chose `svg`.

```html
<div class="svg-social-buttons-container">
  <div class="svg-social-buttons-body">
    <div class="svg-single-social-button svg-share-twitter">
      <i class="svg-holder svg-twitter"></i>
    </div>
    <div class="svg-single-social-button svg-share-facebook">
      <i class="svg-holder svg-facebook"></i>
    </div>
    <div class="svg-single-social-button svg-share-reddit">
      <i class="svg-holder svg-reddit"></i>
    </div>
    <div class="svg-single-social-button svg-share-google-plus">
      <i class="svg-holder svg-google-plus"></i>
    </div>
    <div class="svg-single-social-button svg-share-linkedin">
      <i class="svg-holder svg-linkedin"></i>
    </div>
    <div class="svg-single-social-button svg-share-email">
      <i class="svg-holder svg-email"></i>
    </div>
  </div>
</div>
```

Every button will use an `onclick` event handler to generate dynamic links and open a popup window. So, the `div`s will contain another property like - `onclick="socialShareManager('Platform Name')"`, the 'Platform Name' will be platform name for specific button.

### Buttons JavaScript

When the `socialShareManager` function will be called on `onclick` event, the main responsibility of the function will be to generate the links for the specific platforms.

The main part of the share link is the link of the page, which can be achieved by `window.location.href` API, but some browsers might not support this, for those scenarios use `document.location.href` and, the title can be achieved by `document.title`, but while sharing some titles can be problematic while sharing via URL, so `encodeURIComponent()` function will be used.

```javascript
var pageTitle = encodeURIComponent(document.title);
var pageLink = window.location.href || document.location.href;
var twitterUsername = "";

if (socilaMedia === 'twitter') {
  return "//twitter.com/intent/tweet?" + "text=" + pageTitle + "&url=" + pageLink + "&via=" + twitterUsername;
} else if (socilaMedia === 'facebook') {
  return "//facebook.com/sharer/sharer.php?" + "u=" + pageLink;
} else if (socilaMedia === 'google-plus') {
  return "//plus.google.com/share?" + "url=" + pageLink;
} else if (socilaMedia === 'reddit') {
  return "//reddit.com/submit?" + "url=" + pageLink + "&title=" + pageTitle;
} else if (socilaMedia === 'linkedin') {
  return "//linkedin.com/shareArticle?" + "mini=true" + "&url=" + pageLink;
} else if (socilaMedia === 'email') {
  return "mailto:?" + "subject=" + pageTitle + "&body=" + pageLink;
}
```

Though everything is just normal JavaScript the link part is starting with `//`, why? To ensure that the sharing options work flawlessly in `http://` and `https://` scenarios.

Other main functionality is opening another window, which can be easily achieved by `window.open()` function.

```javascript
var popup = {
  width: 500,
  height: 350
};
popup.top = (screen.height / 2) - (popup.height / 2);
popup.left = (screen.width / 2)  - (popup.width / 2);

var sharingWindowFeatures = {
  left: popup.left,
  top: popup.top,
  height: popup.height,
  width: popup.width,
  menubar: "no",
  toolbar: "no",
  location: "no",
  status: "no",
  resizable: "yes",
  scrollbars: "yes"
};

sharingWindowFeatures = Object.keys(sharingWindowFeatures).map(function(key) {
  return key + '=' + sharingWindowFeatures[key];
}).join(',');

window.open(
  shareableLink,
  'sharingWindow',
  sharingWindowFeatures
);
```

## Project Files on Github

- [Social Share Buttons](https://github.com/MarufSarker/tutorial-social-share-buttons)

## References

- <a rel="nofollow" target="_blank" href="https://dev.twitter.com/web/tweet-button/web-intent">Tweet Web Intent</a>
- <a rel="nofollow" target="_blank" href="https://developers.google.com/+/web/share/#sharelink-endpoint">Google Plus Share Link Endpoints</a>
- <a rel="nofollow" target="_blank" href="https://developer.linkedin.com/docs/share-on-linkedin">LinkedIn Sharing</a>
- <a rel="nofollow" target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Email_links">MDN's mailto Docs</a>
