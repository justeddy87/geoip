+function(factory) {
  if (typeof define === 'function' && define.amd) {
    define('nytint-geoip-v1', ['jquery/nyt', 'underscore/nyt'], factory);
  } else {
    window.nytint_geoip_v1 = factory(window.jQuery, window._);
  }
}(function($,_) {

    'use strict';

    /*
    Data attributes:
      geoip-match
        valid values:
          string codes consistent with values for specified data-geoip-match-on
      data-geoip-match-on
        valid values:
          area_code, city, continent_code, country_code, country_code3, country_name, dma_code, latitude, longitude, metro_code, postal_code, region, time_zone
      data-geoip-else
        valid values:
          jquery selector specifying the element(s) to show if specified match conditions are NOT met

    */

    var geoip_cache,
        fetching = [],
        key = 'nyt-geoip-v1',
        storage = sessionStorage, //localStorage
        stored_data = (storage) ? JSON.parse(storage.getItem(key)) : null,

        parseOptions = function(qs) {
          return _.reduce(qs.split('&'), function(memo, params) {
            var prefix = 'geoip_',
                parts;
            if (params.indexOf(prefix) === 0) {
              parts = params.split('=');
              memo[parts[0].replace(prefix, '')] = parts[1];
            }
            return memo;
          }, {});
        },

        qsOptions = parseOptions(window.location.search.slice(1)),

        ready = function() {
          var dfd = new $.Deferred();
          $(document).ready(function() {
            dfd.resolve($('[data-geoip-match-on]'));
          });
          return dfd.promise();
        },

        queryApi = function(dfd) {
          $.ajax({
              url: 'http://geoip.newsdev.nytimes.com/',
              dataType: 'json'
            })
            .done(function(response) {
              geoip_cache = response.data;
              storage.setItem(key, JSON.stringify(geoip_cache));
              dfd.resolve(geoip_cache);
            })
            .fail(function() {
              dfd.reject('geoip service error');
            });
        },

        fetch = function(forceRefresh) {
          var dfd = new $.Deferred(),
              promise = dfd.promise();

          if ((!(stored_data || geoip_cache) && fetching.length === 0) || forceRefresh) {
            fetching.push(dfd);
          } else if (stored_data) {
            dfd.resolve(stored_data);
          } else if (geoip_cache) {
            dfd.resolve(geoip_cache);
          } else {
            return fetching[fetching.length - 1].promise();
          }

          if (fetching.length > 0) {
            queryApi(fetching.shift());
          }
          return promise;
        },

        complete = function(geoipData, $elems, options) {
          options = (_.isString(options)) ? parseOptions(options) :
            (_.isObject(options) ? options : qsOptions);
          geoipData = _.extend({}, geoipData || {}, options);
          // by default hides elements that don't match, shows those that do.
          $elems.each(function() {
            var $this = $(this),
                match = _.map(($this.data('geoipMatch') || '').toString().split(','), function(e) { return $.trim(e); }),
                matchOn = geoipData[$this.data('geoipMatchOn')],
                $else = $($this.data('geoipElse'));
            if (matchOn) {
              matchOn = matchOn.toString();
              if (_.contains(match, matchOn)) {
                $this.show();
                $else.hide();
              } else {
                $this.hide();
                $else.show();
              }
            }
          });
          return geoipData;
        },

        run = function(callback, forceRefresh, options) {
          $.when(fetch(forceRefresh), ready()).done(function(geoipData, $elems) {
            var modifiedGeo = complete(geoipData, $elems, options);
            if (_.isFunction(callback)) {
              callback(modifiedGeo, $elems);
            }
          });
        };

        if(!window.NYTINT_TESTING) {
          run();
        } else {
          run.parseOptions = parseOptions;
        }

    return run;

});