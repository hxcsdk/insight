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
    $scope.uom = "K";

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
          determineUom($scope.hrStats.networkHashps[$scope.hrStats.networkHashps.length - 1].hashperseconds);          
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
    
    var determineUom = function(hps) {
      if ((hps / 1000) < 999) {
        $scope.uom = "K"
      } else if (((hps / 1000) / 1000) < 999) {
        $scope.uom = "M"
      } else if ((((hps / 1000) / 1000) / 1000) < 999) {
        $scope.uom = "G"      
      } else {
        $scope.uom = "T"
      }
    }

    var formatDate = function(dateIn) {
      return new Date(dateIn * 1000);
    }

    var convertHashesToUnit = function(hashIn) {
      var hashOut = hashIn;
      switch ($scope.uom) {
        case 'K':
          loop = 1;
          break;
        case 'M':
          loop = 2;
          break;          
        case 'G':
          loop = 3;
          break;          
        case 'T':
          loop = 4;
          break;          
      }

      var i = 0;
      do {
        hashOut = (hashOut / 1000);
        i++;
      }
      while (i < loop)

      return hashOut;
    }

    var _generateHrGraph = function(gd, units) {
      $scope.testGraph = new Dygraph(document.getElementById('hash-graph'), gd, {
        labels: ["Time", $scope.uom + "H/s"],
        fillGraph: true,
        color: '#007aff',
        // xlabel: 'Time Stamp (24hr)',
        ylabel: $scope.uom + 'H/s',
        drawPoints: true,
        title: 'Average Hashrate'
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
