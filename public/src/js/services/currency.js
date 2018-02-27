'use strict';

angular.module('insight.currency').factory('Currency',
  function($resource, __env) {
    return $resource(__env.apiUrl + '/api/currency');
});
