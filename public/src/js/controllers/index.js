'use strict';

var TRANSACTION_DISPLAYED = 10;
var BLOCKS_DISPLAYED = 5;

angular.module('insight.system').controller('IndexController',
  function($scope, Global, getSocket, Blocks, PqStats, Sync) {
    $scope.global = Global;
    $scope.loadingStats = true;

    var _getSync = function() {
      Sync.get({},
        function(sync) {
          _onSyncUpdate(sync);
        },
        function(e) {
          var err = 'Could not get sync information' + e.toString();
          $scope.sync = {
            error: err
          };
        });
    };

    var _onSyncUpdate = function(sync) {
      $scope.sync = sync;
      if (sync.syncPercentage === '100.000') {
        _getStats();
        $scope.loadingStats = false;
      };
    };
    
    var _getStats = function() {
      PqStats.get(function(stat) {
      });
    };

    var _getBlocks = function() {
      Blocks.get({
        limit: BLOCKS_DISPLAYED
      }, function(res) {
        $scope.blocks = res.blocks;
        $scope.blocksLength = res.length;
      });
    };

    var socket = getSocket($scope);

    var _startSocket = function() { 
      socket.emit('subscribe', 'sync');
      socket.on('status', function(sync) {
        _onSyncUpdate(sync);
      });
      socket.emit('subscribe', 'inv');
      socket.on('tx', function(tx) {
        var quantumProtected = false;
        if(tx.vout){
          tx.vout.forEach(function (out) {
          Object.keys(out).forEach(function (key) {
            if(/^(Hb|Ta|Tb)/.test(key)){
              quantumProtected = true;
            }
          })
        })
        }
        
        tx.quantumProtected = quantumProtected;
        $scope.txs.unshift(tx);
        if (parseInt($scope.txs.length, 10) >= parseInt(TRANSACTION_DISPLAYED, 10)) {
          $scope.txs = $scope.txs.splice(0, TRANSACTION_DISPLAYED);
        }
      });

      socket.on('block', function() {
        _getBlocks();
      });
    };

    socket.on('connect', function() {
      _startSocket();
    });



    $scope.humanSince = function(time) {
      var m = moment.unix(time);
      return m.max().fromNow();
    };

    $scope.index = function() {
      _getBlocks();
      _startSocket();
      _getSync();
    };

    $scope.txs = [];
    $scope.blocks = [];
  });
