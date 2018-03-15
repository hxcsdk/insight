'use strict';

angular.module('insight.stats')
  .factory('PqStats',
    function($resource, __env) {
    return $resource(__env.apiUrl + '/api/pqstats', 
      { 

      }, {
      get: {
        method: 'GET',
        interceptor: {
          response: function (res) {
            return res.data;
          },
          responseError: function (res) {
            if (res.status === 404) {
              console.log('error');            
              return res;
            }
          }
        }
      }
    });
  });
