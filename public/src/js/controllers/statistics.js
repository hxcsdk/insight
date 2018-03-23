'use strict';

angular.module('insight.stats').controller('StatisticsController',
  function($scope, getSocket, PqStats, MiningStats, TicketStats, Sync) {
    $scope.loadingStats = {
      'Pq': true,
      'Mining': true,
      'Ticket': true
    }
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
        _getPqStats();
        _getMiningStats();
        _getTicketStats();
      };
    };
    
    var _getPqStats = function() {
      PqStats.get(function(pqs) {
        $scope.pqStats = pqs;
        $scope.loadingStats.Pq = false;
        if (pqs.totalTxCount24h > 0) {
          $scope.lastDayClass = 'p' + ((pqs.pqTxCount24h / pqs.totalTxCount24h) * 100).toFixed(0).toString();
        } else {
          $scope.lastDayClass = 'p0';
        }
        if (pqs.totalHx > 0) {
          $scope.totalPqClass = 'p' + ((pqs.pqHx / pqs.totalHx) * 100).toFixed(0).toString();
        } else {
          $scope.totalPqClass = 'p0';
        }
      });
    };

    var _getTicketStats = function() {
      TicketStats.get(function(ts) {
        $scope.tStats = ts;
        $scope.loadingStats.Ticket = false;
      });
    };

    var _getMiningStats = function() {
      MiningStats.get(function(ms) {
        $scope.mStats = ms.info
        console.log(ms.info);
        $scope.loadingStats.Mining = false;
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
