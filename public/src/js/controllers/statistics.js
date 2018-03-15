'use strict';

angular.module('insight.stats').controller('StatisticsController',
  function($scope, getSocket, PqStats, Sync) {
    $scope.loadingStats = true;
    $scope.pqStats;
    $scope.lastDayClass = '';
    $scope.totalPqClass = '';

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
      };
    };
    
    var _getStats = function() {
      PqStats.get(function(stat) {
        $scope.pqStats = stat;
        $scope.loadingStats = false;
        if (stat.totalTxCount24h > 0) {
          $scope.lastDayClass = 'p' + ((stat.pqTxCount24h / stat.totalTxCount24h) * 100).toFixed(0).toString();
        } else {
          $scope.lastDayClass = 'p0';
        }
        if (stat.totalHx > 0) {
          $scope.totalPqClass = 'p' + ((stat.pqHx / stat.totalHx) * 100).toFixed(0).toString();
        } else {
          $scope.totalPqClass = 'p0';
        }
      });
    };

    var socket = getSocket($scope);

    var _startSocket = function() { 
      socket.emit('subscribe', 'sync');
      socket.on('status', function(sync) {
        _onSyncUpdate(sync);
      });
    };

    socket.on('connect', function() {
      _startSocket();
    });



    $scope.humanSince = function(time) {
      var m = moment.unix(time);
      return m.max().fromNow();
    };

    $scope.onInit = function() {
      _startSocket();
      _getSync();
    };
  });
