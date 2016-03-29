# GeoIP

## Description

A simple, Node-based service for providing geolocation data based on a user's IP address.  Backed by the MaxMind DB.  Also includes a JavaScript plugin for querying the service and handling the response.

* [Features](#features)
* [Requirements](#requirements)
* [Support](#support)
* [Installation](#installation)
* [Usage](#usage)
    * [Geoip Service](#geoip-service)
    * [Client-side JS](#client-side-js)
* [Other Relevant Documentation](#other-relevant-documentation)
* [License](#license)

## Features

* Capable of handling homepage traffic

## Support

Please add issues to this repo on Github.

## Local Development

### Client-side JS

JavaScript dependencies must be installed via NPM:

```
npm install
```

Changes should be made to `frontend/geoip.js`.  ~Please add tests to `frontend/spec/geoipSpec.js`.~ (currently not working)  

Minify the updated script by running `grunt uglify` before checking in your changes.

#### Tests

The Jasmine tests can be run via PhantomJS using grunt: `grunt jasmine`.

### Server


#### On OS X

Since the server requires GNU tar, you'll likely find it easiest to develop locally on OS X by building and then running a docker image:

```
docker build -t geoip . && docker run -p 80:80 -e MAXMIND_LICENSE=... -e ORIGIN_RE="/^https?:\/\/([\w-]+\.)*yourdomain\.com(:\d+)?$/" geoip
```

#### On other platforms

Run `npm start`.

## Usage

### Client-side JS

#### How to Include the JS

This plugin is intended to be used on NYT5 pages, and has a RequireJS module variant.  It can also be used in a non-RJS environment.

At the moment, we are not publishing static, versioned files for inclusion anywhere.  There is, however, a minified version of the script checked in to the repository [here](https://github.com/newsdev/geoip/blob/master/dist/geoip.min.js).  To use it, add the minified code within a script tag in the relevant freeform or interactive for your project.

The script itself defines but does not *require* an AMD module, so to trigger its default behavior, add a line requiring the module:

For example:

```html
<script type="text/javascript">
/*! geoip_resolver 2016-03-29 */
+function(a){"function"==typeof define&&define.amd?define("nytint-geoip",[],a):window.nytint_geoip=a()}(function(){"use strict";var a="nyt-geoip",b=sessionStorage,c=b?JSON.parse(b.getItem(a)):null,d=document.getElementsByTagName("html"),e=new XMLHttpRequest,f=["country_code","region","dma_code","postal_code"],g=!1,h=null,i=null;return h=function(a){return c?(i(c,a),c):(e.onload=function(b){var c=b.target,d="json"===c.responseType?c.response.data:JSON.parse(c.responseText).message;return i(d,a),d},e.onreadystatechange=function(){4===this.readyState&&200!==this.status&&console.error(this.status)},e.open("GET","http://geoip.newsdev.nytimes.com/",!0),e.responseType="json",void e.send())},i=function(c,e){if(!d)return console.error("HTML tag is missing?"),!1;if(b.setItem(a,JSON.stringify(c)),!g){for(var h,i=0;h=f[i];i++){var j=["geo",h.replace("_code",""),c[h]].join("-");d[0].classList.add(j)}g=!0}return"function"==typeof e&&e(c),c},window.NYTINT_TESTING||h(),h});

require(['foundation/main'], function() {
  require(['nytint-geoip']);
});
</script>
```

Use the same basic format to add your own custom logic for handling the response from our geoip service:

```js
require(['foundation/main'], function() {
  require(['nytint-geoip'], function(geoip) { geoip(handler); });
  var handler = function(d) { console.debug(d); };
});
```

#### Default behavior

When the client-side script is instantiated on the page, it will automatically apply a subset of geocoded data as classes to the `html` tag.  Styles can then be written to show/hide elements depending on geolocation per session.  

For a response from the geoip service that looks like this:

```js
{
  "response": true,
  "data":{
    "country_code":"US",
    "country_code3":"USA",
    "country_name":"United States",
    "region":"NY",
    "city":"New York",
    "postal_code":"10018",
    "latitude":40.75529861450195,
    "longitude":-73.99240112304688,
    "metro_code":501,
    "dma_code":501,
    "area_code":212,
    "continent_code":"NA",
    "time_zone":"America/New_York"
  },
  "status":"ok"
}
```

the following will use it to control content options:

```html
<style>
  /*default display conditions*/
  .story[data-story-id="100000004295572"] {display: block;}
  .story[data-story-id="100000004295573"] {display: none;}
  /*geocoded display conditions*/
  html.geo-dma-501 [data-story-id="100000004295572"] {display: none;}
  html.geo-dma-501 [data-story-id="100000004295573"] {display: block;}
</style>
<div class="story" data-story-id="100000004295572">
  I will be shown for other users.
</div>
<div class="story" data-story-id="100000004295573">
  I will show for users in the NYC DMA.
</div>
```

If you want the visibilty of one element to always be the inverse of another's (depending on the criteria defined for the latter), you can show/hide content with `:not()` rules within your CSS.

```html
<style>
  /*default display conditions*/
  .story[data-story-id="100000004295574"],
  .story[data-story-id="100000004295575"],
  .story[data-story-id="100000004295576"] {display: none;}
  /*geocoded display conditions*/
  html.geo-region-NY [data-story-id="100000004295574"],
  html.geo-region-VA [data-story-id="100000004295575"],
  html:not(.geo-region-KS) [data-story-id="100000004295576"] {display: block;}
</style>
<div class="story" data-story-id="100000004295574">I will show for users in NYC.</div>
<div class="story" data-story-id="100000004295575">I will be hidden for users in NYC.</div>
<div class="story" data-story-id="100000004295576">I will show for users not in Kansas.</div>
```

## Other Relevant Documentation

*Links here to external documentation that might help someone using or developing in this project.  For example:*

* [Jasmine](http://jasmine.github.io/2.3/introduction.html) - A behavior-driven development framework for testing JavaScript code


## License

*Include and licence information here.*