'use strict';

angular.module('insight.stats').controller('StatisticsController',
  function($scope, getSocket, PqStats, MiningStats, TicketStats, HrGraphStats, Sync) {
    $scope.loadingStats = {
      'Pq': true,
      'Mining': true,
      'Ticket': true,
      'GraphRendered': false
    }
    $scope.lastDayClass = '';
    $scope.totalPqClass = '';
    $scope.testGraphData = {
      "networkHashps": [
        {
            "hashperseconds": 1000,
            "timestamp": 1521652827
        },
        {
            "hashperseconds": 134758,
            "timestamp": 1521653172
        },
        {
            "hashperseconds": 133366,
            "timestamp": 1521653250
        },
        {
            "hashperseconds": 128661,
            "timestamp": 1521653374
        },
        {
            "hashperseconds": 165785,
            "timestamp": 1521653414
        },
        {
            "hashperseconds": 149798,
            "timestamp": 1521653523
        },
        {
            "hashperseconds": 141582,
            "timestamp": 1521653619
        },
        {
            "hashperseconds": 142908,
            "timestamp": 1521653622
        }
      ]
    };

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
        _getHrGraphStats();
        // _getTicketStats();
      };
    };
    
    var _getHrGraphStats = function() {
      transformGraphStats($scope.testGraphData);
      HrGraphStats.get(function(hgs) {
        $scope.hrgStats = hgs;
        console.log(hgs);
      });
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
        $scope.mStats = ms;
        $scope.loadingStats.Mining = false;
      });
    };
    
    var transformGraphStats = function(stats) {
      $scope.hrGraphData = [];
      stats.networkHashps.forEach(function(el) {
        $scope.hrGraphData.push([ formatDate(el.timestamp), el.hashperseconds]);
      });
      _generateHrGraph($scope.hrGraphData);
    }
    
    var formatDate = function(dateIn) {
      return new Date(dateIn * 1000);
    }

    var _generateHrGraph = function(gd) {
      $scope.testGraph = new Dygraph(document.getElementById('hash-graph'), gd, {
        labels: ["Time", "Hash Per (Unit)"],
        fillGraph: true,
        color: '#007aff'
      } );
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
