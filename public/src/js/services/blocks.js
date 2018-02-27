'use strict';

angular.module('insight.blocks')
  .factory('Block',
    function($resource, __env) {
    return $resource(__env.apiUrl + '/api/block/:blockHash', {
      blockHash: '@blockHash'
    }, {
      get: {
        method: 'GET',
        interceptor: {
          response: function (res) {
            return res.data;
          },
          responseError: function (res) {
            if (res.status === 404) {
              return res;
            }
          }
        }
      }
    });
  })
  .factory('Blocks',
    function($resource, __env) {
      return $resource(__env.apiUrl + '/api/blocks');
  })
  .factory('BlockByHeight',
    function($resource, __env) {
      return $resource(__env.apiUrl + '/api/block-index/:blockHeight');
  });
