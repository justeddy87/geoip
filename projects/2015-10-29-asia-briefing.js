/*! geoip_resolver 2016-06-30 */
+function(a){"function"==typeof define&&define.amd?define("nytint-geoip",[],a):window.nytint_geoip=a()}(function(){"use strict";var a="nyt-geoip",b=document.getElementsByTagName("html"),c=!1,d=["continent_code","country_code","region","dma_code","postal_code","time_zone","zone_abbr"],e=function(b){var c=new XMLHttpRequest,d=null,e=null;try{if(d=JSON.parse(sessionStorage.getItem(a)),d&&void 0!==d.country_code)return g(d,b),d}catch(h){}c.onload=function(a){return a.target?(e=f(a.target),"undefined"==typeof e?!1:(g(e,b),e)):!1},c.onreadystatechange=function(){4===c.readyState&&200!==c.status&&console.error(c.status)},c.open("GET","https://geoip.newsdev.nytimes.com/",!0);try{c.responseType="json"}catch(h){}c.send()},f=function(a){var b=null;switch(!0){case"json"===a.responseType:b=a.response.data;break;case null!==a.response:b=JSON.parse(a.response).data;break;case null!==a.responseText:b=JSON.parse(a.responseText).message}return void 0!==b?b:null},g=function(e,f){if(!b)return!1;try{sessionStorage.setItem(a,JSON.stringify(e))}catch(g){}if(void 0!==e&&!c){for(var i,j=0;i=d[j];j++)if(void 0!==e[i]){var k=["geo",h(i),e[i]].join("-");b[0].classList.add(k)}c=!0}return"function"==typeof f&&f(e),e},h=function(a){var b=a;switch(!0){case a.indexOf("zone_abbr")>=0:b=a.replace("zone_abbr","us-timezone");break;case a.indexOf("_zone")>=0:b=a.replace("_zone","zone");break;case a.indexOf("_code")>=0:b=a.replace("_code","")}return b};return window.NYTINT_TESTING||e(),e});

require(['foundation/main'], function() {
  require(['nytint-geoip', 'jquery/nyt'], function(geoip, $) {
    geoip(function(geoipData, $elems) {
      var $asia;
      if (!geoipData.country_code && geoipData.continent_code == 'AS') {
        $asia = $elems.filter('.nythpAsiaBriefingTest-Asia');
        $asia.show();
        $($asia.data('geoipElse')).hide();
      }
    });
  });
});