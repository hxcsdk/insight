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
  })
  .factory('MiningStats',
    function($resource, __env) {
      return $resource(__env.apiUrl + '/api/status?getMiningInfo', 
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
  })
  .factory('TicketStats',
    function($resource, __env) {
      return $resource(__env.apiUrl + '/api/status?getTicketInfo', 
      { 
      }, {
      get: {
        method: 'GET',
        interceptor: {
          response: function (res) {
            return res.data.info;
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
