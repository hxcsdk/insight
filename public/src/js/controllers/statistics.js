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
    $scope.uom = "Kilo"

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

        // instantiates a blank graph
        _generateHrGraph([], $scope.uom);
        // _getTicketStats();
      };
    };
    
    var _getHrGraphStats = function() {
      HrGraphStats.get(function(hgs) {
        $scope.hrStats = hgs;
        if ($scope.hrStats.networkHashps.length > 0) {
          transformGraphStats($scope.hrStats);
        }
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
        $scope.hrGraphData.push([ formatDate(el.timestamp), convertHashesToUnit(el.hashperseconds)]);
      });
      $scope.loadingStats.GraphRendered = true;      
      _generateHrGraph($scope.hrGraphData, $scope.uom);
    }
    
    var formatDate = function(dateIn) {
      return new Date(dateIn * 1000);
    }

    var convertHashesToUnit = function(hashIn) {
      var hashOut = hashIn;
      switch ($scope.uom) {
        case 'Kilo':
          loop = 1;
          break;
        case 'Mega':
          loop = 2;
          break;          
        case 'Giga':
          loop = 3;
          break;          
        case 'Tera':
          loop = 4;
          break;          
      }

      var i = 0;
      do {
        hashOut = (hashOut / 1000);
        i++;
      }
      while (i < loop)

      return hashOut;;
    }

    var _generateHrGraph = function(gd, units) {
      $scope.testGraph = new Dygraph(document.getElementById('hash-graph'), gd, {
        labels: ["Time", "Hash Per" + $scope.uom + 'second'],
        fillGraph: true,
        color: '#007aff',
        xlabel: 'Time Stamp (24hr)',
        // ylabel: 'Hash Per ' + units + 'second',
        drawPoints: true,
        title: 'Hashes Per ' + $scope.uom + 'second'
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
