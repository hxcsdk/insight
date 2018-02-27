'use strict';

angular.module('insight.transactions')
  .factory('Transaction',
    function($resource, __env) {
    return $resource(__env.apiUrl + '/api/tx/:txId', {
      txId: '@txId'
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
  .factory('TransactionsByBlock',
    function($resource, __env) {
    return $resource(__env.apiUrl + '/api/txs', {
      block: '@block'
    });
  })
  .factory('TransactionsByAddress',
    function($resource, __env) {
    return $resource(__env.apiUrl + '/api/txs', {
      address: '@address'
    });
  })
  .factory('Transactions',
    function($resource, __env) {
      return $resource(__env.apiUrl + '/api/txs');
  });
