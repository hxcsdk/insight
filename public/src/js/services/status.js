'use strict';

angular.module('insight.status')
  .factory('Status',
    function($resource, __env) {
      return $resource(__env.apiUrl + '/api/status', {
        q: '@q'
      });
    })
  .factory('Sync',
    function($resource, __env) {
      return $resource(__env.apiUrl + '/api/sync');
    })
  .factory('PeerSync',
    function($resource, __env) {
      return $resource(__env.apiUrl + '/api/peer');
    });
